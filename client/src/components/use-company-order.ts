import { useEffect, useMemo, useState } from "react";
import type { OrderCompany } from "@/components/CompanyOrderCards";

const STORAGE_KEY = "wos.prototype.home-company-order.v1";

export function normalizeCompanyOrder(value: unknown, availableNames: string[]): string[] {
  const available = new Set(availableNames);
  const result: string[] = [];

  if (Array.isArray(value)) {
    for (const name of value) {
      if (typeof name === "string" && available.has(name) && !result.includes(name)) {
        result.push(name);
      }
    }
  }

  for (const name of availableNames) {
    if (!result.includes(name)) result.push(name);
  }

  return result;
}

export function mergeVisibleCompanyOrder(
  fullOrder: string[],
  visibleNames: string[],
  nextVisibleNames: string[],
  availableNames: string[],
): string[] {
  const normalized = normalizeCompanyOrder(fullOrder, availableNames);
  const visibleSet = new Set(visibleNames);
  const nextVisible = normalizeCompanyOrder(nextVisibleNames, visibleNames);
  let nextIndex = 0;

  return normalized.map((name) => {
    if (!visibleSet.has(name)) return name;
    const replacement = nextVisible[nextIndex];
    nextIndex += 1;
    return replacement ?? name;
  });
}

export interface CompanyOrderState {
  orderedCompanies: OrderCompany[];
  storageWarning: string;
  saveVisibleOrder: (visibleNames: string[], nextVisibleNames: string[]) => boolean;
}

export function useCompanyOrder(companies: OrderCompany[]): CompanyOrderState {
  const availableNames = useMemo(() => companies.map((company) => company.name), [companies]);
  const namesKey = availableNames.join("\u001f");
  const [companyOrder, setCompanyOrder] = useState<string[]>(availableNames);
  const [loadedNamesKey, setLoadedNamesKey] = useState("");
  const [storageWarning, setStorageWarning] = useState("");

  useEffect(() => {
    if (loadedNamesKey === namesKey) return;

    let savedValue: unknown = null;
    let warning = "";
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) savedValue = JSON.parse(stored);
    } catch {
      warning = "브라우저 저장소를 읽지 못했습니다. 순서는 현재 화면에서만 유지됩니다.";
    }

    setCompanyOrder(normalizeCompanyOrder(savedValue, availableNames));
    setStorageWarning(warning);
    setLoadedNamesKey(namesKey);
  }, [availableNames, loadedNamesKey, namesKey]);

  const orderedCompanies = useMemo(() => {
    const byName = new Map(companies.map((company) => [company.name, company]));
    return companyOrder
      .map((name) => byName.get(name))
      .filter((company): company is OrderCompany => Boolean(company));
  }, [companies, companyOrder]);

  function saveVisibleOrder(visibleNames: string[], nextVisibleNames: string[]) {
    const nextOrder = mergeVisibleCompanyOrder(
      companyOrder,
      visibleNames,
      nextVisibleNames,
      availableNames,
    );
    setCompanyOrder(nextOrder);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrder));
      setStorageWarning("");
      return true;
    } catch {
      setStorageWarning("순서는 화면에 적용했지만 브라우저 저장소에 저장하지 못했습니다. 새로고침하면 사라집니다.");
      return false;
    }
  }

  return { orderedCompanies, storageWarning, saveVisibleOrder };
}
