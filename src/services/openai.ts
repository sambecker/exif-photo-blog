import { generateText, streamText, Message, CoreUserMessage } from 'ai';
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
const OPENAI_MODEL = 'gpt-4o';
const ANTHROPIC_MODEL = 'claude-3.5-sonnet';

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
4. Keep responses concise and focused`;

  const imageData = removeBase64Prefix(imageBase64);

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
    const { text } = await generateText(args);
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
