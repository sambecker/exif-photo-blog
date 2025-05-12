'use client';

import { createContext, use } from 'react';
import { generateAppTextState } from '.';
import US_EN from '../locales/us-en';

export const AppTextContext = createContext(generateAppTextState(US_EN));

export const useAppText = () => use(AppTextContext);
