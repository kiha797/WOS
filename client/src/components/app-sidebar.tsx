import { 
  ShoppingCart, 
  ClipboardList, 
  RotateCcw,
  Wallet, 
  ChevronDown,
  ChevronUp,
  Bell,
  ExternalLink,
  UserCircle,
  Sparkles,
  Monitor,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link, useLocation } from "wouter";

import ___WOS__________ from "@assets/유팜몰WOS_배너영역- 복사본.jpg";

import ___WOS____________1_ from "@assets/유팜몰WOS_배너영역- 복사본 (1).jpg";

const menuItems = [
  {
    title: "주문하기",
    url: "/order",
    icon: ShoppingCart,
    highlight: true,
  },
  {
    title: "주문관리",
    icon: ClipboardList,
    items: [
      { title: "온라인주문내역", url: "/orders/online" },
      { title: "매출원장", url: "/orders/sales" },
      { title: "품목수불(일련번호)", url: "/orders/serial" },
      { title: "세금계산서", url: "/orders/tax" },
      { title: "약가인하상품", url: "/orders/price-reduction" },
      { title: "회수의약품", url: "/orders/returns" },
    ],
  },
  {
    title: "반품",
    icon: RotateCcw,
    items: [
      { title: "반품등록", url: "/returns/register" },
      { title: "반품현황", url: "/returns/status" },
      { title: "반품상세", url: "/returns/detail" },
    ],
  },
  {
    title: "결제",
    icon: Wallet,
    items: [
      { title: "잔고결제", url: "/deposit/balance" },
      { title: "결제내역", url: "/deposit/history" },
    ],
  },
  {
    title: "마이페이지",
    url: "/mypage",
    icon: UserCircle,
  },
];

const footerItems = [
  { title: "유팜몰", url: "https://www.upharmmall.co.kr/", icon: ExternalLink, external: true },
  { title: "고객센터", url: "/notice", icon: Bell, external: false },
  { title: "원격지원", url: "https://www.anydesk.com/", icon: Monitor, external: true },
];

export function AppSidebar({ selectedColor }: { selectedColor?: string }) {
  const [location] = useLocation();

  return (
    <Sidebar collapsible="icon" data-testid="sidebar-main" className="border-r">
      <SidebarContent className="py-2">
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {menuItems.map((item) => {
                const isActive = location === item.url;
                
                if (item.items) {
                  return (
                    <Collapsible key={item.title} asChild defaultOpen={item.items.some(sub => sub.url === location)} className="group/collapsible">
                      <SidebarMenuItem className="my-0">
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton 
                            tooltip={item.title}
                            data-testid={`sidebar-menu-${item.title}`}
                            className="h-10 px-3 py-2 hover:bg-sidebar-accent group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:py-3 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-1"
                          >
                            <item.icon className="h-5 w-5 shrink-0 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6" />
                            <span className="font-medium group-data-[collapsible=icon]:text-[11px] group-data-[collapsible=icon]:text-center group-data-[collapsible=icon]:leading-tight text-[16px]">{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:hidden group-data-[collapsible=icon]:hidden" />
                            <ChevronUp className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=closed]/collapsible:hidden group-data-[collapsible=icon]:hidden" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                          <SidebarMenuSub className="ml-0 border-l-0 px-0 gap-0.5">
                            {item.items.map((subItem) => {
                              const isSubActive = location === subItem.url;
                              return (
                                <SidebarMenuSubItem key={subItem.title} className="my-0">
                                  <SidebarMenuSubButton 
                                    asChild 
                                    isActive={isSubActive}
                                    data-testid={`sidebar-submenu-${subItem.title}`}
                                    className="h-9 pl-12 pr-3 py-2 text-[14px]"
                                  >
                                    <Link href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }


                if (item.highlight) {
                  return (
                    <SidebarMenuItem key={item.title} className="my-1 px-2 group-data-[collapsible=icon]:px-1">
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        data-testid={`sidebar-menu-${item.title}`}
                        className="h-[53px] justify-center rounded-lg text-white hover-elevate group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:py-3 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-1"
                        style={{ backgroundColor: selectedColor || "#2563eb" }}
                      >
                        <Link href={item.url!}>
                          <item.icon className="h-5 w-5 shrink-0 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6" />
                          <span className="group-data-[collapsible=icon]:text-[11px] group-data-[collapsible=icon]:text-center group-data-[collapsible=icon]:leading-tight text-[15px] font-bold">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title} className="my-0">
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                      data-testid={`sidebar-menu-${item.title}`}
                      className="h-10 px-3 py-2 hover:bg-sidebar-accent group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:py-3 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-1 text-[16px] font-bold"
                    >
                      <Link href={item.url!}>
                        <item.icon className="h-5 w-5 shrink-0 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6" />
                        <span className="group-data-[collapsible=icon]:text-[11px] group-data-[collapsible=icon]:text-center group-data-[collapsible=icon]:leading-tight text-[16px] font-normal">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto p-0">
        <SidebarSeparator />
        <SidebarMenu className="flex w-full min-w-0 flex-col gap-0.5 py-2 px-2 text-[13px]">
          {footerItems.map((item) => {
            const isActive = !item.external && location === item.url;
            return (
              <SidebarMenuItem key={item.title} className="my-0">
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive}
                  tooltip={item.title}
                  data-testid={`sidebar-footer-${item.title}`}
                  className="h-9 px-3 py-2 hover:bg-sidebar-accent group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-1"
                >
                  {item.external ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <item.icon className="h-4 w-4 shrink-0 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                      <span className="group-data-[collapsible=icon]:text-[10px] group-data-[collapsible=icon]:text-center group-data-[collapsible=icon]:leading-tight text-[16px]">{item.title}</span>
                    </a>
                  ) : (
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4 shrink-0 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                      <span className="group-data-[collapsible=icon]:text-[10px] group-data-[collapsible=icon]:text-center group-data-[collapsible=icon]:leading-tight text-[16px]">{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        {/* Banner area – 공지사항/유팜몰 아래 맨 하단, 아이콘 모드 시 숨김 */}
        <div className="flex flex-col gap-0 border-t border-sidebar-border group-data-[collapsible=icon]:hidden">
          <a
            href="#"
            data-testid="sidebar-banner-1"
            className="block w-full overflow-hidden transition-opacity hover:opacity-90"
          >
            <img
              src={___WOS____________1_}
              alt="이달의 특가 브레이닝캡슐"
              className="w-full object-cover"
              style={{ display: "block", maxHeight: "90px" }}
            />
          </a>
          <a
            href="#"
            data-testid="sidebar-banner-2"
            className="block w-full overflow-hidden transition-opacity hover:opacity-90"
          >
            <img
              src="/banner2.jpg"
              alt="배너 2"
              className="w-full object-cover"
              style={{ display: "block", maxHeight: "90px" }}
            />
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
