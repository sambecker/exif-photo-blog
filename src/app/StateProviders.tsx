import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import {
  ADMIN_AI_MODEL_DEBUG_ENABLED,
  ADMIN_DEBUG_TOOLS_ENABLED,
  DEFAULT_THEME,
} from '@/app/config';
import AppStateProvider from '@/app/AppStateProvider';
import UploadStateProvider from '@/admin/upload/UploadStateProvider';
import AppTextProvider from '@/i18n/state/AppTextProvider';
import SelectPhotosProvider from '@/admin/select/SelectPhotosProvider';
import EditTitlesProvider from '@/admin/edit-titles/EditTitlesProvider';
import SwrConfigClient from '@/swr/SwrConfigClient';
import SharedHoverProvider from '@/components/shared-hover/SharedHoverProvider';
import StickyHeaderProvider from '@/app/StickyHeaderProvider';

// Order matters: SharedHoverProvider renders hover content
// itself, so it must stay within theme and SWR providers
export default function StateProviders({
  children,
}: {
  children: ReactNode
}) {
  return (
    <AppStateProvider
      areAdminDebugToolsEnabled={ADMIN_DEBUG_TOOLS_ENABLED}
      isAdminAiModelDebugEnabled={ADMIN_AI_MODEL_DEBUG_ENABLED}
    >
      <UploadStateProvider>
        <AppTextProvider>
          <SelectPhotosProvider>
            <EditTitlesProvider>
              <ThemeProvider attribute="class" defaultTheme={DEFAULT_THEME}>
                <SwrConfigClient>
                  <SharedHoverProvider>
                    <StickyHeaderProvider>
                      {children}
                    </StickyHeaderProvider>
                  </SharedHoverProvider>
                </SwrConfigClient>
              </ThemeProvider>
            </EditTitlesProvider>
          </SelectPhotosProvider>
        </AppTextProvider>
      </UploadStateProvider>
    </AppStateProvider>
  );
}
