import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ShoppingCart, Star } from "lucide-react";

const recentOrders = [
  { orderNo: "2026030619002794", orderDate: "2026-03-06 19:00", note: "진코액스정80mg 외 1종", orderAmt: 259500, approvedAmt: 259500, status: "승인완료" },
  { orderNo: "2026030614120763", orderDate: "2026-03-06 14:12", note: "마운자로프리필드펜주2.5mg", orderAmt: 1390500, approvedAmt: 1390500, status: "승인완료" },
  { orderNo: "2026030614111879", orderDate: "2026-03-06 14:11", note: "조인스정200mg 외 4종", orderAmt: 315680, approvedAmt: 315680, status: "승인완료" },
  { orderNo: "2026030610160967", orderDate: "2026-03-06 10:16", note: "자큐보구강봉해정20mg", orderAmt: 546600, approvedAmt: 546600, status: "승인완료" },
  { orderNo: "2026030520455928", orderDate: "2026-03-05 20:46", note: "소론도정", orderAmt: 16000, approvedAmt: 16000, status: "승인완료" },
];

interface FreqProduct {
  manufacturer: string;
  productName: string;
  tags: string[];
  spec: string;
  price: number;
  stock: number;
  totalQty: string;
  orderCount: string;
  avgQty: string;
}

const freqProducts: FreqProduct[] = [
  { manufacturer: "국제약품", productName: "후메토룬점안액", tags: ["전", "보"], spec: "5ml", price: 1675, stock: 269, totalQty: "", orderCount: "", avgQty: "" },
  { manufacturer: "한림제약", productName: "포소드점안액", tags: ["전", "보"], spec: "10ml", price: 1110, stock: 706, totalQty: "", orderCount: "", avgQty: "" },
  { manufacturer: "대우제약", productName: "브롬펜점안액", tags: ["전", "보"], spec: "6mL/1병", price: 1811, stock: 323, totalQty: "", orderCount: "", avgQty: "" },
  { manufacturer: "한림제약", productName: "퀴노비드안연고3mg", tags: ["전", "보"], spec: "5g", price: 2545, stock: 629, totalQty: "", orderCount: "", avgQty: "" },
  { manufacturer: "알파제약", productName: "라노탄점안액", tags: ["전", "보", "냉"], spec: "2.5ml", price: 11533, stock: 12, totalQty: "", orderCount: "", avgQty: "" },
];

const notices = [
  { text: "[기타][데일리팜]단독·유통 공통'...", date: "2023-03-03" },
  { text: "[기타][의확신문]의약품 유통마진빠고...", date: "2022-07-04" },
  { text: "[기타][데일리팜]가름값 뛰고 최저임...", date: "2022-06-30" },
  { text: "[기타][데일리팜]내년 최저임금 96...", date: "2022-06-30" },
  { text: "[기타][데일리팜]유통업계 '인슐린...", date: "2022-06-23" },
];

