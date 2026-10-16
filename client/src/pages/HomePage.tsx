import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, ClipboardList, Monitor, Newspaper, ReceiptText, Wallet } from "lucide-react";
import CompanyOrderCards, { type OrderCompany } from "@/components/CompanyOrderCards";

const companyColors: Record<string, string> = {
  "동원약품":   "bg-blue-500",
  "신덕약품":   "bg-purple-500",
  "보덕메디팜": "bg-green-500",
  "아이팜코리아": "bg-orange-500",
  "인천약품":   "bg-red-500",
  "신덕팜":     "bg-teal-500",
};

const companyShort: Record<string, string> = {
  "동원약품":   "동",
  "신덕약품":   "신",
  "보덕메디팜": "보",
  "아이팜코리아": "아",
  "인천약품":   "인",
  "신덕팜":     "신",
};

const notices = [
  { company: "동원약품",   title: "【핫뉴스】'코로나 자가 검사키트가 기획… 진단키트도 소비재'", date: "2021-05-04" },
  { company: "신덕약품",   title: "【핫뉴스】'코로나 자가 검사키트가 기획… 진단키트도 소비재'", date: "2021-05-04" },
  { company: "보덕메디팜", title: "의약품 안전성 속보", date: "2020-05-26" },
  { company: "아이팜코리아", title: "6/27(목) 서버업데이트 일정안내", date: "2019-06-26" },
  { company: "인천약품",   title: "6/27(목) 서버업데이트 일정안내", date: "2019-06-20" },
];

const orderData = [
  { name: "(주)동원약품",   amount: 0 },
  { name: "신덕약품",       amount: 0 },
  { name: "보덕메디팜",     amount: 0 },
  { name: "아이팜코리아(주)", amount: 0 },
  { name: "인천약품",       amount: 0 },
];

const balanceData = [
  { name: "(주)동원약품",   prevBalance: 0, transaction: 0, currBalance: 0 },
  { name: "신덕약품",       prevBalance: 0, transaction: 0, currBalance: 0 },
  { name: "보덕메디팜",     prevBalance: 0, transaction: 0, currBalance: 0 },
  { name: "아이팜코리아(주)", prevBalance: 0, transaction: 0, currBalance: 0 },
  { name: "인천약품",       prevBalance: 0, transaction: 0, currBalance: 0 },
];

const today = new Date();
const fmt = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const orderPeriod = `${fmt(firstOfMonth)} ~ ${fmt(today)}`;
const balancePeriod = fmt(today);

interface HomePageProps {
  companies: OrderCompany[];
  onChooseCompany: (company: string) => void;
}

