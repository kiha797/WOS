import { DepositHistoryTable } from '../DepositHistoryTable';

const mockHistory = [
  {
    id: "1",
    date: "2025-11-12 14:30:00",
    transactionType: "충전",
    amount: 500000,
    balance: 1500000,
    description: "계좌이체 충전"
  },
  {
    id: "2",
    date: "2025-11-11 10:15:00",
    transactionType: "사용",
    amount: 75000,
    balance: 1000000,
    description: "주문번호: ORD001"
  },
  {
    id: "3",
    date: "2025-11-10 16:45:00",
    transactionType: "충전",
    amount: 1000000,
    balance: 1075000,
    description: "계좌이체 충전"
  },
];

export default function DepositHistoryTableExample() {
  return (
    <div className="p-6 bg-background">
      <h2 className="text-lg font-semibold mb-4">예치금 내역</h2>
      <DepositHistoryTable history={mockHistory} />
    </div>
  );
}
