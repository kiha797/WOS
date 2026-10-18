import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { format, subDays, subWeeks, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";

type PeriodType = "thisMonth" | "lastMonth" | "3months" | "6months" | "1year" | "2years" | "3years";

const periodLabels: Record<PeriodType, string> = {
  thisMonth: "당월",
  lastMonth: "전월",
  "3months": "3개월",
  "6months": "6개월",
  "1year": "1년",
  "2years": "2년",
  "3years": "3년",
};

function getDateRange(period: PeriodType): { start: Date; end: Date } {
  const today = new Date();
  const end = today;
  let start: Date;
  switch (period) {
    case "thisMonth": start = startOfMonth(today); break;
    case "lastMonth": start = startOfMonth(subMonths(today, 1)); break;
    case "3months": start = subMonths(today, 3); break;
    case "6months": start = subMonths(today, 6); break;
    case "1year": start = subMonths(today, 12); break;
    case "2years": start = subMonths(today, 24); break;
    case "3years": start = subMonths(today, 36); break;
    default: start = subMonths(today, 6);
  }
  return { start, end };
}

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

const mockNoticeData = [
  { date: "2026-02-06", company: "한국오노약품공업...", badges: ["급여", "전문"], name: "옵디보주240mg(1관/생물학) 24 mL*1V", lotNo: "2343FA", reason: "메모" },
  { date: "2026-02-06", company: "한국오노약품공업...", badges: ["급여", "전문"], name: "옵디보주240mg(1관/생물학) 24 mL*1V", lotNo: "2343FB", reason: "메모" },
  { date: "2026-02-06", company: "한국오노약품공업...", badges: ["급여", "전문"], name: "옵디보주240mg(1관/생물학) 24 mL*1V", lotNo: "2343FC", reason: "메모" },
  { date: "2026-02-06", company: "한국오노약품공업...", badges: ["급여", "전문"], name: "옵디보주240mg(1관/생물학) 24 mL*1V", lotNo: "2349FA", reason: "메모" },
  { date: "2026-02-06", company: "한국오노약품공업...", badges: ["급여", "전문"], name: "옵디보주240mg(1관/생물학) 24 mL*1V", lotNo: "2349FB", reason: "메모" },
  { date: "2026-02-06", company: "한국오노약품공업...", badges: ["급여", "전문"], name: "옵디보주240mg(1관/생물학) 24 mL*1V", lotNo: "2544FA", reason: "메모" },
  { date: "2026-02-05", company: "미래제약(주)", badges: ["비급여", "전문"], name: "젤라틴엑스정 10T", lotNo: "2403", reason: "" },
  { date: "2026-02-05", company: "한국오노약품공업...", badges: ["급여", "전문"], name: "옵디보주100mg(1관/생물학) 10 mL*1V", lotNo: "2342FA", reason: "메모" },
  { date: "2026-02-05", company: "한국오노약품공업...", badges: ["급여", "전문"], name: "옵디보주100mg(1관/생물학) 10 mL*1V", lotNo: "2343FB", reason: "메모" },
  { date: "2026-02-05", company: "한국오노약품공업...", badges: ["급여", "전문"], name: "옵디보주100mg(1관/생물학) 10 mL*1V", lotNo: "2345FA", reason: "메모" },
  { date: "2026-02-05", company: "한국오노약품공업...", badges: ["급여", "전문"], name: "옵디보주100mg(1관/생물학) 10 mL*1V", lotNo: "2345FB", reason: "메모" },
  { date: "2026-02-05", company: "한국오노약품공업...", badges: ["급여", "전문"], name: "옵디보주100mg(1관/생물학) 10 mL*1V", lotNo: "2345FC", reason: "메모" },
];

const mockShipmentData = [
  { shipDate: "2026-02-02", noticeDate: "2020-06-01", company: "대웅바이오(주)", badges: ["급여", "전문"], name: "다이어플린엑스알서방정1000mg 30T", lotNo: "25DX1033", qty: 2 },
  { shipDate: "2026-02-02", noticeDate: "2020-06-01", company: "대웅바이오(주)", badges: ["급여", "전문"], name: "다이어플린엑스알서방정1000mg 30T", lotNo: "25DX1052", qty: 2 },
  { shipDate: "2025-10-28", noticeDate: "2026-01-07", company: "한국다이이찌산쿄", badges: [], name: "올메텍플러스정20/12.5mg(특정로트회수) 30T", lotNo: "E06583A", qty: 2 },
];

export default function RecalledMedicinesPage() {
  const today = new Date();

  const [leftPeriod, setLeftPeriod] = useState<PeriodType>("6months");
  const [rightPeriod, setRightPeriod] = useState<PeriodType>("6months");

  const leftRange = getDateRange("6months");
  const rightRange = getDateRange("6months");

  const [leftStartDate, setLeftStartDate] = useState<Date>(leftRange.start);
  const [leftEndDate, setLeftEndDate] = useState<Date>(leftRange.end);
  const [rightStartDate, setRightStartDate] = useState<Date>(rightRange.start);
  const [rightEndDate, setRightEndDate] = useState<Date>(rightRange.end);

  const [leftProductSearch, setLeftProductSearch] = useState("");
  const [leftCompanySearch, setLeftCompanySearch] = useState("");
  const [includeNoDate, setIncludeNoDate] = useState(false);

  const [rightProductSearch, setRightProductSearch] = useState("");
  const [rightCompanySearch, setRightCompanySearch] = useState("");

  const [leftPage, setLeftPage] = useState(1);
  const [rightPage, setRightPage] = useState(1);
  const [leftPerPage, setLeftPerPage] = useState("15");
  const [rightPerPage, setRightPerPage] = useState("15");

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<"left" | "right">("left");
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(leftRange.start);
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(leftRange.end);
  const [calStartMonth, setCalStartMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const [calEndMonth, setCalEndMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedQuickOption, setSelectedQuickOption] = useState<string>("이번달");

  const handleLeftPeriodChange = (p: PeriodType) => {
    setLeftPeriod(p);
    const range = getDateRange(p);
    setLeftStartDate(range.start);
    setLeftEndDate(range.end);
  };

  const handleRightPeriodChange = (p: PeriodType) => {
    setRightPeriod(p);
    const range = getDateRange(p);
    setRightStartDate(range.start);
    setRightEndDate(range.end);
  };

  const openCalendar = (target: "left" | "right") => {
    setCalendarTarget(target);
    const sd = target === "left" ? leftStartDate : rightStartDate;
    const ed = target === "left" ? leftEndDate : rightEndDate;
    setTempStartDate(sd);
    setTempEndDate(ed);
    setCalStartMonth(new Date(sd.getFullYear(), sd.getMonth(), 1));
    setCalEndMonth(new Date(ed.getFullYear(), ed.getMonth(), 1));
    setSelectedQuickOption("");
    setIsCalendarOpen(true);
  };

  const applyQuickOption = (optionId: string) => {
    setSelectedQuickOption(quickOptions.find(o => o.id === optionId)?.label || "");
    switch (optionId) {
      case "today": setTempStartDate(today); setTempEndDate(today); break;
      case "yesterday": setTempStartDate(subDays(today, 1)); setTempEndDate(subDays(today, 1)); break;
      case "thisWeek": setTempStartDate(startOfWeek(today, { weekStartsOn: 0 })); setTempEndDate(endOfWeek(today, { weekStartsOn: 0 })); break;
      case "lastWeek": setTempStartDate(startOfWeek(subWeeks(today, 1), { weekStartsOn: 0 })); setTempEndDate(endOfWeek(subWeeks(today, 1), { weekStartsOn: 0 })); break;
      case "last7Include": setTempStartDate(subDays(today, 6)); setTempEndDate(today); break;
      case "last7Exclude": setTempStartDate(subDays(today, 7)); setTempEndDate(subDays(today, 1)); break;
      case "thisMonth": setTempStartDate(startOfMonth(today)); setTempEndDate(endOfMonth(today)); break;
      case "lastMonth": setTempStartDate(startOfMonth(subMonths(today, 1))); setTempEndDate(endOfMonth(subMonths(today, 1))); break;
      case "last30Include": setTempStartDate(subDays(today, 29)); setTempEndDate(today); break;
      case "last30Exclude": setTempStartDate(subDays(today, 30)); setTempEndDate(subDays(today, 1)); break;
    }
  };

  const handleConfirmDates = () => {
    if (tempStartDate && tempEndDate) {
      if (calendarTarget === "left") {
        setLeftStartDate(tempStartDate);
        setLeftEndDate(tempEndDate);
      } else {
        setRightStartDate(tempStartDate);
        setRightEndDate(tempEndDate);
      }
    }
    setIsCalendarOpen(false);
  };

  const handleCancelDates = () => {
    setIsCalendarOpen(false);
  };

  const navigateDates = (target: "left" | "right", direction: "prev" | "next") => {
    const sd = target === "left" ? leftStartDate : rightStartDate;
    const ed = target === "left" ? leftEndDate : rightEndDate;
    const days = differenceInDays(ed, sd);
    let newStart: Date, newEnd: Date;
    if (direction === "prev") {
      newStart = subDays(sd, days + 1);
      newEnd = subDays(ed, days + 1);
    } else {
      newStart = new Date(sd.getTime() + (days + 1) * 86400000);
      newEnd = new Date(ed.getTime() + (days + 1) * 86400000);
    }
    if (target === "left") {
      setLeftStartDate(newStart);
      setLeftEndDate(newEnd);
    } else {
      setRightStartDate(newStart);
      setRightEndDate(newEnd);
    }
  };

  const getDayCount = () => {
    if (tempStartDate && tempEndDate) {
      return differenceInDays(tempEndDate, tempStartDate) + 1;
    }
    return 0;
  };

  const leftTotalItems = mockNoticeData.length;
  const leftTotalPages = Math.ceil(leftTotalItems / parseInt(leftPerPage));
  const rightTotalItems = mockShipmentData.length;
  const rightTotalPages = Math.ceil(rightTotalItems / parseInt(rightPerPage));

  const renderDateNav = (target: "left" | "right", label: string) => {
    const sd = target === "left" ? leftStartDate : rightStartDate;
    const ed = target === "left" ? leftEndDate : rightEndDate;
    const currentPeriod = target === "left" ? leftPeriod : rightPeriod;
    const handlePeriod = target === "left" ? handleLeftPeriodChange : handleRightPeriodChange;

    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-600 shrink-0">{label}</span>
        <div className="flex items-center border rounded h-7">
          <button
            className="px-1.5 h-full hover:bg-gray-50 text-gray-500"
            onClick={() => navigateDates(target, "prev")}
            data-testid={`button-${target}-date-prev`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            className="flex items-center gap-1.5 px-2 text-xs hover:bg-gray-50"
            onClick={() => openCalendar(target)}
            data-testid={`button-${target}-open-calendar`}
          >
            <span>{format(sd, "yyyy.MM.dd.")} ~ {format(ed, "yyyy.MM.dd.")}</span>
            <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
          </button>
          <button
            className="px-1.5 h-full hover:bg-gray-50 text-gray-500 border-l"
            onClick={() => navigateDates(target, "next")}
            data-testid={`button-${target}-date-next`}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex items-center border rounded overflow-hidden shrink-0">
          {(Object.keys(periodLabels) as PeriodType[]).map((key) => (
            <button
              key={key}
              className={`h-6 px-2 text-[11px] border-r last:border-r-0 whitespace-nowrap ${currentPeriod === key ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              onClick={() => handlePeriod(key)}
              data-testid={`button-${target}-period-${key}`}
            >
              {periodLabels[key]}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="wos-page flex flex-col h-full p-4 gap-3 overflow-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-extrabold" data-testid="text-page-title">회수품목내용</h1>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Bell className="h-3.5 w-3.5" />
          <span>공지사항</span>
          <span className="text-blue-600 hover:underline cursor-pointer" data-testid="link-notice">타사이트를 통한 주문 관련 공...</span>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 flex flex-col border rounded bg-white min-w-0">
          <div className="px-3 pt-3 pb-2 border-b space-y-2">
            <h2 className="text-[15px] font-extrabold" data-testid="text-left-title">회수품목 고시정보</h2>
            {renderDateNav("left", "고시일자")}
            <div className="flex items-center gap-2 flex-wrap">
              <Input
                placeholder="품목명/보험코드 입력"
                value={leftProductSearch}
                onChange={(e) => setLeftProductSearch(e.target.value)}
                className="h-7 text-xs w-40"
                data-testid="input-left-product"
              />
              <Input
                placeholder="제약회사명 입력"
                value={leftCompanySearch}
                onChange={(e) => setLeftCompanySearch(e.target.value)}
                className="h-7 text-xs w-32"
                data-testid="input-left-company"
              />
              <Button size="sm" className="h-7 px-4 text-xs bg-gray-800 hover:bg-gray-900" data-testid="button-left-search">
                검색
              </Button>
              <div className="flex items-center gap-1">
                <Checkbox
                  id="includeNoDate"
                  checked={includeNoDate}
                  onCheckedChange={(v) => setIncludeNoDate(v === true)}
                  className="h-3.5 w-3.5"
                  data-testid="checkbox-include-no-date"
                />
                <label htmlFor="includeNoDate" className="text-[11px] text-gray-600 cursor-pointer">고시일자 없는 경우 포함</label>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow className="h-8">
                  <TableHead className="h-8 py-1 text-[11px] text-center font-extrabold whitespace-nowrap">고시일자</TableHead>
                  <TableHead className="h-8 py-1 text-[11px] text-center font-extrabold whitespace-nowrap">제약회사</TableHead>
                  <TableHead className="h-8 py-1 text-[11px] font-extrabold whitespace-nowrap">품목 및 규격</TableHead>
                  <TableHead className="h-8 py-1 text-[11px] text-center font-extrabold whitespace-nowrap">제조번호</TableHead>
                  <TableHead className="h-8 py-1 text-[11px] text-center font-extrabold whitespace-nowrap">회수사유</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockNoticeData.map((item, idx) => (
                  <TableRow key={idx} className="h-7 hover:bg-blue-50 border-b">
                    <TableCell className="py-0.5 px-2 text-[11px] text-center whitespace-nowrap">{item.date}</TableCell>
                    <TableCell className="py-0.5 px-2 text-[11px] text-left whitespace-nowrap">{item.company}</TableCell>
                    <TableCell className="py-0.5 px-2 text-[11px]">
                      <div className="flex items-center gap-1">
                        {item.badges.map((badge, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className={`h-4 px-1 text-[9px] rounded inline-flex items-center justify-center ${
                              badge === "급여" ? "border-blue-500 text-blue-600 bg-blue-50" :
                              badge === "비급여" ? "border-pink-500 text-pink-600 bg-pink-50" :
                              badge === "전문" ? "border-blue-500 text-blue-600 bg-blue-50" :
                              "border-gray-400 text-gray-600"
                            }`}
                          >
                            {badge}
                          </Badge>
                        ))}
                        <span className="text-[11px] truncate">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-0.5 px-2 text-[11px] text-center whitespace-nowrap">{item.lotNo}</TableCell>
                    <TableCell className="py-0.5 px-2 text-[11px] text-center whitespace-nowrap">
                      {item.reason && (
                        <span className="text-blue-600 cursor-pointer hover:underline" data-testid={`link-reason-${idx}`}>{item.reason}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-center gap-2 px-3 py-2 border-t text-xs">
            <span className="text-gray-500">페이지 당 개수:</span>
            <Select value={leftPerPage} onValueChange={setLeftPerPage}>
              <SelectTrigger className="h-6 w-16 text-xs" data-testid="select-left-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-gray-500">{leftTotalItems} 중 1-{Math.min(parseInt(leftPerPage), leftTotalItems)}</span>
            <div className="flex items-center gap-1">
              <button className="h-6 w-6 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50" disabled={leftPage <= 1} onClick={() => setLeftPage(1)} data-testid="button-left-first-page">
                <ChevronLeft className="h-3 w-3" /><ChevronLeft className="h-3 w-3 -ml-2" />
              </button>
              <button className="h-6 w-6 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50" disabled={leftPage <= 1} onClick={() => setLeftPage(p => Math.max(1, p - 1))} data-testid="button-left-prev-page">
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button className="h-6 w-6 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50" disabled={leftPage >= leftTotalPages} onClick={() => setLeftPage(p => Math.min(leftTotalPages, p + 1))} data-testid="button-left-next-page">
                <ChevronRight className="h-3 w-3" />
              </button>
              <button className="h-6 w-6 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50" disabled={leftPage >= leftTotalPages} onClick={() => setLeftPage(leftTotalPages)} data-testid="button-left-last-page">
                <ChevronRight className="h-3 w-3" /><ChevronRight className="h-3 w-3 -ml-2" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col border rounded bg-white min-w-0">
          <div className="px-3 pt-3 pb-2 border-b space-y-2">
            <h2 className="text-[15px] font-extrabold" data-testid="text-right-title">회수품목 출하내역</h2>
            {renderDateNav("right", "출고일자")}
            <div className="flex items-center gap-2 flex-wrap">
              <Input
                placeholder="품목명/보험코드 입력"
                value={rightProductSearch}
                onChange={(e) => setRightProductSearch(e.target.value)}
                className="h-7 text-xs w-40"
                data-testid="input-right-product"
              />
              <Input
                placeholder="제약회사명 입력"
                value={rightCompanySearch}
                onChange={(e) => setRightCompanySearch(e.target.value)}
                className="h-7 text-xs w-32"
                data-testid="input-right-company"
              />
              <Button size="sm" className="h-7 px-3 text-xs bg-gray-800 hover:bg-gray-900" data-testid="button-right-search">
                <Search className="h-3 w-3 mr-1" />
                검색
              </Button>
              <Button size="sm" variant="outline" className="h-7 px-3 text-xs" data-testid="button-right-reset">
                해제
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow className="h-8">
                  <TableHead className="h-8 py-1 text-[11px] text-center font-extrabold whitespace-nowrap">출고일자</TableHead>
                  <TableHead className="h-8 py-1 text-[11px] text-center font-extrabold whitespace-nowrap">고시일자</TableHead>
                  <TableHead className="h-8 py-1 text-[11px] text-center font-extrabold whitespace-nowrap">제약회사</TableHead>
                  <TableHead className="h-8 py-1 text-[11px] font-extrabold whitespace-nowrap">품목 및 규격</TableHead>
                  <TableHead className="h-8 py-1 text-[11px] text-center font-extrabold whitespace-nowrap">제조번호</TableHead>
                  <TableHead className="h-8 py-1 text-[11px] text-center font-extrabold whitespace-nowrap">수량</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockShipmentData.map((item, idx) => (
                  <TableRow key={idx} className="h-7 hover:bg-blue-50 border-b">
                    <TableCell className="py-0.5 px-2 text-[11px] text-center whitespace-nowrap">{item.shipDate}</TableCell>
                    <TableCell className="py-0.5 px-2 text-[11px] text-center whitespace-nowrap">{item.noticeDate}</TableCell>
                    <TableCell className="py-0.5 px-2 text-[11px] text-left whitespace-nowrap">{item.company}</TableCell>
                    <TableCell className="py-0.5 px-2 text-[11px]">
                      <div className="flex items-center gap-1">
                        {item.badges.map((badge, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className={`h-4 px-1 text-[9px] rounded inline-flex items-center justify-center ${
                              badge === "급여" ? "border-blue-500 text-blue-600 bg-blue-50" :
                              badge === "비급여" ? "border-pink-500 text-pink-600 bg-pink-50" :
                              badge === "전문" ? "border-blue-500 text-blue-600 bg-blue-50" :
                              "border-gray-400 text-gray-600"
                            }`}
                          >
                            {badge}
                          </Badge>
                        ))}
                        <span className="text-[11px] truncate">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-0.5 px-2 text-[11px] text-center whitespace-nowrap">{item.lotNo}</TableCell>
                    <TableCell className="py-0.5 px-2 text-[11px] text-center whitespace-nowrap">{item.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end gap-2 px-3 py-2 border-t text-xs">
            <span className="text-gray-500">페이지 당 개수:</span>
            <Select value={rightPerPage} onValueChange={setRightPerPage}>
              <SelectTrigger className="h-6 w-16 text-xs" data-testid="select-right-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-gray-500">{rightTotalItems} 중 1-{Math.min(parseInt(rightPerPage), rightTotalItems)}</span>
            <div className="flex items-center gap-1">
              <button className="h-6 w-6 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50" disabled={rightPage <= 1} onClick={() => setRightPage(1)} data-testid="button-right-first-page">
                <ChevronLeft className="h-3 w-3" /><ChevronLeft className="h-3 w-3 -ml-2" />
              </button>
              <button className="h-6 w-6 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50" disabled={rightPage <= 1} onClick={() => setRightPage(p => Math.max(1, p - 1))} data-testid="button-right-prev-page">
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button className="h-6 w-6 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50" disabled={rightPage >= rightTotalPages} onClick={() => setRightPage(p => Math.min(rightTotalPages, p + 1))} data-testid="button-right-next-page">
                <ChevronRight className="h-3 w-3" />
              </button>
              <button className="h-6 w-6 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50" disabled={rightPage >= rightTotalPages} onClick={() => setRightPage(rightTotalPages)} data-testid="button-right-last-page">
                <ChevronRight className="h-3 w-3" /><ChevronRight className="h-3 w-3 -ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="max-w-3xl p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-base font-semibold sr-only">날짜 선택</DialogTitle>
          </DialogHeader>

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
                    <button
                      onClick={() => setCalStartMonth(new Date(calStartMonth.getFullYear(), calStartMonth.getMonth() - 1, 1))}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-400" />
                    </button>
                    <span className="text-lg font-semibold">
                      {format(calStartMonth, "yyyy.M.", { locale: ko })}
                    </span>
                    <button
                      onClick={() => setCalStartMonth(new Date(calStartMonth.getFullYear(), calStartMonth.getMonth() + 1, 1))}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
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
                    <button
                      onClick={() => setCalEndMonth(new Date(calEndMonth.getFullYear(), calEndMonth.getMonth() - 1, 1))}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-400" />
                    </button>
                    <span className="text-lg font-semibold">
                      {format(calEndMonth, "yyyy.M.", { locale: ko })}
                    </span>
                    <button
                      onClick={() => setCalEndMonth(new Date(calEndMonth.getFullYear(), calEndMonth.getMonth() + 1, 1))}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
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
                    <>
                      {format(tempStartDate, "yyyy.MM.dd.")} ~ {format(tempEndDate, "yyyy.MM.dd.")} ({getDayCount()}일)
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancelDates} data-testid="button-calendar-cancel">
                    취소
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleConfirmDates} data-testid="button-calendar-confirm">
                    확인
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
