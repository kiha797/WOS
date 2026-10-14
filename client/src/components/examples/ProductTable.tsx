import { ProductTable } from '../ProductTable';

const mockProducts = [
  { id: "1", code: "650300010", name: "진정화학", manufacturer: "가나다반입300T 진정", packaging: "300T", price: 15000, stock: 0 },
  { id: "2", code: "650300010", name: "진정화학", manufacturer: "가나다반입30T 진정", packaging: "30T", price: 1500, stock: 0 },
  { id: "3", code: "644204420", name: "한국메버트", manufacturer: "가나틀록스정/1300mg30T 메버트(죽산)", packaging: "30T", price: 8500, stock: 5 },
  { id: "4", code: "644204440", name: "한국메버트", manufacturer: "가나틀록스정/1300mg30T 메버트", packaging: "30T", price: 8500, stock: 0 },
  { id: "5", code: "653005700", name: "한국메버", manufacturer: "가나틀감정/60mg 300C 한국메버", packaging: "300C", price: 12000, stock: 0 },
  { id: "6", code: "653005700", name: "한국메버", manufacturer: "가나틀감정/60mg 30C 한국메버", packaging: "30C", price: 1200, stock: 0 },
  { id: "7", code: "641604671", name: "대웅약품", manufacturer: "나트백스그스트발10A 대웅", packaging: "10A", price: 25000, stock: 0 },
  { id: "8", code: "651604671", name: "동아에스티", manufacturer: "동아이어스트정(S구산)/1e+10cfu 동아에", packaging: "10A", price: 18000, stock: 0 },
  { id: "9", code: "651604671", name: "동아에스티(구)", manufacturer: "동아이어스트정(S구산)/1e+10cfu 동아", packaging: "10A", price: 18000, stock: 0 },
  { id: "10", code: "651604671", name: "가나다반입센터", manufacturer: "가나디아이신30캡(구.구산)0회정", packaging: "1V", price: 5000, stock: 10 },
  { id: "11", code: "650300011", name: "진정화학2", manufacturer: "가나다반입300T 진정2", packaging: "300T", price: 16000, stock: 3 },
  { id: "12", code: "650300012", name: "진정화학3", manufacturer: "가나다반입30T 진정3", packaging: "30T", price: 1600, stock: 8 },
];

export default function ProductTableExample() {
  return (
    <div className="p-6 bg-background">
      <h2 className="text-lg font-semibold mb-4">제품 목록</h2>
      <ProductTable 
        products={mockProducts}
        onAddToCart={(id, qty) => console.log(`Added ${id}: ${qty}`)}
      />
    </div>
  );
}
