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
import { CompanyLogoEditor } from "@/components/CompanyLogoEditor";
import { useCompanyLogos } from "@/hooks/use-company-logos";
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
  ShoppingCart,
  ChevronDown,
  User,
  LogOut,
  Settings,
  FileText,
  Building2,
  Phone,
  UserCircle2,
  Home,
  Check,
} from "lucide-react";
import { COMPANY_NAMES } from "@shared/company-branding";
import type { OrderCompany } from "@/components/CompanyOrderCards";
import { useState } from "react";
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



function Router({
  selectedColor,
  companies,
  onCompanyChange,
}: {
  selectedColor?: string;
  companies: OrderCompany[];
  onCompanyChange: (company: string) => void;
}) {
  const [, navigate] = useLocation();
  const chooseCompany = (company: string) => {
    onCompanyChange(company);
    navigate("/order");
  };

  return (
    <Switch>
      <Route path="/">
        {() => <HomePage companies={companies} onChooseCompany={chooseCompany} />}
      </Route>
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

const COMPANIES = COMPANY_NAMES;

const COMPANY_META: Record<string, { color: string; hex: string; hexDark: string; initial: string; logoLabel: string; logoImg?: string; headerLogoImg?: string }> = {
  "동원약품":     { color: "bg-[#B30000]",  hex: "#B30000", hexDark: "#800000", initial: "동", logoLabel: "동원약품",    logoImg: dongwonLogoImg, headerLogoImg: dongwonLogoWhiteImg },
  "신덕약품":     { color: "bg-blue-600",   hex: "#2563eb", hexDark: "#1e40af", initial: "신", logoLabel: "신덕약품(주)", logoImg: sindukLogoImg },
  "보덕메디팜":   { color: "bg-gray-800",   hex: "#1f2937", hexDark: "#111827", initial: "보", logoLabel: "보덕메디팜", logoImg: bodukLogoImg },
  "아이팜코리아": { color: "bg-[#00B3B3]",  hex: "#00B3B3", hexDark: "#007a7a", initial: "아", logoLabel: "ipharmkorea", logoImg: ipharmLogoImg },
  "인천약품":     { color: "bg-orange-500", hex: "#f97316", hexDark: "#c2530d", initial: "인", logoLabel: "(주)인천약품", logoImg: incheonLogoImg },
  "신덕팜":       { color: "bg-purple-600", hex: "#9333ea", hexDark: "#6b21a8", initial: "신", logoLabel: "(주)신덕팜" },
};

const ORDER_COMPANIES: OrderCompany[] = COMPANIES.map((name) => ({
  name,
  color: COMPANY_META[name].hex,
  defaultLogo: COMPANY_META[name].logoImg,
  logoLabel: COMPANY_META[name].logoLabel,
}));

function AppHeader({ selectedCompany, onCompanyChange }: { selectedCompany: string; onCompanyChange: (company: string) => void }) {
  const { toggleSidebar } = useSidebar();
  const [location, navigate] = useLocation();
  const isHome = location === "/";
  const cartCount = 3;
  const pendingOrders = 5;

  const selectedMeta = COMPANY_META[selectedCompany];
  const headerBg = selectedMeta.hex;
  const companyLogos = useCompanyLogos();
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<{ company: string; variant: "standard" | "header" } | null>(null);
  const openLogoEditor = (company: string, variant: "standard" | "header") => {
    setCompanyMenuOpen(false);
    setEditingLogo({ company, variant });
  };
  const customHeaderLogo = companyLogos.findLogo(selectedCompany, "header")?.url;
  const currentHeaderLogo = customHeaderLogo
    || selectedMeta.headerLogoImg
    || companyLogos.findLogo(selectedCompany, "standard")?.url
    || selectedMeta.logoImg;

  return (
    <header
      className="shrink-0 z-50 transition-all duration-500"
      style={{ background: headerBg }}
      data-testid="header-main"
    >
      {/* ── Main nav bar ── */}
      <div className="relative flex items-center h-[64px] px-2 gap-1 sm:px-3 sm:gap-3">

        {/* LEFT */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
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
            type="button"
            aria-label="홈으로 이동"
            title="홈으로 이동"
            className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => navigate("/")}
            data-testid="button-brand"
          >
            <Home aria-hidden="true" className="h-5 w-5" />
          </button>

          <div className="flex flex-col gap-0.5 lg:flex-row lg:items-center lg:gap-3">
          <DropdownMenu open={companyMenuOpen} onOpenChange={setCompanyMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-1.5 h-8 px-2 max-[400px]:gap-1 max-[400px]:px-1 rounded border border-white/50 bg-black/20 hover:bg-black/30 transition-colors"
                data-testid="button-company-select"
              >
                <span className="text-[13px] max-[400px]:text-[11px] font-semibold text-white">주문회사 이동</span>
                <ChevronDown className="h-3 w-3 text-white shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="bottom"
              sideOffset={6}
              className="w-[240px] max-w-[calc(100vw-1rem)] p-1.5 rounded-xl border border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.15)] bg-white"
            >
              <DropdownMenuLabel className="px-3 py-2 text-[11px] font-medium text-gray-500">
                주문회사 선택
              </DropdownMenuLabel>
              {COMPANIES.map((company) => {
                const isSelected = selectedCompany === company;
                return (
                  <DropdownMenuItem
                    key={company}
                    role="menuitemradio"
                    aria-checked={isSelected}
                    onSelect={() => onCompanyChange(company)}
                    className={`flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2.5 text-[14px] cursor-pointer focus:bg-blue-50 focus:text-gray-900 ${
                      isSelected
                        ? "bg-blue-50/70 font-semibold text-gray-900"
                        : "text-gray-700"
                    }`}
                    data-testid={`menu-item-company-${company}`}
                  >
                    <span>{company}</span>
                    {isSelected
                      ? <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-blue-600" />
                      : <span aria-hidden="true" className="h-4 w-4 shrink-0" />
                    }
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-1 text-[11px] leading-tight text-white/90 max-sm:text-[9px] lg:gap-1.5 lg:text-[12px]"
            data-testid="text-ordering-company"
          >
            <ShoppingCart aria-hidden="true" className="h-3 w-3 shrink-0 lg:h-3.5 lg:w-3.5" />
            {isHome ? (
              <span>주문할 회사를 선택하세요</span>
            ) : (
              <span>
                <span className="font-semibold text-white text-[14px]">{selectedCompany}</span>
                <span className="max-sm:block sm:before:content-['_']">현재 주문중</span>
              </span>
            )}
          </div>
          </div>

        </div>

        {/* Centered company brand, independent of the width of either control group. */}
        {!isHome && <button
          type="button"
          onClick={() => openLogoEditor(selectedCompany, "header")}
          aria-label={`${selectedCompany} 헤더 로고 편집`}
          title="클릭하여 헤더용 흰색 PNG 로고 업로드"
          className="absolute left-1/2 top-1/2 z-10 flex h-12 w-[120px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-visible px-1.5 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white max-sm:w-[96px] max-[380px]:w-[76px]"
        >
          {currentHeaderLogo
            ? <img src={currentHeaderLogo} alt={`${selectedCompany} 헤더 로고`} className="max-h-10 max-w-full scale-[1.4] object-contain" />
            : <span className="truncate text-center text-sm font-semibold text-white max-[380px]:text-xs">{selectedMeta.logoLabel}</span>}
        </button>}
        {editingLogo && (
          <CompanyLogoEditor
            company={editingLogo.company}
            variant={editingLogo.variant}
            standardFallback={COMPANY_META[editingLogo.company].logoImg}
            headerFallback={COMPANY_META[editingLogo.company].headerLogoImg}
            brandColor={COMPANY_META[editingLogo.company].hex}
            open
            onOpenChange={(open) => { if (!open) setEditingLogo(null); }}
          />
        )}

        <div className="flex-1" />

        {/* RIGHT */}
        <div className="flex items-center gap-1 max-[380px]:gap-0 shrink-0">

          {/* 담당자 연락처 */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="hidden md:flex items-center gap-1 h-8 px-2 rounded border border-white/50 bg-black/20 hover:bg-black/30 transition-colors"
                data-testid="button-contact"
              >
                <Phone className="h-3 w-3 text-white" />
                <span className="text-[11px] text-white font-medium">담당자</span>
                <ChevronDown className="h-2.5 w-2.5 text-white" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
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

          {/* Cart */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="relative h-8 w-8 max-[380px]:h-7 max-[380px]:w-7 text-white hover:bg-black/20"
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

          <div className="h-5 w-px bg-white/40 mx-1 max-sm:hidden" />

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 max-[380px]:gap-1 h-8 pl-1 pr-1.5 max-[380px]:pr-1 rounded-lg hover:bg-black/20 transition-colors group"
                data-testid="button-user-menu"
              >
                <Avatar className="h-6 w-6 max-[380px]:h-5 max-[380px]:w-5 shrink-0">
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
                <ChevronDown className="h-3 w-3 max-[380px]:h-2.5 max-[380px]:w-2.5 text-white/80 group-hover:text-white transition-colors" />
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
                <Router
                  selectedColor={COMPANY_META[selectedCompany]?.hex || "#2563eb"}
                  companies={ORDER_COMPANIES}
                  onCompanyChange={setSelectedCompany}
                />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
