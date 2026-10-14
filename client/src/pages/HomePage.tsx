import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor } from "lucide-react";

const companies = ["동원약품", "신덕약품", "보덕메디팜", "아이팜코리아", "인천약품", "신덕팜"];

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

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("동원약품");

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      {/* Company tabs */}
      <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 bg-white border-b flex-wrap">
        {companies.map((c) => (
          <button
            key={c}
            onClick={() => setActiveTab(c)}
            data-testid={`tab-company-${c}`}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === c
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {c}
          </button>
        ))}
        <button className="ml-1 flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-gray-500 hover:bg-gray-200 text-xs">
          ⇅
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Top cards row */}
        <div className="grid grid-cols-3 gap-3">
          {/* WOS 주문금액 */}
          <Card className="border border-gray-200">
            <CardContent className="p-4 flex flex-col justify-between h-28">
              <div>
                <div className="text-xs font-semibold text-gray-700">총 WOS 주문금액</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{orderPeriod}</div>
              </div>
              <div className="text-right text-lg font-bold text-gray-800">0 원</div>
            </CardContent>
          </Card>

          {/* 당월 잔고 */}
          <Card className="border border-gray-200">
            <CardContent className="p-4 flex flex-col justify-between h-28">
              <div>
                <div className="text-xs font-semibold text-gray-700">총 당월 잔고</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{balancePeriod}</div>
              </div>
              <div className="text-right text-lg font-bold text-gray-800">0 원</div>
            </CardContent>
          </Card>

          {/* 스마트WOS 설정 */}
          <Card className="border-0 bg-gray-800 cursor-pointer hover-elevate" data-testid="card-smart-wos">
            <CardContent className="p-4 flex flex-col items-center justify-center h-28 gap-2">
              <Monitor className="h-8 w-8 text-white/60" />
              <span className="text-sm font-semibold text-white">스마트WOS 설정</span>
            </CardContent>
          </Card>
        </div>

        {/* 업체별 최신공지 */}
        <Card className="border border-gray-200">
          <CardContent className="p-0">
            <div className="px-4 py-2.5 border-b">
              <span className="text-sm font-semibold text-gray-800">업체별 최신공지</span>
            </div>
            <div className="divide-y">
              {notices.map((n, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-2.5 hover-elevate cursor-pointer"
                  data-testid={`notice-item-${i}`}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold text-white shrink-0 ${companyColors[n.company] ?? "bg-gray-400"}`}
                  >
                    {companyShort[n.company]}
                  </span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700 shrink-0">{n.company}</span>
                      <span className="text-xs text-gray-600 truncate">{n.title}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">{n.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom: two tables */}
        <div className="grid grid-cols-2 gap-3">
          {/* 업체별 주문 금액 */}
          <Card className="border border-gray-200">
            <CardContent className="p-0">
              <div className="px-4 py-2.5 border-b flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">업체별 주문 금액</span>
                <span className="text-[11px] text-gray-400">{orderPeriod}</span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="py-2 px-4 text-left font-medium text-gray-600">법인명</th>
                    <th className="py-2 px-4 text-right font-medium text-gray-600">주문(승인)금액</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orderData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-2 px-4 text-gray-700">{row.name}</td>
                      <td className="py-2 px-4 text-right text-gray-700">{row.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* 업체별 결제잔액 */}
          <Card className="border border-gray-200">
            <CardContent className="p-0">
              <div className="px-4 py-2.5 border-b flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">업체별 결제잔액</span>
                <span className="text-[11px] text-gray-400">{orderPeriod}</span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="py-2 px-4 text-left font-medium text-gray-600">법인명</th>
                    <th className="py-2 px-4 text-right font-medium text-gray-600">전월잔고</th>
                    <th className="py-2 px-4 text-right font-medium text-gray-600">거래금액</th>
                    <th className="py-2 px-4 text-right font-medium text-gray-600">당월잔고</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {balanceData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-2 px-4 text-gray-700">{row.name}</td>
                      <td className="py-2 px-4 text-right text-gray-700">{row.prevBalance.toLocaleString()}</td>
                      <td className="py-2 px-4 text-right text-gray-700">{row.transaction.toLocaleString()}</td>
                      <td className="py-2 px-4 text-right text-gray-700">{row.currBalance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
