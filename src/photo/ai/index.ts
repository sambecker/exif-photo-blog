import { streamOpenAiImageQuery } from '@/services/openai';

export type ImageQuery = 'title' | 'caption' | 'tags' | 'description';

export const IMAGE_QUERIES: Record<ImageQuery, string> = {
  title: 'Provide a short title for this image',
  caption: 'What is the caption of this image?',
  tags: 'Describe this image three or less comma-separated keywords',
  description: 'Describe this image in detail',
};

export const streamImageQuery = (imageBase64: string, query: ImageQuery) =>
  streamOpenAiImageQuery(imageBase64, IMAGE_QUERIES[query]);
