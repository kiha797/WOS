import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface DepositHistoryData {
  id: string;
  date: string;
  transactionType: string;
  amount: number;
  balance: number;
  description: string;
}

interface DepositHistoryTableProps {
  history: DepositHistoryData[];
}

export function DepositHistoryTable({ history }: DepositHistoryTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="h-9">
            <TableHead className="w-[150px] h-9 py-2 text-xs">일시</TableHead>
            <TableHead className="w-[120px] h-9 py-2 text-xs">거래유형</TableHead>
            <TableHead className="w-[150px] h-9 py-2 text-right text-xs">거래금액</TableHead>
            <TableHead className="w-[150px] h-9 py-2 text-right text-xs">잔액</TableHead>
            <TableHead className="h-9 py-2 text-xs">내용</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                거래 내역이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            history.map((item) => (
              <TableRow key={item.id} data-testid={`deposit-row-${item.id}`} className="h-9">
                <TableCell className="text-xs py-1.5">{item.date}</TableCell>
                <TableCell className="py-1">
                  <Badge variant={item.transactionType === "충전" ? "default" : "secondary"} className="text-xs h-5">
                    {item.transactionType}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-xs py-1.5">
                  <span className={item.transactionType === "충전" ? "text-primary" : "text-destructive"}>
                    {item.transactionType === "충전" ? "+" : "-"}
                    {item.amount.toLocaleString()}원
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold text-xs py-1.5">
                  {item.balance.toLocaleString()}원
                </TableCell>
                <TableCell className="text-xs text-muted-foreground py-1.5">{item.description}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
