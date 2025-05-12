'use client';

import { createContext, use } from 'react';
import { generateI18NState } from '.';
import US_EN from '../locales/us-en';

export const AppTextContext = createContext(generateI18NState(US_EN));

export const useAppText = () => use(AppTextContext);
