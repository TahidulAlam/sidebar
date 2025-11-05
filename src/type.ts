import type { ReactNode } from "react";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  href?: string;
  badge?: number | string;
  disabled?: boolean;
  subItems?: SidebarItem[];
}

export interface SidebarSection {
  id?: string;
  title?: string;
  items: SidebarItem[];
}

export interface SidebarUser {
  avatar: string;
  name: string;
  role: string;
}

export interface MobileSidebarControls {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

export interface SidebarProps {
  sections: SidebarSection[];
  containerClassName?: string;
  profileClassName?: string;
  navClassName?: string;
  sectionTitleClassName?: string;
  itemClassName?: string;
  submenuFloatingClassName?: string;
  collapseToggleClassName?: string;
  activeItemId?: string;
  onItemClick: (id: string, item: SidebarItem) => void;
  user?: SidebarUser;
  showProfile?: boolean;
  className?: string;
  header?: ReactNode;
  variant?: "default" | "compact" | "floating" | "fullscreen";
  toggleDeskBtnPosition?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

  toggleDeskBtnClass?: string;
  showActiveIndicator?: boolean;
  hideOnDesk?: boolean;
  toggleDesk?: boolean;
  mobileBreakpoint?: number;
  position?: "left" | "right";
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  collapseTogglePosition?: "top" | "bottom";
}
