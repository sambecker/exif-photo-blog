import { generateText, streamText, Message, CoreUserMessage, CoreTool } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { kv } from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';
import { AI_TEXT_GENERATION_ENABLED, HAS_VERCEL_KV } from '@/site/config';
import { removeBase64Prefix } from '@/utility/image';
import { cleanUpAiTextResponse } from '@/photo/ai';
import { AI_IMAGE_QUERIES, AiImageQuery } from '@/photo/ai';

const RATE_LIMIT_IDENTIFIER = 'ai-image-query';
const RATE_LIMIT_MAX_QUERIES_PER_HOUR = 1000;

type Provider = 'openai' | 'anthropic';
const DEFAULT_PROVIDER: Provider = 'openai';
const OPENAI_MODEL = 'gpt-4-vision-preview';
const ANTHROPIC_MODEL = 'claude-3-sonnet-20240229';

// Tool definitions for structured responses
const tools = {
  respond_bilingual: {
    description: 'Respond with both English and Chinese text in a structured format',
    parameters: {
      type: 'object',
      properties: {
        english: {
          type: 'string',
          description: 'The English response'
        },
        chinese: {
          type: 'string',
          description: 'The Chinese response (simplified characters only)'
        }
      },
      required: ['english', 'chinese']
    }
  },
  respond_title_and_caption: {
    description: 'Respond with title and caption pairs in both English and Chinese',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'object',
          properties: {
            english: {
              type: 'string',
              description: 'The English title (2-3 words)'
            },
            chinese: {
              type: 'string',
              description: 'The Chinese title (2-4 characters)'
            }
          },
          required: ['english', 'chinese']
        },
        caption: {
          type: 'object',
          properties: {
            english: {
              type: 'string',
              description: 'The English caption (6-12 words)'
            },
            chinese: {
              type: 'string',
              description: 'The Chinese caption (6-15 characters)'
            }
          },
          required: ['english', 'chinese']
        }
      },
      required: ['title', 'caption']
    }
  },
  respond_tags: {
    description: 'Respond with genre classification and bilingual tags',
    parameters: {
      type: 'object',
      properties: {
        genre: {
          type: 'string',
          enum: ['landscape', 'portraiture', 'animal', 'street', 'cars', 'event'],
          description: 'Primary genre of the image'
        },
        english_tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'English tags (3-5 tags: subjects, colors, actions, emotions)',
          minItems: 3,
          maxItems: 5
        },
        chinese_tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Chinese equivalent tags',
          minItems: 3,
          maxItems: 5
        }
      },
      required: ['genre', 'english_tags', 'chinese_tags']
    }
  }
} satisfies Record<string, CoreTool>;

// Initialize AI providers
const openai = AI_TEXT_GENERATION_ENABLED
  ? createOpenAI({ 
      apiKey: process.env.OPENAI_SECRET_KEY,
      compatibility: 'strict' // Enable strict mode for OpenAI API
    })
  : undefined;

const anthropic = AI_TEXT_GENERATION_ENABLED
  ? createAnthropic({ 
      apiKey: process.env.ANTHROPIC_API_KEY
    })
  : undefined;

const ratelimit = HAS_VERCEL_KV
  ? new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX_QUERIES_PER_HOUR, '1h'),
  })
  : undefined;

const checkRateLimitAndBailIfNecessary = async () => {
  if (!ratelimit) {
    return;
  }

  const { success } = await ratelimit.limit(RATE_LIMIT_IDENTIFIER);

  if (!success) {
    throw new Error(
      `Rate limit exceeded. Maximum of ${RATE_LIMIT_MAX_QUERIES_PER_HOUR} queries per hour.`
    );
  }
};

const getQueryTool = (query: AiImageQuery): [string, CoreTool] => {
  switch (query) {
    case 'title':
    case 'caption':
    case 'description':
    case 'description-small':
    case 'description-large':
      return ['respond_bilingual', tools.respond_bilingual];
    case 'title-and-caption':
      return ['respond_title_and_caption', tools.respond_title_and_caption];
    case 'tags':
      return ['respond_tags', tools.respond_tags];
    default:
      return ['respond_bilingual', tools.respond_bilingual];
  }
};

const getImageTextArgs = (
  imageBase64: string,
  query: AiImageQuery,
  provider: Provider = DEFAULT_PROVIDER
): Parameters<typeof generateText>[0] | undefined => {
  const basePrompt = `You are a highly skilled photographer and photography expert with deep knowledge of both Western and Chinese artistic traditions.

${AI_IMAGE_QUERIES[query]}

Remember to:
1. Follow the exact format specified
2. Be poetic and evocative
3. Consider both cultural perspectives
4. Keep responses concise and focused

Use the provided tool to format your response.`;

  const imageData = removeBase64Prefix(imageBase64);
  const [toolName, tool] = getQueryTool(query);

  if (provider === 'openai' && openai) {
    return {
      model: openai.chat(OPENAI_MODEL),
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: basePrompt },
          { 
            type: 'image_url', 
            image_url: { 
              url: `data:image/jpeg;base64,${imageData}`,
              detail: 'high'
            } 
          }
        ],
      } as CoreUserMessage],
      temperature: 0.8,
      maxTokens: 1000,
      tools: { [toolName]: tool },
      toolChoice: { type: 'tool', toolName }
    };
  } else if (provider === 'anthropic' && anthropic) {
    return {
      model: anthropic(ANTHROPIC_MODEL),
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: basePrompt },
          { 
            type: 'image', 
            source: { 
              type: 'base64', 
              data: imageData,
              mediaType: 'image/jpeg'
            } 
          }
        ],
      } as CoreUserMessage],
      temperature: 0.8,
      maxTokens: 1000,
      tools: { [toolName]: tool },
      toolChoice: { type: 'tool', toolName }
    };
  }
  
  return undefined;
};

export const streamOpenAiImageQuery = async (
  imageBase64: string,
  query: AiImageQuery,
  provider: Provider = DEFAULT_PROVIDER
) => {
  await checkRateLimitAndBailIfNecessary();

  const stream = createStreamableValue('');
  const args = getImageTextArgs(imageBase64, query, provider);

  if (args) {
    (async () => {
      const { textStream } = await streamText(args);
      for await (const delta of textStream) {
        stream.update(cleanUpAiTextResponse(delta));
      }
      stream.done();
    })();
  }

  return stream;
};

export const generateOpenAiImageQuery = async (
  imageBase64: string,
  query: AiImageQuery,
  provider: Provider = DEFAULT_PROVIDER
) => {
  await checkRateLimitAndBailIfNecessary();

  const args = getImageTextArgs(imageBase64, query, provider);

  if (args) {
    const { text, toolCalls } = await generateText(args);
    if (toolCalls?.[0]) {
      return toolCalls[0].args;
    }
    return cleanUpAiTextResponse(text);
  }
};

export const testOpenAiConnection = async (provider: Provider = DEFAULT_PROVIDER) => {
  await checkRateLimitAndBailIfNecessary();

  if (provider === 'openai' && openai) {
    return generateText({
      model: openai.chat(OPENAI_MODEL),
      messages: [{
        role: 'user',
        content: 'Test connection',
      } as CoreUserMessage],
      maxTokens: 10,
    });
  } else if (provider === 'anthropic' && anthropic) {
    return generateText({
      model: anthropic(ANTHROPIC_MODEL),
      messages: [{
        role: 'user',
        content: 'Test connection',
      } as CoreUserMessage],
      maxTokens: 10,
    });
  }
};
