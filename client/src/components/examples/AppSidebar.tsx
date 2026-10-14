import { AppSidebar } from '../app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <h2 className="text-lg font-semibold">사이드바 예제</h2>
          <p className="text-sm text-muted-foreground mt-2">
            좌측 사이드바를 접거나 펼칠 수 있습니다.
          </p>
        </div>
      </div>
    </SidebarProvider>
  );
}
