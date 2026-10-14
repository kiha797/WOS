import { Switch, Route, useLocation } from "wouter";
import dongwonLogoImg from "@assets/동원약품_로고.png";
import dongwonLogoWhiteImg from "@assets/동원약품_가로형_(3)_(1)_1781593048629.png";
import ipharmLogoImg from "@assets/image_1781570983758.png";
import sindukLogoImg from "@assets/새_프로젝트_(10)_1781592983347.jpg";
import bodukLogoImg from "@assets/image_1781591627393.png";
import incheonLogoImg from "@assets/image_1781590250606.png";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Menu,
  Bell,
  ShoppingCart,
  ChevronDown,
  User,
  LogOut,
  Settings,
  FileText,
  Building2,
  Search,
  Wallet,
  Package,
  Phone,
  UserCircle2,
  Home,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import HomePage from "@/pages/HomePage";
import OrderPage from "@/pages/OrderPage";
import OnlineOrdersPage from "@/pages/OnlineOrdersPage";
import DepositHistoryPage from "@/pages/DepositHistoryPage";
import BalancePaymentPage from "@/pages/BalancePaymentPage";
import ReturnsRegisterPage from "@/pages/ReturnsRegisterPage";
import SalesLedgerPage from "@/pages/SalesLedgerPage";
import BoardPage from "@/pages/BoardPage";
import ReturnsStatusPage from "@/pages/ReturnsStatusPage";
import RecalledMedicinesPage from "@/pages/RecalledMedicinesPage";
import SerialNumberPage from "@/pages/SerialNumberPage";
import TaxInvoicePage from "@/pages/TaxInvoicePage";
import PriceReductionPage from "@/pages/PriceReductionPage";
import MyPage from "@/pages/MyPage";
import PlaceholderPage from "@/pages/PlaceholderPage";
import NotFound from "@/pages/not-found";



