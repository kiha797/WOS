import { InquiryBoard } from "@/components/InquiryBoard";

const mockInquiries = [
  {
    id: "1",
    title: "배송 일정 문의",
    content: "주문한 제품의 배송 일정이 궁금합니다. 빠른 답변 부탁드립니다.",
    status: "답변완료",
    createdAt: "2025-11-10 14:30",
    reply: "안녕하세요. 고객님께서 주문하신 제품은 11월 13일 배송 예정입니다. 배송 완료 후 문자로 안내드리겠습니다. 감사합니다."
  },
  {
    id: "2",
    title: "제품 재고 문의",
    content: "특정 제품의 대량 주문이 필요한데, 재고 확보가 가능한지 문의드립니다.",
    status: "대기중",
    createdAt: "2025-11-12 09:15"
  },
  {
    id: "3",
    title: "세금계산서 발행 관련",
    content: "지난달 주문 건에 대한 세금계산서 발행을 요청드립니다.",
    status: "답변완료",
    createdAt: "2025-11-08 16:20",
    reply: "세금계산서는 이메일로 발송 완료되었습니다. 확인 부탁드립니다."
  },
];

export default function BoardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">1:1 게시판</h1>
        <p className="text-sm text-muted-foreground mt-1">궁금한 사항을 문의하세요</p>
      </div>

      <InquiryBoard 
        inquiries={mockInquiries}
        onCreateInquiry={(title, content) => console.log("Create:", { title, content })}
        onViewInquiry={(id) => console.log("View:", id)}
      />
    </div>
  );
}
