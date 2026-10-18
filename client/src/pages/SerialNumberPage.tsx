import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  Bell,
  Calendar as CalendarIcon,
  Search,
  Printer,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  format,
  subMonths,
  subYears,
  startOfMonth,
  differenceInDays,
  subDays,
  subWeeks,
  startOfWeek,
  endOfWeek,
  endOfMonth,
} from "date-fns";
import { ko } from "date-fns/locale";

interface StockItem {
  date: string;
  approvalNo: string;
  type: "매출" | "반품";
  category: ("전문" | "일반" | "급여" | "비급여" | "수급할인")[];
  productName: string;
  manufacturer: string;
  qty: number;
  unitPrice: number;
  amount: number;
  standardCode: string;
  insuranceCode: string;
  hasDetail: boolean;
}

interface DetailRow {
  category: string;
  expiryDate: string;
  lotNumber: string;
  serialNumber: string;
  qty: number;
}

const mockDetailData: Record<number, DetailRow[]> = {
  3: [
    { category: "출고", expiryDate: "2028-09-10", lotNumber: "GMH2509007", serialNumber: "25CAB200000VMK", qty: 1 },
    { category: "출고", expiryDate: "2028-09-10", lotNumber: "GMH2509007", serialNumber: "25CAB200000VML", qty: 1 },
    { category: "출고", expiryDate: "2028-09-10", lotNumber: "GMH2509007", serialNumber: "25CAB200000VMQ", qty: 1 },
    { category: "출고", expiryDate: "2028-09-10", lotNumber: "GMH2509007", serialNumber: "25CAB200000VMR", qty: 1 },
    { category: "출고", expiryDate: "2028-09-10", lotNumber: "GMH2509007", serialNumber: "25CAB200000YE8", qty: 1 },
  ],
  4: [
    { category: "출고", expiryDate: "2027-06-30", lotNumber: "BKW2506012", serialNumber: "25BKW100000AAA", qty: 1 },
    { category: "출고", expiryDate: "2027-06-30", lotNumber: "BKW2506012", serialNumber: "25BKW100000AAB", qty: 1 },
  ],
  5: [
    { category: "출고", expiryDate: "2027-12-31", lotNumber: "SJP2512001", serialNumber: "25SJP200000XAA", qty: 1 },
    { category: "출고", expiryDate: "2027-12-31", lotNumber: "SJP2512001", serialNumber: "25SJP200000XAB", qty: 1 },
  ],
  6: [
    { category: "출고", expiryDate: "2028-03-15", lotNumber: "DWB2503011", serialNumber: "25DWB300000BAA", qty: 1 },
    { category: "출고", expiryDate: "2028-03-15", lotNumber: "DWB2503011", serialNumber: "25DWB300000BAB", qty: 1 },
  ],
  7: [
    { category: "출고", expiryDate: "2027-08-20", lotNumber: "HDK2508003", serialNumber: "25HDK400000CAA", qty: 1 },
    { category: "출고", expiryDate: "2027-08-20", lotNumber: "HDK2508003", serialNumber: "25HDK400000CAB", qty: 1 },
    { category: "출고", expiryDate: "2027-08-20", lotNumber: "HDK2508003", serialNumber: "25HDK400000CAC", qty: 1 },
    { category: "출고", expiryDate: "2027-08-20", lotNumber: "HDK2508003", serialNumber: "25HDK400000CAD", qty: 1 },
  ],
  10: [
    { category: "출고", expiryDate: "2026-11-30", lotNumber: "DWP2611022", serialNumber: "25DWP500000DAA", qty: 1 },
    { category: "출고", expiryDate: "2026-11-30", lotNumber: "DWP2611022", serialNumber: "25DWP500000DAB", qty: 1 },
    { category: "출고", expiryDate: "2026-11-30", lotNumber: "DWP2611022", serialNumber: "25DWP500000DAC", qty: 1 },
    { category: "출고", expiryDate: "2026-11-30", lotNumber: "DWP2611022", serialNumber: "25DWP500000DAD", qty: 1 },
  ],
  12: [
    { category: "출고", expiryDate: "2027-04-30", lotNumber: "TJP2504018", serialNumber: "25TJP600000EAA", qty: 1 },
    { category: "출고", expiryDate: "2027-04-30", lotNumber: "TJP2504018", serialNumber: "25TJP600000EAB", qty: 1 },
    { category: "출고", expiryDate: "2027-04-30", lotNumber: "TJP2504018", serialNumber: "25TJP600000EAC", qty: 1 },
    { category: "출고", expiryDate: "2027-04-30", lotNumber: "TJP2504018", serialNumber: "25TJP600000EAD", qty: 1 },
    { category: "출고", expiryDate: "2027-04-30", lotNumber: "TJP2504018", serialNumber: "25TJP600000EAE", qty: 1 },
    { category: "출고", expiryDate: "2027-04-30", lotNumber: "TJP2504018", serialNumber: "25TJP600000EAF", qty: 1 },
  ],
  14: [
    { category: "출고", expiryDate: "2027-09-15", lotNumber: "BIG2509031", serialNumber: "25BIG700000FAA", qty: 1 },
    { category: "출고", expiryDate: "2027-09-15", lotNumber: "BIG2509031", serialNumber: "25BIG700000FAB", qty: 1 },
    { category: "출고", expiryDate: "2027-09-15", lotNumber: "BIG2509031", serialNumber: "25BIG700000FAC", qty: 1 },
  ],
};

