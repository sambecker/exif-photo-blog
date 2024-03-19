'use server';

import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });

const queryImage = async (imageBase64: string, query: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    stream: true,
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
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
};

export const tagImage = async (imageBase64: string) =>
  queryImage(
    imageBase64,
    'Describe this image three or less comma-separated keywords',
  );
