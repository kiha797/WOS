import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DrugDetailsDialog } from "@/components/DrugDetailsDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, Search, ChevronUp, ChevronDown, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Check, Link2, Trash2, ShoppingCart, ImageOff, ZoomIn } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subDays, subWeeks, subMonths, startOfYear, endOfYear } from "date-fns";
import { ko } from "date-fns/locale";
import drugExampleImage from "@assets/image_1790562988645.png";

const mockProducts = [
  { 
    id: "1", 
    code: "", 
    badges: ["전문", "급여"],
    name: "가나요화정(유황약록)", 
    imageUrl: drugExampleImage,
    packaging: "30정(병)", 
    manufacturer: "이연제약", 
    price: 3090, 
    stock: 3, 
    quantity: "",
    returned: "단가",
    discount: "반품",
    history: "이력",
    favorite: false,
    returnStatus: ""
  },
  { 
    id: "2", 
    code: "644206420", 
    badges: ["전문", "급여"],
    name: "가나틀록스정20/1100MG", 
    packaging: "100정(PTP)", 
    manufacturer: "보령바이오파마", 
    price: 23640, 
    stock: 2, 
    quantity: "",
    returned: "단가",
    discount: "반품",
    history: "이력",
    favorite: false,
    returnStatus: "불가"
  },
  { 
    id: "3", 
    code: "", 
    badges: ["전문", "비급여"],
    name: "린코마이신염산염수화물주600mg", 
    packaging: "30정(Alu-ALu)", 
    manufacturer: "영풍제약", 
    price: 9200, 
    stock: 0, 
    quantity: "",
    returned: "단가",
    discount: "품절",
    history: "이력",
    favorite: false,
    returnStatus: "조건"
  },
  { 
    id: "4", 
    code: "", 
    badges: ["전문", "비급여"],
    name: "린코마이신염산염수화물주600mg", 
    packaging: "300정(PTP)", 
    manufacturer: "영풍제약", 
    price: 46000, 
    stock: 0, 
    quantity: "",
    returned: "단가",
    discount: "품절",
    history: "이력",
    favorite: false,
    returnStatus: ""
  },
  { 
    id: "5", 
    code: "", 
    badges: ["전문", "비급여"],
    name: "가나메드정50MG", 
    packaging: "1,000정(병)", 
    manufacturer: "일동제약", 
    price: 2580, 
    stock: 0, 
    quantity: "",
    returned: "단가",
    discount: "품절",
    history: "이력",
    favorite: false,
    returnStatus: ""
  },
  { 
    id: "6", 
    code: "658600010", 
    badges: ["일반", "급여"],
    name: "가나모딘시럽(유황엽록)", 
    packaging: "25mL/100포", 
    manufacturer: "이연제약", 
    price: 51500, 
    stock: 0, 
    quantity: "",
    returned: "단가",
    discount: "품절",
    history: "이력",
    favorite: false,
    returnStatus: "제한"
  },
  { 
    id: "7", 
    code: "", 
    badges: ["보험", "비급여"],
    name: "가나칸정50MG(PTP)(급여산제)", 
    packaging: "30정(병)", 
    manufacturer: "제이더블유중외제약", 
    price: 10300, 
    stock: 0, 
    quantity: "",
    returned: "단가",
    discount: "품절",
    history: "이력",
    favorite: false,
    returnStatus: ""
  },
  { 
    id: "8", 
    code: "", 
    badges: ["전문", "비급여"],
    name: "가나칸정50MG(급여산제)", 
    packaging: "100정(병)", 
    manufacturer: "제이더블유중외제약", 
    price: 103000, 
    stock: 0, 
    quantity: "",
    returned: "단가",
    discount: "품절",
    history: "이력",
    favorite: false,
    returnStatus: ""
  },
  { 
    id: "9", 
    code: "", 
    badges: ["일반", "비급여"],
    name: "가나칸정50MG(급여산제)", 
    packaging: "100정(병)", 
    manufacturer: "제이더블유중외제약", 
    price: 103000, 
    stock: 0, 
    quantity: "",
    returned: "단가",
    discount: "품절",
    history: "이력",
    favorite: false,
    returnStatus: ""
  },
  { 
    id: "10", 
    code: "", 
    badges: ["전문", "비급여"],
    name: "가나칸정50MG(급여산제)", 
    packaging: "100정(병)", 
    manufacturer: "제이더블유중외제약", 
    price: 103000, 
    stock: 0, 
    quantity: "",
    returned: "단가",
    discount: "품절",
    history: "이력",
    favorite: false,
    returnStatus: ""
  },
];

const mockCartItems: any[] = [];

const mockPurchaseHistory = [
  { id: "1", date: "2025-02-11", code: "12", quantity: 3, price: "45,000원", status: "출고완료", manufactureNo: "" },
  { id: "2", date: "2024-11-11", code: "1234", quantity: 2, price: "18,500원", status: "출고완료", manufactureNo: "" },
  { id: "3", date: "2024-08-11", code: "1350", quantity: 5, price: "67,800원", status: "출고완료", manufactureNo: "" },
  { id: "5", date: "2023-01-11", code: "2500", quantity: 1, price: "12,000원", status: "반품완료", manufactureNo: "" },
  { id: "5", date: "2023-01-11", code: "2500", quantity: 1, price: "12,000원", status: "출고완료", manufactureNo: "" },
  { id: "6", date: "2002-12-11", code: "12000", quantity: 1, price: "12,000원", status: "출고완료", manufactureNo: "" },
  { id: "7", date: "1999-11-11", code: "1", quantity: 1, price: "12,000원", status: "출고완료", manufactureNo: "" },
];

const mockFrequentProducts = [
  { id: "f1",  name: "가브스메트정50/1000mg",      packaging: "60정(PTP)",   manufacturer: "노바티스",   price: 25380, avgOrder: 3, prevPrevMonth: 6, prevMonth: 3, thisMonth: 0, stock: 142,  badges: ["전문","급여"],  favorite: true,  returnRestricted: false },
  { id: "f2",  name: "콩코르정2.5mg",              packaging: "30정(PTP)",   manufacturer: "머크",       price: 3960,  avgOrder: 1, prevPrevMonth: 3, prevMonth: 0, thisMonth: 0, stock: 2575, badges: ["전문","급여"],  favorite: false, returnRestricted: true  },
  { id: "f3",  name: "넥시움정20mg",               packaging: "14정(PTP)",   manufacturer: "아스트라제",  price: 10206, avgOrder: 0, prevPrevMonth: 0, prevMonth: 0, thisMonth: 0, stock: 739,  badges: ["전문","급여"],  favorite: false, returnRestricted: false },
  { id: "f4",  name: "락티케어제마지스로오슨0.25%",  packaging: "60g",         manufacturer: "한국파마",   price: 9970,  avgOrder: 0, prevPrevMonth: 0, prevMonth: 0, thisMonth: 0, stock: 246,  badges: ["전문","비급여"], favorite: false, returnRestricted: false },
  { id: "f5",  name: "에스로반연고20mg",            packaging: "10g",         manufacturer: "JW신약",     price: 1320,  avgOrder: 0, prevPrevMonth: 2, prevMonth: 0, thisMonth: 0, stock: 188,  badges: ["일반","비급여"], favorite: false, returnRestricted: false },
  { id: "f6",  name: "뉴부틴서방정300mg",           packaging: "30정(병)",    manufacturer: "유나이티",   price: 6750,  avgOrder: 0, prevPrevMonth: 0, prevMonth: 0, thisMonth: 0, stock: 98,   badges: ["전문","급여"],  favorite: false, returnRestricted: false },
  { id: "f7",  name: "글라디엠정4mg",              packaging: "30정(병)",    manufacturer: "유한양행",   price: 8370,  avgOrder: 0, prevPrevMonth: 0, prevMonth: 0, thisMonth: 0, stock: 201,  badges: ["전문","급여"],  favorite: false, returnRestricted: false },
  { id: "f8",  name: "에소메졸캡슐20mg",            packaging: "30캡슐(병)",  manufacturer: "한미약품",   price: 27750, avgOrder: 0, prevPrevMonth: 0, prevMonth: 0, thisMonth: 0, stock: 531,  badges: ["전문","급여"],  favorite: false, returnRestricted: false },
  { id: "f9",  name: "심발타캡슐30mg",             packaging: "28캡슐(PTP)", manufacturer: "한국릴리",   price: 11200, avgOrder: 0, prevPrevMonth: 0, prevMonth: 0, thisMonth: 0, stock: 425,  badges: ["전문","급여"],  favorite: false, returnRestricted: false },
  { id: "f10", name: "다나핀크림",                packaging: "25g/1개",     manufacturer: "오스틴",     price: 5900,  avgOrder: 0, prevPrevMonth: 0, prevMonth: 0, thisMonth: 0, stock: 163,  badges: ["일반","비급여"], favorite: false, returnRestricted: false },
];