export default function HomePage({ companies, onChooseCompany }: HomePageProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      <div className="p-4 space-y-4">
        <CompanyOrderCards companies={companies} onChooseCompany={onChooseCompany} />

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Card className="overflow-hidden border border-slate-200/90 bg-gradient-to-br from-white to-sky-50/70 shadow-sm">
            <CardContent className="flex min-h-[148px] flex-col justify-between p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold tracking-tight text-slate-700">총 WOS 주문금액</div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-sky-700/70" />
                    <span>{orderPeriod}</span>
                  </div>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-200/70">
                  <ReceiptText className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </span>
              </div>
              <div className="mt-5 flex items-baseline justify-end gap-1.5 border-t border-sky-100 pt-3">
                <span className="font-mono text-2xl font-semibold tracking-tight text-slate-900">0</span>
                <span className="text-sm font-medium text-slate-500">원</span>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-slate-200/90 bg-gradient-to-br from-white to-teal-50/60 shadow-sm">
            <CardContent className="flex min-h-[148px] flex-col justify-between p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold tracking-tight text-slate-700">총 당월 잔고</div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-teal-700/70" />
                    <span>{balancePeriod}</span>
                  </div>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800 ring-1 ring-inset ring-teal-200/70">
                  <Wallet className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </span>
              </div>
              <div className="mt-5 flex items-baseline justify-end gap-1.5 border-t border-teal-100 pt-3">
                <span className="font-mono text-2xl font-semibold tracking-tight text-slate-900">0</span>
                <span className="text-sm font-medium text-slate-500">원</span>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-slate-700 bg-slate-800 text-white shadow-sm sm:col-span-2 xl:col-span-1" data-testid="card-smart-wos">
            <CardContent className="flex min-h-[148px] items-center justify-between gap-5 p-5">
              <div className="min-w-0">
                <div className="text-sm font-semibold tracking-tight text-white">스마트WOS 설정</div>
                <div className="mt-1.5 text-xs text-slate-300">WOS 운영 설정</div>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-sky-100">
                <Monitor className="h-5 w-5" strokeWidth={1.8} />
              </span>
            </CardContent>
          </Card>
        </div>

        {/* 업체별 최신공지 */}
        <Card className="overflow-hidden border border-slate-200/90 bg-gradient-to-br from-white to-sky-50/50 shadow-sm">
          <CardContent className="p-0">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 px-4 py-3.5 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-200/70">
                  <Newspaper className="h-[17px] w-[17px]" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold tracking-tight text-slate-800">업체별 최신공지</h2>
                  <p className="mt-0.5 text-xs text-slate-500">거래처에서 전한 최근 안내</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-500">
                {notices.length}건
              </span>
            </div>
            <div className="divide-y divide-slate-100 px-3 sm:px-4">
              {notices.map((n, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-3.5 sm:items-center sm:gap-4 sm:py-3"
                  data-testid={`notice-item-${i}`}
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm ring-1 ring-inset ring-white/20 sm:mt-0 ${companyColors[n.company] ?? "bg-slate-400"}`}
                  >
                    {companyShort[n.company]}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold tracking-tight text-slate-700">{n.company}</div>
                      <div className="mt-1 break-keep text-[13px] leading-5 text-slate-600">{n.title}</div>
                    </div>
                    <time className="shrink-0 font-mono text-[11px] tracking-tight text-slate-400 sm:text-right">{n.date}</time>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom: two financial tables */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
          {/* 업체별 주문 금액 */}
          <Card className="min-w-0 overflow-hidden border border-slate-200/90 bg-gradient-to-br from-white to-sky-50/40 shadow-sm">
            <CardContent className="p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 px-4 py-3.5 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-200/70">
                    <ClipboardList className="h-[17px] w-[17px]" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold tracking-tight text-slate-800">업체별 주문 금액</h2>
                    <p className="mt-0.5 text-xs text-slate-500">업체별 주문 현황</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 font-mono text-[10px] tracking-tight text-slate-500 sm:text-[11px]">
                  {orderPeriod}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <caption className="sr-only">업체별 주문 금액, {orderPeriod}</caption>
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th scope="col" className="px-4 py-2.5 text-left font-semibold text-slate-500 sm:px-5">법인명</th>
                      <th scope="col" className="px-4 py-2.5 text-right font-semibold text-slate-500 sm:px-5">주문(승인)금액</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orderData.map((row, i) => (
                      <tr key={i} className={i % 2 === 1 ? "bg-slate-50/35" : "bg-white/60"}>
                        <th scope="row" className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-700 sm:px-5">{row.name}</th>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-mono tabular-nums text-slate-700 sm:px-5">{row.amount.toLocaleString()}<span className="ml-1 text-slate-400">원</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 업체별 결제잔액 */}
          <Card className="min-w-0 overflow-hidden border border-slate-200/90 bg-gradient-to-br from-white to-teal-50/35 shadow-sm">
            <CardContent className="p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 px-4 py-3.5 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800 ring-1 ring-inset ring-teal-200/70">
                    <Wallet className="h-[17px] w-[17px]" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold tracking-tight text-slate-800">업체별 결제잔액</h2>
                    <p className="mt-0.5 text-xs text-slate-500">전월 이월 및 당월 거래</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 font-mono text-[10px] tracking-tight text-slate-500 sm:text-[11px]">
                  {orderPeriod}
                </span>
              </div>
              <div className="max-w-full overflow-x-auto">
                <table className="w-full min-w-[440px] text-xs">
                  <caption className="sr-only">업체별 결제잔액, {orderPeriod}</caption>
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th scope="col" className="px-4 py-2.5 text-left font-semibold text-slate-500 sm:px-5">법인명</th>
                      <th scope="col" className="px-4 py-2.5 text-right font-semibold text-slate-500">전월잔고</th>
                      <th scope="col" className="px-4 py-2.5 text-right font-semibold text-slate-500">거래금액</th>
                      <th scope="col" className="px-4 py-2.5 text-right font-semibold text-slate-500 sm:px-5">당월잔고</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {balanceData.map((row, i) => (
                      <tr key={i} className={i % 2 === 1 ? "bg-slate-50/35" : "bg-white/60"}>
                        <th scope="row" className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-700 sm:px-5">{row.name}</th>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-mono tabular-nums text-slate-600">{row.prevBalance.toLocaleString()}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-mono tabular-nums text-slate-600">{row.transaction.toLocaleString()}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-semibold tabular-nums text-slate-800 sm:px-5">{row.currBalance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-slate-100 px-4 py-2 text-[10px] text-slate-400 sm:hidden">
                표를 좌우로 밀어 전체 금액을 확인하세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