const mockData: StockItem[] = [
  {
    date: "2026-02-27",
    approvalNo: "01012",
    type: "매출",
    category: ["일반", "비급여"],
    productName: "비타블루쥬비덴탈포유정 120T(60T*2EA)",
    manufacturer: "초당약품",
    qty: 1,
    unitPrice: 32000,
    amount: 32000,
    standardCode: "",
    insuranceCode: "",
    hasDetail: false,
  },
  {
    date: "2026-02-27",
    approvalNo: "01011",
    type: "매출",
    category: ["일반", "비급여"],
    productName: "파인톰젤라틴스5mg(파인드림)(제약사물질) 60T(30T*2EA)",
    manufacturer: "초당약품",
    qty: 2,
    unitPrice: 19500,
    amount: 39000,
    standardCode: "",
    insuranceCode: "",
    hasDetail: false,
  },
  {
    date: "2026-02-27",
    approvalNo: "01010",
    type: "매출",
    category: ["일반"],
    productName: "기세이에프정120mg(SK) 200T(100T*2EA)",
    manufacturer: "초당약품",
    qty: 1,
    unitPrice: 29700,
    amount: 29700,
    standardCode: "8806447046814",
    insuranceCode: "",
    hasDetail: false,
  },
  {
    date: "2026-02-27",
    approvalNo: "00675",
    type: "매출",
    category: ["전문", "급여"],
    productName: "글리벡정2mg 30T",
    manufacturer: "동아에스티",
    qty: 5,
    unitPrice: 5340,
    amount: 26700,
    standardCode: "8806425001712",
    insuranceCode: "642500170",
    hasDetail: true,
  },
  {
    date: "2026-02-27",
    approvalNo: "00675",
    type: "매출",
    category: ["전문", "급여"],
    productName: "악캡셀25mg 56C",
    manufacturer: "부광약품",
    qty: 2,
    unitPrice: 18032,
    amount: 36064,
    standardCode: "8806422018416",
    insuranceCode: "642210840",
    hasDetail: true,
  },
  {
    date: "2026-02-27",
    approvalNo: "00675",
    type: "매출",
    category: ["전문", "급여"],
    productName: "뉴미가사방정50mg 100T",
    manufacturer: "삼진제약",
    qty: 2,
    unitPrice: 32400,
    amount: 64800,
    standardCode: "8806478051139",
    insuranceCode: "647805110",
    hasDetail: true,
  },
  {
    date: "2026-02-27",
    approvalNo: "00675",
    type: "매출",
    category: ["전문", "급여"],
    productName: "베아캡트정10mg 30T",
    manufacturer: "대웅바이오",
    qty: 2,
    unitPrice: 66390,
    amount: 132780,
    standardCode: "8806940011012",
    insuranceCode: "694001100",
    hasDetail: true,
  },
  {
    date: "2026-02-27",
    approvalNo: "00675",
    type: "매출",
    category: ["전문", "급여"],
    productName: "테넬리아정20mg 30T",
    manufacturer: "한독",
    qty: 4,
    unitPrice: 21960,
    amount: 87840,
    standardCode: "8806521050515",
    insuranceCode: "652105050",
    hasDetail: true,
  },
  {
    date: "2026-02-26",
    approvalNo: "00086",
    type: "반품",
    category: ["수급할인"],
    productName: "수급할인 1T",
    manufacturer: "",
    qty: 0,
    unitPrice: 0,
    amount: -111340,
    standardCode: "",
    insuranceCode: "",
    hasDetail: false,
  },
  {
    date: "2026-02-26",
    approvalNo: "00171",
    type: "매출",
    category: ["일반", "급여"],
    productName: "대한관류액멸균생리식염수 1000mL",
    manufacturer: "대한약품공업",
    qty: 20,
    unitPrice: 1000,
    amount: 20000,
    standardCode: "8806451003414",
    insuranceCode: "645100341",
    hasDetail: false,
  },
  {
    date: "2026-02-26",
    approvalNo: "00170",
    type: "매출",
    category: ["전문", "급여"],
    productName: "액시드캡슐150mg 100C",
    manufacturer: "대웅제약",
    qty: 4,
    unitPrice: 30800,
    amount: 123200,
    standardCode: "8806416019139",
    insuranceCode: "641601910",
    hasDetail: true,
  },
  {
    date: "2026-02-26",
    approvalNo: "00170",
    type: "매출",
    category: ["일반", "비급여"],
    productName: "에크크림13g(지발파) 1EA",
    manufacturer: "동아제약",
    qty: 3,
    unitPrice: 9100,
    amount: 27300,
    standardCode: "8806497024015",
    insuranceCode: "",
    hasDetail: false,
  },
  {
    date: "2026-02-26",
    approvalNo: "00170",
    type: "매출",
    category: ["전문", "급여"],
    productName: "뉴히알유니장안액0.15%/0.45mL 60EA",
    manufacturer: "태준제약",
    qty: 6,
    unitPrice: 14880,
    amount: 89280,
    standardCode: "8806501029135",
    insuranceCode: "650102911",
    hasDetail: true,
  },
  {
    date: "2026-02-26",
    approvalNo: "00170",
    type: "매출",
    category: ["일반", "비급여"],
    productName: "카네스텐크림20g(바이엘)(비급여) 1EA",
    manufacturer: "유한양행",
    qty: 2,
    unitPrice: 11300,
    amount: 22600,
    standardCode: "8806411003317",
    insuranceCode: "",
    hasDetail: false,
  },
  {
    date: "2026-02-26",
    approvalNo: "00170",
    type: "매출",
    category: ["전문", "급여"],
    productName: "트라젠타듀오정2.5/1000mg 60T",
    manufacturer: "베링거인겔하임",
    qty: 3,
    unitPrice: 48200,
    amount: 144600,
    standardCode: "8806491029037",
    insuranceCode: "649102903",
    hasDetail: true,
  },
];

