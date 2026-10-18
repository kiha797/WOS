import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, FileSpreadsheet, FileDown, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PriceItem {
  no: number;
  scheduledDate: string;
  manufacturer: string;
  productName: string;
  productSpec: string;
  isExpert: boolean;
  isCovered: boolean;
  hasRecentOrder: boolean;
  insuranceCode: string;
  priceBefore: number;
  priceAfter: number;
  priceChange: number;
  recentQtyThisMonth: number;
  recentQtyLastMonth: number;
  recentQtyTwoMonthsAgo: number;
}

const mockData: PriceItem[] = [
  { no: 1, scheduledDate: "2026.05.01", manufacturer: "대원제약", productName: "펠루비서방정", productSpec: "30T", isExpert: true, isCovered: true, hasRecentOrder: true, insuranceCode: "671805860", priceBefore: 9120, priceAfter: 7020, priceChange: 2100, recentQtyTwoMonthsAgo: 0, recentQtyLastMonth: 0, recentQtyThisMonth: 0 },
  { no: 2, scheduledDate: "2026.05.01", manufacturer: "대원제약", productName: "펠루비서방정", productSpec: "500T", isExpert: true, isCovered: true, hasRecentOrder: false, insuranceCode: "671805860", priceBefore: 152000, priceAfter: 117000, priceChange: 35000, recentQtyTwoMonthsAgo: 0, recentQtyLastMonth: 0, recentQtyThisMonth: 0 },
  { no: 3, scheduledDate: "2026.05.01", manufacturer: "대원제약", productName: "펠루비칭", productSpec: "300T", isExpert: true, isCovered: true, hasRecentOrder: false, insuranceCode: "671803380", priceBefore: 54000, priceAfter: 28800, priceChange: 25200, recentQtyTwoMonthsAgo: 0, recentQtyLastMonth: 0, recentQtyThisMonth: 0 },
  { no: 4, scheduledDate: "2026.05.01", manufacturer: "대원제약", productName: "펠루비칭", productSpec: "30T", isExpert: true, isCovered: true, hasRecentOrder: false, insuranceCode: "671803380", priceBefore: 5400, priceAfter: 2880, priceChange: 2520, recentQtyTwoMonthsAgo: 0, recentQtyLastMonth: 0, recentQtyThisMonth: 0 },
  { no: 5, scheduledDate: "2026.05.01", manufacturer: "셀트리온제약", productName: "딜라트렌에스알정32mg(총근당)", productSpec: "100T", isExpert: true, isCovered: true, hasRecentOrder: false, insuranceCode: "643309020", priceBefore: 77600, priceAfter: 77500, priceChange: 100, recentQtyTwoMonthsAgo: 0, recentQtyLastMonth: 0, recentQtyThisMonth: 0 },
  { no: 6, scheduledDate: "2026.05.01", manufacturer: "종근당", productName: "딜라트렌에스알정32mg(판매원변경)", productSpec: "100T", isExpert: true, isCovered: true, hasRecentOrder: false, insuranceCode: "643309020", priceBefore: 77600, priceAfter: 77500, priceChange: 100, recentQtyTwoMonthsAgo: 0, recentQtyLastMonth: 0, recentQtyThisMonth: 0 },
  { no: 7, scheduledDate: "2026.05.01", manufacturer: "종근당", productName: "딜라트렌에스알정32mg(판매원변경)", productSpec: "30T", isExpert: true, isCovered: true, hasRecentOrder: false, insuranceCode: "643309020", priceBefore: 23280, priceAfter: 23250, priceChange: 30, recentQtyTwoMonthsAgo: 0, recentQtyLastMonth: 0, recentQtyThisMonth: 0 },
];

const periodOptions = [
  { value: "2026.05.01", label: "2026.05.01 <<< 펠루비정 외 26 종" },
  { value: "2026.04.01", label: "2026.04.01 <<< 엔커비액(밀크맛.. 외 14 종" },
  { value: "2026.03.01", label: "2026.03.01 <<< 클로미프라민캅.. 외 5 종" },
  { value: "2026.02.01", label: "2026.02.01 <<< 세파클러캅셀250.. 외 226 종" },
  { value: "2026.01.01", label: "2026.01.01 <<< 낙센에프정500mg 외 6784 종" },
  { value: "2025.12.01", label: "2025.12.01 <<< 트라조돈캅셀25m.. 외 52 종" },
  { value: "2025.11.20", label: "2025.11.20 <<< 디나칸캅셀 외 20 종" },
  { value: "2025.11.01", label: "2025.11.01 <<< 가란타제산 외 60 종" },
  { value: "2025.10.01", label: "2025.10.01 <<< 리퀴시아정2.5mg 외 15 종" },
  { value: "2025.09.10", label: "2025.09.10 <<< 엘리퀴스정2.5mg 외 17 종" },
  { value: "2025.09.01", label: "2025.09.01 <<< 그로트로핀투주.. 외 218 종" },
  { value: "2025.08.01", label: "2025.08.01 <<< 5%포도당주사액(.. 외 15 종" },
  { value: "2025.07.01", label: "2025.07.01 <<< 20%만니톨주 외 18 종" },
  { value: "2025.06.09", label: "2025.06.09 <<< 트라젠타정5mg(.. 외 17 종" },
  { value: "2025.06.01", label: "2025.06.01 <<< 리포지엔알정480.. 외 11 종" },
  { value: "2025.05.01", label: "2025.05.01 <<< 후루오레사이트.. 외 29 종" },
];

