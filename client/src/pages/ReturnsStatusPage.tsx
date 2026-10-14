import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Calendar as CalendarIcon, Printer, FileText, Info } from "lucide-react";

const mockReturnsData = [
  {
    id: "1",
    registrationDate: "2025-11-13",
    receiptDate: "2025-11-13",
    mainProduct: "베릴리정(정) 100T",
    productCount: 1,
    status: "신청완료",
    memo: "메모",
    insuranceNumber: "-",
    important: false,
    boxCount: "소형 대형",
    requestForm: "메모",
    depositInfo: "-",
    cancel: false,
  },
  {
    id: "2",
    registrationDate: "2025-11-13",
    receiptDate: "2025-11-20",
    mainProduct: "용각산쿨과립(목숨이정) 12P",
    productCount: 1,
    status: "신청완료",
    memo: "메모",
    insuranceNumber: "-",
    important: false,
    boxCount: "소형 대형",
    depositInfo: "메모",
    cancel: false,
  },
  {
    id: "3",
    registrationDate: "2025-09-23",
    receiptDate: "2025-09-29",
    mainProduct: "에스터반정 300T",
    productCount: 1,
    status: "신청완료",
    memo: "메모",
    insuranceNumber: "-",
    important: false,
    boxCount: "소형 대형",
    depositInfo: "메모",
    cancel: false,
  },
  {
    id: "4",
    registrationDate: "2025-09-19",
    receiptDate: "2025-09-29",
    mainProduct: "스피플록세이저감비제형(디지털움치사용)(장기품목) 30ml*30EA",
    productCount: 1,
    status: "회송처리",
    memo: "메모",
    insuranceNumber: "-",
    important: false,
    boxCount: "소형 대형",
    depositInfo: "메모",
    cancel: false,
  },
  {
    id: "5",
    registrationDate: "2025-09-12",
    receiptDate: "2025-09-16",
    mainProduct: "에드피온서방정150mg 28T",
    productCount: 2,
    status: "접수완료",
    memo: "메모",
    insuranceNumber: "-",
    important: false,
    boxCount: "소형 대형",
    depositInfo: "메모",
    cancel: false,
  },
  {
    id: "6",
    registrationDate: "2025-09-11",
    receiptDate: "2025-09-16",
    mainProduct: "페미캔서방정 30T",
    productCount: 2,
    status: "반품완료",
    memo: "메모",
    insuranceNumber: "-",
    important: false,
    boxCount: "소형 대형",
    depositInfo: "-",
    cancel: false,
  },
];

const mockReturnDetails = [
  {
    id: "1",
    manufacturer: "일동제약",
    productName: "셀라롤루나이티타임건조시험(메밀라진) 6P",
    badges: ["전문", "비급여"],
    insuranceCode: "-",
    registeredQty: 3,
    receivedQty: 0,
    rejectedQty: 0,
    result: "-",
  },
  {
    id: "2",
    manufacturer: "일동제약",
    productName: "셀라롤루타이아타임건조시험(메밀라진) 6P",
    badges: ["전문", "비급여"],
    insuranceCode: "-",
    registeredQty: 5,
    receivedQty: 0,
    rejectedQty: 0,
    result: "-",
  },
];

type TabType = "all" | "pending" | "manager" | "processing" | "completed" | "cancelled";

