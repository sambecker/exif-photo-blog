import { streamOpenAiImageQuery } from '@/services/openai';

export type ImageQuery =
  'title' |
  'caption' |
  'tags' |
  'descriptionSmall' |
  'descriptionMedium' |
  'descriptionLarge' |
  'rich' |
  'semantic';

export const IMAGE_QUERIES: Record<ImageQuery, string> = {
  // title: 'Provide a short title for this image',
  title: 'Provide a short title for this image in 3 words or less',
  caption: 'What is a pithy caption for this image in 8 words or less?',
  // eslint-disable-next-line max-len
  tags: 'Describe this image three or less comma-separated keywords with no adjective or adverbs',
  descriptionSmall: 'Describe this image succinctly',
  descriptionMedium: 'Describe this image',
  descriptionLarge: 'Describe this image in detail',
  // eslint-disable-next-line max-len
  rich: 'What is a short title and pithy caption of 8 words or less for this image?',
  // eslint-disable-next-line max-len
  semantic: 'List up to 5 things in this image without description as a comma-separated list',
};

export const streamImageQuery = (imageBase64: string, query: ImageQuery) =>
  streamOpenAiImageQuery(imageBase64, IMAGE_QUERIES[query]);
