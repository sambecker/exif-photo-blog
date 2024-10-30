import { generateText, streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { createOpenAI } from '@ai-sdk/openai';
import { kv } from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';
import { AI_TEXT_GENERATION_ENABLED, HAS_VERCEL_KV } from '@/site/config';
import { removeBase64Prefix } from '@/utility/image';
import { cleanUpAiTextResponse } from '@/photo/ai';

const RATE_LIMIT_IDENTIFIER = 'openai-image-query';
const RATE_LIMIT_MAX_QUERIES_PER_HOUR = 100;
const MODEL = 'gpt-4o';

const openai = AI_TEXT_GENERATION_ENABLED
  ? createOpenAI({ apiKey: process.env.OPENAI_SECRET_KEY })
  : undefined;

const ratelimit = HAS_VERCEL_KV
  ? new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX_QUERIES_PER_HOUR, '1h'),
  })
  : undefined;

// Allows 100 requests per hour
const checkRateLimitAndBailIfNecessary = async () => {
  if (ratelimit) {
    let success = false;
    try {
      success = (await ratelimit.limit(RATE_LIMIT_IDENTIFIER)).success;
    } catch (e: any) {
      console.error('Failed to rate limit OpenAI', e);
      throw new Error('Failed to rate limit OpenAI');
    }
    if (!success) {
      console.error('OpenAI rate limit exceeded');
      throw new Error('OpenAI rate limit exceeded');
    }
  }
};

const getImageTextArgs = (
  imageBase64: string,
  query: string,
): (
  Parameters<typeof streamText>[0] &
  Parameters<typeof generateText>[0]
) | undefined => openai ? {
  model: openai(MODEL),
  messages: [{
    'role': 'user',
    'content': [
      {
        'type': 'text',
        'text': query,
      }, {
        'type': 'image',
        'image': removeBase64Prefix(imageBase64),
      },
    ],
  }],

  // Temperature controls randomness in the output
  // Range: 0.0 to 2.0
  // - 0.0: Focused, deterministic, always picks most likely next token
  // - 0.7: Balanced, creative yet coherent (OpenAI default)
  // - 1.0: More creative, varied outputs
  // - 2.0: Maximum randomness, most creative but potentially less coherent
  temperature: 0.9,

  // Top_p (nucleus sampling) controls diversity of word choices
  // Range: 0.0 to 1.0
  // - Lower values (0.1): Conservative, uses only most likely tokens
  // - Higher values (0.9): More diverse vocabulary, creative word choices
  // - 1.0: Considers all possible tokens
  top_p: 0.9,

  // Frequency penalty reduces repetition by lowering the likelihood 
  // of using tokens that have already appeared in the text
  // Range: -2.0 to 2.0
  // - 0.0: No penalty (OpenAI default)
  // - 0.6: Moderate discouragement of repetition
  // - 1.0+: Strongly avoids repeating words/phrases
  frequency_penalty: 0.6,

  // Presence penalty encourages the model to talk about new topics
  // Range: -2.0 to 2.0
  // - 0.0: No penalty (OpenAI default)
  // - 0.6: Moderately encourages new topics
  // - 1.0+: Strongly favors introducing new concepts
  // Useful for generating more diverse titles/captions
  presence_penalty: 0.6,

  // Optional parameters you might consider:
  // max_tokens: 100,    // Limits response length
  // n: 1,              // Number of completions to generate
  // stream: true,      // Enable streaming responses
  // stop: ["\n", "."], // Stop sequences
} : undefined;

export const streamOpenAiImageQuery = async (
  imageBase64: string,
  query: string,
) => {
  await checkRateLimitAndBailIfNecessary();

  const stream = createStreamableValue('');

  const args = getImageTextArgs(imageBase64, query);

  if (args) {
    (async () => {
      const { textStream } = await streamText(args);
      for await (const delta of textStream) {
        stream.update(cleanUpAiTextResponse(delta));
      }
      stream.done();
    })();
  }

  return stream.value;
};

export const generateOpenAiImageQuery = async (
  imageBase64: string,
  query: string,
) => {
  await checkRateLimitAndBailIfNecessary();

  const args = getImageTextArgs(imageBase64, query);

  if (args) {
    return generateText(args)
      .then(({ text }) => cleanUpAiTextResponse(text));
  }
};

export const testOpenAiConnection = async () => {
  await checkRateLimitAndBailIfNecessary();

  if (openai) {
    return generateText({
      model: openai(MODEL),
      messages: [{
        'role': 'user',
        'content': [
          {
            'type': 'text',
            'text': 'Test connection',
          },
        ],
      }],
    });
  }
};