function Router({ selectedColor }: { selectedColor?: string }) {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/order">
        {() => <OrderPage selectedColor={selectedColor} />}
      </Route>
      <Route path="/quick-order">
        {() => <PlaceholderPage title="바로결제주문" description="바로 결제하여 주문하세요" />}
      </Route>
      <Route path="/orders/online" component={OnlineOrdersPage} />
      <Route path="/orders/sales" component={SalesLedgerPage} />
      <Route path="/orders/returns" component={RecalledMedicinesPage} />
      <Route path="/orders/serial" component={SerialNumberPage} />
      <Route path="/orders/tax" component={TaxInvoicePage} />
      <Route path="/orders/price-reduction" component={PriceReductionPage} />
      <Route path="/returns/register" component={ReturnsRegisterPage} />
      <Route path="/returns/status" component={ReturnsStatusPage} />
      <Route path="/returns/detail">
        {() => <PlaceholderPage title="반품상세" description="반품 상세 내역을 확인하세요" />}
      </Route>
      <Route path="/deposit/balance" component={BalancePaymentPage} />
      <Route path="/deposit/history" component={DepositHistoryPage} />
      <Route path="/mypage" component={MyPage} />
      <Route path="/notice">
        {() => <PlaceholderPage title="공지사항" description="공지사항을 확인하세요" />}
      </Route>
      <Route path="/support">
        {() => <PlaceholderPage title="고객센터" description="고객센터에 문의하세요" />}
      </Route>
      <Route path="/remote">
        {() => <PlaceholderPage title="원격지원" description="원격지원을 요청하세요" />}
      </Route>
      <Route path="/board" component={BoardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function HeaderSearch({ onNavigate }: { onNavigate: (url: string) => void }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") inputRef.current?.blur();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const suggestions = [
    { name: "타이레놀정500mg", mfr: "한국얀센" },
    { name: "아스피린프로텍트정100mg", mfr: "바이엘코리아" },
    { name: "메트포르민염산염정500mg", mfr: "동아제약" },
    { name: "오메가3연질캡슐", mfr: "일동제약" },
    { name: "비타민D3소프트캡슐", mfr: "유한양행" },
  ].filter((s) => query.length > 0 && s.name.toLowerCase().includes(query.toLowerCase()));

  const isOpen = focused && (suggestions.length > 0 || query.length > 0);

  return (
    <div className="relative w-full max-w-sm" data-testid="search-wrapper">
      <div
        className={`flex items-center gap-2 h-8 rounded-full border px-3 transition-all duration-200 bg-white ${
          focused
            ? "border-gray-300 shadow-[0_0_0_3px_rgba(0,0,0,0.08)]"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 160)}
          placeholder="주문 상품 검색"
          className="flex-1 bg-transparent text-[13px] text-gray-800 placeholder:text-gray-400 outline-none min-w-0"
          data-testid="input-search"
        />
        <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-gray-200 px-1 py-0.5 text-[10px] text-gray-400 font-mono shrink-0">
          ⌘K
        </kbd>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1.5 left-0 right-0 rounded-xl border border-gray-200 bg-white shadow-[0_8px_32px_rgba(30,64,175,0.2)] overflow-hidden z-[60]">
          {suggestions.length > 0 ? (
            <>
              <div className="px-3 py-1.5 border-b border-gray-100">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">상품 검색 결과</span>
              </div>
              {suggestions.map((s) => (
                <button
                  key={s.name}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-blue-50 transition-colors"
                  onMouseDown={() => { setQuery(s.name); setFocused(false); }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-50 shrink-0">
                      <Package className="h-3 w-3 text-blue-500" />
                    </div>
                    <span className="text-[13px] text-gray-800">{s.name}</span>
                  </div>
                  <span className="text-[11px] text-gray-400">{s.mfr}</span>
                </button>
              ))}
            </>
          ) : (
            <div className="px-3 py-3 text-[12px] text-gray-400 text-center">"{query}" 검색 결과 없음</div>
          )}
          <div className="flex items-center px-3 py-1.5 border-t border-gray-100 bg-blue-50/50">
            <span className="text-[10px] text-gray-400">Enter 검색 · Esc 닫기</span>
          </div>
        </div>
      )}
    </div>
  );
}

const COMPANIES = ["동원약품", "신덕약품", "보덕메디팜", "아이팜코리아", "인천약품", "신덕팜"];

const COMPANY_META: Record<string, { color: string; hex: string; hexDark: string; initial: string; logoLabel: string; logoImg?: string; headerLogoImg?: string }> = {
  "동원약품":     { color: "bg-[#B30000]",  hex: "#B30000", hexDark: "#800000", initial: "동", logoLabel: "동원약품",    logoImg: dongwonLogoImg, headerLogoImg: dongwonLogoWhiteImg },
  "신덕약품":     { color: "bg-blue-600",   hex: "#2563eb", hexDark: "#1e40af", initial: "신", logoLabel: "신덕약품(주)", logoImg: sindukLogoImg },
  "보덕메디팜":   { color: "bg-gray-800",   hex: "#1f2937", hexDark: "#111827", initial: "보", logoLabel: "보덕메디팜", logoImg: bodukLogoImg },
  "아이팜코리아": { color: "bg-[#00B3B3]",  hex: "#00B3B3", hexDark: "#007a7a", initial: "아", logoLabel: "ipharmkorea", logoImg: ipharmLogoImg },
  "인천약품":     { color: "bg-orange-500", hex: "#f97316", hexDark: "#c2530d", initial: "인", logoLabel: "(주)인천약품", logoImg: incheonLogoImg },
  "신덕팜":       { color: "bg-purple-600", hex: "#9333ea", hexDark: "#6b21a8", initial: "신", logoLabel: "(주)신덕팜" },
};

function AppHeader({ selectedCompany, onCompanyChange }: { selectedCompany: string; onCompanyChange: (company: string) => void }) {
  const { toggleSidebar } = useSidebar();
  const [, navigate] = useLocation();
  const cartCount = 3;
  const notifCount = 2;
  const pendingOrders = 5;

  const selectedMeta = COMPANY_META[selectedCompany];
  const headerBg = selectedMeta.hex;

  return (
    <header
      className="shrink-0 z-50 transition-all duration-500"
      style={{ background: headerBg }}
      data-testid="header-main"
    >
      {/* ── Main nav bar ── */}
      <div className="flex items-center h-[64px] px-3 gap-3">

        {/* LEFT */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-black/20"
            onClick={toggleSidebar}
            data-testid="button-sidebar-toggle"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <button
            className="flex items-center justify-center w-6 h-6 rounded-md shrink-0 text-gray-700 bg-white hover:bg-white/90 transition-colors"
            onClick={() => navigate("/")}
            data-testid="button-brand"
          >
            <Home className="h-3.5 w-3.5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="hidden sm:flex items-center gap-1.5 h-8 px-2 rounded border border-white/50 bg-black/20 hover:bg-black/30 transition-colors"
                data-testid="button-company-select"
              >
                <span className="text-[13px] font-semibold text-white">{selectedCompany}</span>
                {(selectedMeta.headerLogoImg || selectedMeta.logoImg) && (
                  <>
                    <span className="h-3 w-px bg-white/40 shrink-0" />
                    {selectedMeta.headerLogoImg ? (
                      <div className="flex items-center justify-center w-[80px] h-[18px] shrink-0 overflow-hidden">
                        <img
                          src={selectedMeta.headerLogoImg}
                          alt={selectedCompany}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-[80px] h-[16px] rounded bg-white shrink-0 overflow-hidden">
                        <img
                          src={selectedMeta.logoImg}
                          alt={selectedCompany}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </>
                )}
                <ChevronDown className="h-3 w-3 text-white shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="bottom"
              sideOffset={6}
              className="w-[350px] p-2 rounded-xl border border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.15)] bg-white"
            >
              {COMPANIES.map((company) => {
                const meta = COMPANY_META[company];
                const isSelected = selectedCompany === company;
                return (
                  <DropdownMenuItem
                    key={company}
                    onClick={() => onCompanyChange(company)}
                    className="flex items-center gap-3 rounded-lg focus:bg-blue-50 px-3 py-2.5 cursor-pointer"
                    data-testid={`menu-item-company-${company}`}
                  >
                    {/* 이니셜 원형 */}
                    <div className={`flex items-center justify-center w-9 h-9 rounded-full ${meta.color} text-white text-[14px] font-bold shrink-0`}>
                      {meta.initial}
                    </div>
                    {/* 회사명 */}
                    <span className={`flex-1 text-[14px] ${isSelected ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                      {company}
                    </span>
                    {/* 회사 로고 */}
                    <div className="w-28 flex items-center justify-start shrink-0">
                      {meta.logoImg ? (
                        <div className="flex items-center justify-center w-[100px] h-[24px] rounded bg-white shrink-0 overflow-hidden px-1">
                          <img
                            src={meta.logoImg}
                            alt={company}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-500 border border-gray-200 rounded px-2 py-0.5 whitespace-nowrap bg-gray-50">
                          {meta.logoLabel}
                        </span>
                      )}
                    </div>
                    {/* 선택 체크 */}
                    {isSelected
                      ? <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      : <span className="h-4 w-4 shrink-0" />
                    }
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 담당자 연락처 */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="hidden sm:flex items-center gap-1 h-8 px-2 rounded border border-white/50 bg-black/20 hover:bg-black/30 transition-colors"
                data-testid="button-contact"
              >
                <Phone className="h-3 w-3 text-white" />
                <span className="text-[11px] text-white font-medium">담당자</span>
                <ChevronDown className="h-2.5 w-2.5 text-white" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side="bottom"
              sideOffset={6}
              className="w-64 p-0 rounded-xl border border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.15)] overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-gray-100" style={{ background: "linear-gradient(135deg,#1e40af,#2563eb)" }}>
                <span className="text-[11px] font-semibold text-white/90">담당자 연락처</span>
              </div>
              <div className="p-2 flex flex-col gap-1">
                <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover-elevate">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 shrink-0">
                    <Building2 className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-semibold text-gray-800">(주)동원약품</span>
                    <a
                      href="tel:053-381-5555"
                      className="text-[12px] text-blue-600 font-medium hover:text-blue-700 transition-colors"
                      data-testid="link-company-phone"
                    >
                      053-381-5555
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover-elevate">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 shrink-0">
                    <UserCircle2 className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-semibold text-gray-800">최상섭</span>
                    <a
                      href="tel:010-2667-4100"
                      className="text-[12px] text-blue-600 font-medium hover:text-blue-700 transition-colors"
                      data-testid="link-manager-phone"
                    >
                      010-2667-4100
                    </a>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

        </div>

        {/* CENTER: search */}
        <div className="flex-1 flex justify-center px-4">
          <HeaderSearch onNavigate={navigate} />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Balance chip */}
          <button
            onClick={() => navigate("/mypage")}
            className="hidden md:flex items-center gap-1 h-7 px-2.5 rounded-full border border-white/40 bg-black/20 hover:bg-black/30 transition-colors ml-1"
            data-testid="button-balance"
          >
            <Wallet className="h-3 w-3 text-white" />
            <span className="text-[11px] font-bold text-white tracking-tight">20,370,332</span>
            <span className="text-[10px] text-white/80">원</span>
          </button>

          <div className="h-5 w-px bg-white/40 mx-1" />

          {/* Notification */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="relative h-8 w-8 text-white hover:bg-black/20"
                data-testid="button-notifications"
              >
                <Bell className="h-4 w-4" />
                {notifCount > 0 && (
                  <>
                    <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-red-400 opacity-40 animate-ping" />
                    <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white leading-none">
                      {notifCount}
                    </span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">공지 알림 {notifCount}건</TooltipContent>
          </Tooltip>

          {/* Cart */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="relative h-8 w-8 text-white hover:bg-black/20"
                onClick={() => navigate("/")}
                data-testid="button-cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[8px] font-bold text-blue-600 leading-none">
                    {cartCount}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">장바구니 {cartCount}개</TooltipContent>
          </Tooltip>

          <div className="h-5 w-px bg-white/40 mx-1" />

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 h-8 pl-1 pr-1.5 rounded-lg hover:bg-black/20 transition-colors group"
                data-testid="button-user-menu"
              >
                <Avatar className="h-6 w-6 shrink-0">
                  <AvatarFallback
                    className="text-[10px] font-bold text-gray-700 bg-white"
                  >
                    김
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
                  <span className="text-[12px] font-semibold text-white leading-none">김은영 약사</span>
                  <span className="text-[10px] text-white/80 leading-none">새봄약국</span>
                </div>
                <ChevronDown className="h-3 w-3 text-white/80 group-hover:text-white transition-colors" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-60 mt-1 p-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
            >
              {/* Profile header */}
              <div className="px-4 pt-4 pb-3 border-b border-gray-100" style={{ background: "linear-gradient(135deg,#1e40af,#2563eb)" }}>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="text-sm font-bold text-blue-700 bg-white">
                      김
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-white">김은영 약사</span>
                    <span className="text-[11px] text-blue-100/70">새봄약국 · dongwon@example.com</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  <div className="rounded-lg bg-white/10 border border-white/15 px-2.5 py-2">
                    <div className="text-[10px] text-blue-100/70 mb-0.5">당월잔고</div>
                    <div className="text-[12px] font-bold text-emerald-300">143,241,281원</div>
                  </div>
                  <div className="rounded-lg bg-white/10 border border-white/15 px-2.5 py-2">
                    <div className="text-[10px] text-blue-100/70 mb-0.5">오늘 주문</div>
                    <div className="text-[12px] font-bold text-white">{pendingOrders}건</div>
                  </div>
                </div>
              </div>

              <div className="p-1.5">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => navigate("/mypage")}
                    className="rounded-lg text-[13px] text-gray-600 hover:text-gray-900 focus:text-gray-900 focus:bg-blue-50 gap-2.5 px-2.5 py-2"
                    data-testid="menu-item-mypage"
                  >
                    <User className="h-3.5 w-3.5 text-blue-400" />
                    마이페이지
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/orders/online")}
                    className="rounded-lg text-[13px] text-gray-600 hover:text-gray-900 focus:text-gray-900 focus:bg-blue-50 gap-2.5 px-2.5 py-2"
                    data-testid="menu-item-orders"
                  >
                    <FileText className="h-3.5 w-3.5 text-blue-400" />
                    주문내역
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-lg text-[13px] text-gray-600 hover:text-gray-900 focus:text-gray-900 focus:bg-blue-50 gap-2.5 px-2.5 py-2"
                    data-testid="menu-item-settings"
                  >
                    <Settings className="h-3.5 w-3.5 text-blue-400" />
                    설정
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1 bg-gray-100" />
                <DropdownMenuItem
                  className="rounded-lg text-[13px] text-gray-600 hover:text-gray-900 focus:text-gray-900 focus:bg-blue-50 gap-2.5 px-2.5 py-2"
                  data-testid="menu-item-company"
                >
                  <Building2 className="h-3.5 w-3.5 text-blue-400" />
                  주식회사 동원약품
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-gray-100" />
                <DropdownMenuItem
                  className="rounded-lg text-[13px] text-red-500 hover:text-red-600 focus:text-red-600 focus:bg-red-50 gap-2.5 px-2.5 py-2"
                  data-testid="menu-item-logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  로그아웃
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [selectedCompany, setSelectedCompany] = useState("동원약품");
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "5rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex flex-col h-screen w-full">
            <AppHeader selectedCompany={selectedCompany} onCompanyChange={setSelectedCompany} />
            <div className="flex flex-1 overflow-hidden">
              <AppSidebar selectedColor={COMPANY_META[selectedCompany]?.hex || "#2563eb"} />
              <main className="flex-1 overflow-hidden bg-gray-50">
                <Router selectedColor={COMPANY_META[selectedCompany]?.hex || "#2563eb"} />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
