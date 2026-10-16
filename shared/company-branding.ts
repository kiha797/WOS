export const COMPANY_NAMES = [
  "동원약품", "신덕약품", "보덕메디팜", "아이팜코리아", "인천약품", "신덕팜",
] as const;

export const LOGO_VARIANTS = ["standard", "header"] as const;
export type LogoVariant = (typeof LOGO_VARIANTS)[number];
export const MAX_LOGO_BYTES = 512 * 1024;
export const LOGO_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export interface CompanyLogo {
  company: string;
  variant: LogoVariant;
  url: string;
  updatedAt: string;
}

export interface CompanyLogosResponse {
  logos: CompanyLogo[];
}
