import { OrdersTable } from '../OrdersTable';

const mockOrders = [
  {
    id: "1",
    orderNumber: "ORD001",
    productCode: "650300010",
    productName: "가나다반입300T 진정",
    quantity: 5,
    price: 15000,
    total: 75000,
    status: "완료",
    orderDate: "2025-11-12 14:30"
  },
  {
    id: "2",
    orderNumber: "ORD002",
    productCode: "644204420",
    productName: "가나틀록스정/1300mg30T 메버트",
    quantity: 3,
    price: 8500,
    total: 25500,
    status: "배송중",
    orderDate: "2025-11-12 15:20"
  },
];

export default function OrdersTableExample() {
  return (
    <div className="p-6 bg-background">
      <h2 className="text-lg font-semibold mb-4">온라인 주문내역</h2>
      <OrdersTable 
        orders={mockOrders}
        onViewDetail={(id) => console.log(`View order: ${id}`)}
      />
    </div>
  );
}
