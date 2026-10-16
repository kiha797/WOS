import { sql } from "./db";
import type { CompanyLogo, LogoVariant } from "../shared/company-branding";

export async function getCompanyLogos(): Promise<CompanyLogo[]> {
  const rows = await sql`
    SELECT COALESCE(json_agg(json_build_object(
      'company', company, 'variant', variant, 'updatedAt', updated_at
    ) ORDER BY company, variant), '[]'::json) AS logos
    FROM company_logos
  `;
  return (rows[0].logos as Omit<CompanyLogo, "url">[]).map(logo => ({
    ...logo,
    url: `/api/company-logos/${encodeURIComponent(logo.company)}/${logo.variant}/image?v=${encodeURIComponent(logo.updatedAt)}`,
  }));
}

export async function getCompanyLogoData(company: string, variant: LogoVariant): Promise<string | undefined> {
  const rows = await sql`
    SELECT COALESCE(json_agg(data_url), '[]'::json) AS images
    FROM company_logos WHERE company = ${company} AND variant = ${variant}
  `;
  return rows[0].images[0];
}

export async function saveCompanyLogo(company: string, variant: LogoVariant, dataUrl: string): Promise<void> {
  await sql`
    WITH saved AS (
      INSERT INTO company_logos (company, variant, data_url)
      VALUES (${company}, ${variant}, ${dataUrl})
      ON CONFLICT (company, variant) DO UPDATE
      SET data_url = EXCLUDED.data_url, updated_at = clock_timestamp()
      RETURNING company
    ) SELECT COUNT(*) AS affected FROM saved
  `;
}

export async function deleteCompanyLogo(company: string, variant: LogoVariant): Promise<void> {
  await sql`
    WITH deleted AS (
      DELETE FROM company_logos WHERE company = ${company} AND variant = ${variant}
      RETURNING company
    ) SELECT COUNT(*) AS affected FROM deleted
  `;
}
