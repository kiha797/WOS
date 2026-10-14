import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export interface OrderData {
  id: string;
  orderNumber: string;
  productCode: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
  orderDate: string;
}

interface OrdersTableProps {
  orders: OrderData[];
  onViewDetail?: (orderId: string) => void;
}

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  "대기중": "secondary",
  "처리중": "default",
  "배송중": "default",
  "완료": "default",
  "취소": "destructive",
};

export function OrdersTable({ orders, onViewDetail }: OrdersTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="h-9">
            <TableHead className="w-[100px] h-9 py-2 text-xs">주문번호</TableHead>
            <TableHead className="w-[120px] h-9 py-2 text-xs">주문일시</TableHead>
            <TableHead className="w-[100px] h-9 py-2 text-xs">제품코드</TableHead>
            <TableHead className="h-9 py-2 text-xs">제품명</TableHead>
            <TableHead className="w-[80px] h-9 py-2 text-right text-xs">수량</TableHead>
            <TableHead className="w-[120px] h-9 py-2 text-right text-xs">단가</TableHead>
            <TableHead className="w-[120px] h-9 py-2 text-right text-xs">합계</TableHead>
            <TableHead className="w-[100px] h-9 py-2 text-center text-xs">상태</TableHead>
            <TableHead className="w-[80px] h-9 py-2 text-center text-xs">상세</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                주문 내역이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id} data-testid={`order-row-${order.id}`} className="h-9">
                <TableCell className="font-mono text-xs py-1.5">{order.orderNumber}</TableCell>
                <TableCell className="text-xs py-1.5">{order.orderDate}</TableCell>
                <TableCell className="font-mono text-xs py-1.5">{order.productCode}</TableCell>
                <TableCell className="font-medium text-sm py-1.5">{order.productName}</TableCell>
                <TableCell className="text-right font-mono text-xs py-1.5">{order.quantity}</TableCell>
                <TableCell className="text-right font-mono text-xs py-1.5">{order.price.toLocaleString()}원</TableCell>
                <TableCell className="text-right font-mono font-semibold text-xs py-1.5">{order.total.toLocaleString()}원</TableCell>
                <TableCell className="text-center py-1">
                  <Badge variant={statusColors[order.status] || "default"} className="text-xs h-5">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center py-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => onViewDetail?.(order.id)}
                    data-testid={`button-view-${order.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
