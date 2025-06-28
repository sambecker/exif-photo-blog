import { CategoryQueryMeta } from '@/category';

type YearWithMeta = { year: string } & CategoryQueryMeta;

export type Years = YearWithMeta[];
