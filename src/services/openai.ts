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
      const { textStream } = streamText(args);
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
