import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar as CalendarIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  format,
  subDays,
  subMonths,
  startOfDay,
  differenceInDays,
  subWeeks,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { ko } from "date-fns/locale";

interface TaxInvoice {
  no: number;
  issueDate: string;
  issueNo: string;
  product: string;
  supplyAmount: number;
  vat: number;
  totalAmount: number;
  status: string;
}

const mockInvoices: TaxInvoice[] = [
  {
    no: 2,
    issueDate: "2026-01-31",
    issueNo: "BI2602-0006892",
    product: "수금할인",
    supplyAmount: -422150,
    vat: -42215,
    totalAmount: -464365,
    status: "발행",
  },
  {
    no: 1,
    issueDate: "2026-01-31",
    issueNo: "BI2602-0006454",
    product: "전문-<로세릴네일라카125mg(일반) 5ML 갈더마 외 524",
    supplyAmount: 88693150,
    vat: 8869315,
    totalAmount: 97562465,
    status: "발행",
  },
];

const quickOptions = [
  { id: "today", label: "오늘" },
  { id: "yesterday", label: "어제" },
  { id: "thisWeek", label: "이번주" },
  { id: "lastWeek", label: "지난주" },
  { id: "last7Include", label: "최근 7일(오늘 포함)" },
  { id: "last7Exclude", label: "최근 7일(오늘 제외)" },
  { id: "thisMonth", label: "이번달" },
  { id: "lastMonth", label: "지난달" },
  { id: "last30Include", label: "최근 30일 (오늘 포함)" },
  { id: "last30Exclude", label: "최근 30일 (오늘 제외)" },
];

