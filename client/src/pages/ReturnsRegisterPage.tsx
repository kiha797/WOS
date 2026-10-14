import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bell, Search, Calendar } from "lucide-react";

export default function ReturnsRegisterPage() {
  const [returnType, setReturnType] = useState("general");
  const [searchProduct, setSearchProduct] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [showHistory, setShowHistory] = useState(true);
  const [cartTab, setCartTab] = useState("all");
  const [historyPeriod, setHistoryPeriod] = useState("6months");
  const [manufactureNo, setManufactureNo] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const returnTypeOptions = [
    { id: "general", label: "일반반품" },
    { id: "taxFree", label: "비과세반품" },
    { id: "subdivision", label: "소분반품" },
    { id: "subdivisionExt", label: "소분반품(외)" },
  ];

  const cartTabs = [
    { id: "all", label: "전체", count: 0 },
    { id: "treatment", label: "진료", count: 0 },
    { id: "normal", label: "일반", count: 0 },
    { id: "taxFree", label: "비과세반품", count: 0 },
    { id: "subdivision", label: "소분반품", count: 0 },
    { id: "recall", label: "회수", count: 0 },
  ];

  const periodOptions = [
    { id: "thisMonth", label: "당월" },
    { id: "lastMonth", label: "전월" },
    { id: "3months", label: "3개월" },
    { id: "6months", label: "6개월" },
    { id: "1year", label: "1년" },
    { id: "2years", label: "2년" },
    { id: "3years", label: "3년" },
  ];

  return (
    <div className="h-full overflow-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold" data-testid="text-page-title">반품등록</h1>
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

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {returnTypeOptions.map((option) => (
              <label key={option.id} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="returnType"
                  value={option.id}
                  checked={returnType === option.id}
                  onChange={(e) => setReturnType(e.target.value)}
                  className="w-3 h-3 text-blue-600"
                  data-testid={`radio-return-type-${option.id}`}
                />
                <span className="text-xs">{option.label}</span>
              </label>
            ))}
            <Input
              type="text"
              placeholder="품목명/보험코드 입력"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              className="w-40 h-7 text-xs"
              data-testid="input-search-product"
            />
            <Input
              type="text"
              placeholder="제약회사명 입력"
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              className="w-32 h-7 text-xs"
              data-testid="input-search-company"
            />
            <label className="flex items-center gap-1 cursor-pointer">
              <Checkbox
                checked={showHistory}
                onCheckedChange={(checked) => setShowHistory(checked as boolean)}
                className="h-3 w-3"
                data-testid="checkbox-show-history"
              />
              <span className="text-xs">이력</span>
            </label>
            <Button size="sm" className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700" data-testid="button-search">
              <Search className="h-3 w-3 mr-1" />
              검색
            </Button>
          </div>

          <Card className="rounded-sm flex-1">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="h-8">
                    <TableHead className="h-8 py-1 text-xs text-center font-medium">품목</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium">규격</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium">반품</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium">제약회사</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium">단가</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium">이력</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium">반품 가능수량</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium">수량</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium">담기</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-xs text-gray-500 py-16">
                      검색된 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-sm">
            <CardHeader className="py-2 px-3 border-b flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xs font-semibold whitespace-nowrap" data-testid="text-section-shipment-history">제품 출고 이력</CardTitle>
                <span className="text-[10px] text-gray-500">누적 출하 수량 : 매출 0 / 반품 0</span>
              </div>
              <div className="flex items-center border rounded overflow-hidden shrink-0">
                {periodOptions.map((option, index) => (
                  <button
                    key={option.id}
                    className={`h-5 px-1.5 text-[10px] whitespace-nowrap ${index < periodOptions.length - 1 ? "border-r" : ""} ${historyPeriod === option.id ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setHistoryPeriod(option.id)}
                    data-testid={`button-history-period-${option.id}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <Input
                  type="text"
                  placeholder="제조번호"
                  value={manufactureNo}
                  onChange={(e) => setManufactureNo(e.target.value)}
                  className="w-24 h-7 text-xs"
                  data-testid="input-manufacture-no"
                />
                <Input
                  type="text"
                  placeholder="유효기간"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-24 h-7 text-xs"
                  data-testid="input-expiry-date"
                />
                <Button size="icon" variant="outline" className="h-7 w-7" data-testid="button-calendar">
                  <Calendar className="h-3 w-3" />
                </Button>
              </div>
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="h-7">
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">주문일자</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">단가</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">유효기간</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">제조번호</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">출하수량</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-xs text-gray-500 py-8">
                      검색된 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="w-[400px] flex flex-col gap-4">
          <Card className="rounded-sm">
            <CardHeader className="py-2 px-3 border-b space-y-0">
              <CardTitle className="text-sm font-semibold" data-testid="text-section-return-cart">반품 장바구니</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex border-b overflow-x-auto">
                {cartTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`px-2 py-1.5 text-[10px] whitespace-nowrap border-b-2 ${cartTab === tab.id ? "border-blue-600 text-blue-600 font-medium" : "border-transparent text-gray-600 hover:text-gray-900"}`}
                    onClick={() => setCartTab(tab.id)}
                    data-testid={`button-cart-tab-${tab.id}`}
                  >
                    {tab.label} {tab.count}건
                  </button>
                ))}
              </div>
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="h-7">
                    <TableHead className="h-7 py-1 text-xs text-center font-medium w-6">
                      <Checkbox className="h-3 w-3" data-testid="checkbox-cart-select-all" />
                    </TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">품목 및 규격</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">제약회사</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">수량</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">유효기간(대표)</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">제조번호(대표)</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-xs text-gray-500 py-8">
                      검색된 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-sm">
            <CardHeader className="py-2 px-3 border-b space-y-0">
              <CardTitle className="text-sm font-semibold" data-testid="text-section-product-info">제품정보</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="border-b pb-2 mb-2">
                <span className="text-xs text-gray-500">품목 및 규격</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-16">규격</span>
                  <span>-</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-16">박스입수</span>
                  <span>(소) (중) (대)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-16">제약회사</span>
                  <span>-</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-16">최소주문</span>
                  <span>-</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-16">보험코드</span>
                  <span>-</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-16">최대주문</span>
                  <span>-</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-16">반품</span>
                  <span>-</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-16">포장형태</span>
                  <span>-</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-16">반품조건</span>
                  <span>-</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-16">입고일정</span>
                  <span>-</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
