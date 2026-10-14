import { useState, Fragment } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bell, Calendar as CalendarIcon, Printer, FileSpreadsheet, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import {
  format,
  subDays,
  subWeeks,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  differenceInDays,
} from "date-fns";
import { ko } from "date-fns/locale";

export default function SalesLedgerPage() {
  const [filterAll, setFilterAll] = useState(true);
  const [filterPurchase, setFilterPurchase] = useState(false);
  const [filterReturn, setFilterReturn] = useState(false);
  const [filterPayment, setFilterPayment] = useState(false);
  const [filterPriceComp, setFilterPriceComp] = useState(false);

  const today = new Date();
  const [viewMode, setViewMode] = useState<"monthly" | "daily">("daily");
  const [startDate, setStartDate] = useState<Date>(startOfMonth(today));
  const [endDate, setEndDate] = useState<Date>(today);
  const [period, setPeriod] = useState("thisMonth");
  const [criteriaMode, setCriteriaMode] = useState<"voucher" | "product">("voucher");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<{ date: string; amount: string; description: string } | null>(null);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(startOfMonth(today));
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(today);
  const [calendarYear, setCalendarYear] = useState<number>(today.getFullYear());
  const [leftMonth, setLeftMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth() - 1, 1));
  const [rightMonth, setRightMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));

  const [showLeftPicker, setShowLeftPicker] = useState(false);
  const [showRightPicker, setShowRightPicker] = useState(false);
  const [pickerLeftMonth, setPickerLeftMonth] = useState(0);
  const [pickerLeftYear, setPickerLeftYear] = useState(today.getFullYear());
  const [pickerRightMonth, setPickerRightMonth] = useState(0);
  const [pickerRightYear, setPickerRightYear] = useState(today.getFullYear());
  const [leftYearStart, setLeftYearStart] = useState(today.getFullYear() - 3);
  const [rightYearStart, setRightYearStart] = useState(today.getFullYear() - 3);

  const openLeftPicker = () => {
    setPickerLeftMonth(leftMonth.getMonth());
    setPickerLeftYear(leftMonth.getFullYear());
    setLeftYearStart(leftMonth.getFullYear() - 3);
    setShowLeftPicker(true);
  };
  const confirmLeftPicker = () => {
    setLeftMonth(new Date(pickerLeftYear, pickerLeftMonth, 1));
    setShowLeftPicker(false);
  };
  const openRightPicker = () => {
    setPickerRightMonth(rightMonth.getMonth());
    setPickerRightYear(rightMonth.getFullYear());
    setRightYearStart(rightMonth.getFullYear() - 3);
    setShowRightPicker(true);
  };
  const confirmRightPicker = () => {
    setRightMonth(new Date(pickerRightYear, pickerRightMonth, 1));
    setShowRightPicker(false);
  };

  const handleYearChange = (newYear: number) => {
    setCalendarYear(newYear);
    setLeftMonth(new Date(newYear, today.getMonth() - 1, 1));
    setRightMonth(new Date(newYear, today.getMonth(), 1));
  };

  const applyQuickRange = (from: Date, to: Date) => {
    setTempStartDate(from);
    setTempEndDate(to);
    const fromMonth = new Date(from.getFullYear(), from.getMonth(), 1);
    setLeftMonth(fromMonth);
    setRightMonth(new Date(from.getFullYear(), from.getMonth() + 1, 1));
    setCalendarYear(from.getFullYear());
  };

  const handleOpenCalendar = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setCalendarYear(startDate.getFullYear());
    setLeftMonth(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
    setRightMonth(new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1));
    setIsCalendarOpen(true);
  };

  const handleApplyDates = () => {
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
      setStartDate(new Date(startDate.getTime() + (days + 1) * 24 * 60 * 60 * 1000));
      setEndDate(new Date(endDate.getTime() + (days + 1) * 24 * 60 * 60 * 1000));
    }
  };

  const periodOptions = [
    { id: "thisMonth", label: "당월" },
    { id: "lastMonth", label: "전월" },
    { id: "3months", label: "3개월" },
    { id: "6months", label: "6개월" },
    { id: "1year", label: "1년" },
    { id: "2years", label: "2년" },
  ];

  const sampleData = [
    {
      id: 1,
      date: "2026-01-05",
      approvalNo: "385",
      type: "매입",
      category: "인터넷",
      orderType: "일반",
      description: "비오틀250산(특정보트트퀴수) 200P",
      itemCount: "외4종",
      salesAmount: "245,000",
      depositAmount: "0",
      balance: "15,124,159",
      receipt: "",
      hasSubtotal: true,
      subtotalAmount: "245,000",
      subtotalBalance: "15,124,159",
    },
    {
      id: 2,
      date: "2026-01-02",
      approvalNo: "1008",
      type: "매입",
      category: "기타",
      orderType: "일반",
      description: "디세텔정 500T",
      itemCount: "",
      salesAmount: "50,000",
      depositAmount: "0",
      balance: "14,879,159",
      receipt: "보기",
    },
    {
      id: 3,
      date: "2026-01-02",
      approvalNo: "242",
      type: "매입",
      category: "인터넷",
      orderType: "일반",
      description: "센트롤실버프로장 120T",
      itemCount: "",
      salesAmount: "35,000",
      depositAmount: "0",
      balance: "14,829,159",
      receipt: "보기",
    },
    {
      id: 4,
      date: "2026-01-02",
      approvalNo: "241",
      type: "매입",
      category: "인터넷",
      orderType: "일반",
      description: "마데카솔케어연고10g 1EA",
      itemCount: "외3종",
      salesAmount: "143,250",
      depositAmount: "0",
      balance: "14,794,159",
      receipt: "보기",
    },
    {
      id: 5,
      date: "2026-01-02",
      approvalNo: "145",
      type: "매입",
      category: "인터넷",
      orderType: "일반",
      description: "하루날디정0.2mg 140T",
      itemCount: "외7종",
      salesAmount: "1,214,910",
      depositAmount: "0",
      balance: "14,650,909",
      receipt: "보기",
      hasSubtotal: true,
      subtotalAmount: "1,443,160",
      subtotalBalance: "14,879,159",
    },
  ];

  const voucherDetailItems = [
    { id: 1, manufacturer: "테라젠이텍", category: "구매", name: "에페시나정50mg",             badges: ["전","보"], spec: "500정(병)",  price: "49,000",  qty: 1,  amount: "49,000",   insCode: "698502210", lotNo: "25014",      expiry: "20281026", serialNo: "SN2600001", type: "처방" },
    { id: 2, manufacturer: "테라젠이텍", category: "구매", name: "에페시나정50mg",             badges: ["전","보"], spec: "500정(병)",  price: "49,000",  qty: 2,  amount: "98,000",   insCode: "698502210", lotNo: "25011",      expiry: "20280914", serialNo: "SN2600002", type: "처방" },
    { id: 3, manufacturer: "메디카코리", category: "구매", name: "프레리카캡슐50mg",           badges: ["전","보"], spec: "30캡슐(병)", price: "11,580",  qty: 10, amount: "115,800",  insCode: "646004810", lotNo: "26005",      expiry: "20290125", serialNo: "SN2600003", type: "처방" },
    { id: 4, manufacturer: "보령",       category: "구매", name: "듀카브플러스정60/5/12.5mg", badges: ["전","보"], spec: "30정(병)",   price: "24,270",  qty: 11, amount: "266,970",  insCode: "641907920", lotNo: "1908E00700", expiry: "20281215", serialNo: "SN2600004", type: "처방" },
    { id: 5, manufacturer: "애보트",     category: "구매", name: "하이드라섹산30mg",           badges: ["전","비"], spec: "16산제",    price: "15,450",  qty: 10, amount: "154,500",  insCode: "",          lotNo: "SXE3155",    expiry: "20270329", serialNo: "SN2600005", type: "처방" },
  ];

  const productSampleData = [
    { id: 1,  date: "2026-05-22", category: "매출",   manufacturer: "화이자",   name: "듀아비브정0.45/20mg",         badges: ["전","비"], spec: "30정(PTP)",       price: "57,600",   qty: 1,  amount: "57,600",     lotNo: "ML5271",   expiry: "20280116" },
    { id: 2,  date: "2026-05-22", category: "매출",   manufacturer: "화이자",   name: "듀아비브정0.45/20mg",         badges: ["전","비"], spec: "30정(PTP)",       price: "57,600",   qty: 5,  amount: "288,000",    lotNo: "ML5271",   expiry: "20280116" },
    { id: 3,  date: "2026-05-22", category: "매출",   manufacturer: "비아트리스", name: "노바스크정5mg",               badges: ["전","보"], spec: "30정(PTP)",       price: "10,740",   qty: 8,  amount: "85,920",     lotNo: "8212415",  expiry: "20280902" },
    { id: 4,  date: "2026-05-22", category: "매출",   manufacturer: "한국릴리",  name: "마운자로프리필드펜주2.5mg",    badges: ["전","비"], spec: "0.5ml/4펜",       price: "278,100",  qty: 10, amount: "2,781,000",  lotNo: "D949026E", expiry: "20271228" },
    { id: 5,  date: "2026-05-22", category: "반품",   manufacturer: "유니메드",  name: "유니알디스포점안액0.18%",      badges: ["전","보"], spec: "0.35mL/30관",     price: "8,310",    qty: 15, amount: "124,650",    lotNo: "260030",   expiry: "20290301" },
    { id: 6,  date: "2026-05-22", category: "매출",   manufacturer: "메나리니",  name: "엘리델크림1%",                badges: ["전","보"], spec: "10g/1개",         price: "11,197",   qty: 20, amount: "223,940",    lotNo: "331235",   expiry: "20271130" },
    { id: 7,  date: "2026-05-22", category: "결제",   manufacturer: "동화약품",  name: "후시딘연고",                  badges: ["일","비"], spec: "5g",              price: "4,350",    qty: 40, amount: "174,000",    lotNo: "",         expiry: "" },
    { id: 8,  date: "2026-05-22", category: "매출",   manufacturer: "국제약품",  name: "큐알론점안액0.3%",            badges: ["전","보"], spec: "0.5mL/60관",      price: "20,220",   qty: 2,  amount: "40,440",     lotNo: "ECL92603", expiry: "20290409" },
    { id: 9,  date: "2026-05-22", category: "약가보상", manufacturer: "애보트",    name: "하이드라섹산30mg",            badges: ["전","비"], spec: "16산제",          price: "15,450",   qty: 6,  amount: "92,700",     lotNo: "SXE3155",  expiry: "20270329" },
    { id: 10, date: "2026-05-24", category: "매출",   manufacturer: "국제약품",  name: "큐알론점안액0.3%",            badges: ["전","보"], spec: "0.5mL/60관",      price: "20,220",   qty: 7,  amount: "141,540",    lotNo: "ECL92601", expiry: "20290115" },
    { id: 11, date: "2026-05-24", category: "매출",   manufacturer: "한국릴리",  name: "마운자로프리필드펜주5mg",      badges: ["전","비"], spec: "0.5ml/4펜",       price: "369,300",  qty: 15, amount: "5,539,500",  lotNo: "D975797A", expiry: "20271117" },
    { id: 12, date: "2026-05-24", category: "기타",   manufacturer: "한독",      name: "알레그라정180mg",             badges: ["전","보"], spec: "30정(병)",        price: "9,300",    qty: 18, amount: "167,400",    lotNo: "ALFE007",  expiry: "20290310" },
    { id: 13, date: "2026-05-24", category: "매출",   manufacturer: "건일제약",  name: "오마코연질캡슐1000mg",        badges: ["전","보"], spec: "100캡슐(PTP)",    price: "29,700",   qty: 5,  amount: "148,500",    lotNo: "25017",    expiry: "20280508" },
  ];

  return (
    <div className="h-full overflow-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold" data-testid="text-page-title">매출원장</h1>
          <div className="flex items-center border rounded overflow-hidden">
            <button
              className={`h-7 px-3 text-xs whitespace-nowrap ${criteriaMode === "voucher" ? "bg-gray-800 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              onClick={() => setCriteriaMode("voucher")}
              data-testid="button-criteria-voucher"
            >전표일자 기준</button>
            <button
              className={`h-7 px-3 text-xs whitespace-nowrap border-l ${criteriaMode === "product" ? "bg-gray-800 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              onClick={() => setCriteriaMode("product")}
              data-testid="button-criteria-product"
            >상품기준 (일련번호 포함)</button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Bell className="h-4 w-4 text-blue-600" />
          <span className="font-medium">공지사항</span>
          <span className="text-gray-500">타사이트를 통한 주문 관련 공...</span>
          <div className="flex items-center gap-1 text-gray-400">
            <span>①</span>
            <span>②</span>
          </div>
        </div>
      </div>
      <Card className="rounded-sm">
        <CardContent className="p-4">
          {/* 상단 요약 + 기간 버튼 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold" data-testid="text-section-purchase-category">매입구분</span>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">현재잔고</span>
                <span className="font-semibold text-blue-600">15,124,159원</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">매입금액</span>
                <span className="font-semibold">1,688,160원</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">결제금액</span>
                <span className="font-semibold">0원</span>
              </div>
            </div>
            <div className="flex items-center border rounded overflow-hidden shrink-0">
              {periodOptions.map((option, index) => (
                <button
                  key={option.id}
                  className={`h-5 px-1.5 text-[10px] whitespace-nowrap ${index < periodOptions.length - 1 ? "border-r" : ""} ${period === option.id ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setPeriod(option.id)}
                  data-testid={`button-period-${option.id}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 필터 + 날짜 선택 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 cursor-pointer">
                  <Checkbox checked={filterAll} onCheckedChange={(c) => setFilterAll(c as boolean)} className="h-3 w-3" data-testid="checkbox-filter-all" />
                  <span className="text-xs">전체</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <Checkbox checked={filterPurchase} onCheckedChange={(c) => setFilterPurchase(c as boolean)} className="h-3 w-3" data-testid="checkbox-filter-purchase" />
                  <span className="text-xs">매입</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <Checkbox checked={filterReturn} onCheckedChange={(c) => setFilterReturn(c as boolean)} className="h-3 w-3" data-testid="checkbox-filter-return" />
                  <span className="text-xs">반품</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <Checkbox checked={filterPayment} onCheckedChange={(c) => setFilterPayment(c as boolean)} className="h-3 w-3" data-testid="checkbox-filter-payment" />
                  <span className="text-xs">결제</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded h-7">
                  <button className="px-2 h-full hover:bg-gray-50 text-gray-500" onClick={() => navigateDates("prev")} data-testid="button-date-prev">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 text-xs hover:bg-gray-50"
                    onClick={handleOpenCalendar}
                    data-testid="button-open-calendar"
                  >
                    <span>{format(startDate, "yyyy.MM.dd.")} ~ {format(endDate, "yyyy.MM.dd.")}</span>
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                  </button>
                  <button className="px-2 h-full hover:bg-gray-50 text-gray-500 border-l" onClick={() => navigateDates("next")} data-testid="button-date-next">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs" data-testid="button-print">
                <Printer className="h-3 w-3 mr-1" />출력
              </Button>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs" data-testid="button-excel">
                <FileSpreadsheet className="h-3 w-3 mr-1" />엑셀다운
              </Button>
            </div>
          </div>

          {criteriaMode === "voucher" ? (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="h-8">
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-24">일자</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-20">전표번호</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-16">종류</TableHead>
                <TableHead className="h-8 py-1 text-xs text-left font-medium">적요</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-16">통류수</TableHead>
                <TableHead className="h-8 py-1 text-xs text-right font-medium w-24">판매금액</TableHead>
                <TableHead className="h-8 py-1 text-xs text-right font-medium w-24">입금금액</TableHead>
                <TableHead className="h-8 py-1 text-xs text-right font-medium w-28">잔고</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-16">메모</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((row) => (
                <Fragment key={row.id}>
                  <TableRow className="h-8">
                    <TableCell className="py-1 text-xs text-center">{row.date}</TableCell>
                    <TableCell className="py-1 text-xs text-center">{row.approvalNo}</TableCell>
                    <TableCell className="py-1 text-xs text-center">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-600 border-blue-200">{row.type}</Badge>
                    </TableCell>
                    <TableCell
                      className="py-1 text-xs text-left text-blue-600 cursor-pointer hover:underline"
                      onClick={() => { setSelectedVoucher({ date: row.date, amount: row.salesAmount, description: row.description }); setIsDetailOpen(true); }}
                      data-testid={`cell-description-${row.id}`}
                    >{row.description}</TableCell>
                    <TableCell className="py-1 text-xs text-center">{row.itemCount}</TableCell>
                    <TableCell className="py-1 text-xs text-right">{row.salesAmount}</TableCell>
                    <TableCell className="py-1 text-xs text-right">{row.depositAmount}</TableCell>
                    <TableCell className="py-1 text-xs text-right font-medium">{row.balance}</TableCell>
                    <TableCell className="py-1 text-xs text-center"></TableCell>
                  </TableRow>
                  {row.hasSubtotal && (
                    <TableRow key={`${row.id}-subtotal`} className="h-7 bg-gray-50">
                      <TableCell colSpan={4} className="py-1 text-right text-gray-600 text-[14px] font-bold">일 합계</TableCell>
                      <TableCell className="py-1 text-xs text-center"></TableCell>
                      <TableCell className="py-1 text-right text-[14px] font-bold">{row.subtotalAmount}</TableCell>
                      <TableCell className="py-1 text-xs text-right">0</TableCell>
                      <TableCell className="py-1 text-xs text-right font-medium">{row.subtotalBalance}</TableCell>
                      <TableCell colSpan={1} className="py-1"></TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
          ) : (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="h-8">
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-24">전표일자</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-16">구분</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-20">제조사</TableHead>
                <TableHead className="h-8 py-1 text-xs text-left font-medium">상품명</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-24">규격</TableHead>
                <TableHead className="h-8 py-1 text-xs text-right font-medium w-20">판매가</TableHead>
                <TableHead className="h-8 py-1 text-xs text-right font-medium w-16">주문수량</TableHead>
                <TableHead className="h-8 py-1 text-xs text-right font-medium w-24">주문금액</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-24">제조번호</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-24">유효기간</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-24">일련번호</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productSampleData.map((row) => (
                <TableRow key={row.id} className="h-8">
                  <TableCell className="py-1 text-xs text-center">{row.date}</TableCell>
                  <TableCell className="py-1 text-xs text-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-1.5 py-0 h-4",
                        row.category === "매출" && "bg-blue-50 text-blue-600 border-blue-200",
                        row.category === "반품" && "bg-red-50 text-red-600 border-red-200",
                        row.category === "결제" && "bg-green-50 text-green-600 border-green-200",
                        row.category === "약가보상" && "bg-purple-50 text-purple-600 border-purple-200",
                        row.category === "기타" && "bg-gray-50 text-gray-600 border-gray-200",
                      )}
                    >{row.category}</Badge>
                  </TableCell>
                  <TableCell className="py-1 text-xs text-center">{row.manufacturer}</TableCell>
                  <TableCell className="py-1 text-xs text-left">
                    <span className="inline-flex items-center gap-1">
                      <span>{row.name}</span>
                      {row.badges.map((badge, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className={cn(
                            "text-[9px] px-1 py-0 h-4 leading-none",
                            badge === "전" && "bg-blue-50 text-blue-600 border-blue-300",
                            badge === "일" && "bg-gray-50 text-gray-600 border-gray-300",
                            badge === "비" && "bg-red-50 text-red-600 border-red-300",
                            badge === "보" && "bg-green-50 text-green-600 border-green-300",
                          )}
                        >{badge}</Badge>
                      ))}
                    </span>
                  </TableCell>
                  <TableCell className="py-1 text-xs text-center">{row.spec}</TableCell>
                  <TableCell className="py-1 text-xs text-right">{row.price}</TableCell>
                  <TableCell className="py-1 text-xs text-right">{row.qty}</TableCell>
                  <TableCell className={cn("py-1 text-xs text-right", (row.category === "반품" || row.category === "약가보상") && "text-red-600")}>
                    {(row.category === "반품" || row.category === "약가보상") ? `-${row.amount}` : row.amount}
                  </TableCell>
                  <TableCell className="py-1 text-xs text-center">{row.lotNo}</TableCell>
                  <TableCell className="py-1 text-xs text-center">{row.expiry}</TableCell>
                  <TableCell className="py-1 text-xs text-center">
                    <Button variant="outline" size="sm" className="h-5 px-2 text-[10px]">상세보기</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
      {/* 매출원장 상세 팝업 */}
      <DialogPrimitive.Root open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <DialogPrimitive.Content
            className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-white border border-gray-200 rounded-lg shadow-xl p-0 focus:outline-none flex flex-col"
            style={{ width: '860px', maxWidth: '95vw', maxHeight: '90vh' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                <DialogPrimitive.Title className="text-sm font-bold">매출원장조회</DialogPrimitive.Title>
                <span className="text-xs text-gray-500">최근 12개월 이내 고객님께서 온라인을 통해 주문하신 내역을 확인하실 수 있습니다.</span>
              </div>
              <DialogPrimitive.Close className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {/* 전표일자 + 거래금액 */}
              <div className="flex border mb-4">
                <div className="flex items-center gap-3 px-4 py-2 border-r bg-gray-50 w-48">
                  <span className="text-xs font-medium text-gray-600">전표일자</span>
                </div>
                <div className="flex items-center px-4 py-2 border-r flex-1">
                  <span className="text-xs">{selectedVoucher?.date}</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 border-r bg-gray-50 w-24">
                  <span className="text-xs font-medium text-gray-600">거래금액</span>
                </div>
                <div className="flex items-center px-4 py-2 flex-1">
                  <span className="text-xs font-semibold text-blue-600">{selectedVoucher?.amount}원</span>
                </div>
              </div>

              <div className="text-sm font-bold mb-3">주문상품 정보</div>

              {/* 처방의약품 */}
              <div className="text-xs font-medium text-gray-700 mb-1">처방의약품</div>
              <Table className="mb-4">
                <TableHeader className="bg-gray-50">
                  <TableRow className="h-8">
                    <TableHead className="h-8 py-1 text-xs text-center font-medium w-20">제조사명</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium w-14">구분</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-left font-medium">상품명</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium w-20">규격</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-right font-medium w-16">판매가</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-right font-medium w-12">수량</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-right font-medium w-20">금액</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium w-24">보험코드</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium w-24">제조번호</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium w-20">유효기간</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium w-24">일련번호</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {voucherDetailItems.map((item) => (
                    <TableRow key={item.id} className="h-8">
                      <TableCell className="py-1 text-xs text-center">{item.manufacturer}</TableCell>
                      <TableCell className="py-1 text-xs text-center">{item.category}</TableCell>
                      <TableCell className="py-1 text-xs text-left">
                        <span className="inline-flex items-center gap-1 flex-wrap">
                          <span>{item.name}</span>
                          {item.badges.map((badge, i) => (
                            <Badge key={i} variant="outline" className={cn(
                              "text-[9px] px-1 py-0 h-4 leading-none",
                              badge === "전" && "bg-blue-50 text-blue-600 border-blue-300",
                              badge === "일" && "bg-gray-50 text-gray-600 border-gray-300",
                              badge === "비" && "bg-red-50 text-red-600 border-red-300",
                              badge === "보" && "bg-green-50 text-green-600 border-green-300",
                            )}>{badge}</Badge>
                          ))}
                        </span>
                      </TableCell>
                      <TableCell className="py-1 text-xs text-center">{item.spec}</TableCell>
                      <TableCell className="py-1 text-xs text-right">{item.price}</TableCell>
                      <TableCell className="py-1 text-xs text-right">{item.qty}</TableCell>
                      <TableCell className="py-1 text-xs text-right">{item.amount}</TableCell>
                      <TableCell className="py-1 text-xs text-center">{item.insCode}</TableCell>
                      <TableCell className="py-1 text-xs text-center">{item.lotNo}</TableCell>
                      <TableCell className="py-1 text-xs text-center">{item.expiry}</TableCell>
                      <TableCell className="py-1 text-xs text-center">{item.serialNo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 일반의약품 */}
              <div className="text-xs font-medium text-gray-700 mb-1">일반의약품</div>
              <Table className="mb-4">
                <TableHeader className="bg-gray-50">
                  <TableRow className="h-8">
                    <TableHead className="h-8 py-1 text-xs text-center font-medium w-20">제조사명</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium w-14">구분</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-left font-medium">상품명</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium w-20">규격</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-right font-medium w-16">판매가</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-right font-medium w-12">수량</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-right font-medium w-20">금액</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium w-24">보험코드</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium w-24">제조번호</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium w-20">유효기간</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium w-24">일련번호</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={11} className="py-4 text-xs text-center text-gray-400">주문정보가 없습니다.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs" data-testid="button-detail-excel">
                  <FileSpreadsheet className="h-3 w-3 mr-1" />엑셀 다운로드
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs" data-testid="button-detail-pdf">
                  <Printer className="h-3 w-3 mr-1" />PDF 다운로드
                </Button>
              </div>
              <Button variant="outline" size="sm" className="h-8 px-4 text-xs border-red-300 text-red-600" onClick={() => setIsDetailOpen(false)} data-testid="button-detail-close">
                목록
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
      {/* 일자조회 다이얼로그 (오버레이 없음) */}
      <DialogPrimitive.Root open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Content
            className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-white border border-gray-200 rounded-lg shadow-xl p-0 focus:outline-none flex flex-col"
            style={{ width: '690px', maxWidth: '690px', height: '690px' }}
          >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <DialogPrimitive.Title className="text-base font-semibold">일자조회</DialogPrimitive.Title>
            <DialogPrimitive.Close className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          <div className="px-4 py-3 space-y-2 flex-1 overflow-y-auto">
            {/* 기준연도 + 선택 기간 표시 */}
            <div className="flex items-center justify-center gap-3 py-2 px-4 border rounded-md">
              <span className="text-sm text-gray-600">기준연도</span>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => handleYearChange(calendarYear - 1)} data-testid="button-prev-year">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-sm font-bold w-12 text-center">{calendarYear}</span>
                <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => handleYearChange(calendarYear + 1)} data-testid="button-next-year">
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
              <span className="text-sm text-gray-700 ml-2">
                {tempStartDate ? format(tempStartDate, "yyyy-MM-dd") : ""} ~ {tempEndDate ? format(tempEndDate, "yyyy-MM-dd") : ""}
              </span>
            </div>

            {/* 빠른 선택 1행: 7버튼 균등 */}
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="flex-1 h-7 px-0 text-xs" onClick={() => applyQuickRange(today, today)} data-testid="button-today">오늘</Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 px-0 text-xs" onClick={() => applyQuickRange(subDays(today, 1), subDays(today, 1))} data-testid="button-yesterday">전일</Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 px-0 text-xs" onClick={() => applyQuickRange(startOfWeek(today, { weekStartsOn: 1 }), endOfWeek(today, { weekStartsOn: 1 }))} data-testid="button-this-week">주간</Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 px-0 text-xs" onClick={() => applyQuickRange(startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }), endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }))} data-testid="button-last-week">전주</Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 px-0 text-xs" onClick={() => applyQuickRange(startOfMonth(today), endOfMonth(today))} data-testid="button-this-month">당월</Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 px-0 text-xs" onClick={() => applyQuickRange(startOfMonth(subMonths(today, 1)), endOfMonth(subMonths(today, 1)))} data-testid="button-last-month">전월</Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 px-0 text-xs" onClick={() => applyQuickRange(startOfYear(today), endOfYear(today))} data-testid="button-this-year">올해</Button>
            </div>

            {/* 빠른 선택 2행: 7버튼 균등 */}
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="flex-1 h-7 px-0 text-xs" onClick={() => applyQuickRange(new Date(calendarYear, 0, 1), new Date(calendarYear, 5, 30))} data-testid="button-first-half">상반기</Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 px-0 text-xs" onClick={() => applyQuickRange(new Date(calendarYear, 6, 1), new Date(calendarYear, 11, 31))} data-testid="button-second-half">하반기</Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 px-0 text-xs" onClick={() => applyQuickRange(new Date(calendarYear, 0, 1), new Date(calendarYear, 2, 31))} data-testid="button-q1">1/4분기</Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 px-0 text-xs" onClick={() => applyQuickRange(new Date(calendarYear, 3, 1), new Date(calendarYear, 5, 30))} data-testid="button-q2">2/4분기</Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 px-0 text-xs" onClick={() => applyQuickRange(new Date(calendarYear, 6, 1), new Date(calendarYear, 8, 30))} data-testid="button-q3">3/4분기</Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 px-0 text-xs" onClick={() => applyQuickRange(new Date(calendarYear, 9, 1), new Date(calendarYear, 11, 31))} data-testid="button-q4">4/4분기</Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 px-0 text-xs" onClick={() => applyQuickRange(new Date(calendarYear, 0, 1), today)} data-testid="button-until-today">오늘까지</Button>
            </div>

            {/* 월 선택: 12버튼 균등 */}
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                <Button
                  key={month}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-7 px-0 text-xs"
                  onClick={() => applyQuickRange(new Date(calendarYear, month - 1, 1), endOfMonth(new Date(calendarYear, month - 1, 1)))}
                  data-testid={`button-month-${month}`}
                >
                  {month}월
                </Button>
              ))}
            </div>

            {/* 두 개의 캘린더 */}
            <div className="flex justify-between pt-1">
              {/* 왼쪽 캘린더 */}
              <div className="border rounded-md flex-1">
                {showLeftPicker ? (
                  <div className="flex flex-col p-3 h-full">
                    <div className="flex gap-2 flex-1">
                      {/* 월 그리드: 1월~6월 왼쪽, 7월~12월 오른쪽 */}
                      <div className="grid grid-cols-2 gap-1 flex-1">
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                          <button
                            key={m}
                            className={cn(
                              "rounded text-sm py-1.5 text-center",
                              pickerLeftMonth === m - 1
                                ? "bg-blue-500 text-white font-semibold"
                                : "hover:bg-gray-100 text-gray-700"
                            )}
                            onClick={() => setPickerLeftMonth(m - 1)}
                          >{m}월</button>
                        ))}
                      </div>
                      {/* 연도 리스트 */}
                      <div className="flex flex-col items-center border-l pl-2 w-20">
                        <button
                          className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm"
                          onClick={() => setLeftYearStart(s => s - 1)}
                        >«</button>
                        <div className="flex flex-col gap-0.5 flex-1 w-full mt-0.5">
                          {Array.from({ length: 7 }, (_, i) => leftYearStart + i).map(y => (
                            <button
                              key={y}
                              className={cn(
                                "w-full rounded text-sm py-1 text-center",
                                pickerLeftYear === y
                                  ? "bg-blue-500 text-white font-semibold"
                                  : "hover:bg-gray-100 text-gray-700"
                              )}
                              onClick={() => setPickerLeftYear(y)}
                            >{y}</button>
                          ))}
                        </div>
                        <button
                          className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm mt-0.5"
                          onClick={() => setLeftYearStart(s => s + 1)}
                        >»</button>
                      </div>
                    </div>
                    <div className="flex justify-center gap-2 pt-3 border-t mt-3">
                      <Button size="sm" variant="default" className="bg-blue-500 h-7 px-5 text-xs" onClick={confirmLeftPicker}>확인</Button>
                      <Button size="sm" variant="outline" className="h-7 px-5 text-xs" onClick={() => setShowLeftPicker(false)}>취소</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-3 pt-3 pb-1">
                      <button
                        className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm"
                        onClick={() => setLeftMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                      >«</button>
                      <span
                        className="text-sm font-medium cursor-pointer hover:text-blue-600"
                        onClick={openLeftPicker}
                      >{format(leftMonth, "M월 yyyy", { locale: ko })} ▾</span>
                      <button
                        className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm"
                        onClick={() => setLeftMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                      >»</button>
                    </div>
                    <Calendar
                      mode="range"
                      selected={{ from: tempStartDate, to: tempEndDate }}
                      onSelect={(range) => {
                        setTempStartDate(range?.from);
                        setTempEndDate(range?.to);
                      }}
                      month={leftMonth}
                      onMonthChange={setLeftMonth}
                      locale={ko}
                      showOutsideDays={true}
                      fixedWeeks
                      classNames={{ caption: "hidden", nav: "hidden", month: "", day_outside: "day-outside aria-selected:bg-accent/50 aria-selected:text-muted-foreground !text-[#cccccc]" }}
                    />
                    <div className="flex justify-center pb-3">
                      <Button variant="outline" size="sm" className="h-7 px-6 text-xs" onClick={() => { setTempStartDate(today); setTempEndDate(today); }}>
                        오늘
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center px-2 text-gray-400 text-sm">~</div>

              {/* 오른쪽 캘린더 */}
              <div className="border rounded-md flex-1">
                {showRightPicker ? (
                  <div className="flex flex-col p-3 h-full">
                    <div className="flex gap-2 flex-1">
                      <div className="grid grid-cols-2 gap-1 flex-1">
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                          <button
                            key={m}
                            className={cn(
                              "rounded text-sm py-1.5 text-center",
                              pickerRightMonth === m - 1
                                ? "bg-blue-500 text-white font-semibold"
                                : "hover:bg-gray-100 text-gray-700"
                            )}
                            onClick={() => setPickerRightMonth(m - 1)}
                          >{m}월</button>
                        ))}
                      </div>
                      <div className="flex flex-col items-center border-l pl-2 w-20">
                        <button
                          className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm"
                          onClick={() => setRightYearStart(s => s - 1)}
                        >«</button>
                        <div className="flex flex-col gap-0.5 flex-1 w-full mt-0.5">
                          {Array.from({ length: 7 }, (_, i) => rightYearStart + i).map(y => (
                            <button
                              key={y}
                              className={cn(
                                "w-full rounded text-sm py-1 text-center",
                                pickerRightYear === y
                                  ? "bg-blue-500 text-white font-semibold"
                                  : "hover:bg-gray-100 text-gray-700"
                              )}
                              onClick={() => setPickerRightYear(y)}
                            >{y}</button>
                          ))}
                        </div>
                        <button
                          className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm mt-0.5"
                          onClick={() => setRightYearStart(s => s + 1)}
                        >»</button>
                      </div>
                    </div>
                    <div className="flex justify-center gap-2 pt-3 border-t mt-3">
                      <Button size="sm" variant="default" className="bg-blue-500 h-7 px-5 text-xs" onClick={confirmRightPicker}>확인</Button>
                      <Button size="sm" variant="outline" className="h-7 px-5 text-xs" onClick={() => setShowRightPicker(false)}>취소</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-3 pt-3 pb-1">
                      <button
                        className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm"
                        onClick={() => setRightMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                      >«</button>
                      <span
                        className="text-sm font-medium cursor-pointer hover:text-blue-600"
                        onClick={openRightPicker}
                      >{format(rightMonth, "M월 yyyy", { locale: ko })} ▾</span>
                      <button
                        className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm"
                        onClick={() => setRightMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                      >»</button>
                    </div>
                    <Calendar
                      mode="range"
                      selected={{ from: tempStartDate, to: tempEndDate }}
                      onSelect={(range) => {
                        setTempStartDate(range?.from);
                        setTempEndDate(range?.to);
                      }}
                      month={rightMonth}
                      onMonthChange={setRightMonth}
                      locale={ko}
                      showOutsideDays={true}
                      fixedWeeks
                      classNames={{ caption: "hidden", nav: "hidden", month: "", day_outside: "day-outside aria-selected:bg-accent/50 aria-selected:text-muted-foreground !text-[#cccccc]" }}
                    />
                    <div className="flex justify-center pb-3">
                      <Button variant="outline" size="sm" className="h-7 px-6 text-xs" onClick={() => { setTempStartDate(today); setTempEndDate(today); }}>
                        오늘
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 px-4 py-3 border-t">
            <Button
              variant="default"
              className="bg-blue-500 hover:bg-blue-600 h-8 px-4 text-sm"
              onClick={handleApplyDates}
              data-testid="button-apply-dates"
            >
              <Check className="h-4 w-4 mr-1" />
              적용
            </Button>
            <Button
              variant="outline"
              className="h-8 px-4 text-sm"
              onClick={handleCancelDates}
              data-testid="button-cancel-dates"
            >
              <X className="h-4 w-4 mr-1" />
              취소
            </Button>
          </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
