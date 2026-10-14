import { useState } from "react";
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
import { Plus, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface InquiryData {
  id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  reply?: string;
}

interface InquiryBoardProps {
  inquiries: InquiryData[];
  onCreateInquiry?: (title: string, content: string) => void;
  onViewInquiry?: (inquiryId: string) => void;
}

export function InquiryBoard({ inquiries, onCreateInquiry, onViewInquiry }: InquiryBoardProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryData | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreate = () => {
    if (title && content) {
      onCreateInquiry?.(title, content);
      setTitle("");
      setContent("");
      setIsCreateOpen(false);
      console.log("문의 작성됨:", { title, content });
    }
  };

  const handleView = (inquiry: InquiryData) => {
    setSelectedInquiry(inquiry);
    setIsViewOpen(true);
    onViewInquiry?.(inquiry.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">1:1 게시판</h2>
        <Button onClick={() => setIsCreateOpen(true)} data-testid="button-create-inquiry">
          <Plus className="h-4 w-4 mr-2" />
          문의하기
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="h-9">
              <TableHead className="w-[80px] h-9 py-2 text-xs">번호</TableHead>
              <TableHead className="h-9 py-2 text-xs">제목</TableHead>
              <TableHead className="w-[120px] h-9 py-2 text-center text-xs">상태</TableHead>
              <TableHead className="w-[150px] h-9 py-2 text-xs">작성일</TableHead>
              <TableHead className="w-[80px] h-9 py-2 text-center text-xs">상세</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  문의 내역이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry, index) => (
                <TableRow key={inquiry.id} data-testid={`inquiry-row-${inquiry.id}`} className="h-9">
                  <TableCell className="text-center font-mono text-xs py-1.5">{inquiries.length - index}</TableCell>
                  <TableCell className="font-medium text-sm py-1.5">{inquiry.title}</TableCell>
                  <TableCell className="text-center py-1">
                    <Badge variant={inquiry.status === "답변완료" ? "default" : "secondary"} className="text-xs h-5">
                      {inquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs py-1.5">{inquiry.createdAt}</TableCell>
                  <TableCell className="text-center py-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => handleView(inquiry)}
                      data-testid={`button-view-inquiry-${inquiry.id}`}
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

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent data-testid="dialog-create-inquiry">
          <DialogHeader>
            <DialogTitle>문의하기</DialogTitle>
            <DialogDescription>
              궁금하신 내용을 작성해주세요. 빠른 시일 내에 답변드리겠습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                data-testid="input-inquiry-title"
              />
            </div>
            <div>
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="문의 내용을 입력하세요"
                rows={6}
                data-testid="textarea-inquiry-content"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} data-testid="button-cancel-inquiry">
              취소
            </Button>
            <Button onClick={handleCreate} disabled={!title || !content} data-testid="button-submit-inquiry">
              작성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent data-testid="dialog-view-inquiry">
          <DialogHeader>
            <DialogTitle>{selectedInquiry?.title}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              작성일: {selectedInquiry?.createdAt}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>문의 내용</Label>
              <div className="mt-2 p-4 bg-muted rounded-md text-sm whitespace-pre-wrap">
                {selectedInquiry?.content}
              </div>
            </div>
            {selectedInquiry?.reply && (
              <div>
                <Label className="text-primary">답변</Label>
                <div className="mt-2 p-4 bg-primary/5 border border-primary/20 rounded-md text-sm whitespace-pre-wrap">
                  {selectedInquiry.reply}
                </div>
              </div>
            )}
            {!selectedInquiry?.reply && (
              <div className="text-sm text-muted-foreground text-center py-4">
                답변 대기중입니다.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)} data-testid="button-close-inquiry">
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
