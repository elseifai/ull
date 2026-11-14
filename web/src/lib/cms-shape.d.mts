export function clean(v: unknown, base?: string): any;
export function mediaUrl(url: string, base?: string): string;
export type MediaVariant = { width?: number; height?: number; alt?: string; avif?: string; webp?: string; og?: string };
export function collectMedia(v: unknown, base?: string, into?: Record<string, MediaVariant>): Record<string, MediaVariant>;
export function toWebBlock(b: any): any;
export function toWebPage(doc: any, base?: string): any;
