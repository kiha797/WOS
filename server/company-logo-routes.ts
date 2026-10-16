import type { Express, Request, Response, NextFunction } from "express";
import { COMPANY_NAMES, LOGO_VARIANTS, type LogoVariant } from "../shared/company-branding";
import { LogoInputError, parseLogoDataUrl } from "./company-logo-input";
import { deleteCompanyLogo, getCompanyLogoData, getCompanyLogos, saveCompanyLogo } from "./company-logo-storage";

// Shared branding for the existing demo portal. When real authentication is
// introduced, restrict mutation routes to an authenticated branding administrator.
export function registerCompanyLogoRoutes(app: Express) {
  function validTarget(req: Request, res: Response, next: NextFunction) {
    if (!COMPANY_NAMES.some(company => company === req.params.company)
      || !LOGO_VARIANTS.some(variant => variant === req.params.variant)) {
      res.status(400).json({ message: "올바른 회사와 로고 종류를 선택해 주세요." });
      return;
    }
    next();
  }

  app.get("/api/company-logos", async (_req, res) => {
    try {
      res.json({ logos: await getCompanyLogos() });
    } catch (error) {
      console.error("Failed to load company logos", error);
      res.status(500).json({ message: "회사 로고를 불러오지 못했습니다." });
    }
  });

  app.get("/api/company-logos/:company/:variant/image", validTarget, async (req, res) => {
    try {
      const dataUrl = await getCompanyLogoData(req.params.company, req.params.variant as LogoVariant);
      if (!dataUrl) {
        res.status(404).json({ message: "등록된 로고가 없습니다." });
        return;
      }
      const { mime, bytes } = parseLogoDataUrl(dataUrl);
      res.set({
        "Content-Type": mime,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache",
      }).send(bytes);
    } catch (error) {
      console.error("Failed to serve company logo", error);
      res.status(500).json({ message: "회사 로고 이미지를 불러오지 못했습니다." });
    }
  });

  app.put("/api/company-logos/:company/:variant", validTarget, async (req, res) => {
    try {
      parseLogoDataUrl(req.body?.dataUrl);
      await saveCompanyLogo(req.params.company, req.params.variant as LogoVariant, req.body.dataUrl);
      res.json({ logos: await getCompanyLogos() });
    } catch (error) {
      if (error instanceof LogoInputError) {
        res.status(error.status).json({ message: error.message });
        return;
      }
      console.error("Failed to save company logo", error);
      res.status(500).json({ message: "회사 로고를 저장하지 못했습니다. 다시 시도해 주세요." });
    }
  });

  app.delete("/api/company-logos/:company/:variant", validTarget, async (req, res) => {
    try {
      await deleteCompanyLogo(req.params.company, req.params.variant as LogoVariant);
      res.json({ logos: await getCompanyLogos() });
    } catch (error) {
      console.error("Failed to reset company logo", error);
      res.status(500).json({ message: "회사 로고를 초기화하지 못했습니다." });
    }
  });
}
