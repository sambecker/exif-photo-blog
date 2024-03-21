'use server';

import OpenAI from 'openai';
import { createStreamableValue, render } from 'ai/rsc';
import { kv } from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';
import { HAS_VERCEL_KV } from '@/site/config';

const RATE_LIMIT_IDENTIFIER = 'openai-image-query';
const RATE_LIMIT_MAX_QUERIES_PER_HOUR = 100;

const provider = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });

// Allows 100 requests per hour
const ratelimit = HAS_VERCEL_KV
  ? new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX_QUERIES_PER_HOUR, '1h'),
  })
  : undefined;

export const streamOpenAiImageQuery = async (
  imageBase64: string,
  query: string,
) => {
  if (ratelimit) {
    const { success } = await ratelimit.limit(RATE_LIMIT_IDENTIFIER);
    if (!success) {
      console.error('OpenAI rate limit exceeded');
      throw new Error('OpenAI rate limit exceeded');
    }
  }

  const stream = createStreamableValue('');

  render({
    provider,
    model: 'gpt-4-vision-preview',
    messages: [{
      'role': 'user',
      'content': [
        {
          'type': 'text',
          'text': query,
        }, {
          'type': 'image_url',
          'image_url': {
            'url': imageBase64,
          },
        },
      ],
    }],
    text: ({ content, done }): any => {
      if (done) {
        stream.done(content);
      } else {
        stream.update(content);
      }
    },
  });

  return stream.value;
};
