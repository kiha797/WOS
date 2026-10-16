import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, LoaderCircle, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCompanyLogos } from "@/hooks/use-company-logos";
import {
  LOGO_MIME_TYPES,
  MAX_LOGO_BYTES,
  type LogoVariant,
} from "@shared/company-branding";

type Props = {
  company: string;
  variant: LogoVariant;
  standardFallback?: string;
  headerFallback?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandColor: string;
};

function errorText(error: unknown): string {
  if (!(error instanceof Error)) return "요청을 처리하지 못했습니다. 다시 시도해 주세요.";
  const match = error.message.match(/^\d+:\s*([\s\S]*)$/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]) as { message?: string };
      if (parsed.message) return parsed.message;
    } catch {
      return match[1] || error.message;
    }
  }
  return error.message;
}

function fileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string"
      ? resolve(reader.result)
      : reject(new Error("이미지 파일을 읽지 못했습니다."));
    reader.onerror = () => reject(new Error("이미지 파일을 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });
}

function verifyImage(dataUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth > 4096 || image.naturalHeight > 4096) {
        reject(new Error("이미지의 가로·세로는 4096px 이하여야 합니다."));
      } else {
        resolve();
      }
    };
    image.onerror = () => reject(new Error("이미지를 열 수 없습니다. 손상되지 않은 이미지 파일인지 확인해 주세요."));
    image.src = dataUrl;
  });
}