export default function ReturnsStatusPage() {
  const [selectedTab, setSelectedTab] = useState<TabType>("all");
  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [selectedReturn, setSelectedReturn] = useState<typeof mockReturnsData[0] | null>(mockReturnsData[0]);
  const [dateRangeType, setDateRangeType] = useState<"day" | "week" | "month" | "3months" | "6months" | "1year" | "2years" | "3years">("6months");

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "all", label: "전체", count: 0 },
    { key: "pending", label: "미등록", count: 0 },
    { key: "manager", label: "담당자", count: 0 },
    { key: "processing", label: "처리중", count: 0 },
    { key: "completed", label: "접수완료", count: 22 },
    { key: "cancelled", label: "취소", count: 0 },
  ];

  const dateRanges: { key: typeof dateRangeType; label: string }[] = [
    { key: "day", label: "당일" },
    { key: "week", label: "주간" },
    { key: "month", label: "3개월" },
    { key: "3months", label: "6개월" },
    { key: "6months", label: "1년" },
    { key: "1year", label: "2년" },
    { key: "2years", label: "3년" },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <h1 className="text-lg font-bold" data-testid="text-page-title">반품현황</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          <span>공지사항</span>
          <span className="text-blue-600">타사이트를 통한 수금 관련 공...</span>
        </div>
      </div>
      {/* 필터 영역 */}
      <div className="px-4 py-3 bg-white border-b space-y-3">
        {/* 반품기간 탭 */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">반품기간</span>
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={selectedTab === tab.key ? "default" : "outline"}
                size="sm"
                className={`h-7 px-3 text-xs ${
                  selectedTab === tab.key 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-600"
                }`}
                onClick={() => setSelectedTab(tab.key)}
                data-testid={`tab-${tab.key}`}
              >
                {tab.label} {tab.count}건
              </Button>
            ))}
          </div>
        </div>

        {/* 검색 필터 */}
        <div className="flex items-center gap-3">
          <Input
            placeholder="품목명/제약코드 입력"
            className="h-8 text-sm w-48"
            data-testid="input-product-search"
          />
          <Input
            placeholder="제약회사명 입력"
            className="h-8 text-sm w-40"
            data-testid="input-manufacturer-search"
          />
          <div className="flex items-center gap-1">
            <Input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 w-28 text-xs text-center"
              data-testid="input-start-date"
            />
            <span className="text-muted-foreground">~</span>
            <Input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 w-28 text-xs text-center"
              data-testid="input-end-date"
            />
            <Button size="icon" variant="outline" className="h-8 w-8" data-testid="button-calendar">
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button className="h-8 px-4 text-sm bg-blue-600 hover:bg-blue-700" data-testid="button-search">
            <Search className="h-4 w-4 mr-1" />
            검색
          </Button>
          <div className="flex items-center gap-1 ml-auto">
            {dateRanges.map((range) => (
              <Button
                key={range.key}
                variant={dateRangeType === range.key ? "default" : "outline"}
                size="sm"
                className={`h-7 px-2 text-xs ${
                  dateRangeType === range.key 
                    ? "bg-blue-600 text-white" 
                    : ""
                }`}
                onClick={() => setDateRangeType(range.key)}
                data-testid={`button-range-${range.key}`}
              >
                {range.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs" data-testid="button-print">
              <Printer className="h-3 w-3 mr-1" />
              출력
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs" data-testid="button-export">
              <FileText className="h-3 w-3 mr-1" />
              내역엑셀
            </Button>
          </div>
        </div>
      </div>
      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        {/* 반품 목록 테이블 */}
        <Card className="flex-1 rounded-sm flex flex-col overflow-hidden">
          <CardContent className="p-0 flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0">
                <TableRow className="h-9">
                  <TableHead className="h-9 py-1 text-xs text-center font-medium w-8">
                    <Checkbox className="h-4 w-4" data-testid="checkbox-all" />
                  </TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium">등록일자</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium">접수일자</TableHead>
                  <TableHead className="h-9 py-1 text-xs font-medium">대표품목</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium">품목수</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium">진행현황</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium">반품메모</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium">보험번호서</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium">
                    <div>소중함</div>
                    <div className="text-[10px] text-muted-foreground">반품함</div>
                  </TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium">박스라벨</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium">반품요청서</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium">담당자메모</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-medium">반품취소</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReturnsData.map((item, idx) => (
                  <TableRow 
                    key={item.id}
                    className={`h-9 cursor-pointer hover:bg-blue-50 ${
                      selectedReturn?.id === item.id ? "bg-blue-100" : idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                    onClick={() => setSelectedReturn(item)}
                    data-testid={`row-return-${item.id}`}
                  >
                    <TableCell className="py-1 px-2 text-center">
                      <Checkbox className="h-4 w-4" data-testid={`checkbox-${item.id}`} />
                    </TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center text-blue-600">{item.registrationDate}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{item.receiptDate}</TableCell>
                    <TableCell className="py-1 px-2 text-xs">{item.mainProduct}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{item.productCount}</TableCell>
                    <TableCell className="py-1 px-2 text-center">
                      <Badge 
                        variant="outline" 
                        className={`h-5 px-2 text-[10px] ${
                          item.status === "반품완료" 
                            ? "border-red-500 text-red-600 bg-red-50" 
                            : item.status === "접수완료"
                            ? "border-orange-500 text-orange-600 bg-orange-50"
                            : item.status === "반품제한"
                            ? "border-gray-400 text-gray-600 bg-gray-100"
                            : "border-blue-500 text-blue-600 bg-blue-50"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center text-blue-600 cursor-pointer hover:underline">
                      {item.memo}
                    </TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{item.insuranceNumber}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{item.important ? "O" : "-"}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{item.boxCount}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{item.requestForm || "-"}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center text-blue-600 cursor-pointer hover:underline">
                      {item.depositInfo}
                    </TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{item.cancel ? "취소" : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="border-t px-4 py-2 text-xs text-muted-foreground text-right">
            24 중 1-13
          </div>
        </Card>

        {/* 반품상세 */}
        <Card className="h-48 rounded-sm flex flex-col overflow-hidden">
          <CardHeader className="pb-2 pt-2 px-3 border-b">
            <CardTitle className="text-sm font-semibold">반품상세</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0">
                <TableRow className="h-8">
                  <TableHead className="h-8 py-1 text-xs text-center font-medium">제약회사</TableHead>
                  <TableHead className="h-8 py-1 text-xs font-medium">품목 및 규격</TableHead>
                  <TableHead className="h-8 py-1 text-xs text-center font-medium">보험코드</TableHead>
                  <TableHead className="h-8 py-1 text-xs text-center font-medium">등록수량</TableHead>
                  <TableHead className="h-8 py-1 text-xs text-center font-medium">접수수량</TableHead>
                  <TableHead className="h-8 py-1 text-xs text-center font-medium">불가수량</TableHead>
                  <TableHead className="h-8 py-1 text-xs text-center font-medium">접수결과</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReturnDetails.map((item) => (
                  <TableRow key={item.id} className="h-8 hover:bg-gray-50">
                    <TableCell className="py-1 px-2 text-xs text-center">{item.manufacturer}</TableCell>
                    <TableCell className="py-1 px-2 text-xs">
                      <div className="flex items-center gap-1">
                        {item.badges.map((badge, i) => (
                          <Badge 
                            key={i}
                            variant="outline" 
                            className={`h-5 px-1.5 text-[10px] rounded w-10 inline-flex items-center justify-center ${
                              badge === "급여" ? "border-blue-500 text-blue-600 bg-blue-50" : 
                              badge === "비급여" ? "border-pink-500 text-pink-600 bg-pink-50" :
                              "border-gray-400 text-gray-600"
                            }`}
                          >
                            {badge}
                          </Badge>
                        ))}
                        <span className="ml-1">{item.productName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{item.insuranceCode}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{item.registeredQty}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{item.receivedQty}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{item.rejectedQty}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{item.result}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
