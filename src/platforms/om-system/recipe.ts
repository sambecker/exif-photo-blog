import { z } from 'zod';

export const OM_RECIPE_VERSION = 1;

export const OM_COLOR_CHANNELS = [
  'Yellow', 'Orange', 'Orange-red', 'Red', 'Magenta', 'Violet',
  'Blue', 'Blue-cyan', 'Cyan', 'Green-cyan', 'Green', 'Yellow-green',
] as const;

export const OM_MONO_FILTERS = [
  'None', 'Yellow', 'Orange', 'Red', 'Magenta',
  'Blue', 'Cyan', 'Green', 'Yellow-green',
] as const;

export const OM_WHITE_BALANCE_LABELS: Record<number, string> = {
  0: 'Auto',
  1: 'Auto · Keep warm color off',
  16: 'Shade',
  17: 'Cloudy',
  18: 'Fine weather',
  20: 'Tungsten',
  21: 'Tungsten-like',
  22: 'Auto setup',
  23: 'Flash',
  33: 'Daylight fluorescent',
  34: 'Neutral white fluorescent',
  35: 'Cool white fluorescent',
  36: 'White fluorescent',
  48: 'Tungsten-like',
  67: 'Underwater',
  512: 'Custom WB 1',
  513: 'Custom WB 2',
  514: 'Custom WB 3',
  515: 'Custom WB 4',
};

const adjustment = (min: number, max: number) =>
  z.number().int().min(min).max(max);

const whiteBalanceSchema = z.object({
  mode: z.number().int().refine(mode => mode in OM_WHITE_BALANCE_LABELS),
  amber: adjustment(-7, 7),
  green: adjustment(-7, 7),
  kelvin: z.number().int().optional(),
}).superRefine((wb, context) => {
  if (wb.mode >= 512 && (wb.kelvin === undefined ||
    wb.kelvin < 2000 || wb.kelvin > 14000)) {
    context.addIssue({ code: 'custom', message: 'Invalid selected Kelvin' });
  }
});

const sharedSettings = {
  version: z.literal(1),
  whiteBalance: whiteBalanceSchema,
  tone: z.object({
    shadow: adjustment(-7, 7),
    mid: adjustment(-7, 7),
    highlight: adjustment(-7, 7),
  }),
  shading: adjustment(-5, 5),
  sharpness: adjustment(-2, 2),
  contrast: adjustment(-2, 2),
};

const omRecipeSchema = z.discriminatedUnion('kind', [
  z.object({
    ...sharedSettings,
    kind: z.literal('color'),
    colors: z.array(adjustment(-5, 5)).length(12),
  }),
  z.object({
    ...sharedSettings,
    kind: z.literal('mono'),
    filter: z.object({
      color: adjustment(0, 8),
      strength: z.number().int().optional(),
    }).superRefine((filter, context) => {
      if (filter.color !== 0 && (filter.strength === undefined ||
        filter.strength < 0 || filter.strength > 3)) {
        context.addIssue({
          code: 'custom', message: 'Missing filter strength',
        });
      }
    }),
    grain: z.enum(['off', 'low', 'medium', 'high']),
    hue: z.enum(['normal', 'sepia', 'blue', 'purple', 'green']),
  }),
]);

export type OmRecipe = z.infer<typeof omRecipeSchema>;

export const isOmSystemPen = (make?: string, model?: string) =>
  /^(OM Digital Solutions|OM SYSTEM)$/i.test(make?.trim() ?? '') &&
  model?.trim().toUpperCase() === 'PEN';

// Parsing strips unrelated/inactive properties and fixes serialization order.
export const parseOmRecipe = (value: unknown): OmRecipe | undefined => {
  try {
    const result = omRecipeSchema.safeParse(
      typeof value === 'string' ? JSON.parse(value) : value,
    );
    if (!result.success) { return undefined; }
    const recipe = result.data;
    if (recipe.whiteBalance.mode < 512) {
      delete recipe.whiteBalance.kelvin;
    }
    if (recipe.kind === 'mono' && recipe.filter.color === 0) {
      delete recipe.filter.strength;
    }
    return recipe;
  } catch {
    return undefined;
  }
};

const OM_RECIPE_KEY_PATTERN = /^om-pen-v1-(color|mono)-[a-f0-9]{64}$/;

export const isOmRecipeKey = (key?: string): boolean =>
  OM_RECIPE_KEY_PATTERN.test(key ?? '');

export const labelForOmRecipe = (kind: OmRecipe['kind']) =>
  kind === 'color' ? 'Color recipe' : 'Mono recipe';

export const labelForOmRecipeKey = (key: string) =>
  labelForOmRecipe(key.startsWith('om-pen-v1-color-') ? 'color' : 'mono');

export const formatOmWhiteBalance = (wb: OmRecipe['whiteBalance']) =>
  wb.kelvin ? `${wb.kelvin}K` : OM_WHITE_BALANCE_LABELS[wb.mode];

export const formatOmWbShift = ({ amber, green }: OmRecipe['whiteBalance']) =>
  `${amber < 0 ? 'B' : 'A'}${Math.abs(amber)} · ` +
  `${green < 0 ? 'M' : 'G'}${Math.abs(green)}`;

export const omSignedValue = (value: number) =>
  value > 0 ? `+${value}` : String(value);