interface EstimateRow {
  no: number;
  productCode: string;
  productType: string;
  productName: string;
  salesQty: number;
  expiryDate: string;
  lotNo: string;
  priceBefore: number;
  priceAfter: number;
  estimateQty: number;
  estimateAmount: number;
  isSubtotal?: boolean;
  isTotal?: boolean;
}

const mockEstimateData: EstimateRow[] = [
  { no: 1, productCode: "054409", productType: "일반", productName: "넥실렌정 500T 제일", salesQty: 0, expiryDate: "2027-04-15", lotNo: "FNXA403", priceBefore: 62000, priceAfter: 53000, estimateQty: 0.0, estimateAmount: 0 },
  { no: 0, productCode: "", productType: "", productName: "제품별소계", salesQty: 0, expiryDate: "", lotNo: "", priceBefore: 0, priceAfter: 0, estimateQty: 0.0, estimateAmount: 0, isSubtotal: true },
  { no: 2, productCode: "081218", productType: "일반", productName: "스티렌정60mg 800T 동아에스티", salesQty: 0, expiryDate: "2028-04-28", lotNo: "SLTS2504009", priceBefore: 88800, priceAfter: 76000, estimateQty: 0.0, estimateAmount: 0 },
  { no: 0, productCode: "", productType: "", productName: "제품별소계", salesQty: 0, expiryDate: "", lotNo: "", priceBefore: 0, priceAfter: 0, estimateQty: 0.0, estimateAmount: 0, isSubtotal: true },
  { no: 3, productCode: "077615", productType: "일반", productName: "에스티렌투엑스정 300T 하나제약", salesQty: 2, expiryDate: "2027-02-09", lotNo: "250041", priceBefore: 52200, priceAfter: 44700, estimateQty: 0.6, estimateAmount: 4500 },
  { no: 0, productCode: "", productType: "", productName: "제품별소계", salesQty: 2, expiryDate: "", lotNo: "", priceBefore: 0, priceAfter: 0, estimateQty: 0.6, estimateAmount: 4500, isSubtotal: true },
  { no: 4, productCode: "062462", productType: "일반", productName: "에스트렌정60mg 500T 삼진", salesQty: 1, expiryDate: "2027-11-18", lotNo: "ESMA002H", priceBefore: 52500, priceAfter: 45000, estimateQty: 0.3, estimateAmount: 2250 },
  { no: 0, productCode: "", productType: "", productName: "제품별소계", salesQty: 1, expiryDate: "", lotNo: "", priceBefore: 0, priceAfter: 0, estimateQty: 0.3, estimateAmount: 2250, isSubtotal: true },
  { no: 5, productCode: "020814", productType: "일반", productName: "크레메진세립2G 84P 씨제이", salesQty: 2, expiryDate: "2028-06-04", lotNo: "CMG25B7", priceBefore: 157584, priceAfter: 155904, estimateQty: 0.6, estimateAmount: 1008 },
  { no: 0, productCode: "", productType: "", productName: "제품별소계", salesQty: 2, expiryDate: "", lotNo: "", priceBefore: 0, priceAfter: 0, estimateQty: 0.6, estimateAmount: 1008, isSubtotal: true },
  { no: 6, productCode: "094744", productType: "일반", productName: "크레메진속봉정 336T(84포) 에이치케이이노엔", salesQty: 3, expiryDate: "2028-01-31", lotNo: "TK25207", priceBefore: 157668, priceAfter: 155904, estimateQty: 0.9, estimateAmount: 1588 },
  { no: 7, productCode: "094744", productType: "일반", productName: "크레메진속봉정 336T(84포) 에이치케이이노엔", salesQty: 3, expiryDate: "2028-02-29", lotNo: "TK25305", priceBefore: 157668, priceAfter: 155904, estimateQty: 0.9, estimateAmount: 1588 },
  { no: 0, productCode: "", productType: "", productName: "제품별소계", salesQty: 6, expiryDate: "", lotNo: "", priceBefore: 0, priceAfter: 0, estimateQty: 1.8, estimateAmount: 3175, isSubtotal: true },
  { no: 0, productCode: "", productType: "", productName: "전체합계", salesQty: 11, expiryDate: "", lotNo: "", priceBefore: 0, priceAfter: 0, estimateQty: 0, estimateAmount: 10933, isTotal: true },
];

