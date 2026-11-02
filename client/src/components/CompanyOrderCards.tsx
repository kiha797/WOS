import { useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { ArrowDownUp, ArrowUpRight, Building2 } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  KeyboardCode,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCompanyLogos } from "@/hooks/use-company-logos";
import { useHomeCompanyDemoSelection } from "@/components/HomeCompanyDemoSelection";
import CompanyOrderDialog from "@/components/CompanyOrderDialog";
import type { CompanyOrderState } from "@/components/use-company-order";

export interface OrderCompany {
  name: string;
  color: string;
  defaultLogo?: string;
  logoLabel: string;
}

interface CompanyOrderCardsProps {
  companies: OrderCompany[];
  onChooseCompany: (company: string) => void;
  companyOrder: CompanyOrderState;
  headingActions?: ReactNode;
}

export default function CompanyOrderCards({ companies, onChooseCompany, companyOrder, headingActions }: CompanyOrderCardsProps) {
  const companyLogos = useCompanyLogos();
  // Keep the saved prototype selection; production should provide the account's trading companies.
  const { selectedNames, visibleCompanies, storageWarning: visibilityWarning, updateSelection } = useHomeCompanyDemoSelection(companies);
  const { orderedCompanies, storageWarning, saveVisibleOrder } = companyOrder;
  const visibleNames = visibleCompanies.map((company) => company.name);
  const visibleNameSet = new Set(visibleNames);
  const displayCompanies = orderedCompanies.filter((company) => visibleNameSet.has(company.name));
  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  const [activeDrag, setActiveDrag] = useState(false);
  const suppressClickRef = useRef(false);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: {
        start: [KeyboardCode.Space],
        cancel: [KeyboardCode.Esc],
        end: [KeyboardCode.Space],
      },
    }),
  );

  function finishCardDrag() {
    setActiveDrag(false);
    // Pointer-up can dispatch a click after a drop or cancellation; never navigate from it.
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 250);
  }

  function handleCardDragEnd(event: DragEndEvent) {
    finishCardDrag();
    if (!event.over || event.active.id === event.over.id) return;

    const from = displayCompanies.findIndex((company) => company.name === String(event.active.id));
    const to = displayCompanies.findIndex((company) => company.name === String(event.over?.id));
    if (from >= 0 && to >= 0) {
      const nextNames = arrayMove(displayCompanies.map((company) => company.name), from, to);
      saveVisibleOrder(visibleNames, nextNames);
    }
  }

  function handleCardDragCancel() {
    finishCardDrag();
  }

  function saveDialogOrder(names: string[], nextVisibleNames: string[]) {
    const orderSaved = saveVisibleOrder(companies.map((company) => company.name), names);
    const visibilitySaved = updateSelection(nextVisibleNames);
    return orderSaved && visibilitySaved;
  }

  return (
    <section aria-labelledby="company-order-heading" className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="company-order-heading" className="text-base font-semibold tracking-tight text-slate-800">
              주문회사 선택
            </h2>
            <button
              type="button"
              onClick={() => setSortDialogOpen(true)}
              aria-label="주문회사 순서 변경"
              aria-haspopup="dialog"
              aria-expanded={sortDialogOpen}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-1"
              data-testid="company-order-sort-trigger"
            >
              <ArrowDownUp aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">회사를 선택하면 해당 회사의 주문 화면으로 이동합니다.</p>
        </div>
        {headingActions}
      </div>

      <div
        role="region"
        aria-label="주문회사 목록"
        tabIndex={0}
        className="-m-1 overflow-x-auto overscroll-x-contain p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={() => {
            suppressClickRef.current = true;
            setActiveDrag(true);
          }}
          onDragEnd={handleCardDragEnd}
          onDragCancel={handleCardDragCancel}
          accessibility={{
            screenReaderInstructions: {
              draggable: "스페이스바로 회사를 선택하고 좌우 방향키로 순서를 바꾼 뒤 스페이스바로 놓으세요. 이동을 취소하려면 Escape 키를 누르세요. 주문 화면을 열려면 Enter 키를 누르세요.",
            },
          }}
        >
          <SortableContext
            items={displayCompanies.map((company) => company.name)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="grid w-full min-w-[1010px] grid-cols-6 gap-2.5 sm:min-w-[1020px] sm:gap-3">
              {displayCompanies.map((company, index) => (
                <SortableOrderCompanyCard
                  key={company.name}
                  company={company}
                  index={index}
                  companyLogos={companyLogos}
                  isDraggingAny={activeDrag}
                  onChooseCompany={onChooseCompany}
                  onClickCapture={(event) => {
                    if (!suppressClickRef.current) return;
                    event.preventDefault();
                    event.stopPropagation();
                    suppressClickRef.current = false;
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      {displayCompanies.length === 0 && (
        <p role="status" className="rounded-lg border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
          모든 회사 카드가 숨겨져 있습니다. 제목 옆 순서 변경 버튼에서 눈 아이콘을 눌러 다시 표시하세요.
        </p>
      )}
      {(storageWarning || visibilityWarning) && !sortDialogOpen && (
        <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {storageWarning || visibilityWarning}
        </p>
      )}
      <CompanyOrderDialog
        open={sortDialogOpen}
        onOpenChange={setSortDialogOpen}
        companies={orderedCompanies}
        companyNames={orderedCompanies.map((company) => company.name)}
        visibleNames={selectedNames}
        storageWarning={storageWarning || visibilityWarning}
        onSave={saveDialogOrder}
      />
    </section>
  );
}

interface SortableOrderCompanyCardProps {
  company: OrderCompany;
  index: number;
  companyLogos: ReturnType<typeof useCompanyLogos>;
  isDraggingAny: boolean;
  onChooseCompany: (company: string) => void;
  onClickCapture: (event: ReactMouseEvent<HTMLButtonElement>) => void;
}

function SortableOrderCompanyCard({
  company,
  index,
  companyLogos,
  isDraggingAny,
  onChooseCompany,
  onClickCapture,
}: SortableOrderCompanyCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: company.name });
  const uploadedLogo = companyLogos.findLogo(company.name, "standard")?.url;
  const logo = uploadedLogo || company.defaultLogo;

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      title={`${company.name} 주문하기`}
      aria-label={`${company.name} 주문하기. 드래그하여 순서를 변경할 수 있습니다.`}
      aria-roledescription="정렬 가능한 주문회사 카드"
      onClickCapture={onClickCapture}
      onClick={() => onChooseCompany(company.name)}
      data-testid={`button-order-company-${company.name}`}
      className={`group relative flex min-h-[118px] min-w-0 touch-auto select-none cursor-grab flex-col justify-between overflow-hidden rounded-xl border border-slate-200/90 bg-white p-3 text-left shadow-[0_1px_2px_rgba(23,37,56,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_20px_rgba(23,37,56,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:cursor-grabbing active:translate-y-0 sm:min-h-[132px] sm:p-4 ${
        isDragging ? "z-10 border-sky-400 shadow-lg" : ""
      } ${isDraggingAny && !isDragging ? "opacity-70" : ""}`}
      style={{
        ["--company-accent" as string]: company.color,
        animationDelay: `${index * 35}ms`,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px] opacity-80 transition-all duration-200 group-hover:w-1.5"
        style={{ backgroundColor: company.color }}
      />
      <span className="flex h-9 w-full items-center pl-1">
        {logo ? (
          <img
            src={logo}
            alt={`${company.name} 로고`}
            draggable={false}
            className="max-h-8 max-w-[116px] object-contain object-left"
          />
        ) : (
          <span className="inline-flex items-center gap-2 text-slate-400">
            <Building2 aria-hidden="true" className="h-4 w-4" />
            <span className="text-[11px] font-medium">{company.logoLabel}</span>
          </span>
        )}
      </span>
      <span className="flex min-w-0 items-end justify-between gap-1 pl-1">
        <span className="min-w-0 break-keep text-[14px] font-bold leading-snug tracking-tight text-slate-800 sm:text-[15px]">
          {company.name}
        </span>
        <span
          aria-hidden="true"
          className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition duration-200 group-hover:bg-[var(--company-accent)] group-hover:text-white"
        >
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </span>
      <span className="pl-1 pt-1 text-[11px] font-semibold text-slate-500 transition-colors group-hover:text-slate-700">
        주문하기
      </span>
    </button>
  );
}
