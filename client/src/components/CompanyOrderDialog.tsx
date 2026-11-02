import { useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { OrderCompany } from "@/components/CompanyOrderCards";

interface CompanyOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: OrderCompany[];
  companyNames: string[];
  visibleNames: string[];
  storageWarning: string;
  onSave: (names: string[], visibleNames: string[]) => boolean;
}

interface SortableCompanyRowProps {
  company: OrderCompany;
  index: number;
  count: number;
  visible: boolean;
  onMove: (from: number, to: number) => void;
  onToggleVisibility: (name: string) => void;
}

function SortableCompanyRow({
  company,
  index,
  count,
  visible,
  onMove,
  onToggleVisibility,
}: SortableCompanyRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: company.name });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex min-h-[58px] items-center gap-2 rounded-lg border px-2.5 py-2 sm:gap-3 sm:px-3 ${
        isDragging ? "z-10 border-sky-400 bg-sky-50 shadow-md" : "border-slate-200 bg-white"
      }`}
      data-testid={`company-order-row-${company.name}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`${company.name} 순서 이동. 드래그하거나 키보드 방향키로 이동하세요.`}
        className="flex h-9 w-7 shrink-0 touch-none cursor-grab items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 active:cursor-grabbing sm:w-8"
        data-testid={`company-order-handle-${company.name}`}
      >
        <GripVertical aria-hidden="true" className="h-4 w-4" />
      </button>
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: company.color }}
      />
      <span className={`min-w-0 flex-1 truncate text-sm font-semibold ${visible ? "text-slate-800" : "text-slate-400"}`}>{company.name}</span>
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
        <span
          aria-label={`${index + 1}번째`}
          className="flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-100 px-1.5 font-mono text-xs font-semibold tabular-nums text-slate-600 sm:px-2"
        >
          {index + 1}
        </span>
        <button
          type="button"
          onClick={() => onMove(index, index - 1)}
          disabled={index === 0}
          aria-label={`${company.name} 위로 이동`}
          className="flex h-8 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 disabled:cursor-not-allowed disabled:opacity-30 sm:w-8"
        >
          <ArrowUp aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onMove(index, index + 1)}
          disabled={index === count - 1}
          aria-label={`${company.name} 아래로 이동`}
          className="flex h-8 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 disabled:cursor-not-allowed disabled:opacity-30 sm:w-8"
        >
          <ArrowDown aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onToggleVisibility(company.name)}
          aria-label={`${company.name} 홈 카드에서 ${visible ? "숨기기" : "보이기"}`}
          aria-pressed={visible}
          className={`flex h-8 items-center justify-center gap-1 rounded-md px-1.5 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 sm:px-2 ${
            visible
              ? "text-sky-700 hover:bg-sky-50"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          }`}
          data-testid={`company-visibility-toggle-${company.name}`}
        >
          {visible ? (
            <Eye aria-hidden="true" className="h-4 w-4 shrink-0" />
          ) : (
            <EyeOff aria-hidden="true" className="h-4 w-4 shrink-0" />
          )}
          <span>{visible ? "보임" : "숨김"}</span>
        </button>
      </div>
    </li>
  );
}

export default function CompanyOrderDialog({
  open,
  onOpenChange,
  companies,
  companyNames,
  visibleNames,
  storageWarning,
  onSave,
}: CompanyOrderDialogProps) {
  const [draftNames, setDraftNames] = useState(companyNames);
  const [draftVisibleNames, setDraftVisibleNames] = useState(visibleNames);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const companyByName = new Map(companies.map((company) => [company.name, company]));
  const companyNamesKey = companyNames.join("\u001f");
  const visibleNamesKey = visibleNames.join("\u001f");
  const draftCompanies = draftNames
    .map((name) => companyByName.get(name))
    .filter((company): company is OrderCompany => Boolean(company));

  useEffect(() => {
    if (open) {
      setDraftNames(companyNames);
      setDraftVisibleNames(visibleNames);
    }
  }, [companyNamesKey, visibleNamesKey, open]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setDraftNames((current) => {
      const from = current.indexOf(String(active.id));
      const to = current.indexOf(String(over.id));
      return from < 0 || to < 0 ? current : arrayMove(current, from, to);
    });
  }

  function moveRow(from: number, to: number) {
    if (to < 0 || to >= draftNames.length) return;
    setDraftNames((current) => arrayMove(current, from, to));
  }

  function toggleVisibility(name: string) {
    setDraftVisibleNames((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );
  }

  function saveOrder() {
    if (onSave(draftNames, draftVisibleNames)) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby="company-order-description"
        className="max-h-[calc(100dvh-2rem)] w-[min(29rem,calc(100vw-2rem))] gap-0 overflow-hidden rounded-xl border-slate-200 bg-white p-0 text-slate-800 shadow-[0_24px_80px_rgba(19,34,54,0.24)] [&>button]:text-white"
      >
        <DialogHeader className="bg-[#202326] px-5 py-4 pr-14 text-left text-white">
          <DialogTitle className="text-base font-semibold tracking-tight text-white">업체 순서 변경</DialogTitle>
          <DialogDescription id="company-order-description" className="mt-1 text-xs text-slate-300">
            드래그하여 순서를 변경하고, 눈 아이콘으로 홈 카드 표시를 설정하세요
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[min(60dvh,28rem)] overflow-y-auto px-4 py-4">
          <p className="mb-3 text-[11px] leading-relaxed text-slate-500">
            눈 아이콘은 홈 주문회사 카드만 제어합니다. 상단 메뉴 이동은 계속 사용할 수 있으며, 설정은 현재 브라우저에만 저장됩니다.
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            accessibility={{
              screenReaderInstructions: {
                draggable: "스페이스바로 회사를 선택하고 방향키로 순서를 바꾼 뒤 스페이스바로 놓으세요. 이동을 취소하려면 Escape 키를 누르세요.",
              },
            }}
          >
            <SortableContext items={draftNames} strategy={verticalListSortingStrategy}>
              <ol
                aria-label="주문회사 순서 및 홈 카드 표시 설정"
                className="space-y-2"
                data-testid="company-order-sort-list"
              >
                {draftCompanies.map((company, index) => (
                  <SortableCompanyRow
                    key={company.name}
                    company={company}
                    index={index}
                    count={draftCompanies.length}
                    visible={draftVisibleNames.includes(company.name)}
                    onMove={moveRow}
                    onToggleVisibility={toggleVisibility}
                  />
                ))}
              </ol>
            </SortableContext>
          </DndContext>
          {storageWarning && (
            <p
              role="status"
              className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-900"
            >
              {storageWarning}
            </p>
          )}
        </div>

        <DialogFooter className="flex-row justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="min-h-9 border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700"
            data-testid="company-order-cancel"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={saveOrder}
            className="min-h-9 bg-slate-800 px-4 text-xs font-semibold text-white hover:bg-slate-700"
            data-testid="company-order-save"
          >
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
