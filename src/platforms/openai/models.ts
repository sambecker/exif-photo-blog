// Type-only import keeps this module safe to use from client components
import type { OpenAIProvider } from '@ai-sdk/openai';

export type OpenAIModel = Parameters<OpenAIProvider>[0];

// OpenAIModel ends in a `string` catch-all so callers can pass ids newer than
// the SDK, which also means typos survive until OpenAI rejects them at
// runtime. Dropping that member gets the ids the SDK actually knows about.
type KnownModel<T> = T extends string
  ? string extends T ? never : T
  : never;

export type OpenAIModelKnown = KnownModel<OpenAIModel>;

export const OPENAI_MODEL_DEFAULT: OpenAIModelKnown = 'gpt-5.2';
export const OPENAI_MODEL_COMPATIBLE: OpenAIModelKnown = 'gpt-4o';

// Curated rather than derived, as the SDK's full list is long and
// includes pinned dates, non-vision, and specialized variants
export const OPENAI_MODELS_SELECTABLE: OpenAIModelKnown[] = [
  'gpt-5.6-luna',
  'gpt-5.6-sol',
  'gpt-5.6-terra',
  'gpt-5.6',
  'gpt-5.5',
  'gpt-5.4',
  'gpt-5.4-mini',
];
