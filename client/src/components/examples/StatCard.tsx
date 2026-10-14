import { StatCard } from '../StatCard';
import { Wallet, ShoppingCart, Package } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-6 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="예치금 잔액"
          value="1,500,000원"
          icon={Wallet}
          description="사용 가능 금액"
        />
        <StatCard
          title="이번 달 주문"
          value="24건"
          icon={ShoppingCart}
          description="전월 대비 +12%"
        />
        <StatCard
          title="배송 대기"
          value="3건"
          icon={Package}
          description="배송 준비중"
        />
      </div>
    </div>
  );
}