function TagBadge({ tag }: { tag: string }) {
  if (tag === "전") return <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-blue-50 text-blue-700 border-blue-300 font-normal">전</Badge>;
  if (tag === "보") return <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-green-50 text-green-700 border-green-300 font-normal">보</Badge>;
  if (tag === "냉") return <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-sky-50 text-sky-700 border-sky-300 font-normal">냉</Badge>;
  return null;
}

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<"frequent" | "wishlist">("frequent");
  const [orderQtys, setOrderQtys] = useState<Record<number, string>>(
    Object.fromEntries(freqProducts.map((_, i) => [i, "0"]))
  );

  return (
    <div className="h-full overflow-auto p-5">
      {/* Welcome */}
      <p className="text-sm text-gray-700 mb-4" data-testid="text-welcome">
        새봄약국(김은영)님 환영합니다.
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "전월잔고", value: "120,108,650원" },
          { label: "거래금액", value: "23,132,631원" },
          { label: "결제금액", value: "0원" },
          { label: "당월잔고", value: "143,241,281원" },
        ].map((card) => (
          <Card key={card.label} className="rounded-sm">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-500 mb-2">{card.label}</p>
              <p className="text-lg font-bold text-gray-900" data-testid={`text-${card.label}`}>{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 최근 주문내역 */}
      <div className="bg-white border border-gray-200 rounded-sm mb-5">
        <div className="flex items-center justify-between px-4 py-2.5 border-b">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-800">최근 주문내역</span>
            <span className="text-xs text-gray-400">| 1주일</span>
          </div>
          <button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50" data-testid="button-order-expand">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="h-9 bg-gray-50">
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-center w-52">주문번호(주문일)</TableHead>
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-left">적요</TableHead>
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-right w-28">주문금액</TableHead>
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-right w-28">승인금액</TableHead>
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-center w-24">주문상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order, i) => (
              <TableRow key={i} className="h-11 border-b last:border-0" data-testid={`row-order-${i}`}>
                <TableCell className="py-1.5 text-xs text-center">
                  <div className="font-medium text-gray-800">{order.orderNo}</div>
                  <div className="text-gray-400">{order.orderDate}</div>
                </TableCell>
                <TableCell className="py-1.5 text-sm text-left">{order.note}</TableCell>
                <TableCell className="py-1.5 text-sm text-right">{order.orderAmt.toLocaleString()}</TableCell>
                <TableCell className="py-1.5 text-sm text-right">{order.approvedAmt.toLocaleString()}</TableCell>
                <TableCell className="py-1.5 text-xs text-center text-gray-600">{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 다빈도 주문상품 / 관심상품 */}
      <div className="bg-white border border-gray-200 rounded-sm mb-5">
        <div className="flex items-center justify-between px-4 py-2.5 border-b">
          <div className="flex items-center gap-2">
            <button
              className={`h-8 px-4 text-sm rounded border ${activeTab === "frequent" ? "bg-red-500 text-white border-red-500 font-medium" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
              onClick={() => setActiveTab("frequent")}
              data-testid="button-tab-frequent"
            >
              다빈도 주문상품
            </button>
            <button
              className={`h-8 px-4 text-sm rounded border ${activeTab === "wishlist" ? "bg-red-500 text-white border-red-500 font-medium" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
              onClick={() => setActiveTab("wishlist")}
              data-testid="button-tab-wishlist"
            >
              관심상품
            </button>
          </div>
          <button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50" data-testid="button-freq-expand">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="h-9 bg-gray-50">
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-center w-24">제조사명</TableHead>
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-left">상품명</TableHead>
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-center w-20">규격</TableHead>
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-right w-20">판매가</TableHead>
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-right w-16">재고</TableHead>
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-right w-16">총수량</TableHead>
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-right w-16">주문횟수</TableHead>
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-right w-16">평균수량</TableHead>
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-center w-20">주문수량</TableHead>
              <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-center w-28">비고</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {freqProducts.map((product, i) => (
              <TableRow key={i} className="h-10 border-b last:border-0" data-testid={`row-freq-${i}`}>
                <TableCell className="py-1.5 text-xs text-center text-gray-600">{product.manufacturer}</TableCell>
                <TableCell className="py-1.5 text-xs text-left">
                  <div className="flex items-center gap-1 flex-wrap">
                    {product.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
                    <span>{product.productName}</span>
                  </div>
                </TableCell>
                <TableCell className="py-1.5 text-xs text-center">{product.spec}</TableCell>
                <TableCell className="py-1.5 text-xs text-right">{product.price.toLocaleString()}</TableCell>
                <TableCell className="py-1.5 text-xs text-right">{product.stock}</TableCell>
                <TableCell className="py-1.5 text-xs text-right">{product.totalQty}</TableCell>
                <TableCell className="py-1.5 text-xs text-right">{product.orderCount}</TableCell>
                <TableCell className="py-1.5 text-xs text-right">{product.avgQty}</TableCell>
                <TableCell className="py-1.5 text-xs text-center">
                  <Input
                    type="number"
                    value={orderQtys[i]}
                    onChange={(e) => setOrderQtys((prev) => ({ ...prev, [i]: e.target.value }))}
                    className="h-6 w-14 text-xs text-center px-1 mx-auto"
                    data-testid={`input-qty-${i}`}
                  />
                </TableCell>
                <TableCell className="py-1.5 text-xs text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" data-testid={`button-wishlist-${i}`}>
                      관심
                    </Button>
                    <Button size="sm" className="h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white border-0" data-testid={`button-cart-${i}`}>
                      <ShoppingCart className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        {/* 나의 상담현황 */}
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="flex items-center justify-between px-4 py-2.5 border-b">
            <span className="text-sm font-semibold text-gray-800">나의 상담현황</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="h-9 bg-gray-50">
                <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-center">구분</TableHead>
                <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-center">답변대기</TableHead>
                <TableHead className="h-9 py-1.5 text-xs font-semibold text-gray-700 text-center">답변완료</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { type: "1:1문의", waiting: 0, done: 0 },
                { type: "주문문의", waiting: 0, done: 0 },
              ].map((row) => (
                <TableRow key={row.type} className="h-9 border-b last:border-0" data-testid={`row-consult-${row.type}`}>
                  <TableCell className="py-1.5 text-xs text-center">{row.type}</TableCell>
                  <TableCell className="py-1.5 text-xs text-center">{row.waiting}</TableCell>
                  <TableCell className="py-1.5 text-xs text-center">{row.done}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 공지사항 */}
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="flex items-center justify-between px-4 py-2.5 border-b">
            <span className="text-sm font-semibold text-gray-800">공지사항</span>
            <button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50" data-testid="button-notice-expand">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="divide-y">
            {notices.map((notice, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer" data-testid={`row-notice-${i}`}>
                <span className="text-xs text-gray-700 truncate flex-1">{notice.text}</span>
                <span className="text-xs text-gray-400 ml-3 shrink-0">{notice.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