export function CompanyLogoEditor({
  company,
  variant: initialVariant,
  standardFallback,
  headerFallback,
  open,
  onOpenChange,
  brandColor,
}: Props) {
  const [variant, setVariant] = useState<LogoVariant>(initialVariant);
  const [error, setError] = useState("");
  const [preparing, setPreparing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const logos = useCompanyLogos();
  const customUrl = logos.findLogo(company, variant)?.url;
  const standardUrl = logos.findLogo(company, "standard")?.url || standardFallback;
  const fallback = variant === "header"
    ? headerFallback || standardUrl
    : standardFallback;
  const previewUrl = customUrl || fallback;
  const headerArtworkOnBrand = variant === "header" && Boolean(customUrl || headerFallback);
  const isPending = preparing || logos.isSaving || logos.isResetting;

  useEffect(() => {
    if (!open) return;
    setVariant(initialVariant);
    setError("");
  }, [open, initialVariant, company]);

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    setError("");
    if (!(LOGO_MIME_TYPES as readonly string[]).includes(file.type)) {
      setError("PNG, JPEG 또는 WEBP 이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setError("파일 크기는 512KB 이하여야 합니다.");
      return;
    }
    setPreparing(true);
    try {
      const dataUrl = await fileAsDataUrl(file);
      await verifyImage(dataUrl);
      await logos.saveLogo({ company, variant, dataUrl });
      toast({ title: "로고를 저장했습니다.", description: `${company} · ${variant === "standard" ? "표준 로고" : "헤더 로고"}` });
    } catch (uploadError) {
      setError(errorText(uploadError));
    } finally {
      setPreparing(false);
    }
  };

  const resetToFallback = async () => {
    setError("");
    try {
      await logos.resetLogo({ company, variant });
      toast({ title: "기본 로고로 되돌렸습니다." });
    } catch (resetError) {
      setError(errorText(resetError));
    }
  };

  const selectedVariantLabel = variant === "standard" ? "표준 로고" : "헤더 로고";
  const hasCustomLogo = Boolean(customUrl);

  return (
      <Dialog open={open} onOpenChange={(nextOpen) => {
        if (isPending && !nextOpen) return;
        onOpenChange(nextOpen);
        if (!nextOpen) setError("");
      }}>
        <DialogContent
          className="w-[calc(100%-2rem)] max-w-[460px] max-h-[90dvh] overflow-y-auto rounded-2xl border-[#d9e2e8] bg-[#f9fbfc] p-0 text-[#18323b]"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            document.querySelector<HTMLElement>('[data-testid="button-company-select"]')?.focus();
          }}
        >
          <DialogHeader className="border-b border-[#e3eaed] px-6 pb-4 pt-6 text-left">
            <DialogTitle className="text-lg font-bold tracking-tight">{company} 로고 관리</DialogTitle>
            <DialogDescription className="text-sm leading-5 text-[#62777e]">
              두 로고는 각각 저장되며 다른 회사의 로고에는 영향을 주지 않습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 px-6 py-5">
            <div className="grid grid-cols-2 rounded-lg bg-[#eaf0f2] p-1" role="group" aria-label="로고 종류 선택">
              {(["standard", "header"] as const).map((item) => (
                <button
                  type="button"
                  key={item}
                  aria-pressed={variant === item}
                  disabled={isPending}
                  onClick={() => {
                    setVariant(item);
                    setError("");
                  }}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${variant === item ? "bg-white text-[#174a57] shadow-sm" : "text-[#6b8086] hover:text-[#315762]"}`}
                >
                  {item === "standard" ? "표준 로고" : "헤더 로고"}
                </button>
              ))}
            </div>

            <div
              className="flex h-36 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#c9d7dc]"
              style={{ backgroundColor: headerArtworkOnBrand ? brandColor : "#ffffff" }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt={`${company} ${selectedVariantLabel} 미리보기`} className="max-h-[100px] max-w-[84%] object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#809399]">
                  <ImagePlus className="h-7 w-7" aria-hidden="true" />
                  <span className="text-sm">등록된 로고가 없습니다</span>
                </div>
              )}
            </div>
            <div className="space-y-1.5 text-xs leading-5 text-[#687e85]">
              {variant === "header" ? (
                <>
                  <p>헤더의 회사명 옆에 표시되는 별도 로고입니다.</p>
                  <p>투명 배경의 흰색 PNG를 권장합니다. 투명도는 그대로 유지되며 색상은 변경되지 않습니다.</p>
                </>
              ) : (
                <p>회사 선택 목록에서 표시되는 표준 로고입니다. PNG, JPEG, WEBP를 지원합니다.</p>
              )}
              <p>파일 형식: PNG, JPEG, WEBP · 최대 512KB · 가로·세로 4096px 이하</p>
              <p>저장하면 새로고침 후에도 유지되는 공통 회사 로고로 적용됩니다.</p>
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-[#efc9c5] bg-[#fff2f0] px-3 py-2 text-sm text-[#a43f35]">
                {error}
              </p>
            )}
            {logos.isError && !error && (
              <div role="alert" className="flex items-center justify-between gap-3 rounded-lg border border-[#efc9c5] bg-[#fff2f0] px-3 py-2 text-sm text-[#a43f35]">
                <span>로고 정보를 불러오지 못했습니다.</span>
                <button type="button" onClick={() => void logos.refetch()} className="font-semibold underline">다시 시도</button>
              </div>
            )}
            {logos.isLoading && (
              <div className="h-1.5 overflow-hidden rounded-full bg-[#e7eef0]" aria-label="로고 정보를 불러오는 중">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-[#6d9aa5]" />
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept={LOGO_MIME_TYPES.join(",")}
              className="sr-only"
              aria-label={`${company} ${selectedVariantLabel} 이미지 선택`}
              onChange={onFileSelected}
            />
            <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={!hasCustomLogo || isPending || logos.isLoading || logos.isError}
                onClick={() => void resetToFallback()}
                className="border-[#cbd9dd] bg-transparent text-[#536d74] hover:bg-[#edf3f4]"
              >
                {logos.isResetting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}
                기본 로고로 초기화
              </Button>
              <Button
                type="button"
                disabled={isPending || logos.isLoading || logos.isError}
                onClick={() => inputRef.current?.click()}
                className="bg-[#1d5967] text-white hover:bg-[#174956]"
              >
                {isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {preparing ? "이미지 확인 중..." : logos.isSaving ? "저장 중..." : "이미지 업로드"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
}
