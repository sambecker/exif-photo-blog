'use server';

import OpenAI from 'openai';
import { createStreamableValue, render } from 'ai/rsc';

const provider = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });

export const streamOpenAiImageQuery = async (
  imageBase64: string,
  query: string,
) => {
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
