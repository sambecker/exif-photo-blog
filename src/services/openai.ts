import { generateText, streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { createOpenAI } from '@ai-sdk/openai';
import { kv } from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';
import { AI_TEXT_GENERATION_ENABLED, HAS_VERCEL_KV } from '@/site/config';
import { removeBase64Prefix } from '@/utility/image';
import { cleanUpAiTextResponse } from '@/photo/ai';

const RATE_LIMIT_IDENTIFIER = 'openai-image-query';
const RATE_LIMIT_MAX_QUERIES_PER_HOUR = 100;
const MODEL = 'gpt-4o';

const openai = AI_TEXT_GENERATION_ENABLED
  ? createOpenAI({ apiKey: process.env.OPENAI_SECRET_KEY })
  : undefined;

const ratelimit = HAS_VERCEL_KV
  ? new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX_QUERIES_PER_HOUR, '1h'),
  })
  : undefined;

// Allows 100 requests per hour
const checkRateLimitAndBailIfNecessary = async () => {
  if (ratelimit) {
    let success = false;
    try {
      success = (await ratelimit.limit(RATE_LIMIT_IDENTIFIER)).success;
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
  temperature: 0.9,
  topP: 0.9,
  frequencyPenalty: 0.5,
  presencePenalty: 0.5,
  messages: [{
    'role': 'user',
    'content': [
      {
        'type': 'text',
        'text': `You are a poetic and creative bilingual (English/Chinese) photography curator. ${query}`,
      }, {
        'type': 'image',
        'image': removeBase64Prefix(imageBase64),
      },
    ],
  }],
} : undefined;

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isContentFilterResponse = (text: string) => {
  const lowerText = text.toLowerCase();
  return lowerText.includes("i'm sorry") || 
         lowerText.includes("i apologize") || 
         lowerText.includes("cannot help") ||
         lowerText.includes("can't help") ||
         lowerText.includes("identifying or describing");
};

export const streamOpenAiImageQuery = async (
  imageBase64: string,
  query: string,
) => {
  await checkRateLimitAndBailIfNecessary();
  const stream = createStreamableValue('');
  const args = getImageTextArgs(imageBase64, query);

  if (args) {
    (async () => {
      let lastError: Error | undefined;
      
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          // Clear stream at the start of each attempt
          stream.update('');
          console.log(`Starting attempt ${attempt + 1}/${MAX_RETRIES}`);
          
          const { textStream } = await streamText(args);
          let accumulatedText = '';
          let partialText = '';
          let shouldRetry = false;
          
          try {
            for await (const delta of textStream) {
              const cleanedDelta = cleanUpAiTextResponse(delta);
              
              // Check if this delta contains a filter response immediately
              if (isContentFilterResponse(cleanedDelta)) {
                shouldRetry = true;
                break;
              }
              
              partialText += cleanedDelta;
              
              // Only update accumulated text and stream on word boundaries
              if (cleanedDelta.includes(' ') || cleanedDelta.includes('\n')) {
                accumulatedText += partialText;
                
                // Check accumulated text for filter response
                if (isContentFilterResponse(accumulatedText)) {
                  shouldRetry = true;
                  break;
                }
                
                // Only update stream if we haven't detected a filter response
                if (!shouldRetry) {
                  stream.update(partialText);
                }
                partialText = '';
              }
            }
            
            // Handle any remaining partial text if we haven't detected a filter response
            if (!shouldRetry) {
              if (partialText) {
                accumulatedText += partialText;
                if (isContentFilterResponse(accumulatedText)) {
                  shouldRetry = true;
                } else {
                  stream.update(partialText);
                }
              }
            }
          } catch (streamError) {
            const err = streamError instanceof Error ? streamError : new Error(String(streamError));
            if (attempt < MAX_RETRIES - 1) {
              console.log(`Retry attempt ${attempt + 1}/${MAX_RETRIES} due to stream error:`, err.message);
              await sleep(RETRY_DELAY_MS);
              continue;
            }
            throw err;
          }
          
          if (shouldRetry) {
            if (attempt < MAX_RETRIES - 1) {
              console.log(`Retry attempt ${attempt + 1}/${MAX_RETRIES} due to content filter`);
              await sleep(RETRY_DELAY_MS);
              continue;
            } else {
              stream.error('Failed to generate text after all retries');
              return;
            }
          }
          
          // If we get here without hitting the content filter, we succeeded
          stream.done();
          return;
          
        } catch (error: unknown) {
          const err = error instanceof Error ? error : new Error(String(error));
          lastError = err;
          if (attempt < MAX_RETRIES - 1) {
            console.log(`Retry attempt ${attempt + 1}/${MAX_RETRIES} due to error:`, err.message);
            await sleep(RETRY_DELAY_MS);
            continue;
          }
          console.error(`Failed to generate text after ${MAX_RETRIES} attempts:`, lastError);
          stream.error(err.message);
          return;
        }
      }
      
      // If we get here, all retries failed
      if (lastError) {
        stream.error(lastError.message);
      } else {
        stream.error('Failed to generate text after all retries');
      }
    })();
  }

  return stream.value;
};

export const generateOpenAiImageQuery = async (
  imageBase64: string,
  query: string,
) => {
  await checkRateLimitAndBailIfNecessary();

  const args = getImageTextArgs(imageBase64, query);

  if (args) {
    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const { text } = await generateText(args);
        const cleanedText = cleanUpAiTextResponse(text);
        
        // If we get a content filter response, treat it as an error and retry
        if (isContentFilterResponse(cleanedText)) {
          lastError = new Error('Content filter response');
          if (attempt < MAX_RETRIES - 1) {
            await sleep(RETRY_DELAY_MS);
            continue;
          }
        }
        
        return cleanedText;
      } catch (e) {
        lastError = e as Error;
        if (attempt < MAX_RETRIES - 1) {
          await sleep(RETRY_DELAY_MS);
          continue;
        }
      }
    }
    
    // If we get here, all retries failed
    console.error(`Failed to generate text after ${MAX_RETRIES} attempts:`, lastError);
    throw lastError;
  }
};

export const testOpenAiConnection = async () => {
  await checkRateLimitAndBailIfNecessary();

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
