import { ArrowUpRight, Building2 } from "lucide-react";
import { useCompanyLogos } from "@/hooks/use-company-logos";

export interface OrderCompany {
  name: string;
  color: string;
  defaultLogo?: string;
  logoLabel: string;
}

interface CompanyOrderCardsProps {
  companies: OrderCompany[];
  onChooseCompany: (company: string) => void;
}

export default function CompanyOrderCards({ companies, onChooseCompany }: CompanyOrderCardsProps) {
  const companyLogos = useCompanyLogos();

  return (
    <section aria-labelledby="company-order-heading" className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="company-order-heading" className="text-base font-semibold tracking-tight text-slate-800">
            주문회사 선택
          </h2>
          <p className="mt-1 text-xs text-slate-500">회사를 선택하면 해당 회사의 주문 화면으로 이동합니다.</p>
        </div>
        <span className="text-[11px] font-medium tracking-wide text-slate-400">ORDER BY COMPANY</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {companies.map((company, index) => {
          const uploadedLogo = companyLogos.findLogo(company.name, "standard")?.url;
          const logo = uploadedLogo || company.defaultLogo;

          return (
            <button
              key={company.name}
              type="button"
              title={`${company.name} 주문하기`}
              aria-label={`${company.name} 주문하기`}
              onClick={() => onChooseCompany(company.name)}
              data-testid={`button-order-company-${company.name}`}
              className="group relative flex min-h-[118px] min-w-0 flex-col justify-between overflow-hidden rounded-xl border border-slate-200/90 bg-white p-3 text-left shadow-[0_1px_2px_rgba(23,37,56,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_20px_rgba(23,37,56,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-0 sm:min-h-[132px] sm:p-4"
              style={{ ["--company-accent" as string]: company.color, animationDelay: `${index * 35}ms` }}
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
        })}
      </div>
    </section>
  );
}
