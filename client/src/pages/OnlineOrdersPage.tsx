import { useState, useCallback } from "react";
import { format, startOfMonth, endOfMonth, subMonths, subYears, differenceInDays, subDays, subWeeks, startOfWeek, endOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import * as DialogPrimitive from "@radix-ui/react-dialog";
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
import { Search, Download, Printer, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

interface OrderItem {
  orderDate: string;
  productName: string;
  warehouse: string;
  orderQty: number;
  releaseQty: number;
  unitPrice: number;
  amount: number;
  expectedDate: string;
  batch: string;
  status: string;
  cancel: string;
}

interface OrderGroup {
  orderTime: string;
  orderNumber: string;
  subtotal: number;
  items: OrderItem[];
}

const mockOrderGroups: OrderGroup[] = [
  {
    orderTime: "2026-02-06 10:18:06",
    orderNumber: "DA2602-0219963",
    subtotal: 1145400,
    items: [
      { orderDate: "2026-02-06", productName: "네비레트엠정2.5mg 300T 광동제약(메나리니)", warehouse: "동원약품", orderQty: 1, releaseQty: 1, unitPrice: 39600, amount: 39600, expectedDate: "2026-02-06", batch: "01", status: "출고확정", cancel: "-" },
      { orderDate: "", productName: "리트모놈SR서방캡셀225mg 50C 한국애보트", warehouse: "동원약품", orderQty: 5, releaseQty: 5, unitPrice: 20600, amount: 103000, expectedDate: "2026-02-06", batch: "01", status: "출고확정", cancel: "-" },
      { orderDate: "", productName: "리바로젯정2/10mg 100T 종외제약", warehouse: "동원약품", orderQty: 4, releaseQty: 4, unitPrice: 130700, amount: 522800, expectedDate: "2026-02-06", batch: "01", status: "출고확정", cancel: "-" },
      { orderDate: "", productName: "레보발사정2.5/80mg 30T 안국뉴팜", warehouse: "동원약품", orderQty: 20, releaseQty: 20, unitPrice: 24000, amount: 480000, expectedDate: "2026-02-06", batch: "01", status: "출고확정", cancel: "-" },
    ],
  },
  {
    orderTime: "2026-02-06 10:49:53",
    orderNumber: "DA2602-0222235",
    subtotal: 783320,
    items: [
      { orderDate: "2026-02-06", productName: "뉴히알드롭점안액0.15% 6ML 태준", warehouse: "동원약품", orderQty: 10, releaseQty: 10, unitPrice: 3203, amount: 32030, expectedDate: "2026-02-06", batch: "01", status: "출고확정", cancel: "-" },
      { orderDate: "", productName: "코숨점안액 5ML 한국산텐", warehouse: "동원약품", orderQty: 10, releaseQty: 10, unitPrice: 10955, amount: 109550, expectedDate: "2026-02-06", batch: "01", status: "출고확정", cancel: "-" },
      { orderDate: "", productName: "타프콤점안액 2.5ML 한국산텐", warehouse: "동원약품", orderQty: 10, releaseQty: 10, unitPrice: 19626, amount: 196260, expectedDate: "2026-02-06", batch: "01", status: "출고확정", cancel: "-" },
      { orderDate: "", productName: "리퀴시아정5mg(병) 60T 종근당", warehouse: "동원약품", orderQty: 10, releaseQty: 10, unitPrice: 34020, amount: 340200, expectedDate: "2026-02-06", batch: "01", status: "출고확정", cancel: "-" },
      { orderDate: "", productName: "알렌맥스플러스디정 4T 한미", warehouse: "동원약품", orderQty: 5, releaseQty: 5, unitPrice: 21056, amount: 105280, expectedDate: "2026-02-06", batch: "01", status: "출고확정", cancel: "-" },
    ],
  },
];

export default function OnlineOrdersPage() {
  const [activeTab, setActiveTab] = useState<"list" | "cancel">("list");
  const [activePeriod, setActivePeriod] = useState("전월");
  const today = new Date();
  const [startDate, setStartDate] = useState<Date>(startOfMonth(subMonths(today, 1)));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(subMonths(today, 1)));

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(startOfMonth(subMonths(today, 1)));
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(endOfMonth(subMonths(today, 1)));
  const [calStartMonth, setCalStartMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth() - 1, 1));
  const [calEndMonth, setCalEndMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth() - 1, 1));
  const [selectedQuickOption, setSelectedQuickOption] = useState<string>("지난달");

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

  const applyQuickOption = (optionId: string) => {
    setSelectedQuickOption(quickOptions.find(o => o.id === optionId)?.label || "");
    const now = new Date();
    switch (optionId) {
      case "today": setTempStartDate(now); setTempEndDate(now); break;
      case "yesterday": setTempStartDate(subDays(now, 1)); setTempEndDate(subDays(now, 1)); break;
      case "thisWeek": setTempStartDate(startOfWeek(now, { weekStartsOn: 0 })); setTempEndDate(endOfWeek(now, { weekStartsOn: 0 })); break;
      case "lastWeek": setTempStartDate(startOfWeek(subWeeks(now, 1), { weekStartsOn: 0 })); setTempEndDate(endOfWeek(subWeeks(now, 1), { weekStartsOn: 0 })); break;
      case "last7Include": setTempStartDate(subDays(now, 6)); setTempEndDate(now); break;
      case "last7Exclude": setTempStartDate(subDays(now, 7)); setTempEndDate(subDays(now, 1)); break;
      case "thisMonth": setTempStartDate(startOfMonth(now)); setTempEndDate(endOfMonth(now)); break;
      case "lastMonth": setTempStartDate(startOfMonth(subMonths(now, 1))); setTempEndDate(endOfMonth(subMonths(now, 1))); break;
      case "last30Include": setTempStartDate(subDays(now, 29)); setTempEndDate(now); break;
      case "last30Exclude": setTempStartDate(subDays(now, 30)); setTempEndDate(subDays(now, 1)); break;
    }
  };

  const handleOpenCalendar = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setCalStartMonth(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
    setCalEndMonth(new Date(endDate.getFullYear(), endDate.getMonth(), 1));
    setIsCalendarOpen(true);
  };

  const handleConfirmDates = () => {
    if (tempStartDate) setStartDate(tempStartDate);
    if (tempEndDate) setEndDate(tempEndDate);
    setIsCalendarOpen(false);
  };

  const handleCancelDates = () => {
    setIsCalendarOpen(false);
  };

  const navigateDates = (direction: "prev" | "next") => {
    const days = differenceInDays(endDate, startDate);
    if (direction === "prev") {
      setStartDate(subDays(startDate, days + 1));
      setEndDate(subDays(endDate, days + 1));
    } else {
      setStartDate(new Date(startDate.getTime() + (days + 1) * 86400000));
      setEndDate(new Date(endDate.getTime() + (days + 1) * 86400000));
    }
  };

  const getDayCount = () => {
    if (tempStartDate && tempEndDate) return differenceInDays(tempEndDate, tempStartDate) + 1;
    return 0;
  };

  const handlePeriodClick = useCallback((label: string) => {
    setActivePeriod(label);
    const now = new Date();
    let start: Date;
    let end: Date = now;
    switch (label) {
      case "당월": start = startOfMonth(now); end = endOfMonth(now); break;
      case "전월": start = startOfMonth(subMonths(now, 1)); end = endOfMonth(subMonths(now, 1)); break;
      case "3개월": start = startOfMonth(subMonths(now, 2)); end = endOfMonth(now); break;
      case "6개월": start = startOfMonth(subMonths(now, 5)); end = endOfMonth(now); break;
      case "1년": start = startOfMonth(subYears(now, 1)); end = endOfMonth(now); break;
      case "2년": start = startOfMonth(subYears(now, 2)); end = endOfMonth(now); break;
      case "3년": start = startOfMonth(subYears(now, 3)); end = endOfMonth(now); break;
      default: start = startOfMonth(now); end = endOfMonth(now);
    }
    setStartDate(start);
    setEndDate(end);
  }, []);

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4" data-testid="text-page-title">주문내역 조회</h1>

        <div className="border-b mb-6">
          <div className="flex">
            <button
              className={`px-16 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "list" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("list")}
              data-testid="tab-order-list"
            >
              주문목록
            </button>
            <button
              className={`px-16 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "cancel" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("cancel")}
              data-testid="tab-order-cancel"
            >
              주문취소 내역
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <div className="flex items-center border rounded overflow-hidden shrink-0">
            {["당월", "전월", "3개월", "6개월", "1년", "2년", "3년"].map((label, idx) => (
              <button
                key={label}
                className={`h-9 px-4 text-sm whitespace-nowrap ${idx < 6 ? "border-r" : ""} ${activePeriod === label ? "bg-blue-600 text-white font-semibold" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                onClick={() => handlePeriodClick(label)}
                data-testid={`button-period-${label}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center border rounded h-9">
            <button
              className="px-2 h-full hover:bg-gray-50 text-gray-500"
              onClick={() => navigateDates("prev")}
              data-testid="button-date-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="flex items-center gap-2 px-3 text-sm hover:bg-gray-50 whitespace-nowrap"
              onClick={handleOpenCalendar}
              data-testid="button-open-calendar"
            >
              <span>{format(startDate, "yyyy.MM.dd.")} ~ {format(endDate, "yyyy.MM.dd.")}</span>
              <CalendarIcon className="h-4 w-4 text-gray-400" />
            </button>
            <button
              className="px-2 h-full hover:bg-gray-50 text-gray-500 border-l"
              onClick={() => navigateDates("next")}
              data-testid="button-date-next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Select defaultValue="order">
            <SelectTrigger className="h-9 w-20 text-sm" data-testid="select-order-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order">주문</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600">전표구분</span>
            <Select defaultValue="normal">
              <SelectTrigger className="h-9 w-20 text-sm" data-testid="select-slip-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">정상</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            placeholder="제품명을 입력하세요"
            className="h-9 w-52 text-sm"
            data-testid="input-product-search"
          />

          <Button className="h-9 px-5 bg-blue-500 hover:bg-blue-600 text-sm" data-testid="button-search">
            <Search className="h-4 w-4 mr-1" />
            검색
          </Button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold" data-testid="text-section-title">주문 목록</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 px-4 text-sm" data-testid="button-excel-download">
              <Download className="h-4 w-4 mr-1" />
              엑셀 다운로드
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-4 text-sm" data-testid="button-print">
              <Printer className="h-4 w-4 mr-1" />
              출력하기
            </Button>
          </div>
        </div>

        <div className="border rounded-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 h-10">
                <TableHead className="h-10 py-2 text-xs font-semibold text-center text-gray-700 border-r" data-testid="header-order-date">주문일자</TableHead>
                <TableHead className="h-10 py-2 text-xs font-semibold text-center text-gray-700 border-r" data-testid="header-product-name">제품명</TableHead>

                <TableHead className="h-10 py-2 text-xs font-semibold text-center text-gray-700 border-r w-14" data-testid="header-order-qty">주문</TableHead>
                <TableHead className="h-10 py-2 text-xs font-semibold text-center text-gray-700 border-r w-14" data-testid="header-release-qty">출고</TableHead>
                <TableHead className="h-10 py-2 text-xs font-semibold text-center text-gray-700 border-r w-20" data-testid="header-unit-price">단가</TableHead>
                <TableHead className="h-10 py-2 text-xs font-semibold text-center text-gray-700 border-r w-24" data-testid="header-amount">금액</TableHead>
                <TableHead className="h-10 py-2 text-xs font-semibold text-center text-gray-700 border-r w-24" data-testid="header-expected-date">예정일자</TableHead>

                <TableHead className="h-10 py-2 text-xs font-semibold text-center text-gray-700 border-r w-20" data-testid="header-status">상태</TableHead>
                <TableHead className="h-10 py-2 text-xs font-semibold text-center text-gray-700 w-16" data-testid="header-cancel">주문취소</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrderGroups.map((group, groupIdx) => (
                <>
                  {group.items.map((item, itemIdx) => (
                    <TableRow
                      key={`${groupIdx}-${itemIdx}`}
                      className="h-9 hover:bg-gray-50 border-b"
                      data-testid={`order-row-${groupIdx}-${itemIdx}`}
                    >
                      <TableCell className="py-1 px-3 text-xs text-center border-r">{item.orderDate}</TableCell>
                      <TableCell className="py-1 px-3 text-xs border-r">{item.productName}</TableCell>

                      <TableCell className="py-1 px-3 text-xs text-center border-r">{item.orderQty}</TableCell>
                      <TableCell className="py-1 px-3 text-xs text-center border-r">{item.releaseQty}</TableCell>
                      <TableCell className="py-1 px-3 text-xs text-right border-r">{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="py-1 px-3 text-xs text-right border-r">{item.amount.toLocaleString()}</TableCell>
                      <TableCell className="py-1 px-3 text-xs text-center border-r">{item.expectedDate}</TableCell>

                      <TableCell className="py-1 px-3 text-xs text-center border-r">{item.status}</TableCell>
                      <TableCell className="py-1 px-3 text-xs text-center">{item.cancel}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow
                    key={`summary-${groupIdx}`}
                    className="h-10 bg-blue-50 border-b-2 border-blue-200"
                    data-testid={`order-summary-${groupIdx}`}
                  >
                    <TableCell colSpan={2} className="py-1 px-3 text-xs font-semibold text-gray-700">
                      <span className="text-gray-500 mr-2">주문시간</span>
                      <span>{group.orderTime}</span>
                    </TableCell>
                    <TableCell colSpan={2} className="py-1 px-3 text-xs font-semibold text-gray-700">
                      <span className="text-gray-500 mr-2">주문번호</span>
                      <span>{group.orderNumber}</span>
                    </TableCell>
                    <TableCell colSpan={2} className="py-1 px-3 text-xs font-semibold text-gray-700 text-right">
                      <span className="text-gray-500 mr-2">소계</span>
                    </TableCell>
                    <TableCell className="py-1 px-3 text-xs font-bold text-gray-800 text-right">
                      {group.subtotal.toLocaleString()}
                    </TableCell>
                    <TableCell colSpan={3} className="py-1 px-3"></TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <DialogPrimitive.Root open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-white border border-gray-200 rounded-lg shadow-xl p-0 focus:outline-none"
            style={{ width: 700 }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <DialogPrimitive.Title className="text-base font-semibold">기간 선택</DialogPrimitive.Title>
              <DialogPrimitive.Close className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none">
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
            </div>

            <div className="flex">
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

              <div className="flex-1 p-4">
                <div className="flex gap-8 justify-center">
                  <div>
                    <div className="text-center text-sm text-gray-500 mb-2">시작일</div>
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <button onClick={() => setCalStartMonth(new Date(calStartMonth.getFullYear(), calStartMonth.getMonth() - 1, 1))} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft className="h-5 w-5 text-gray-400" />
                      </button>
                      <span className="text-lg font-semibold">{format(calStartMonth, "yyyy.M.", { locale: ko })}</span>
                      <button onClick={() => setCalStartMonth(new Date(calStartMonth.getFullYear(), calStartMonth.getMonth() + 1, 1))} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                    <Calendar
                      mode="single"
                      selected={tempStartDate}
                      onSelect={(date) => { setTempStartDate(date); setSelectedQuickOption(""); }}
                      month={calStartMonth}
                      onMonthChange={setCalStartMonth}
                      locale={ko}
                      className="rounded-md"
                    />
                  </div>

                  <div>
                    <div className="text-center text-sm text-gray-500 mb-2">종료일</div>
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <button onClick={() => setCalEndMonth(new Date(calEndMonth.getFullYear(), calEndMonth.getMonth() - 1, 1))} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft className="h-5 w-5 text-gray-400" />
                      </button>
                      <span className="text-lg font-semibold">{format(calEndMonth, "yyyy.M.", { locale: ko })}</span>
                      <button onClick={() => setCalEndMonth(new Date(calEndMonth.getFullYear(), calEndMonth.getMonth() + 1, 1))} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                    <Calendar
                      mode="single"
                      selected={tempEndDate}
                      onSelect={(date) => { setTempEndDate(date); setSelectedQuickOption(""); }}
                      month={calEndMonth}
                      onMonthChange={setCalEndMonth}
                      locale={ko}
                      className="rounded-md"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    {tempStartDate && tempEndDate && (
                      <>{format(tempStartDate, "yyyy.MM.dd.")} ~ {format(tempEndDate, "yyyy.MM.dd.")} ({getDayCount()}일)</>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancelDates} data-testid="button-calendar-cancel">취소</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleConfirmDates} data-testid="button-calendar-confirm">확인</Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
