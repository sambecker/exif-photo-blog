import { IMMICH_BASE_URL, IMMICH_API_KEY } from '@/app/config';

export interface ImmichAlbumInfo {
  albumName: string;
  albumThumbnailAssetId: string;
  // albumUsers
  assetCount: number;
  assets: ImmichAsset[];
  createdAt: string;
  description: string;
  endDate: string;
  hasSharedLink: boolean;
  id: string;
  isActivityEnabled: boolean;
  lastModifiedAssetTimestamp: string;
  order: number;
  // owner
  ownerId: string;
  shared: boolean;
  startDate: string;
  updatedAt: string;
}


export interface ImmichAsset {
  id: string;
  deviceAssetId: string;
  ownerId: string;
  deviceId: string;
  libraryId: string;
  type: 'IMAGE' | 'VIDEO';
  originalPath: string;
  originalFileName: string;
  originalMimeType: string;
  thumbhash: string;
  fileCreatedAt: string;
  fileModifiedAt: string;
  localDateTime: string;
  updatedAt: string;
  isFavorite: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  visibility?: string;
  duration: string;
  exifInfo?: {
    make?: string;
    model?: string;
    exifImageWidth?: number;
    exifImageHeight?: number;
    fileSizeInByte?: number;
    orientation?: string;
    dateTimeOriginal?: string;
    modifyDate?: string;
    timeZone?: string;
    // not found in Immich, but used in Photo interface
    lensMake?: string;
    lensModel?: string;
    fNumber?: number;
    focalLength?: number;
    iso?: number;
    exposureTime?: string;
    // not found in Immich, but used in Photo interface
    exposureCompensation?: string;
    latitude?: number | null;
    longitude?: number | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    description?: string | null;
    projectionType?: string | null;
    rating?: number | null;
  };
  livePhotoVideoId?: string | null;
  people?: string[];
  checksum?: string;
  isOffline?: boolean;
  hasMetadata?: boolean;
  duplicateId?: string | null;
  resized: boolean;
  // not found in Immich, but used in Photo interface
  tags?: string[];
}

export interface ImmichSharedLinkInfo {
  album: ImmichAlbumInfo;
  assets: ImmichAsset[];
  createdAt?: string;
  expiresAt?: string | null;
  id?: string;
  key?: string;
}

export class ImmichApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Immich API error on endpoint ${url}:
         ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getAssetThumbnail(
    id: string,
    size: 'thumbnail' | 'preview' = 'preview'): Promise<string> {
    return `${this.baseUrl}/api/assets/${id}/thumbnail?size=${size}`;
  }

  async getAssetOriginal(id: string): Promise<string> {
    return `${this.baseUrl}/api/assets/${id}/original`;
  }

  // -------------- request immich api ---------------
  async getAlbumInfo(
    id: string,
    withoutAssets: boolean = false): Promise<ImmichAlbumInfo> {
    if (!id || id.trim() === '') {
      throw new Error('Album ID is required');
    }

    const queryParam = withoutAssets ?
      '?withoutAssets=true' :
      '?withoutAssets=false';
    return this.request<ImmichAlbumInfo>(`/albums/${id}${queryParam}`);
  }

  async getSharedLinkInfo(
    sharedKey: string): Promise<ImmichSharedLinkInfo> {
    if (!sharedKey || sharedKey.trim() === '') {
      throw new Error('Shared key is required');
    }

    try {
      return await this.request<ImmichSharedLinkInfo>(
        `/shared-links/me?key=${sharedKey}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error(`Shared link with key ${sharedKey} not found`);
      }
      throw error;
    }
  }

  async getAssetInfo(id: string, _hidden?: boolean): Promise<ImmichAsset> {
    if (!id || id.trim() === '') {
      throw new Error('Asset ID is required');
    }
    try {
      const asset = await this.request<ImmichAsset>(`/assets/${id}`);
      // TODO: use hidden
      return asset;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error(`Asset with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getAllTags(): Promise<string[]> {
    const result = await this.
      request<{ id: string; name: string; value: string }[]>('/tags');
    return result.map(tag => tag.value);
  }

  async getTimeBuckets(
    size: 'DAY' | 'MONTH' = 'MONTH'):
    Promise<Array<{ timeBucket: string; count: number }>> {
    return this.request<Array<{
      timeBucket: string; count: number
    }>>(`/assets/time-buckets?size=${size}`);
  }

  async getAssetStatistics(): Promise<{
    images: number; videos: number; total: number
  }> {
    return this.request<{
      images: number; videos: number; total: number
    }>('/assets/statistics');
  }
}

let immichClient: ImmichApiClient;

export const getImmichClient = (): ImmichApiClient => {
  if (!immichClient) {
    if (!IMMICH_BASE_URL || !IMMICH_API_KEY) {
      throw new Error('IMMICH_BASE_URL and IMMICH_API_KEY required');
    }

    immichClient = new ImmichApiClient(IMMICH_BASE_URL, IMMICH_API_KEY);
  }
  return immichClient;
};

export async function getSharedLinkInfo(
  shareKey: string): Promise<ImmichSharedLinkInfo> {
  return getImmichClient().getSharedLinkInfo(shareKey);
}