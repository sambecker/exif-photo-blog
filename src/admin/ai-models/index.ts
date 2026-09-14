import { Oklch } from '@/photo/color/client';
import {
  OPENAI_MODEL_COMPATIBLE,
  OPENAI_MODEL_DEFAULT,
  OPENAI_MODELS_SELECTABLE,
  OpenAIModel,
} from '@/platforms/openai/models';

export const AI_MODEL_COMPARISON_PHOTO_COUNT = 10;

// Reference points worth calling out wherever a model id is shown
export const AI_MODEL_ANNOTATIONS: Record<string, string> = {
  [OPENAI_MODEL_COMPATIBLE as string]: 'compatibility',
  [OPENAI_MODEL_DEFAULT as string]: 'default',
};

// Includes the annotated models even when absent from OPENAI_MODELS_SELECTABLE,
// otherwise a column starting on one has no matching option and renders blank
export const AI_MODEL_OPTIONS: OpenAIModel[] = Array.from(new Set([
  OPENAI_MODEL_COMPATIBLE,
  OPENAI_MODEL_DEFAULT,
  ...OPENAI_MODELS_SELECTABLE,
]));

// Default first, then the first curated model (currently astra)
export const AI_MODEL_COLUMNS_DEFAULT: OpenAIModel[] = [
  OPENAI_MODEL_DEFAULT,
  OPENAI_MODELS_SELECTABLE[0] ?? OPENAI_MODEL_DEFAULT,
];

export type AiModelResult = {
  // Recorded per result, as a column's dropdown can be
  // changed after its cells have been generated
  model: OpenAIModel
  title?: string
  caption?: string
  color?: Oklch
  error?: string
  durationInMs: number
}
