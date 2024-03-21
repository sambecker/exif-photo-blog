/* eslint-disable max-len */

import { streamOpenAiImageQuery } from '@/services/openai';

export type AiImageQuery =
  'title' |
  'caption' |
  'title-and-caption' |
  'tags' |
  'description-small' |
  'description' |
  'description-large' |
  'semantic';

export const AI_IMAGE_QUERIES: Record<AiImageQuery, string> = {
  'title': 'Provide a short title for this image in 3 words or less',
  'caption': 'What is a pithy caption for this image in 8 words or less?',
  'title-and-caption': 'Write a short title and pithy caption of 8 words or less for this image, using the format Title: "title" Caption: "caption"',
  'tags': 'Describe this image three or less comma-separated keywords with no adjective or adverbs',
  'description-small': 'Describe this image succinctly',
  'description': 'Describe this image',
  'description-large': 'Describe this image in detail',
  'semantic': 'List up to 5 things in this image without description as a comma-separated list',
};

export const streamAiImageQuery = (imageBase64: string, query: AiImageQuery) =>
  streamOpenAiImageQuery(imageBase64, AI_IMAGE_QUERIES[query]);
