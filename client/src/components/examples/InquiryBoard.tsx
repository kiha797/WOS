import { InquiryBoard } from '../InquiryBoard';

const mockInquiries = [
  {
    id: "1",
    title: "배송 일정 문의",
    content: "주문한 제품의 배송 일정이 궁금합니다.",
    status: "답변완료",
    createdAt: "2025-11-10 14:30",
    reply: "안녕하세요. 해당 주문은 11월 13일 배송 예정입니다. 감사합니다."
  },
  {
    id: "2",
    title: "제품 재고 문의",
    content: "특정 제품의 재고 확보가 가능한지 문의드립니다.",
    status: "대기중",
    createdAt: "2025-11-12 09:15"
  },
];

export default function InquiryBoardExample() {
  return (
    <div className="p-6 bg-background">
      <InquiryBoard 
        inquiries={mockInquiries}
        onCreateInquiry={(title, content) => console.log("Create:", { title, content })}
        onViewInquiry={(id) => console.log("View:", id)}
      />
    </div>
  );
}