export default function PriceReductionPage() {
  const today = new Date();
  const thisMonthLabel = `${today.getMonth() + 1}月`;
  const lastMonthLabel = `${today.getMonth() === 0 ? 12 : today.getMonth()}月`;
  const twoMonthsAgoLabel = `${today.getMonth() <= 1 ? today.getMonth() + 11 : today.getMonth() - 1}月`;
  const [selectedPeriod, setSelectedPeriod] = useState("2026.05.01");
  const [manufacturerSearch, setManufacturerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [onlyPurchased, setOnlyPurchased] = useState(false);
  const [viewMode, setViewMode] = useState<"normal" | "estimate">("normal");

  const showQty = (() => {
    const [y, m] = selectedPeriod.split(".").map(Number);
    const selYear = y, selMonth = m;
    return selYear > today.getFullYear() ||
      (selYear === today.getFullYear() && selMonth >= today.getMonth() + 1);
  })();

  const filtered = mockData.filter((item) => {
    const matchProduct = productSearch === "" ||
      item.productName.includes(productSearch) ||
      item.insuranceCode.includes(productSearch);
    const matchMfr = manufacturerSearch === "" ||
      item.manufacturer.includes(manufacturerSearch);
    const matchPurchased = !onlyPurchased || item.hasRecentOrder;
    return matchProduct && matchMfr && matchPurchased;
  });

  return (
    <div className="wos-page h-full overflow-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold" data-testid="text-page-title">약가인하상품</h1>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm text-[#232426]" data-testid="text-estimate-notice">
            <Info className="h-4 w-4 shrink-0" />
            예상금액은 실제 보상금액과 다를 수 있습니다.
          </span>
          <Button
            size="sm"
            className={`h-8 px-4 text-sm text-white ${viewMode === "estimate" ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"}`}
            onClick={() => setViewMode(v => v === "normal" ? "estimate" : "normal")}
            data-testid="button-estimate-2month"
          >
            2개월 30% 예상금액조회
          </Button>
        </div>
      </div>
      {/* Search bar */}
      <div className="flex flex-col gap-2 mb-3 border rounded-md px-4 py-2.5 bg-[#e8e8e8]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">보험가 변경일</span>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="h-8 w-72 text-sm bg-white" data-testid="select-period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {periodOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-sm">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="w-px h-5 bg-gray-300 mx-0.5" />
          <Input
            placeholder="품목명/보험코드 입력"
            className="h-8 w-60 text-sm bg-white"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            data-testid="input-product-search"
          />
          <Input
            placeholder="제약회사명 입력"
            className="h-8 w-40 text-sm bg-white"
            value={manufacturerSearch}
            onChange={(e) => setManufacturerSearch(e.target.value)}
            data-testid="input-manufacturer-search"
          />
          <Button
            size="sm"
            className="h-8 px-5 text-sm bg-[#1e3a6e] hover:bg-[#162d57] text-white"
            data-testid="button-search"
          >
            <Search className="h-3.5 w-3.5 mr-1.5" />
            검색
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-sm gap-1.5 bg-[#00752800]"
              data-testid="button-excel"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              엑셀
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-sm gap-1.5"
              data-testid="button-pdf"
            >
              <FileDown className="h-3.5 w-3.5" />
              PDF
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between border-t pt-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="only-purchased"
              checked={onlyPurchased}
              onCheckedChange={(v) => setOnlyPurchased(!!v)}
              data-testid="checkbox-only-purchased"
            />
            <label htmlFor="only-purchased" className="text-sm text-gray-700 cursor-pointer whitespace-nowrap">
              약가인하 구입상품만 보기
            </label>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            ★ 상품명이 <span className="text-red-500 font-medium">빨간색</span>인 경우, 최근 1년 이내 주문내역이 있는 상품입니다
          </span>
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded border border-gray-200">
        {viewMode === "normal" ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b">
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-12" rowSpan={2}>순번</TableHead>
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-24" rowSpan={2}>변경일자</TableHead>
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-24" rowSpan={2}>제약사</TableHead>
                <TableHead className="h-10 py-0 text-xs text-left font-semibold text-gray-700" rowSpan={2}>품목</TableHead>
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-24" rowSpan={2}>규격</TableHead>
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-24" rowSpan={2}>보험코드</TableHead>
                <TableHead className="h-5 py-0 text-xs text-center font-semibold text-gray-700 border-b" colSpan={2}>보험약가</TableHead>
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-20" rowSpan={2}>변경금액</TableHead>
              </TableRow>
              <TableRow className="bg-gray-50 border-b">
                <TableHead className="h-5 py-0 text-xs text-center font-semibold text-gray-700 w-20">변경 전</TableHead>
                <TableHead className="h-5 py-0 text-xs text-center font-semibold text-gray-700 w-20">변경 후</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.no} className="h-10 border-b hover:bg-gray-50" data-testid={`row-item-${item.no}`}>
                  <TableCell className="py-2 text-sm text-center">{item.no}</TableCell>
                  <TableCell className="py-2 text-sm text-center whitespace-nowrap">{item.scheduledDate}</TableCell>
                  <TableCell className="py-2 text-sm text-center">{item.manufacturer}</TableCell>
                  <TableCell className="py-2 text-sm text-left">
                    <div className="flex items-center gap-1 flex-wrap">
                      {item.isExpert && (
                        <Badge variant="outline" className="h-4 px-1 text-[10px] border-blue-500 text-blue-600 bg-blue-50 shrink-0">전문</Badge>
                      )}
                      {item.isCovered && (
                        <Badge variant="outline" className="h-4 px-1 text-[10px] border-green-500 text-green-600 bg-green-50 shrink-0">급여</Badge>
                      )}
                      <span className={`font-medium ${item.hasRecentOrder ? "text-red-500" : "text-gray-900"}`}>
                        {item.productName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-sm text-center text-gray-600 whitespace-nowrap">{item.productSpec}</TableCell>
                  <TableCell className="py-2 text-sm text-center">{item.insuranceCode}</TableCell>
                  <TableCell className="py-2 text-sm text-right">{item.priceBefore.toLocaleString()}</TableCell>
                  <TableCell className="py-2 text-sm text-right">{item.priceAfter.toLocaleString()}</TableCell>
                  <TableCell className="py-2 text-right font-semibold text-[14px] text-[#000000]">{item.priceChange.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-sm text-gray-400">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b">
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-10">No.</TableHead>
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-24">제품코드</TableHead>
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-24">지정약여부</TableHead>
                <TableHead className="h-10 py-0 text-xs text-left font-semibold text-gray-700">제품명</TableHead>
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-20">매출수량</TableHead>
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-28">유통기한</TableHead>
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-28">로트번호</TableHead>
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-24">이전단가</TableHead>
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-24">이후단가</TableHead>
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-20">예상수량</TableHead>
                <TableHead className="h-10 py-0 text-xs text-center font-semibold text-gray-700 w-24">예상금액</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEstimateData.map((row, idx) => {
                if (row.isTotal) {
                  return (
                    <TableRow key={`total-${idx}`} className="bg-gray-100 border-t-2 border-gray-400 font-bold">
                      <TableCell className="py-2 text-sm text-center" colSpan={4}>{row.productName}</TableCell>
                      <TableCell className="py-2 text-sm text-center font-bold">{row.salesQty}</TableCell>
                      <TableCell className="py-2" colSpan={4} />
                      <TableCell className="py-2 text-sm text-center font-bold"></TableCell>
                      <TableCell className="py-2 text-sm text-right font-bold">{row.estimateAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  );
                }
                if (row.isSubtotal) {
                  return (
                    <TableRow key={`sub-${idx}`} className="bg-gray-50 border-b font-semibold">
                      <TableCell className="py-1.5 text-sm text-center" colSpan={4}>{row.productName}</TableCell>
                      <TableCell className="py-1.5 text-sm text-center font-bold">{row.salesQty}</TableCell>
                      <TableCell className="py-1.5" colSpan={4} />
                      <TableCell className="py-1.5 text-sm text-center font-bold">{row.estimateQty.toFixed(1)}</TableCell>
                      <TableCell className="py-1.5 text-sm text-right font-bold">{row.estimateAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  );
                }
                return (
                  <TableRow key={`est-${idx}`} className="h-10 border-b hover:bg-gray-50">
                    <TableCell className="py-2 text-sm text-center">{row.no}</TableCell>
                    <TableCell className="py-2 text-sm text-center">{row.productCode}</TableCell>
                    <TableCell className="py-2 text-sm text-center">{row.productType}</TableCell>
                    <TableCell className="py-2 text-sm text-left">{row.productName}</TableCell>
                    <TableCell className="py-2 text-sm text-center">{row.salesQty}</TableCell>
                    <TableCell className="py-2 text-sm text-center whitespace-nowrap">{row.expiryDate}</TableCell>
                    <TableCell className="py-2 text-sm text-center">{row.lotNo}</TableCell>
                    <TableCell className="py-2 text-sm text-right">{row.priceBefore.toLocaleString()}</TableCell>
                    <TableCell className="py-2 text-sm text-right">{row.priceAfter.toLocaleString()}</TableCell>
                    <TableCell className="py-2 text-sm text-center">{row.estimateQty.toFixed(1)}</TableCell>
                    <TableCell className="py-2 text-sm text-right">{row.estimateAmount.toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