export default function TaxInvoicePage() {
  const today = new Date();

  const [startDate, setStartDate] = useState<Date>(subMonths(today, 1));
  const [endDate, setEndDate] = useState<Date>(today);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<"start" | "end">("start");
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(subMonths(today, 1));
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(today);
  const [startMonth, setStartMonth] = useState<Date>(new Date(subMonths(today, 1).getFullYear(), subMonths(today, 1).getMonth(), 1));
  const [endMonth, setEndMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedQuickOption, setSelectedQuickOption] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const applyPeriodShortcut = (type: "today" | "week" | "month") => {
    const now = new Date();
    if (type === "today") {
      setStartDate(startOfDay(now));
      setEndDate(now);
    } else if (type === "week") {
      setStartDate(subDays(now, 7));
      setEndDate(now);
    } else if (type === "month") {
      setStartDate(subMonths(now, 1));
      setEndDate(now);
    }
  };

  const applyQuickOption = (optionId: string) => {
    const label = quickOptions.find((o) => o.id === optionId)?.label || "";
    setSelectedQuickOption(label);
    const now = new Date();
    switch (optionId) {
      case "today":
        setTempStartDate(now);
        setTempEndDate(now);
        break;
      case "yesterday":
        setTempStartDate(subDays(now, 1));
        setTempEndDate(subDays(now, 1));
        break;
      case "thisWeek":
        setTempStartDate(startOfWeek(now, { weekStartsOn: 0 }));
        setTempEndDate(endOfWeek(now, { weekStartsOn: 0 }));
        break;
      case "lastWeek":
        setTempStartDate(startOfWeek(subWeeks(now, 1), { weekStartsOn: 0 }));
        setTempEndDate(endOfWeek(subWeeks(now, 1), { weekStartsOn: 0 }));
        break;
      case "last7Include":
        setTempStartDate(subDays(now, 6));
        setTempEndDate(now);
        break;
      case "last7Exclude":
        setTempStartDate(subDays(now, 7));
        setTempEndDate(subDays(now, 1));
        break;
      case "thisMonth":
        setTempStartDate(startOfMonth(now));
        setTempEndDate(endOfMonth(now));
        break;
      case "lastMonth":
        setTempStartDate(startOfMonth(subMonths(now, 1)));
        setTempEndDate(endOfMonth(subMonths(now, 1)));
        break;
      case "last30Include":
        setTempStartDate(subDays(now, 29));
        setTempEndDate(now);
        break;
      case "last30Exclude":
        setTempStartDate(subDays(now, 30));
        setTempEndDate(subDays(now, 1));
        break;
    }
  };

  const getDayCount = () => {
    if (tempStartDate && tempEndDate) return differenceInDays(tempEndDate, tempStartDate) + 1;
    return 0;
  };

  const openCalendar = (target: "start" | "end") => {
    setCalendarTarget(target);
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setStartMonth(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
    setEndMonth(new Date(endDate.getFullYear(), endDate.getMonth(), 1));
    setIsCalendarOpen(true);
  };

  const handleConfirmDates = () => {
    if (tempStartDate) setStartDate(tempStartDate);
    if (tempEndDate) setEndDate(tempEndDate);
    setIsCalendarOpen(false);
  };

  return (
    <div className="h-full overflow-auto p-6">
      <h1 className="text-xl font-bold mb-5" data-testid="text-page-title">세금계산서</h1>

      {/* Search bar */}
      <div className="bg-[#e8f4fd] rounded-md px-5 py-4 mb-5 flex items-center gap-3 flex-wrap">
        <Button
          size="sm"
          className="h-9 px-5 text-sm bg-[#4da6d9] hover:bg-[#3a90c0] text-white border-0"
          onClick={() => applyPeriodShortcut("today")}
          data-testid="button-period-today"
        >
          오늘
        </Button>
        <Button
          size="sm"
          className="h-9 px-5 text-sm bg-[#4da6d9] hover:bg-[#3a90c0] text-white border-0"
          onClick={() => applyPeriodShortcut("week")}
          data-testid="button-period-week"
        >
          일주일
        </Button>
        <Button
          size="sm"
          className="h-9 px-5 text-sm bg-[#4da6d9] hover:bg-[#3a90c0] text-white border-0"
          onClick={() => applyPeriodShortcut("month")}
          data-testid="button-period-month"
        >
          한달
        </Button>

        {/* Start date */}
        <button
          className="flex items-center gap-2 h-9 px-3 bg-white border border-gray-200 rounded text-sm"
          onClick={() => openCalendar("start")}
          data-testid="button-open-start-date"
        >
          <span>{format(startDate, "yyyy-MM-dd")}</span>
          <CalendarIcon className="h-4 w-4 text-gray-400" />
        </button>

        <span className="text-gray-500 text-sm">~</span>

        {/* End date */}
        <button
          className="flex items-center gap-2 h-9 px-3 bg-white border border-gray-200 rounded text-sm"
          onClick={() => openCalendar("end")}
          data-testid="button-open-end-date"
        >
          <span>{format(endDate, "yyyy-MM-dd")}</span>
          <CalendarIcon className="h-4 w-4 text-gray-400" />
        </button>

        <Button
          size="sm"
          className="h-9 px-5 text-sm bg-[#4da6d9] hover:bg-[#3a90c0] text-white border-0"
          data-testid="button-search"
        >
          <Search className="h-4 w-4 mr-1.5" />
          검색
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="h-10 bg-white border-b">
              <TableHead className="h-10 py-2 text-xs text-center font-semibold text-gray-700 w-14">NO.</TableHead>
              <TableHead className="h-10 py-2 text-xs text-center font-semibold text-gray-700 w-28">발행일자</TableHead>
              <TableHead className="h-10 py-2 text-xs text-center font-semibold text-gray-700 w-40">발행번호</TableHead>
              <TableHead className="h-10 py-2 text-xs text-left font-semibold text-gray-700">품목</TableHead>
              <TableHead className="h-10 py-2 text-xs text-right font-semibold text-gray-700 w-28">공급가액</TableHead>
              <TableHead className="h-10 py-2 text-xs text-right font-semibold text-gray-700 w-24">부가세</TableHead>
              <TableHead className="h-10 py-2 text-xs text-right font-semibold text-gray-700 w-28">합계금액</TableHead>
              <TableHead className="h-10 py-2 text-xs text-center font-semibold text-gray-700 w-16">비고</TableHead>
              <TableHead className="h-10 py-2 text-xs text-center font-semibold text-gray-700 w-20">내역</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInvoices.map((invoice) => {
              const isNegative = invoice.totalAmount < 0;
              return (
                <TableRow key={invoice.no} className="h-11 border-b last:border-0" data-testid={`row-invoice-${invoice.no}`}>
                  <TableCell className="py-2 text-sm text-center">{invoice.no}</TableCell>
                  <TableCell className="py-2 text-sm text-center">{invoice.issueDate}</TableCell>
                  <TableCell className="py-2 text-sm text-center">{invoice.issueNo}</TableCell>
                  <TableCell className="py-2 text-sm text-left">{invoice.product}</TableCell>
                  <TableCell className={`py-2 text-sm text-right ${isNegative ? "text-red-600" : ""}`}>
                    {invoice.supplyAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className={`py-2 text-sm text-right ${isNegative ? "text-red-600" : ""}`}>
                    {invoice.vat.toLocaleString()}
                  </TableCell>
                  <TableCell className={`py-2 text-sm text-right font-medium ${isNegative ? "text-red-600" : ""}`}>
                    {invoice.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-2 text-sm text-center">{invoice.status}</TableCell>
                  <TableCell className="py-2 text-sm text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-3 text-xs bg-[#5c8bb8] hover:bg-[#4a77a0] text-white border-0"
                      data-testid={`button-detail-${invoice.no}`}
                    >
                      내역보기
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1 mt-6">
        <button
          className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 disabled:opacity-30"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          data-testid="button-page-first"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 disabled:opacity-30"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          data-testid="button-page-prev"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`w-8 h-8 flex items-center justify-center rounded text-sm ${currentPage === page ? "bg-[#4da6d9] text-white" : "text-gray-600 hover:bg-gray-100"}`}
            onClick={() => setCurrentPage(page)}
            data-testid={`button-page-${page}`}
          >
            {page}
          </button>
        ))}
        <button
          className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 disabled:opacity-30"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          data-testid="button-page-next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 disabled:opacity-30"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          data-testid="button-page-last"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>

      {/* Calendar Dialog */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="max-w-3xl p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-base font-semibold sr-only">날짜 선택</DialogTitle>
          </DialogHeader>
          <div className="flex">
            {/* Quick options */}
            <div className="w-40 border-r py-2">
              {quickOptions.map((option) => (
                <button
                  key={option.id}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${selectedQuickOption === option.label ? "text-blue-600 font-medium" : "text-gray-600"}`}
                  onClick={() => applyQuickOption(option.id)}
                  data-testid={`quick-option-${option.id}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {/* Dual calendars */}
            <div className="flex-1 p-4">
              <div className="text-xs text-gray-500 mb-3 text-center">
                {tempStartDate && tempEndDate
                  ? `${format(tempStartDate, "yyyy-MM-dd")} ~ ${format(tempEndDate, "yyyy-MM-dd")} (${getDayCount()}일)`
                  : "날짜를 선택하세요"}
              </div>
              <div className="flex gap-8 justify-center">
                <div>
                  <div className="text-center text-sm text-gray-500 mb-2">시작일</div>
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <button onClick={() => setStartMonth(new Date(startMonth.getFullYear(), startMonth.getMonth() - 1, 1))} className="p-1 hover:bg-gray-100 rounded">
                      <ChevronLeft className="h-5 w-5 text-gray-400" />
                    </button>
                    <span className="text-base font-semibold">{format(startMonth, "yyyy.M.", { locale: ko })}</span>
                    <button onClick={() => setStartMonth(new Date(startMonth.getFullYear(), startMonth.getMonth() + 1, 1))} className="p-1 hover:bg-gray-100 rounded">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  <Calendar
                    mode="single"
                    selected={tempStartDate}
                    onSelect={(date) => { setTempStartDate(date); setSelectedQuickOption(""); }}
                    month={startMonth}
                    onMonthChange={setStartMonth}
                    locale={ko}
                    className="rounded-md"
                  />
                </div>
                <div>
                  <div className="text-center text-sm text-gray-500 mb-2">종료일</div>
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <button onClick={() => setEndMonth(new Date(endMonth.getFullYear(), endMonth.getMonth() - 1, 1))} className="p-1 hover:bg-gray-100 rounded">
                      <ChevronLeft className="h-5 w-5 text-gray-400" />
                    </button>
                    <span className="text-base font-semibold">{format(endMonth, "yyyy.M.", { locale: ko })}</span>
                    <button onClick={() => setEndMonth(new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 1))} className="p-1 hover:bg-gray-100 rounded">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  <Calendar
                    mode="single"
                    selected={tempEndDate}
                    onSelect={(date) => { setTempEndDate(date); setSelectedQuickOption(""); }}
                    month={endMonth}
                    onMonthChange={setEndMonth}
                    locale={ko}
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-4 border-t">
            <Button variant="outline" size="sm" onClick={() => setIsCalendarOpen(false)} data-testid="button-calendar-cancel">취소</Button>
            <Button size="sm" onClick={handleConfirmDates} data-testid="button-calendar-confirm">확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
