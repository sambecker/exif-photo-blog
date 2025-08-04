import { generateText, streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { createOpenAI } from '@ai-sdk/openai';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import {
  AI_CONTENT_GENERATION_ENABLED,
  HAS_REDIS_STORAGE,
  OPENAI_BASE_URL,
} from '@/app/config';
import { removeBase64Prefix } from '@/utility/image';
import { cleanUpAiTextResponse } from '@/photo/ai';

const redis = HAS_REDIS_STORAGE ? Redis.fromEnv() : undefined;

const RATE_LIMIT_IDENTIFIER = 'openai-image-query';
const MODEL = 'gpt-4o';

const openai = AI_CONTENT_GENERATION_ENABLED
  ? createOpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
    ...OPENAI_BASE_URL && { baseURL: OPENAI_BASE_URL },
  })
  : undefined;

const ratelimit = redis
  ? {
    basic: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1h'),
    }),
    batch: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(1200, '1d'),
    }),
  }
  : undefined;

const checkRateLimitAndThrow = async (isBatch?: boolean) => {
  if (ratelimit) {
    let success = false;
    try {
      const limiter = isBatch ? ratelimit.batch : ratelimit.basic;
      success = (await limiter.limit(RATE_LIMIT_IDENTIFIER)).success;
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
  await checkRateLimitAndThrow();

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
  isBatch?: boolean,
) => {
  await checkRateLimitAndThrow(isBatch);

  const args = getImageTextArgs(imageBase64, query);

  if (args) {
    return generateText(args)
      .then(({ text }) => cleanUpAiTextResponse(text));
  }
};

export const testOpenAiConnection = async () => {
  await checkRateLimitAndThrow();

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
