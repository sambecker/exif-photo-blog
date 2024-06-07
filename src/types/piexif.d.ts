declare module 'piexifjs' {
  export function load(base64Url: string): Record<string, any>
  export function dump(exifObject: Record<string, any>): string
  export function insert(exifDataWithoutGps: string, base64Url: string): string
  export function remove(exifData: string): string
}
