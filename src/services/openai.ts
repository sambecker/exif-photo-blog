'use server';

import OpenAI from 'openai';
import { createStreamableValue, render } from 'ai/rsc';

const provider = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });

const streamImageQueryRaw = async (imageBase64: string, query: string) => {
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

export type ImageQuery = 'title' | 'caption' | 'tags' | 'description';

export const IMAGE_QUERIES: Record<ImageQuery, string> = {
  title: 'What is the title of this image?',
  caption: 'What is the caption of this image?',
  tags: 'Describe this image three or less comma-separated keywords',
  description: 'Describe this image in detail',
};

export const streamImageQuery = (imageBase64: string, query: ImageQuery) =>
  streamImageQueryRaw(imageBase64, IMAGE_QUERIES[query]);
