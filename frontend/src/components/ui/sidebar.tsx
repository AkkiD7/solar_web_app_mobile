import { PanelLeft } from 'lucide-react';
import { createContext, useContext, useEffect, useMemo, useState, type CSSProperties } from 'react';
import type * as React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
  state: 'expanded' | 'collapsed';
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [openMobile, setOpenMobile] = useState(false);
  const open = openProp ?? uncontrolledOpen;

  const setOpen = (value: boolean) => {
    onOpenChange?.(value);
    if (openProp === undefined) setUncontrolledOpen(value);
  };

  const value = useMemo<SidebarContextValue>(
    () => ({
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      toggleSidebar: () => setOpen(!open),
      state: open ? 'expanded' : 'collapsed',
    }),
    [open, openMobile]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-wrapper"
        data-state={open ? 'expanded' : 'collapsed'}
        style={
          {
            '--sidebar-width': '17rem',
            '--sidebar-width-icon': '4.25rem',
            ...style,
          } as CSSProperties
        }
        className={cn('group/sidebar-wrapper flex min-h-svh w-full bg-background text-foreground', className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({ className, children, ...props }: React.ComponentProps<'div'>) {
  const { open, openMobile, setOpenMobile } = useSidebar();
  const content = (
    <div
      data-slot="sidebar"
      data-state={open ? 'expanded' : 'collapsed'}
      className={cn('flex h-full w-full flex-col bg-sidebar text-sidebar-foreground', className)}
      {...props}
    >
      {children}
    </div>
  );

  return (
    <>
      <aside
        data-slot="sidebar-desktop"
        data-state={open ? 'expanded' : 'collapsed'}
        className={cn(
          'hidden h-svh shrink-0 border-r border-sidebar-border transition-[width] duration-200 md:block',
          open ? 'w-[var(--sidebar-width)]' : 'w-[var(--sidebar-width-icon)]'
        )}
      >
        {content}
      </aside>
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground">
          {content}
        </SheetContent>
      </Sheet>
    </>
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return <main data-slot="sidebar-inset" className={cn('flex min-w-0 flex-1 flex-col', className)} {...props} />;
}

function SidebarTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, setOpenMobile } = useSidebar();
  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn('md:hidden', className)}
      onClick={() => setOpenMobile(true)}
      {...props}
    >
      <PanelLeft className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarDesktopTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button variant="ghost" size="icon" className={cn('hidden md:inline-flex', className)} onClick={toggleSidebar} {...props}>
      <PanelLeft className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-header" className={cn('flex min-h-16 flex-col gap-2 p-3', className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-content" className={cn('flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-3', className)} {...props} />;
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-footer" className={cn('flex flex-col gap-2 p-3', className)} {...props} />;
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-group" className={cn('relative flex w-full min-w-0 flex-col gap-1', className)} {...props} />;
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-group-label" className={cn('px-2 py-1 text-xs font-medium uppercase tracking-wide text-sidebar-foreground/50 group-data-[state=collapsed]/sidebar-wrapper:hidden', className)} {...props} />;
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-group-content" className={cn('w-full text-sm', className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul data-slot="sidebar-menu" className={cn('flex w-full min-w-0 flex-col gap-1', className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="sidebar-menu-item" className={cn('group/menu-item relative', className)} {...props} />;
}

function SidebarMenuButton({
  className,
  isActive,
  tooltip,
  children,
  ...props
}: React.ComponentProps<'button'> & {
  isActive?: boolean;
  tooltip?: string;
}) {
  const button = (
    <button
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(
        'flex h-9 w-full items-center gap-2 overflow-hidden rounded-md px-2 text-left text-sm outline-none transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground group-data-[state=collapsed]/sidebar-wrapper:justify-center',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );

  if (!tooltip) return button;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" className="group-data-[state=expanded]/sidebar-wrapper:hidden">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      className={cn('absolute inset-y-0 right-0 hidden w-2 translate-x-1/2 transition-colors hover:bg-sidebar-border md:block', className)}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarDesktopTrigger,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
};