const mockFrequentHistory = [
  { id: "fh1", name: "클리아타민연질캡슐 90C", orderDate: "2025-12-24", price: 42840, orderQty: 6, manufactureNo: "25GA4228", expiryDate: "2027-07-10" },
  { id: "fh2", name: "클리아타민연질캡슐 90C", orderDate: "2025-12-23", price: 42840, orderQty: 10, manufactureNo: "25GA4228", expiryDate: "2027-07-10" },
  { id: "fh3", name: "클리아타민연질캡슐 90C", orderDate: "2025-12-16", price: 42840, orderQty: 4, manufactureNo: "25GA4200", expiryDate: "2027-06-16" },
  { id: "fh4", name: "클리아타민연질캡슐 90C", orderDate: "2025-11-26", price: 42840, orderQty: 5, manufactureNo: "25GA4181", expiryDate: "2027-05-29" },
];

function isFavoriteResponse(value: unknown): value is { favoriteProductIds: string[] } {
  return Boolean(
    value
      && typeof value === "object"
      && "favoriteProductIds" in value
      && Array.isArray(value.favoriteProductIds)
      && value.favoriteProductIds.every((id) => typeof id === "string")
  );
}

export default function OrderPage({ selectedColor }: { selectedColor?: string }) {
  const [selectedProduct, setSelectedProduct] = useState<any>(mockProducts[0]);
  const [favoriteProductIds, setFavoriteProductIds] = useState<Set<string>>(new Set());
  const [favoriteLoadState, setFavoriteLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [pendingFavoriteIds, setPendingFavoriteIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const isSelectedProductFavorite = Boolean(selectedProduct && favoriteProductIds.has(selectedProduct.id));
  const [isDrugImageOpen, setIsDrugImageOpen] = useState(false);
  const [isDrugDetailsOpen, setIsDrugDetailsOpen] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [focusedQuantityId, setFocusedQuantityId] = useState<string | null>(null);
  
  const today = new Date();
  const [startDate, setStartDate] = useState<string>(format(subMonths(today, 1), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState<string>(format(today, "yyyy-MM-dd"));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(subMonths(today, 1));
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(today);
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [leftMonth, setLeftMonth] = useState(new Date(today.getFullYear(), today.getMonth() - 1, 1));
  const [rightMonth, setRightMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [historyViewMode, setHistoryViewMode] = useState<"date" | "manufacture">("date");
  const [historyPeriod, setHistoryPeriod] = useState<"thisMonth" | "lastMonth" | "6months" | "1year" | "2years">("6months");
  
  const [isFrequentOrderOpen, setIsFrequentOrderOpen] = useState(false);
  const [frequentCart, setFrequentCart] = useState<any[]>([]);
  const [frequentQuantities, setFrequentQuantities] = useState<Record<string, string>>({});
  const [frequentCartTab, setFrequentCartTab] = useState("all");
  const [frequentHistoryPeriod, setFrequentHistoryPeriod] = useState("6months");
  const [selectedFrequentProduct, setSelectedFrequentProduct] = useState<any>(mockFrequentProducts[0]);
  const [mainCart, setMainCart] = useState<any[]>([]);
  const [cartChecked, setCartChecked] = useState<Set<string>>(new Set());
  const [isReturnInfoOpen, setIsReturnInfoOpen] = useState(false);
  const [returnInfoProduct, setReturnInfoProduct] = useState<any>(null);
  const [isHistoryDetailOpen, setIsHistoryDetailOpen] = useState(false);
  const [historyDetailItem, setHistoryDetailItem] = useState<any>(null);
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const [cartExpandedHeight, setCartExpandedHeight] = useState(500);
  const leftColumnRef = useRef<HTMLDivElement>(null);

  const loadFavorites = useCallback(async () => {
    setFavoriteLoadState("loading");
    try {
      const response = await apiRequest("GET", "/api/favorites");
      const result: unknown = await response.json();
      if (!isFavoriteResponse(result)) {
        throw new Error("Invalid favorites response");
      }
      setFavoriteProductIds(new Set(result.favoriteProductIds));
      setFavoriteLoadState("ready");
    } catch {
      setFavoriteLoadState("error");
      toast({
        title: "즐겨찾기를 불러오지 못했습니다.",
        description: "잠시 후 다시 시도해 주세요.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  const addToCart = (product: any) => {
    const qty = parseInt(quantities[product.id] || "1") || 1;
    setMainCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...product, qty }];
    });
    setQuantities(prev => ({ ...prev, [product.id]: "" }));
  };

  const toggleProductFavorite = async (productId: string) => {
    if (favoriteLoadState !== "ready" || pendingFavoriteIds.has(productId)) return;

    const wasFavorite = favoriteProductIds.has(productId);
    setPendingFavoriteIds((current) => new Set(current).add(productId));
    try {
      const response = await apiRequest(
        wasFavorite ? "DELETE" : "PUT",
        `/api/favorites/${encodeURIComponent(productId)}`,
      );
      const result: unknown = await response.json();
      if (!isFavoriteResponse(result)) {
        throw new Error("Invalid favorites response");
      }
      setFavoriteProductIds(new Set(result.favoriteProductIds));
      toast({
        title: wasFavorite ? "즐겨찾기에서 해제했습니다." : "즐겨찾기에 추가했습니다.",
      });
    } catch {
      toast({
        title: wasFavorite ? "즐겨찾기를 해제하지 못했습니다." : "즐겨찾기에 추가하지 못했습니다.",
        description: "변경 사항은 저장되지 않았습니다. 다시 시도해 주세요.",
        variant: "destructive",
      });
    } finally {
      setPendingFavoriteIds((current) => {
        const next = new Set(current);
        next.delete(productId);
        return next;
      });
    }
  };

  const removeFromCart = (productId: string) => {
    setMainCart(prev => prev.filter(item => item.id !== productId));
    setCartChecked(prev => { const s = new Set(prev); s.delete(productId); return s; });
  };

  const cartTotal = mainCart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCartToggle = () => {
    if (!isCartExpanded && leftColumnRef.current) {
      setCartExpandedHeight(Math.floor(leftColumnRef.current.clientHeight * 0.8));
    }
    setIsCartExpanded(prev => !prev);
  };

  const handleReturnInfoClick = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    setReturnInfoProduct(product);
    setIsReturnInfoOpen(true);
  };

  const getReturnInfoMessage = (status: string) => {
    switch (status) {
      case "불가":
        return "제약사 반품불가";
      case "조건":
        return "조건부 반품 가능 (유효기간 6개월 이상 남은 제품에 한함)";
      case "제한":
        return "반품 제한 품목 (냉장보관 의약품)";
      default:
        return "반품 정보 없음";
    }
  };

  const handleFrequentOrderClose = (ordered: boolean) => {
    if (!ordered && frequentCart.length > 0) {
      setMainCart(prev => [...prev, ...frequentCart]);
    }
    setFrequentCart([]);
    setFrequentQuantities({});
    setIsFrequentOrderOpen(false);
  };

  const addToFrequentCart = (product: any) => {
    const qty = parseInt(frequentQuantities[product.id] || "1");
    if (qty > 0) {
      const existingIndex = frequentCart.findIndex(item => item.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...frequentCart];
        updated[existingIndex].quantity += qty;
        setFrequentCart(updated);
      } else {
        setFrequentCart([...frequentCart, { ...product, quantity: qty }]);
      }
      setFrequentQuantities({ ...frequentQuantities, [product.id]: "" });
    }
  };

  const removeFromFrequentCart = (productId: string) => {
    setFrequentCart(frequentCart.filter(item => item.id !== productId));
  };

  const applyQuickRange = (start: Date, end: Date) => {
    setTempStartDate(start);
    setTempEndDate(end);
  };

  const handleApplyDates = () => {
    if (tempStartDate) setStartDate(format(tempStartDate, "yyyy-MM-dd"));
    if (tempEndDate) setEndDate(format(tempEndDate, "yyyy-MM-dd"));
    setIsCalendarOpen(false);
  };

  const handleCancelDates = () => {
    setTempStartDate(startDate ? new Date(startDate) : undefined);
    setTempEndDate(endDate ? new Date(endDate) : undefined);
    setIsCalendarOpen(false);
  };

  return (
    <div className="h-full flex gap-3 p-3 overflow-hidden bg-[#e6e6e6]">
      {/* 왼쪽 영역: 제품목록 (상단) + 장바구니 (하단) */}
      <div ref={leftColumnRef} className="flex-1 flex flex-col gap-3 overflow-hidden">
        {/* 제품품목 */}
        <Card className="rounded-sm flex flex-col overflow-hidden flex-1 bg-[#ffffff]" style={{ borderColor: '#ededed', borderWidth: '2px' }}>
        <CardHeader className="pb-2 pt-3 px-3 border-b flex flex-row items-center justify-between space-y-0 gap-2">
          <CardTitle className="text-[18px] font-extrabold">제품품목<span className="text-[10px] font-normal text-gray-500 ml-1.5">총 {mockProducts.length} 개 상품</span></CardTitle>
          {favoriteLoadState === "error" && (
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => void loadFavorites()}>
              즐겨찾기 다시 불러오기
            </Button>
          )}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs" data-testid="button-recent-order">
              최근주문
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs" data-testid="button-favorites">
              관심
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs" data-testid="button-special-price">
              특가
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs" data-testid="button-price-reduction">
              약가인하
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs" data-testid="button-smart-wos">
              스마트WOS
            </Button>
            <Button size="sm" className="h-7 px-3 text-xs text-white hover-elevate" data-testid="button-frequent-order" onClick={() => setIsFrequentOrderOpen(true)} style={{ backgroundColor: selectedColor || "#ef4444" }}>다빈도주문</Button>
          </div>
        </CardHeader>
        
        {/* 필터 영역 */}
        <div className="p-3 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="h-9 w-24 text-sm" data-testid="select-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="category">분류</SelectItem>
              </SelectContent>
            </Select>
            
            <Input 
              placeholder="품목명/보험코드 입력"
              className="h-9 text-sm flex-1 min-w-0"
              data-testid="input-product-name"
            />
            
            <Input 
              placeholder="제약사명 입력"
              className="h-9 text-sm w-40 shrink-0"
              data-testid="input-manufacturer"
            />
            
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <Checkbox id="soldout" className="h-4 w-4" data-testid="checkbox-soldout" />
              <span className="text-sm whitespace-nowrap">품절제외</span>
            </div>
            
            <Button className="h-9 px-6 text-sm bg-blue-600 hover:bg-blue-700 shrink-0" data-testid="button-search">
              <Search className="h-4 w-4 mr-1" />
              검색
            </Button>
          </div>
        </div>

        {/* 제품 목록 테이블 */}
        <div className="overflow-auto flex-1">
        <Table>
            <TableHeader className="sticky top-0 bg-gray-50 z-10">
              <TableRow className="h-9 border-b">
                <TableHead className="h-9 py-1 text-center font-semibold text-foreground text-[14px] w-[90px]">보험코드</TableHead>
                <TableHead className="h-9 py-1 text-center font-semibold text-foreground text-[14px] w-[90px]">제약사</TableHead>
                <TableHead className="h-9 py-1 font-semibold text-foreground text-[14px] w-[295px]">품목</TableHead>
                <TableHead className="h-9 py-1 text-center font-semibold text-foreground text-[14px] w-[90px]">규격</TableHead>
                <TableHead className="h-9 py-1 text-center font-semibold text-foreground text-[14px] w-[72px]">단가</TableHead>
                <TableHead className="h-9 py-1 text-center font-semibold text-foreground text-[14px] w-[52px]">재고</TableHead>
                <TableHead className="h-9 py-1 text-center font-semibold text-foreground text-[14px] w-[65px]">수량</TableHead>
                <TableHead className="h-9 py-1 text-center font-semibold text-foreground text-[14px] w-[24px] pl-[10px] pr-[10px] whitespace-nowrap">반품</TableHead>
                <TableHead className="h-9 py-1 text-right font-semibold text-foreground text-[14px] whitespace-nowrap w-[60px] pl-[4px] pr-[20px]">비고</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product, idx) => (
                <TableRow 
                  key={product.id} 
                  className={`h-9 cursor-pointer hover:bg-blue-50 border-b ${selectedProduct?.id === product.id ? 'bg-blue-100' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  onClick={() => setSelectedProduct(product)}
                  data-testid={`row-product-${product.id}`}
                >
                  <TableCell className="py-0.5 px-2 text-center text-[12px]">
                    {product.code || '-'}
                  </TableCell>
                  <TableCell className="py-0.5 px-2 text-left text-[14px] whitespace-nowrap">{product.manufacturer}</TableCell>
                  <TableCell className="py-0.5 px-2 text-[16px]">
                    <div className="flex items-center gap-1">
                      <span className="ml-0.5 text-[14px]">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-0.5 px-2 text-left text-[14px]">{product.packaging}</TableCell>
                  <TableCell className="py-0.5 px-2 text-right text-[14px]">
                    {product.discount === "2,100" ? (
                      <span className="text-black-600 font-semibold">2,100</span>
                    ) : (
                      product.price.toLocaleString()
                    )}
                  </TableCell>
                  <TableCell className="py-0.5 px-2 text-center text-[14px]">
                    {product.stock === 0 ? <span className="font-semibold text-[12px] text-[#ff0000]">품절</span> : product.stock}
                  </TableCell>
                  <TableCell className="py-0.5 px-2 text-center">
                    {product.stock === 0 ? null : (
                      <div className="relative inline-flex items-center">
                        <Input
                          type="text"
                          value={quantities[product.id] || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d+$/.test(value)) {
                              setQuantities({ ...quantities, [product.id]: value });
                            }
                          }}
                          onFocus={() => setFocusedQuantityId(product.id)}
                          onBlur={() => setFocusedQuantityId(null)}
                          className="h-6 w-16 text-xs text-center pr-5"
                          data-testid={`input-quantity-${product.id}`}
                        />
                        <div
                          className="absolute right-0 top-0 h-full flex flex-col"
                          style={{ visibility: focusedQuantityId === product.id ? 'visible' : 'hidden' }}
                        >
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              const currentValue = parseInt(quantities[product.id] || "0");
                              setQuantities({ ...quantities, [product.id]: String(currentValue + 1) });
                            }}
                            className="h-3 w-4 flex items-center justify-center border-l bg-white hover:bg-gray-100 active:bg-gray-200"
                            data-testid={`button-increment-${product.id}`}
                          >
                            <ChevronUp className="h-2.5 w-2.5" />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              const currentValue = parseInt(quantities[product.id] || "0");
                              if (currentValue > 0) {
                                setQuantities({ ...quantities, [product.id]: String(currentValue - 1) });
                              }
                            }}
                            className="h-3 w-4 flex items-center justify-center border-l border-t bg-white hover:bg-gray-100 active:bg-gray-200"
                            data-testid={`button-decrement-${product.id}`}
                          >
                            <ChevronDown className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-0.5 px-0 text-center">
                    {product.returnStatus === "불가" ? (
                      <Badge 
                        className="h-5 px-1 text-[10px] rounded bg-red-600 text-white border-0"
                        data-testid={`badge-return-${product.id}`}
                      >
                        불가
                      </Badge>
                    ) : product.returnStatus === "조건" ? (
                      <Badge 
                        className="h-5 px-1 text-[10px] rounded text-white border-0 bg-[#2563eb]"
                        data-testid={`badge-return-${product.id}`}
                      >조건</Badge>
                    ) : product.returnStatus === "제한" ? (
                      <span 
                        className="text-xs text-blue-600 font-medium"
                        data-testid={`badge-return-${product.id}`}
                      >
                        제한
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="py-0.5 pr-2 pl-0">
                    <div className="flex items-center justify-end gap-1">
                      {product.stock > 0 && (
                        <button
                          className="h-6 w-6 border border-gray-300 rounded flex items-center justify-center hover:border-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          data-testid={`button-add-cart-${product.id}`}
                        >
                          <ShoppingCart className="h-3.5 w-3.5 text-gray-500" />
                        </button>
                      )}
                      {product.stock > 0 && (
                        <button
                          type="button"
                          aria-label={favoriteProductIds.has(product.id) ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                          aria-pressed={favoriteProductIds.has(product.id)}
                          disabled={favoriteLoadState !== "ready" || pendingFavoriteIds.has(product.id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            void toggleProductFavorite(product.id);
                          }}
                          className="h-6 w-6 border border-gray-300 rounded flex items-center justify-center hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                          data-testid={`button-favorite-${product.id}`}
                        >
                          <Heart
                            className={`h-3.5 w-3.5 ${favoriteProductIds.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                          />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </Card>

        {/* 장바구니 (하단) */}
        <Card
          className="rounded-sm flex flex-col overflow-hidden shrink-0 bg-[#ffffff]"
          style={{
            height: isCartExpanded ? `${cartExpandedHeight}px` : '280px',
            transition: 'height 0.3s ease',
            borderColor: '#ededed',
            borderWidth: '2px',
          }}
        >
          {/* 헤더: 타이틀(좌) + 화살표(중앙) + 선택삭제(우) — 헤더 클릭 시 접기/펴기 */}
          <CardHeader
            className="pb-2 pt-2 px-3 border-b flex flex-row items-center justify-between space-y-0 gap-2 cursor-pointer select-none"
            onClick={handleCartToggle}
            data-testid="button-cart-header-toggle"
          >
            <div className="flex items-center gap-2">
              <CardTitle className="text-[18px] font-extrabold">장바구니</CardTitle>
            </div>
            <div className="flex-1 flex justify-center items-center gap-1 text-gray-400 text-xs select-none">
              {isCartExpanded
                ? <><ChevronDown className="h-4 w-4" /> <span>접기</span></>
                : <><ChevronUp className="h-4 w-4" /> <span>펼치기</span></>
              }
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-3 text-xs"
              onClick={(e) => e.stopPropagation()}
              data-testid="button-delete-selected"
            >
              선택삭제
            </Button>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0">
                <TableRow className="h-7">
                  <TableHead className="h-7 py-1 w-6 text-center">
                    <Checkbox className="h-3 w-3" data-testid="checkbox-cart-all" />
                  </TableHead>
                  <TableHead className="h-7 py-1 text-[13px] font-medium">품목 및 규격</TableHead>
                  <TableHead className="h-7 py-1 text-[13px] text-center font-medium">제약사</TableHead>
                  <TableHead className="h-7 py-1 text-[13px] text-center font-medium">단가</TableHead>
                  <TableHead className="h-7 py-1 text-[13px] text-center font-medium">수량</TableHead>
                  <TableHead className="h-7 py-1 text-[13px] text-right font-medium">판매금액</TableHead>
                  <TableHead className="h-7 py-1 text-[13px] text-center font-medium">삭제</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mainCart.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-[14px] text-gray-400 py-8">
                      장바구니에 담긴 상품이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  mainCart.map((item) => (
                    <TableRow key={item.id} className="h-8">
                      <TableCell className="py-0.5 px-2 w-6 text-center">
                        <Checkbox
                          className="h-3 w-3"
                          checked={cartChecked.has(item.id)}
                          onCheckedChange={(checked) => {
                            setCartChecked(prev => {
                              const s = new Set(prev);
                              checked ? s.add(item.id) : s.delete(item.id);
                              return s;
                            });
                          }}
                          data-testid={`checkbox-cart-item-${item.id}`}
                        />
                      </TableCell>
                      <TableCell className="py-0.5 px-2 text-[14px] font-medium max-w-[160px] truncate" data-testid={`text-cart-name-${item.id}`}>
                        {item.name}
                      </TableCell>
                      <TableCell className="py-0.5 px-2 text-[14px] text-center text-gray-600">{item.manufacturer}</TableCell>
                      <TableCell className="py-0.5 px-2 text-[14px] text-right">{item.price.toLocaleString()}</TableCell>
                      <TableCell className="py-0.5 px-1 text-center">
                        <div className="inline-flex items-center border rounded overflow-hidden">
                          <button
                            type="button"
                            className="h-5 w-5 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-r text-sm font-bold"
                            onClick={() => {
                              setMainCart(prev => prev.map(c =>
                                c.id === item.id ? { ...c, qty: Math.max(1, c.qty - 1) } : c
                              ));
                            }}
                            data-testid={`button-cart-decrement-${item.id}`}
                          >
                            -
                          </button>
                          <span
                            className="w-7 text-center text-[14px] font-bold text-gray-800 select-none"
                            data-testid={`text-cart-qty-${item.id}`}
                          >
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            className="h-5 w-5 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-l text-sm font-bold"
                            onClick={() => {
                              setMainCart(prev => prev.map(c =>
                                c.id === item.id ? { ...c, qty: c.qty + 1 } : c
                              ));
                            }}
                            data-testid={`button-cart-increment-${item.id}`}
                          >
                            +
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="py-0.5 px-2 text-[14px] text-right font-bold">
                        {(item.price * item.qty).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-0.5 px-2 text-center">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="h-4 w-4 flex items-center justify-center mx-auto text-gray-400 hover:text-red-500"
                          data-testid={`button-remove-cart-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>

          {/* 하단 바: 공지 텍스트(좌) + 주문메모 + 주문하기(우) */}
          <div className="border-t px-2 py-1.5 flex items-center gap-2">
            {/* 주문 품목수 / 금액 영역 */}
            <div className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden" data-testid="text-order-summary">
              <span className="text-[13px] text-gray-700 shrink-0">총 주문 품목</span>
              <span className="text-[13px] font-bold text-gray-900 shrink-0" data-testid="text-order-count">{mainCart.length}</span>
              <span className="text-[13px] text-gray-700 shrink-0">건</span>
              <span className="text-[15px] font-extrabold text-red-500 ml-1 shrink-0" data-testid="text-order-total">{cartTotal.toLocaleString()}</span>
              <span className="text-[13px] text-gray-700 shrink-0">원</span>
            </div>
            {/* 주문메모 + 주문하기 */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-gray-500 shrink-0">주문 메모 :</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder=""
                  maxLength={50}
                  className="h-7 w-48 text-xs border rounded px-2 pr-10 outline-none focus:ring-1 focus:ring-blue-300"
                  data-testid="input-order-memo"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">50/50</span>
              </div>
              <Button className="h-8 px-5 text-sm font-bold bg-red-500 hover:bg-red-600 rounded" data-testid="button-order-submit">
                주문하기 &gt;
              </Button>
            </div>
          </div>
        </Card>
      </div>
      {/* 오른쪽 영역: 제품정보 (상단) + 제품출고이력 (하단) */}
      <div className="flex flex-col gap-3 overflow-hidden shrink-0" style={{ width: '430px' }}>
        {/* 제품정보 (상단) - flex-1로 제품품목과 동일 높이 */}
        <Card className="rounded-sm flex flex-col overflow-hidden flex-1 min-h-0 font-semibold text-[16px] bg-[#ffffff]" style={{ borderColor: '#ededed', borderWidth: '2px' }}>
          <CardHeader className="pb-2 pt-2 px-3 border-b flex flex-row items-center justify-between space-y-0 gap-2">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-[18px] font-extrabold">제품정보</CardTitle>
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" className="h-4 px-2 text-[12px] text-white hover-elevate" data-testid="button-same-ingredient" style={{ backgroundColor: selectedColor || "#3b82f6" }}>
                동일성분
              </Button>
              <Button size="sm" className="h-4 px-2 text-[12px] hover-elevate text-[#3b82f6] bg-[#ffffff] border border-primary-border border-t-[#0000001a] border-r-[#0000001a] border-b-[#0000001a] border-l-[#0000001a]" data-testid="button-same-efficacy">
                동일효능
              </Button>
              <Button size="sm" variant="outline" className="h-4 px-2 border-blue-500 text-blue-500 hover:bg-blue-50 text-[12px]" data-testid="button-same-name">주문문의</Button>
            </div>
          </CardHeader>
          <div className="px-3 py-2 border-b">
            <div className="flex items-center gap-3 rounded border border-gray-200 bg-white px-2.5 py-2">
              <div className="min-w-0 flex-1">
                {selectedProduct && (
                  <div className="truncate text-left font-medium text-gray-500 text-[14px]">
                    {selectedProduct.manufacturer}
                  </div>
                )}
                <div className="mt-1 break-words text-left font-extrabold text-[#3d3d3d] text-[18px]">
                  {selectedProduct ? selectedProduct.name : "품목 및 규격"}
                </div>
              </div>
              <div className="flex w-[116px] shrink-0 flex-col gap-1">
                {selectedProduct?.imageUrl ? (
                  <button
                    type="button"
                    onClick={() => setIsDrugImageOpen(true)}
                    aria-label={`${selectedProduct.name} 약품 이미지 크게 보기`}
                    data-testid="button-drug-image-preview"
                    className="group relative h-[72px] w-full overflow-hidden rounded border border-gray-200 bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <img
                      src={selectedProduct.imageUrl}
                      alt={`${selectedProduct.name} 약품 이미지`}
                      className="h-full w-full object-contain p-1"
                    />
                    <span className="absolute right-1 top-1 rounded bg-white/90 p-0.5 text-gray-600 opacity-0 transition-opacity group-hover:opacity-100">
                      <ZoomIn className="h-3.5 w-3.5" />
                    </span>
                  </button>
                ) : (
                  <div
                    aria-label="약품 이미지 없음"
                    className="flex h-[72px] w-full flex-col items-center justify-center gap-1 rounded border border-dashed border-gray-300 bg-gray-50 text-[10px] font-medium text-gray-400"
                  >
                    <ImageOff className="h-4 w-4" />
                    이미지 없음
                  </div>
                )}
                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    disabled={!selectedProduct}
                    onClick={() => setIsDrugDetailsOpen(true)}
                    data-testid="button-drug-details"
                    className="h-5 w-fit self-center rounded border border-blue-200 bg-white px-2 py-0 text-[10px] font-medium leading-none text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    상세보기
                  </button>
                  <button
                    type="button"
                    aria-label={isSelectedProductFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                    aria-pressed={isSelectedProductFavorite}
                    title={isSelectedProductFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                    disabled={!selectedProduct || favoriteLoadState !== "ready" || pendingFavoriteIds.has(selectedProduct?.id)}
                    onClick={() => selectedProduct && void toggleProductFavorite(selectedProduct.id)}
                    data-testid="button-selected-product-favorite"
                    className={`flex h-6 w-6 items-center justify-center rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50 ${
                      isSelectedProductFavorite
                        ? "border-red-300 bg-red-50 text-red-500"
                        : "border-gray-300 bg-white text-gray-500 hover:border-red-300 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${isSelectedProductFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-0 overflow-auto flex-1 flex flex-col">
            {selectedProduct ? (
              <table className="w-full text-[13px] border-collapse">
                <tbody>
                  {/* 제품비고 행 - 상단 테두리 없음 */}
                  <tr className="border-b border-[#e0e0e0]">
                    <td className="text-gray-600 font-medium px-2 py-1.5 border-r border-[#e0e0e0] w-[72px] whitespace-nowrap bg-[#ffffff00]">제품비고</td>
                    <td className="px-2 py-1.5 text-blue-600 font-medium" colSpan={3}>본제품은[생산중지생산미정]입니다</td>
                  </tr>
                  {/* 보험코드 / 규격구분 행 */}
                  <tr className="border-b border-[#e0e0e0]">
                    <td className="bg-[#f0f0f0] text-gray-600 font-medium px-2 py-1.5 border-r border-[#e0e0e0] whitespace-nowrap">보험코드</td>
                    <td className="px-2 py-1.5 border-r border-[#e0e0e0]">{selectedProduct.code || '658600010'}</td>
                    <td className="bg-[#f0f0f0] text-gray-600 font-medium px-2 py-1.5 border-r border-[#e0e0e0] whitespace-nowrap">규격구분</td>
                    <td className="px-2 py-1.5">
                      <div className="flex items-center gap-1">
                        <span>{selectedProduct.packaging}</span>
                        <Badge variant="outline" className="h-4 px-1 rounded inline-flex items-center justify-center border-blue-500 text-blue-600 bg-blue-50 text-[12px]">전문</Badge>
                        <Badge variant="outline" className="h-4 px-1 rounded inline-flex items-center justify-center border-green-500 text-green-600 bg-green-50 text-[12px]">급여</Badge>
                      </div>
                    </td>
                  </tr>
                  {/* 주문단가 / 상위포장 행 */}
                  <tr className="border-b border-[#e0e0e0]">
                    <td className="bg-[#f0f0f0] text-gray-600 font-medium px-2 py-1.5 border-r border-[#e0e0e0] whitespace-nowrap">주문단가</td>
                    <td className="px-2 py-1.5 border-r border-[#e0e0e0]">{selectedProduct.price?.toLocaleString() || '3,090'}</td>
                    <td className="bg-[#f0f0f0] text-gray-600 font-medium px-2 py-1.5 border-r border-[#e0e0e0] whitespace-nowrap">상위포장</td>
                    <td className="px-2 py-1.5">10</td>
                  </tr>
                  {/* 재고수량 / 표준코드 행 */}
                  <tr className="border-b border-[#e0e0e0]">
                    <td className="bg-[#f0f0f0] text-gray-600 font-medium px-2 py-1.5 border-r border-[#e0e0e0] whitespace-nowrap">재고수량</td>
                    <td className="px-2 py-1.5 border-r border-[#e0e0e0]">{selectedProduct.stock || '9'}</td>
                    <td className="bg-[#f0f0f0] text-gray-600 font-medium px-2 py-1.5 border-r border-[#e0e0e0] whitespace-nowrap">표준코드</td>
                    <td className="px-2 py-1.5">8800570013934</td>
                  </tr>
                  {/* 제형구분 / 성분코드 행 */}
                  <tr className="border-b border-[#e0e0e0]">
                    <td className="bg-[#f0f0f0] text-gray-600 font-medium px-2 py-1.5 border-r border-[#e0e0e0] whitespace-nowrap">제형구분</td>
                    <td className="px-2 py-1.5 border-r border-[#e0e0e0]">내복제</td>
                    <td className="bg-[#f0f0f0] text-gray-600 font-medium px-2 py-1.5 border-r border-[#e0e0e0] whitespace-nowrap">성분코드</td>
                    <td className="px-2 py-1.5">179001ATB</td>
                  </tr>
                  {/* 성분분류 행 */}
                  <tr className="border-b border-[#e0e0e0]">
                    <td className="bg-[#f0f0f0] text-gray-600 font-medium px-2 py-1.5 border-r border-[#e0e0e0] whitespace-nowrap">성분분류</td>
                    <td className="px-2 py-1.5" colSpan={3}>239 - 기타의 소화기관용약</td>
                  </tr>
                  {/* 반품 행 */}
                  <tr className="border-t border-[#e0e0e0]">
                    <td className="bg-[#f0f0f0] text-gray-600 font-medium px-2 py-1.5 border-r border-[#e0e0e0] whitespace-nowrap">반품정보</td>
                    <td className="px-2 py-1.5" colSpan={3}>
                      {selectedProduct.returnStatus === "불가" || selectedProduct.returnStatus === "조건" || selectedProduct.returnStatus === "제한" ? (
                        <span className="text-[13px] font-medium text-[#fa0000]" data-testid="text-return-policy">반품불가</span>
                      ) : (
                        <span className="text-[13px] text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                제품을 선택하세요
              </div>
            )}
          </CardContent>
        </Card>
        <Dialog open={isDrugImageOpen} onOpenChange={setIsDrugImageOpen}>
          <DialogContent className="max-w-2xl overflow-hidden p-0">
            <DialogHeader className="border-b px-4 py-3">
              <DialogTitle className="pr-8 text-base">{selectedProduct?.name} 약품 이미지</DialogTitle>
              <DialogDescription className="sr-only">선택한 약품 이미지를 크게 봅니다.</DialogDescription>
            </DialogHeader>
            {selectedProduct?.imageUrl && (
              <>
                <div className="flex min-h-[220px] items-center justify-center bg-gray-50 p-5">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={`${selectedProduct.name} 약품 이미지 확대`}
                    className="max-h-[65vh] w-full object-contain"
                  />
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        <DrugDetailsDialog product={selectedProduct} open={isDrugDetailsOpen} onOpenChange={setIsDrugDetailsOpen} />

        {/* 제품 출고 이력 (하단) - 장바구니(280px)와 동일 높이 */}
        <Card className="rounded-sm flex flex-col overflow-hidden shrink-0 bg-[#ffffff]" style={{ height: '280px', borderColor: '#ededed', borderWidth: '2px' }}>
          <CardHeader className="pb-1 pt-2 px-3 border-b flex flex-row items-center justify-between space-y-0 gap-1">
            <div className="flex items-center gap-2">
              <CardTitle className="whitespace-nowrap text-[18px] font-extrabold">최근 주문내역</CardTitle>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <div className="flex items-center border rounded overflow-hidden shrink-0">
                <button
                  className={`h-5 px-1.5 text-[10px] border-r whitespace-nowrap ${historyPeriod === "thisMonth" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setHistoryPeriod("thisMonth")}
                  data-testid="button-history-this-month"
                >
                  당월
                </button>
                <button
                  className={`h-5 px-1.5 text-[10px] border-r whitespace-nowrap ${historyPeriod === "lastMonth" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setHistoryPeriod("lastMonth")}
                  data-testid="button-history-last-month"
                >3개월</button>
                <button
                  className={`h-5 px-1.5 text-[10px] border-r whitespace-nowrap ${historyPeriod === "6months" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setHistoryPeriod("6months")}
                  data-testid="button-history-6months"
                >
                  6개월
                </button>
                <button
                  className={`h-5 px-1.5 text-[10px] border-r whitespace-nowrap ${historyPeriod === "1year" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setHistoryPeriod("1year")}
                  data-testid="button-history-1year"
                >
                  1년
                </button>
                <button
                  className={`h-5 px-1.5 text-[10px] whitespace-nowrap ${historyPeriod === "2years" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setHistoryPeriod("2years")}
                  data-testid="button-history-2years"
                >더보기</button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0">
                <TableRow className="h-7">
                  <TableHead className="h-7 py-1 text-xs text-center font-extrabold">주문일자</TableHead>
                  <TableHead className="h-7 py-1 text-xs text-center font-extrabold">판매단가</TableHead>
                  <TableHead className="h-7 py-1 text-xs text-center font-extrabold">수량</TableHead>
                  <TableHead className="h-7 py-1 text-xs text-center font-extrabold">금액</TableHead>
                  <TableHead className="h-7 py-1 text-xs text-center font-extrabold">상세</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { date: "2026-01-16", unitPrice: 521400, qty: 1, detail: { purchaseDate: "2026.01.16", productName: "리트모놈SR서방캡셀225mg 50C 한국에보트", qty: 1, expiryDate: "2028.03.31", lotNo: "1250370" } },
                  { date: "2026-01-15", unitPrice: 521400, qty: 4, detail: { purchaseDate: "2026.01.15", productName: "리트모놈SR서방캡셀225mg 50C 한국에보트", qty: 4, expiryDate: "2028.01.20", lotNo: "1250210" } },
                  { date: "2026-01-07", unitPrice: 521400, qty: 2, detail: { purchaseDate: "2026.01.07", productName: "리트모놈SR서방캡셀225mg 50C 한국에보트", qty: 2, expiryDate: "2027.09.15", lotNo: "1240891" } },
                  { date: "2025-12-29", unitPrice: 521400, qty: 1, detail: { purchaseDate: "2025.12.29", productName: "리트모놈SR서방캡셀225mg 50C 한국에보트", qty: 1, expiryDate: "2027.06.20", lotNo: "1240512" } },
                  { date: "2025-12-18", unitPrice: 521400, qty: 1, detail: { purchaseDate: "2025.12.18", productName: "리트모놈SR서방캡셀225mg 50C 한국에보트", qty: 1, expiryDate: "2027.05.10", lotNo: "1240330" } },
                  { date: "2025-12-12", unitPrice: 521400, qty: 1, detail: { purchaseDate: "2025.12.12", productName: "리트모놈SR서방캡셀225mg 50C 한국에보트", qty: 1, expiryDate: "2027.02.28", lotNo: "1240102" } },
                ].map((row, idx) => (
                  <TableRow key={idx} className="h-7 hover:bg-gray-50">
                    <TableCell className="py-0.5 px-2 text-center text-[12px] font-medium">{row.date}</TableCell>
                    <TableCell className="py-0.5 px-2 text-right text-[12px] font-medium">{row.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="py-0.5 px-2 text-center text-[12px] font-medium">{row.qty}</TableCell>
                    <TableCell className="py-0.5 px-2 text-right text-[12px] font-medium">{(row.unitPrice * row.qty).toLocaleString()}</TableCell>
                    <TableCell className="py-0.5 px-2 text-center text-[12px] font-medium">
                      <button
                        className="text-xs text-blue-600 font-extrabold hover:underline"
                        onClick={() => { setHistoryDetailItem(row.detail); setIsHistoryDetailOpen(true); }}
                        data-testid={`button-history-detail-${idx}`}
                      >
                        상세보기
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {/* 일자조회 팝업 다이얼로그 */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="max-w-3xl p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-lg">일자조회</DialogTitle>
          </DialogHeader>
          
          <div className="p-4 space-y-4">
            {/* 기준연도 및 선택된 기간 표시 */}
            <div className="flex items-center justify-center gap-4 p-3 border rounded-md">
              <span className="text-sm">기준연도</span>
              <div className="flex items-center gap-2">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-7 w-7"
                  onClick={() => setCalendarYear(y => y - 1)}
                  data-testid="button-prev-year"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-semibold w-14 text-center">{calendarYear}</span>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-7 w-7"
                  onClick={() => setCalendarYear(y => y + 1)}
                  data-testid="button-next-year"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm ml-4">
                {tempStartDate ? format(tempStartDate, "yyyy-MM-dd") : ""} ~ {tempEndDate ? format(tempEndDate, "yyyy-MM-dd") : ""}
              </span>
            </div>

            {/* 빠른 선택 버튼들 - 1행 */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" className="h-8 px-4" onClick={() => applyQuickRange(today, today)} data-testid="button-today">오늘</Button>
              <Button variant="outline" size="sm" className="h-8 px-4" onClick={() => applyQuickRange(subDays(today, 1), subDays(today, 1))} data-testid="button-yesterday">전일</Button>
              <Button variant="outline" size="sm" className="h-8 px-4" onClick={() => applyQuickRange(startOfWeek(today, { weekStartsOn: 1 }), endOfWeek(today, { weekStartsOn: 1 }))} data-testid="button-this-week">주간</Button>
              <Button variant="outline" size="sm" className="h-8 px-4" onClick={() => applyQuickRange(startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }), endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }))} data-testid="button-last-week">전주</Button>
              <Button variant="outline" size="sm" className="h-8 px-4" onClick={() => applyQuickRange(startOfMonth(today), endOfMonth(today))} data-testid="button-this-month">당월</Button>
              <Button variant="outline" size="sm" className="h-8 px-4" onClick={() => applyQuickRange(startOfMonth(subMonths(today, 1)), endOfMonth(subMonths(today, 1)))} data-testid="button-last-month">전월</Button>
              <Button variant="outline" size="sm" className="h-8 px-4" onClick={() => applyQuickRange(startOfYear(today), endOfYear(today))} data-testid="button-this-year">올해</Button>
            </div>

            {/* 빠른 선택 버튼들 - 2행 */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" className="h-8 px-4" onClick={() => applyQuickRange(new Date(calendarYear, 0, 1), new Date(calendarYear, 5, 30))} data-testid="button-first-half">상반기</Button>
              <Button variant="outline" size="sm" className="h-8 px-4" onClick={() => applyQuickRange(new Date(calendarYear, 6, 1), new Date(calendarYear, 11, 31))} data-testid="button-second-half">하반기</Button>
              <Button variant="outline" size="sm" className="h-8 px-4" onClick={() => applyQuickRange(new Date(calendarYear, 0, 1), new Date(calendarYear, 2, 31))} data-testid="button-q1">1/4분기</Button>
              <Button variant="outline" size="sm" className="h-8 px-4" onClick={() => applyQuickRange(new Date(calendarYear, 3, 1), new Date(calendarYear, 5, 30))} data-testid="button-q2">2/4분기</Button>
              <Button variant="outline" size="sm" className="h-8 px-4" onClick={() => applyQuickRange(new Date(calendarYear, 6, 1), new Date(calendarYear, 8, 30))} data-testid="button-q3">3/4분기</Button>
              <Button variant="outline" size="sm" className="h-8 px-4" onClick={() => applyQuickRange(new Date(calendarYear, 9, 1), new Date(calendarYear, 11, 31))} data-testid="button-q4">4/4분기</Button>
              <Button variant="outline" size="sm" className="h-8 px-4" onClick={() => applyQuickRange(new Date(calendarYear, 0, 1), today)} data-testid="button-until-today">오늘까지</Button>
            </div>

            {/* 월 선택 버튼들 */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                <Button 
                  key={month}
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-12"
                  onClick={() => applyQuickRange(new Date(calendarYear, month - 1, 1), endOfMonth(new Date(calendarYear, month - 1, 1)))}
                  data-testid={`button-month-${month}`}
                >
                  {month}월
                </Button>
              ))}
            </div>

            {/* 두 개의 캘린더 */}
            <div className="flex justify-center gap-8">
              <div className="border rounded-md p-2">
                <div className="flex items-center justify-between mb-2 px-2">
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setLeftMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">{format(leftMonth, "M월 yyyy", { locale: ko })}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setLeftMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Calendar
                  mode="range"
                  selected={{ from: tempStartDate, to: tempEndDate }}
                  onSelect={(range) => {
                    setTempStartDate(range?.from);
                    setTempEndDate(range?.to);
                  }}
                  month={leftMonth}
                  onMonthChange={setLeftMonth}
                  locale={ko}
                  className="rounded-md"
                />
                <div className="flex justify-center mt-2">
                  <Button variant="outline" size="sm" className="h-7 px-4" onClick={() => { setTempStartDate(today); setTempEndDate(today); }}>
                    오늘
                  </Button>
                </div>
              </div>

              <div className="flex items-center text-muted-foreground">~</div>

              <div className="border rounded-md p-2">
                <div className="flex items-center justify-between mb-2 px-2">
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setRightMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">{format(rightMonth, "M월 yyyy", { locale: ko })}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setRightMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Calendar
                  mode="range"
                  selected={{ from: tempStartDate, to: tempEndDate }}
                  onSelect={(range) => {
                    setTempStartDate(range?.from);
                    setTempEndDate(range?.to);
                  }}
                  month={rightMonth}
                  onMonthChange={setRightMonth}
                  locale={ko}
                  className="rounded-md"
                />
                <div className="flex justify-center mt-2">
                  <Button variant="outline" size="sm" className="h-7 px-4" onClick={() => { setTempStartDate(today); setTempEndDate(today); }}>
                    오늘
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t flex justify-end gap-2">
            <Button 
              variant="default" 
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleApplyDates}
              data-testid="button-apply-dates"
            >
              <Check className="h-4 w-4 mr-1" />
              적용
            </Button>
            <Button 
              variant="outline"
              onClick={handleCancelDates}
              data-testid="button-cancel-dates"
            >
              <X className="h-4 w-4 mr-1" />
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* 다빈도주문 팝업 다이얼로그 */}
      <Dialog open={isFrequentOrderOpen} onOpenChange={(open) => !open && handleFrequentOrderClose(false)}>
        <DialogContent className="max-w-[1100px] h-[85vh] p-0 flex flex-col">
          {/* Dark header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white">다빈도주문상품</span>
              <span className="text-xs text-gray-400">최근 3개월동안의 주문 수량, 주문 횟수 등을 고려하여 다빈도 주문상품 정보를 제공합니다.</span>
            </div>
            <button
              className="text-gray-400 hover:text-white text-lg font-bold leading-none"
              onClick={() => handleFrequentOrderClose(false)}
              data-testid="frequent-button-close"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow className="h-9">
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-20">제조사명</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700">상품명</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-14">구분</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-24">규격</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-20">판매가</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-16">재고</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-12">03월</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-12">04월</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-12">05월</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-12">평균</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-20">수량</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-14">반품</TableHead>
                  <TableHead className="h-9 py-1 text-xs text-center font-semibold text-gray-700 w-20">비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFrequentProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="h-10 border-b hover:bg-blue-50"
                    data-testid={`frequent-row-${product.id}`}
                  >
                    <TableCell className="py-1 px-2 text-xs text-center text-gray-700">{product.manufacturer}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-left">
                      <div className="flex items-center gap-1 flex-wrap">
                        {product.badges?.map((badge: string, i: number) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className={cn(
                              "text-[9px] px-1 py-0 h-4 leading-none",
                              badge === "전문" && "bg-blue-50 text-blue-600 border-blue-300",
                              badge === "일반" && "bg-gray-50 text-gray-600 border-gray-300",
                              badge === "급여" && "bg-green-50 text-green-600 border-green-300",
                              badge === "비급여" && "bg-red-50 text-red-500 border-red-300",
                            )}
                          >{badge}</Badge>
                        ))}
                        <span className="text-gray-800">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center text-gray-600">{product.badges?.includes("일반") ? "일반" : "전문"}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center text-gray-700">{product.packaging}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-right text-gray-800">{product.price.toLocaleString()}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center text-gray-800 font-medium">{product.stock.toLocaleString()}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center text-gray-700">{product.prevPrevMonth}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center text-gray-700">{product.prevMonth}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center text-gray-700">{product.thisMonth}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center text-gray-700">{product.avgOrder}</TableCell>
                    <TableCell className="py-1 px-1 text-center">
                      <Input
                        type="text"
                        value={frequentQuantities[product.id] || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^\d+$/.test(value)) {
                            setFrequentQuantities({ ...frequentQuantities, [product.id]: value });
                          }
                        }}
                        className="h-7 w-14 text-xs text-center"
                        data-testid={`frequent-input-qty-${product.id}`}
                      />
                    </TableCell>
                    <TableCell className="py-1 px-2 text-center">
                      {product.returnRestricted && (
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-sm leading-tight" data-testid={`frequent-return-${product.id}`}>
                          불가
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-1 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded text-gray-500 hover:text-blue-600 hover:border-blue-400"
                          onClick={(e) => { e.stopPropagation(); addToFrequentCart(product); }}
                          data-testid={`frequent-button-add-${product.id}`}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={favoriteProductIds.has(product.id) ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                          aria-pressed={favoriteProductIds.has(product.id)}
                          disabled={favoriteLoadState !== "ready" || pendingFavoriteIds.has(product.id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            void toggleProductFavorite(product.id);
                          }}
                          className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded text-gray-400 hover:text-red-500 hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                          data-testid={`frequent-button-fav-${product.id}`}
                        >
                          <Heart className={`h-3.5 w-3.5 ${favoriteProductIds.has(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
      {/* 반품정보 팝업 다이얼로그 */}
      <Dialog open={isReturnInfoOpen} onOpenChange={setIsReturnInfoOpen}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-base font-semibold">제약사반품불가</DialogTitle>
          </DialogHeader>
          <div className="p-4 min-h-[100px]">
            <div className="bg-gray-50 border rounded p-4">
              <p className="text-sm text-gray-700">
                {returnInfoProduct ? getReturnInfoMessage(returnInfoProduct.returnStatus) : ""}
              </p>
            </div>
          </div>
          <DialogFooter className="p-4 border-t flex justify-end">
            <Button 
              variant="secondary"
              className="h-9 px-6"
              onClick={() => setIsReturnInfoOpen(false)}
              data-testid="button-return-info-close"
            >
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isHistoryDetailOpen} onOpenChange={setIsHistoryDetailOpen}>
        <DialogContent className="max-w-xl p-0">
          <DialogHeader className="p-3 border-b bg-blue-600">
            <DialogTitle className="text-sm font-semibold text-white">최근 구입이력 상세</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="h-8">
                  <TableHead className="h-8 py-1 text-xs text-center font-extrabold">구입일자</TableHead>
                  <TableHead className="h-8 py-1 text-xs text-center font-extrabold">제품명</TableHead>
                  <TableHead className="h-8 py-1 text-xs text-center font-extrabold">수량</TableHead>
                  <TableHead className="h-8 py-1 text-xs text-center font-extrabold">유통기한</TableHead>
                  <TableHead className="h-8 py-1 text-xs text-center font-extrabold">LOT번호</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyDetailItem && (
                  <TableRow className="h-8 hover:bg-gray-50">
                    <TableCell className="py-1 px-2 text-xs text-center">{historyDetailItem.purchaseDate}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{historyDetailItem.productName}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{historyDetailItem.qty}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{historyDetailItem.expiryDate}</TableCell>
                    <TableCell className="py-1 px-2 text-xs text-center">{historyDetailItem.lotNo}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center pb-4">
            <Button
              className="h-9 px-8 bg-gray-500 hover:bg-gray-600 text-white"
              onClick={() => setIsHistoryDetailOpen(false)}
              data-testid="button-history-detail-close"
            >
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
