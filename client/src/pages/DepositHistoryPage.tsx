import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentRecord {
  no: number;
  orderNo: string;
  paymentDate: string;
  tradeName: string;
  paymentAmount: number;
  paymentMethod: string;
  cardCompany: string;
  status: "정상" | "결제오류";
  statusDetail?: string;
}

const mockData: PaymentRecord[] = [
  { no: 6, orderNo: "0402C8255749", paymentDate: "2026-04-04 09:52", tradeName: "김희진_009007_서울테스트약국", paymentAmount: 1465178, paymentMethod: "일반카드", cardCompany: "비씨카드", status: "정상" },
  { no: 5, orderNo: "0402C8254303", paymentDate: "2026-04-03 09:07", tradeName: "김희진_009007_서울테스트약국", paymentAmount: 7000000, paymentMethod: "일반카드", cardCompany: "비씨카드", status: "정상" },
  { no: 4, orderNo: "", paymentDate: "2026-04-02 20:00", tradeName: "김희진_009007_서울테스트약국", paymentAmount: 15265660, paymentMethod: "일반카드", cardCompany: "", status: "결제오류", statusDetail: "한도소진" },
  { no: 3, orderNo: "", paymentDate: "2026-04-02 14:25", tradeName: "김희진_009007_서울테스트약국", paymentAmount: 70450823, paymentMethod: "일반카드", cardCompany: "", status: "결제오류", statusDetail: "전화문의요망" },
  { no: 2, orderNo: "", paymentDate: "2026-04-01 14:15", tradeName: "김희진_009007_서울테스트약국", paymentAmount: 4750000, paymentMethod: "일반카드", cardCompany: "", status: "결제오류", statusDetail: "카드번호 오류" },
  { no: 1, orderNo: "", paymentDate: "2026-04-01 13:20", tradeName: "김희진_009007_서울테스트약국", paymentAmount: 3000000, paymentMethod: "일반카드", cardCompany: "", status: "결제오류", statusDetail: "유효기간 오류" },
];

export default function DepositHistoryPage() {
  const [startDate, setStartDate] = useState("2026-03-01");
  const [endDate, setEndDate] = useState("2026-05-28");
  const [periodSelect, setPeriodSelect] = useState("오늘");
  const [data] = useState<PaymentRecord[]>(mockData);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const handlePeriodChange = (value: string) => {
    setPeriodSelect(value);
    const today = new Date();
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (value === "오늘") {
      setStartDate(fmt(today)); setEndDate(fmt(today));
    } else if (value === "1주일") {
      const s = new Date(today); s.setDate(today.getDate() - 7);
      setStartDate(fmt(s)); setEndDate(fmt(today));
    } else if (value === "1개월") {
      const s = new Date(today); s.setMonth(today.getMonth() - 1);
      setStartDate(fmt(s)); setEndDate(fmt(today));
    } else if (value === "3개월") {
      const s = new Date(today); s.setMonth(today.getMonth() - 3);
      setStartDate(fmt(s)); setEndDate(fmt(today));
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      <div className="p-4 space-y-3">
        {/* Page header */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-base font-bold text-gray-900" data-testid="text-page-title">결제내역 조회</h1>
          <span className="text-xs text-gray-400">결제내역을 조회할 수 있습니다.</span>
        </div>

        {/* Search filter bar */}
        <Card className="border border-gray-200">
          <CardContent className="py-3 px-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-gray-600 shrink-0">조회기간</span>
              <div className="flex items-center gap-1">
                <div className="relative">
                  <Input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-7 w-28 text-xs pr-7"
                    data-testid="input-start-date"
                  />
                  <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
                <span className="text-xs text-gray-400">~</span>
                <div className="relative">
                  <Input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-7 w-28 text-xs pr-7"
                    data-testid="input-end-date"
                  />
                  <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <Select value={periodSelect} onValueChange={handlePeriodChange}>
                <SelectTrigger className="h-7 w-24 text-xs" data-testid="select-period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="오늘">기간선택</SelectItem>
                  <SelectItem value="오늘">오늘</SelectItem>
                  <SelectItem value="1주일">1주일</SelectItem>
                  <SelectItem value="1개월">1개월</SelectItem>
                  <SelectItem value="3개월">3개월</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => handlePeriodChange("오늘")}
                data-testid="button-today"
              >
                오늘
              </Button>

              <Button
                size="sm"
                className="h-7 px-4 text-xs bg-gray-700 hover:bg-gray-800 text-white"
                data-testid="button-search"
              >
                검색
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border border-gray-200">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="h-9">
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-12">번호</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-32">주문번호</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-36">결제일자</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-left font-semibold text-gray-700">거래명</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-right font-semibold text-gray-700 w-28">결제금액</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-20">결제수단</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-20">결제사명</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-28">결제상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.no} className="h-10 border-b hover:bg-gray-50" data-testid={`row-payment-${row.no}`}>
                    <TableCell className="py-2 text-xs text-center text-gray-600">{row.no}</TableCell>
                    <TableCell className="py-2 text-xs text-center text-gray-700">{row.orderNo}</TableCell>
                    <TableCell className="py-2 text-xs text-center text-gray-700 whitespace-nowrap">{row.paymentDate}</TableCell>
                    <TableCell className="py-2 text-xs text-left text-gray-700">{row.tradeName}</TableCell>
                    <TableCell className="py-2 text-xs text-right text-gray-800 font-medium">{row.paymentAmount.toLocaleString()}</TableCell>
                    <TableCell className="py-2 text-xs text-center text-gray-700">{row.paymentMethod}</TableCell>
                    <TableCell className="py-2 text-xs text-center text-gray-700">{row.cardCompany}</TableCell>
                    <TableCell className="py-2 text-xs text-center">
                      {row.status === "정상" ? (
                        <span className="text-blue-600 font-medium" data-testid={`status-${row.no}`}>정상</span>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-red-500 font-medium" data-testid={`status-${row.no}`}>결제오류</span>
                          {row.statusDetail && (
                            <span className="text-[10px] text-red-400">({row.statusDetail})</span>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-sm text-gray-400">
                      조회된 결제내역이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1 py-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            data-testid="button-prev-page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className={cn("h-7 w-7 text-xs", currentPage === page && "bg-gray-700 text-white")}
              onClick={() => setCurrentPage(page)}
              data-testid={`button-page-${page}`}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            data-testid="button-next-page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
