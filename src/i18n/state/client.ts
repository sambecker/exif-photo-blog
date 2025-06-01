'use client';

import { createContext, use } from 'react';
import { generateAppTextState } from '.';
import { TEXT as EN_US } from '../locales/en-us';

export const AppTextContext = createContext(generateAppTextState(EN_US));

export const useAppText = () => use(AppTextContext);
