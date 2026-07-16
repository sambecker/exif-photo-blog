import { gateway, generateText, LanguageModel, Output, streamText } from 'ai';
import { createStreamableValue } from '@ai-sdk/rsc';
import { createOpenAI } from '@ai-sdk/openai';
import {
  AI_ACTIVE_TEXT_GENERATION_PROVIDER,
  AI_GATEWAY_MODEL,
  OPENAI_BASE_URL,
  OPENAI_MODEL,
  OPENAI_SECRET_KEY,
} from '@/app/config';
import { removeBase64Prefix } from '@/utility/image';
import { cleanUpAiTextResponse } from '@/photo/ai';
import {
  checkRateLimitAndThrow as _checkRateLimitAndThrow,
} from '@/platforms/rate-limit';
import { z } from 'zod';

type OpenAIModel = Parameters<NonNullable<typeof openaiClient>>[0];

const MODEL_DEFAULT: OpenAIModel = 'gpt-5.2';
const MODEL_COMPATIBLE: OpenAIModel = 'gpt-4o';

const OPENAI_MODEL_ID: OpenAIModel = OPENAI_MODEL === 'compatible'
  ? MODEL_COMPATIBLE
  : (OPENAI_MODEL || MODEL_DEFAULT);

const checkRateLimitAndThrow = (isBatch?: boolean) =>
  _checkRateLimitAndThrow({
    identifier: 'ai-image-query',
    ...isBatch && { tokens: 1200, duration: '1d' },
  });

const openaiClient = OPENAI_SECRET_KEY
  ? createOpenAI({
    apiKey: OPENAI_SECRET_KEY,
    ...OPENAI_BASE_URL && { baseURL: OPENAI_BASE_URL },
  })
  : undefined;

// AI_ACTIVE_TEXT_GENERATION_PROVIDER (src/app/config.ts) is the single
// source of truth for which provider wins: direct OpenAI when a secret key
// is set, else Vercel AI Gateway when a model is set, else off. `model`
// stays undefined when off, which is the no-auto-spend backstop below.
const model: LanguageModel | undefined =
  AI_ACTIVE_TEXT_GENERATION_PROVIDER === 'gateway' && AI_GATEWAY_MODEL
    ? gateway(AI_GATEWAY_MODEL)
    : AI_ACTIVE_TEXT_GENERATION_PROVIDER === 'openai'
      ? openaiClient?.(OPENAI_MODEL_ID)
      : undefined;

const getImageTextArgs = (
  imageBase64: string,
  query: string,
): (
  Parameters<typeof streamText>[0] &
  Parameters<typeof generateText>[0]
) | undefined => model ? {
  model,
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

export const generateOpenAiImageObjectQuery = async <T extends z.ZodSchema>(
  imageBase64: string,
  query: string,
  schema: T,
  isBatch?: boolean,
): Promise<z.infer<T>> => {
  await checkRateLimitAndThrow(isBatch);

  if (model) {
    return generateText({
      model,
      output: Output.object({ schema }),
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
    }).then(result => Object.fromEntries(Object
      .entries(result.output || {})
      .map(([k, v]) => [k, cleanUpAiTextResponse(v as string)]),
    ) as z.infer<T>);
  } else {
    throw new Error('No AI model configured');
  }
};

export const testOpenAiConnection = async () => {
  await checkRateLimitAndThrow();

  if (model) {
    return generateText({
      model,
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
