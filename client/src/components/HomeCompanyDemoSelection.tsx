import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { OrderCompany } from "@/components/CompanyOrderCards";

const STORAGE_KEY = "wos.prototype.home-company-selection.v1";
const MAX_COMPANIES = 6;

export function sanitizeSelection(value: unknown, availableNames: string[]) {
  if (!Array.isArray(value)) return [];
  const knownNames = new Set(availableNames);
  const uniqueNames: string[] = [];
  for (const item of value) {
    if (typeof item === "string" && knownNames.has(item) && !uniqueNames.includes(item)) {
      uniqueNames.push(item);
      if (uniqueNames.length === MAX_COMPANIES) break;
    }
  }
  return uniqueNames;
}

interface HomeCompanyDemoSelectionProps {
  companies: OrderCompany[];
  selectedNames: string[];
  onSelectionChange: (names: string[]) => void;
  storageWarning?: string;
}

export function HomeCompanyDemoSelection({
  companies,
  selectedNames,
  onSelectionChange,
  storageWarning,
}: HomeCompanyDemoSelectionProps) {
  const [open, setOpen] = useState(false);
  const selectedSet = useMemo(() => new Set(selectedNames), [selectedNames]);

  function toggleCompany(name: string, checked: boolean) {
    if (checked) {
      if (selectedSet.has(name) || selectedNames.length >= MAX_COMPANIES) return;
      onSelectionChange([...selectedNames, name]);
      return;
    }
    if (selectedNames.length <= 1) return;
    onSelectionChange(selectedNames.filter((selectedName) => selectedName !== name));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`시안 설정, 선택된 회사 ${selectedNames.length}개`}
          aria-expanded={open}
          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
        >
          <SlidersHorizontal aria-hidden="true" className="h-3.5 w-3.5 text-sky-700" />
          시안 설정
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
            {selectedNames.length}/6
          </span>
          <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        aria-label="시안 회사 표시 설정"
        className="w-[min(21rem,calc(100vw-2rem))] rounded-xl border-slate-200 bg-[#fffefa] p-0 shadow-[0_16px_44px_rgba(31,47,66,0.16)]"
      >
        <div className="border-b border-slate-100 px-4 pb-3 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">표시할 주문회사</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                시안용 표시 설정이며 실제 거래 정보는 변경되지 않습니다.
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-sky-50 px-2 py-1 font-mono text-xs font-semibold text-sky-800">
              {selectedNames.length} / 6
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelectionChange(companies.slice(0, MAX_COMPANIES).map((company) => company.name))}
            disabled={selectedNames.length === Math.min(companies.length, MAX_COMPANIES)}
            className="mt-3 inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-sky-800 transition hover:bg-sky-50 disabled:cursor-default disabled:text-slate-400 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            <Check aria-hidden="true" className="h-3.5 w-3.5" />
            전체 선택
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto p-2" role="group" aria-label="회사 목록">
          {companies.slice(0, MAX_COMPANIES).map((company) => {
            const checked = selectedSet.has(company.name);
            const lastSelected = checked && selectedNames.length === 1;
            return (
              <label
                key={company.name}
                className={`flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition hover:bg-slate-50 ${
                  lastSelected ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                <Checkbox
                  checked={checked}
                  disabled={lastSelected || (!checked && selectedNames.length >= MAX_COMPANIES)}
                  onCheckedChange={(value) => toggleCompany(company.name, value === true)}
                  aria-label={`${company.name} 표시`}
                  className="border-slate-300 data-[state=checked]:border-sky-700 data-[state=checked]:bg-sky-700"
                />
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: company.color }}
                />
                <span className="min-w-0 flex-1 truncate font-medium text-slate-700">{company.name}</span>
                {checked && <span className="text-[10px] font-medium text-sky-700">표시 중</span>}
              </label>
            );
          })}
        </div>

        <div className="border-t border-slate-100 px-4 py-3">
          <p className="text-[11px] leading-relaxed text-slate-500">
            최소 1곳을 선택하세요. 선택 즉시 반영되며 이 브라우저에만 저장됩니다.
          </p>
          {storageWarning && (
            <p role="status" className="mt-2 rounded-md bg-amber-50 px-2.5 py-2 text-xs leading-relaxed text-amber-900">
              {storageWarning}
            </p>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 flex min-h-9 w-full items-center justify-center rounded-lg bg-slate-800 px-3 text-xs font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
          >
            닫기
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function useHomeCompanyDemoSelection(companies: OrderCompany[]) {
  const availableNames = useMemo(
    () => companies.slice(0, MAX_COMPANIES).map((company) => company.name),
    [companies],
  );
  const namesKey = availableNames.join("\u001f");
  // Three example companies demonstrate the common case, not actual trading relationships.
  const [selectedNames, setSelectedNames] = useState<string[]>(() => availableNames.slice(0, 3));
  const [storageWarning, setStorageWarning] = useState("");
  const [loadedNamesKey, setLoadedNamesKey] = useState("");

  useEffect(() => {
    if (loadedNamesKey === namesKey) return;
    let initialSelection = availableNames.slice(0, 3);
    let warning = "";
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      if (storedValue !== null) {
        const parsed: unknown = JSON.parse(storedValue);
        const sanitized = sanitizeSelection(parsed, availableNames);
        if (Array.isArray(parsed) && (parsed.length === 0 || sanitized.length > 0)) initialSelection = sanitized;
      }
    } catch {
      warning = "브라우저 저장소를 읽지 못했습니다. 이 설정은 현재 화면에서만 유지됩니다.";
    }
    setSelectedNames(initialSelection);
    setStorageWarning(warning);
    setLoadedNamesKey(namesKey);
  }, [availableNames, loadedNamesKey, namesKey]);

  function updateSelection(names: string[]) {
    const sanitized = sanitizeSelection(names, availableNames);
    setSelectedNames(sanitized);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      setStorageWarning("");
      return true;
    } catch {
      setStorageWarning("브라우저 저장소에 저장하지 못했습니다. 이 설정은 현재 화면에서만 유지됩니다.");
      return false;
    }
  }

  const visibleCompanies = useMemo(
    () => companies.filter((company) => selectedNames.includes(company.name)),
    [companies, selectedNames],
  );

  return { selectedNames, visibleCompanies, storageWarning, updateSelection };
}
