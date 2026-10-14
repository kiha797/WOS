import { type ReactNode, useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const tabs = [
  { key: "basic", label: "기본정보" },
  { key: "ingredients", label: "성분정보" },
  { key: "appearance", label: "성상정보" },
  { key: "efficacy", label: "효능효과" },
  { key: "dosage", label: "용법용량" },
  { key: "precautions", label: "주의사항" },
  { key: "storage", label: "저장방법" },
  { key: "counseling", label: "복약지도" },
] as const;

type DrugInfoKey = (typeof tabs)[number]["key"];

const sectionLabels: Record<DrugInfoKey, string> = {
  basic: "기본정보",
  ingredients: "성분",
  appearance: "성상",
  efficacy: "효능효과",
  dosage: "용법용량",
  precautions: "주의사항",
  storage: "저장방법",
  counseling: "복약지도",
};

export type DrugDetailsProduct = {
  name: string;
  manufacturer?: string;
  seller?: string;
  category?: string;
  welfareClassification?: string;
  badges?: string[];
  price?: number;
  code?: string;
  packaging?: string;
  packageType?: string;
  atcCode?: string;
  imageUrl?: string;
  otherImageUrl?: string;
  drugInfo?: Partial<Record<DrugInfoKey, string>>;
};

type Props = {
  product: DrugDetailsProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type InfoRowProps = {
  label: string;
  value: ReactNode;
  secondaryLabel?: string;
  secondaryValue?: ReactNode;
};

function InfoRow({ label, value, secondaryLabel, secondaryValue }: InfoRowProps) {
  return (
    <div className="grid grid-cols-1 border-b border-gray-200 md:grid-cols-[118px_minmax(0,1fr)_118px_minmax(0,1fr)]">
      <div className="flex min-h-8 items-center bg-[#eeeeee] px-2.5 py-1.5 text-[11px] font-medium text-gray-600">
        <span className="mr-1.5 text-amber-500">•</span>{label}
      </div>
      <div className={`flex min-h-8 min-w-0 items-center break-words px-3 py-1.5 text-[12px] text-gray-700 ${secondaryLabel ? "" : "md:col-span-3"}`}>
        {value || <span className="text-gray-400">정보 없음</span>}
      </div>
      {secondaryLabel && (
        <>
          <div className="flex min-h-8 items-center bg-[#eeeeee] px-2.5 py-1.5 text-[11px] font-medium text-gray-600">
            <span className="mr-1.5 text-amber-500">•</span>{secondaryLabel}
          </div>
          <div className="flex min-h-8 min-w-0 items-center break-words px-3 py-1.5 text-[12px] text-gray-700">
            {secondaryValue || <span className="text-gray-400">정보 없음</span>}
          </div>
        </>
      )}
    </div>
  );
}

export function DrugDetailsDialog({ product, open, onOpenChange }: Props) {
  const [activeTab, setActiveTab] = useState<DrugInfoKey>("basic");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setActiveTab("basic");
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-[900px] flex-col gap-0 overflow-hidden p-0 [&>button]:text-white [&>button]:opacity-80"
        data-testid="dialog-drug-details"
      >
        <DialogHeader className="shrink-0 gap-0 bg-gradient-to-r from-rose-500 to-red-400 px-4 py-3 text-left">
          <DialogTitle className="pr-8 text-[15px] font-extrabold text-white">● 상품 정보 상세보기</DialogTitle>
          <DialogDescription className="sr-only">{product?.name} 약품의 기본정보와 상세정보</DialogDescription>
        </DialogHeader>

        <nav aria-label="약품 상세 정보" className="flex shrink-0 gap-1 overflow-x-auto border-b border-rose-300 bg-white px-3 pt-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              aria-current={activeTab === tab.key ? "location" : undefined}
              onClick={() => {
                setActiveTab(tab.key);
                document.getElementById(`drug-info-section-${tab.key}`)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className={`shrink-0 whitespace-nowrap rounded-t px-2.5 py-2 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
                activeTab === tab.key
                  ? "border border-b-white border-rose-400 bg-white text-rose-600"
                  : "text-gray-600 hover:bg-rose-50 hover:text-rose-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white" data-testid="panel-drug-details">
          <section id="drug-info-section-basic" className="scroll-mt-2">
            <InfoRow label="분류" value={product?.category} />
            <InfoRow label="상품명" value={product?.name} />
            <InfoRow
              label="제조 및 수입사"
              value={product?.manufacturer}
              secondaryLabel="판매사"
              secondaryValue={product?.seller}
            />
            <InfoRow
              label="복지부 분류"
              value={product?.welfareClassification}
              secondaryLabel="가격"
              secondaryValue={product?.price != null ? `${product.price.toLocaleString()}원` : undefined}
            />
            <InfoRow
              label="보험코드"
              value={product?.code}
              secondaryLabel="규격"
              secondaryValue={product?.packaging}
            />
            <InfoRow label="상품포장구분" value={product?.packageType} />
            <InfoRow label="ATC 코드" value={product?.atcCode} />
            <InfoRow
              label="상세이미지"
              value={product?.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={`${product.name} 약품 상세이미지`}
                  className="my-1 max-h-[150px] max-w-full object-contain"
                />
              ) : (
                <span className="text-gray-400">등록된 이미지가 없습니다.</span>
              )}
            />
            <InfoRow
              label="기타이미지"
              value={product?.otherImageUrl ? (
                <img
                  src={product.otherImageUrl}
                  alt={`${product.name} 기타이미지`}
                  className="my-1 max-h-[130px] max-w-full object-contain"
                />
              ) : (
                <span className="inline-flex min-h-[70px] min-w-[110px] flex-col items-center justify-center gap-1 border border-gray-200 px-4 text-[11px] text-gray-400">
                  <ImageOff className="h-5 w-5" />
                  No Image
                </span>
              )}
            />
          </section>

          {tabs.slice(1).map((tab) => (
            <section
              key={tab.key}
              id={`drug-info-section-${tab.key}`}
              className="grid scroll-mt-2 grid-cols-[118px_minmax(0,1fr)] border-b border-gray-200"
            >
              <div className="flex items-start bg-[#eeeeee] px-2.5 py-2 text-[11px] font-medium text-gray-600">
                <span className="mr-1.5 text-amber-500">•</span>{sectionLabels[tab.key]}
              </div>
              <div className="min-h-9 whitespace-pre-wrap px-3 py-2 text-[12px] leading-6 text-gray-700">
                {product?.drugInfo?.[tab.key] || (
                  <span className="text-gray-400">현재 연결된 약품 상세정보가 없습니다.</span>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="flex shrink-0 justify-end border-t px-4 py-3">
          <Button type="button" variant="outline" className="h-8 px-5 text-xs" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}