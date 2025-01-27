import { generateOpenAiImageQuery } from '@/services/openai';
import {
  AI_IMAGE_QUERIES,
  AiAutoGeneratedField,
  parseTitleAndCaption,
  parseBilingualResponse,
  parseTags,
} from '.';

export const generateAiImageQueries = async (
  imageBase64?: string,
  textFieldsToGenerate: AiAutoGeneratedField[] = [],
): Promise<{
  title?: { english: string; chinese: string }
  caption?: { english: string; chinese: string }
  tags?: string[]
  semanticDescription?: { english: string; chinese: string }
  error?: string
}> => {
  let title: { english: string; chinese: string } | undefined;
  let caption: { english: string; chinese: string } | undefined;
  let tags: string[] | undefined;
  let semanticDescription: { english: string; chinese: string } | undefined;
  let error: string | undefined;

  try {
    if (imageBase64) {
      if (
        textFieldsToGenerate.includes('title') &&
        textFieldsToGenerate.includes('caption')
      ) {
        const titleAndCaption = await generateOpenAiImageQuery(
          imageBase64,
          'title-and-caption'
        );
        if (titleAndCaption) {
          const parsed = parseTitleAndCaption(titleAndCaption);
          title = parsed.title;
          caption = parsed.caption;
        }
      } else {
        if (textFieldsToGenerate.includes('title')) {
          const titleResponse = await generateOpenAiImageQuery(
            imageBase64,
            'title'
          );
          if (titleResponse) {
            title = parseBilingualResponse(titleResponse);
          }
        }
        if (textFieldsToGenerate.includes('caption')) {
          const captionResponse = await generateOpenAiImageQuery(
            imageBase64,
            'caption'
          );
          if (captionResponse) {
            caption = parseBilingualResponse(captionResponse);
          }
        }
      }
  
      if (textFieldsToGenerate.includes('tags')) {
        const tagsResponse = await generateOpenAiImageQuery(
          imageBase64,
          'tags'
        );
        if (tagsResponse) {
          tags = parseTags(tagsResponse);
        }
      }
  
      if (textFieldsToGenerate.includes('semantic')) {
        const semanticResponse = await generateOpenAiImageQuery(
          imageBase64,
          'description-small'
        );
        if (semanticResponse) {
          semanticDescription = parseBilingualResponse(semanticResponse);
        }
      }
    }
  } catch (e: any) {
    error = e.message;
    console.log('Error generating AI image text', e.message);
  }

  return {
    title,
    caption,
    tags,
    semanticDescription,
    error,
  };
};