const periodOptions = [
  { id: "today", label: "당일" },
  { id: "lastMonth", label: "전월" },
  { id: "3months", label: "3개월" },
  { id: "6months", label: "6개월" },
  { id: "1year", label: "1년" },
  { id: "2years", label: "2년" },
  { id: "3years", label: "3년" },
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

function CategoryBadge({ cat }: { cat: string }) {
  if (cat === "전문") return <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-purple-50 text-purple-700 border-purple-200 font-normal">전문</Badge>;
  if (cat === "일반") return <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-green-50 text-green-700 border-green-200 font-normal">일반</Badge>;
  if (cat === "급여") return <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-blue-50 text-blue-700 border-blue-200 font-normal">급여</Badge>;
  if (cat === "비급여") return <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-gray-50 text-gray-600 border-gray-200 font-normal">비급여</Badge>;
  if (cat === "수급할인") return <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-orange-50 text-orange-700 border-orange-200 font-normal">수급할인</Badge>;
  return null;
}

export default function SerialNumberPage() {
  const today = new Date();

  const [activePeriod, setActivePeriod] = useState("3months");
  const [startDate, setStartDate] = useState<Date>(subMonths(today, 3));
  const [endDate, setEndDate] = useState<Date>(today);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(subMonths(today, 3));
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(today);
  const [startMonth, setStartMonth] = useState<Date>(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
  const [endMonth, setEndMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedQuickOption, setSelectedQuickOption] = useState<string>("최근 3개월");

  const [filterAll, setFilterAll] = useState(true);
  const [filterJeonmun, setFilterJeonmun] = useState(false);
  const [filterIlban, setFilterIlban] = useState(false);
  const [filterGeupyeo, setFilterGeupyeo] = useState(false);
  const [filterBigeupyeo, setFilterBigeupyeo] = useState(false);
  const [filterBigyo, setFilterBigyo] = useState(false);
  const [filterSugeup, setFilterSugeup] = useState(false);

  const [searchCategory, setSearchCategory] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchManufacturer, setSearchManufacturer] = useState("");

  const [appliedCategory, setAppliedCategory] = useState("all");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [appliedManufacturer, setAppliedManufacturer] = useState("");

  const filteredData = mockData.filter((row) => {
    if (appliedKeyword) {
      const kw = appliedKeyword.toLowerCase();
      if (appliedCategory === "product") {
        if (!row.productName.toLowerCase().includes(kw)) return false;
      } else if (appliedCategory === "insurance") {
        if (!row.insuranceCode.toLowerCase().includes(kw)) return false;
      } else {
        if (!row.productName.toLowerCase().includes(kw) && !row.insuranceCode.toLowerCase().includes(kw)) return false;
      }
    }
    if (appliedManufacturer) {
      if (!row.manufacturer.toLowerCase().includes(appliedManufacturer.toLowerCase())) return false;
    }
    return true;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const totalCount = appliedKeyword || appliedManufacturer ? filteredData.length : 775;
  const totalPages = Math.ceil(totalCount / pageSize);

  const totalAmount = 40161860;

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetailIdx, setSelectedDetailIdx] = useState<number | null>(null);

  const openDetail = (idx: number) => {
    setSelectedDetailIdx(idx);
    setIsDetailOpen(true);
  };

  const selectedItem = selectedDetailIdx !== null ? mockData[selectedDetailIdx] : null;
  const selectedDetails = selectedDetailIdx !== null ? (mockDetailData[selectedDetailIdx] ?? []) : [];

  const applyPeriod = (id: string) => {
    setActivePeriod(id);
    const now = new Date();
    switch (id) {
      case "today":
        setStartDate(now);
        setEndDate(now);
        break;
      case "lastMonth":
        setStartDate(startOfMonth(subMonths(now, 1)));
        setEndDate(endOfMonth(subMonths(now, 1)));
        break;
      case "3months":
        setStartDate(subMonths(now, 3));
        setEndDate(now);
        break;
      case "6months":
        setStartDate(subMonths(now, 6));
        setEndDate(now);
        break;
      case "1year":
        setStartDate(subYears(now, 1));
        setEndDate(now);
        break;
      case "2years":
        setStartDate(subYears(now, 2));
        setEndDate(now);
        break;
      case "3years":
        setStartDate(subYears(now, 3));
        setEndDate(now);
        break;
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

  const handleOpenCalendar = () => {
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

  const getDayCount = () => {
    if (tempStartDate && tempEndDate) return differenceInDays(tempEndDate, tempStartDate) + 1;
    return 0;
  };

  return (
    <div className="wos-page h-full overflow-auto p-4">
      {/* Page header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold" data-testid="text-page-title">품목수불</h1>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>수불건수</span>
            <span className="font-semibold text-gray-900">{totalCount.toLocaleString()}건</span>
            <span className="text-gray-400">|</span>
            <span>수불금액</span>
            <span className="font-semibold text-blue-600">{totalAmount.toLocaleString()}원</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Bell className="h-4 w-4 text-blue-600" />
            <span className="font-medium">공지사항</span>
            <span className="text-gray-500">타사이트를 통한 주문 관련 공...</span>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <span>①</span>
              <span>②</span>
            </div>
          </div>
          <div className="flex items-center border rounded overflow-hidden shrink-0">
            {periodOptions.map((option, index) => (
              <button
                key={option.id}
                className={`h-5 px-1.5 text-[10px] whitespace-nowrap ${index < periodOptions.length - 1 ? "border-r" : ""} ${activePeriod === option.id ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                onClick={() => applyPeriod(option.id)}
                data-testid={`button-period-${option.id}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Card className="rounded-sm">
        <CardContent className="p-4">
          {/* Filter checkboxes */}
          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center gap-1 cursor-pointer">
              <Checkbox checked={filterAll} onCheckedChange={(v) => setFilterAll(v as boolean)} className="h-3 w-3" data-testid="checkbox-filter-all" />
              <span className="text-xs">전체</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <Checkbox checked={filterJeonmun} onCheckedChange={(v) => setFilterJeonmun(v as boolean)} className="h-3 w-3" data-testid="checkbox-filter-jeonmun" />
              <span className="text-xs">전문</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <Checkbox checked={filterIlban} onCheckedChange={(v) => setFilterIlban(v as boolean)} className="h-3 w-3" data-testid="checkbox-filter-ilban" />
              <span className="text-xs">일반</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <Checkbox checked={filterGeupyeo} onCheckedChange={(v) => setFilterGeupyeo(v as boolean)} className="h-3 w-3" data-testid="checkbox-filter-geupyeo" />
              <span className="text-xs">급여</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <Checkbox checked={filterBigeupyeo} onCheckedChange={(v) => setFilterBigeupyeo(v as boolean)} className="h-3 w-3" data-testid="checkbox-filter-bigeupyeo" />
              <span className="text-xs">비급여</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <Checkbox checked={filterBigyo} onCheckedChange={(v) => setFilterBigyo(v as boolean)} className="h-3 w-3" data-testid="checkbox-filter-bigyo" />
              <span className="text-xs">비교세</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <Checkbox checked={filterSugeup} onCheckedChange={(v) => setFilterSugeup(v as boolean)} className="h-3 w-3" data-testid="checkbox-filter-sugeup" />
              <span className="text-xs">수급할인</span>
            </label>
          </div>

          {/* Search row */}
          <div className="flex items-center gap-2 mb-4">
            <Select value={searchCategory} onValueChange={setSearchCategory}>
              <SelectTrigger className="h-8 w-20 text-xs" data-testid="select-search-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="product">품목</SelectItem>
                <SelectItem value="insurance">보험코드</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="품목/보험/표준코드 입력"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setAppliedCategory(searchCategory); setAppliedKeyword(searchKeyword); setAppliedManufacturer(searchManufacturer); setCurrentPage(1); } }}
              className="h-8 text-xs w-44"
              data-testid="input-search-keyword"
            />
            <Input
              placeholder="제약회사명 입력"
              value={searchManufacturer}
              onChange={(e) => setSearchManufacturer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setAppliedCategory(searchCategory); setAppliedKeyword(searchKeyword); setAppliedManufacturer(searchManufacturer); setCurrentPage(1); } }}
              className="h-8 text-xs w-36"
              data-testid="input-search-manufacturer"
            />

            {/* Date range */}
            <div className="flex items-center border rounded h-8">
              <button
                className="flex items-center gap-1.5 px-2 text-xs hover:bg-gray-50 h-full"
                onClick={handleOpenCalendar}
                data-testid="button-open-calendar"
              >
                <span>{format(startDate, "yyyy-MM-dd")}</span>
                <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
              </button>
              <span className="text-gray-400 text-xs px-1">~</span>
              <button
                className="flex items-center gap-1.5 px-2 text-xs hover:bg-gray-50 h-full"
                onClick={handleOpenCalendar}
                data-testid="button-open-calendar-end"
              >
                <span>{format(endDate, "yyyy-MM-dd")}</span>
                <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
              </button>
            </div>

            <Button size="sm" className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-search" onClick={() => { setAppliedCategory(searchCategory); setAppliedKeyword(searchKeyword); setAppliedManufacturer(searchManufacturer); setCurrentPage(1); }}>
              <Search className="h-3.5 w-3.5 mr-1" />
              조회
            </Button>

            <div className="flex-1" />

            <Button variant="outline" size="sm" className="h-8 px-2 text-xs" data-testid="button-print">
              <Printer className="h-3.5 w-3.5 mr-1" />
              출력
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-2 text-xs" data-testid="button-excel">
              <FileSpreadsheet className="h-3.5 w-3.5 mr-1" />
              엑셀
            </Button>
          </div>

          {/* Table */}
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="h-8">
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-24 whitespace-nowrap">일자</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-16 whitespace-nowrap">전표번호</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-12 whitespace-nowrap">종류</TableHead>
                <TableHead className="h-8 py-1 text-xs text-left font-medium">품목 및 규격</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-28 whitespace-nowrap">제약회사</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-12 whitespace-nowrap">수량</TableHead>
                <TableHead className="h-8 py-1 text-xs text-right font-medium w-20 whitespace-nowrap">단가</TableHead>
                <TableHead className="h-8 py-1 text-xs text-right font-medium w-24 whitespace-nowrap">금액</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-32 whitespace-nowrap">표준코드</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-28 whitespace-nowrap">보험코드</TableHead>
                <TableHead className="h-8 py-1 text-xs text-center font-medium w-16 whitespace-nowrap">일련번호</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, idx) => {
                const isNegative = row.amount < 0;
                return (
                  <TableRow
                    key={idx}
                    className="h-8"
                    data-testid={`row-stock-${idx}`}
                  >
                    <TableCell className="py-1 text-xs text-center whitespace-nowrap">{row.date}</TableCell>
                    <TableCell className="py-1 text-xs text-center">{row.approvalNo}</TableCell>
                    <TableCell className="py-1 text-xs text-center">
                      {row.type === "매출" ? (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-blue-50 text-blue-700 border-blue-200 font-normal">
                          매출
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-red-50 text-red-700 border-red-200 font-normal">
                          반품
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-1 text-xs text-left">
                      <div className="flex items-center gap-1 flex-wrap">
                        {row.category.map((cat) => (
                          <CategoryBadge key={cat} cat={cat} />
                        ))}
                        <span className={isNegative ? "text-red-600" : ""}>{row.productName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 text-xs text-center">{row.manufacturer}</TableCell>
                    <TableCell className="py-1 text-xs text-center">{row.qty > 0 ? row.qty : ""}</TableCell>
                    <TableCell className="py-1 text-xs text-right">
                      {row.unitPrice > 0 ? row.unitPrice.toLocaleString() : ""}
                    </TableCell>
                    <TableCell className={`py-1 text-xs text-right font-medium ${isNegative ? "text-red-600" : ""}`}>
                      {row.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-1 text-xs text-center text-gray-600">{row.standardCode}</TableCell>
                    <TableCell className="py-1 text-xs text-center text-gray-600">{row.insuranceCode}</TableCell>
                    <TableCell className="py-1 text-xs text-center">
                      {row.hasDetail && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-5 px-1.5 text-[10px]"
                          data-testid={`button-detail-${idx}`}
                          onClick={() => openDetail(idx)}
                        >
                          상세보기
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>페이지당</span>
              <Select defaultValue="15">
                <SelectTrigger className="h-6 w-14 text-xs" data-testid="select-page-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>
                {totalCount.toLocaleString()}건 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)}
              </span>
              <div className="flex items-center border rounded overflow-hidden">
                <button
                  className="px-2 h-6 hover:bg-gray-50 text-gray-500 border-r"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  data-testid="button-page-prev"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  className="px-2 h-6 hover:bg-gray-50 text-gray-500"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  data-testid="button-page-next"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl p-0" data-testid="dialog-detail">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold">유효기간/제조번호</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <p className="text-sm font-semibold text-gray-700 mt-3 mb-3">품목수불상세</p>
            {selectedItem && (
              <p className="text-xs text-gray-500 mb-3">
                {selectedItem.productName} ({selectedItem.manufacturer})
              </p>
            )}
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="h-9">
                  <TableHead className="h-9 py-1 text-xs text-center font-medium w-20">분류</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium w-28">유효기간</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium w-32">제조번호</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium">일련번호</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium w-16">수량</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedDetails.length > 0 ? (
                  selectedDetails.map((detail, i) => (
                    <TableRow key={i} className="h-9" data-testid={`row-detail-${i}`}>
                      <TableCell className="py-1 text-xs text-center">{detail.category}</TableCell>
                      <TableCell className="py-1 text-xs text-center">{detail.expiryDate}</TableCell>
                      <TableCell className="py-1 text-xs text-center">{detail.lotNumber}</TableCell>
                      <TableCell className="py-1 text-xs text-center font-mono">{detail.serialNumber}</TableCell>
                      <TableCell className="py-1 text-xs text-center">{detail.qty}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-6 text-xs text-center text-gray-400">
                      상세 정보가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter className="px-6 pb-4 border-t pt-4">
            <Button size="sm" variant="outline" onClick={() => setIsDetailOpen(false)} data-testid="button-detail-close">
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
