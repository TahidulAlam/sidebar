/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */

"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MdExpandMore,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
} from "react-icons/md";
import { BiMenu } from "react-icons/bi";
import type {
  MobileSidebarControls,
  SidebarItem,
  SidebarProps,
  SidebarSection,
} from "../type";

interface SubmenuState {
  isOpen: boolean;
  isAnimating: boolean;
  height: number;
}

/* ------------------------------------------------------------------ */
/* Position helpers                                                   */
/* ------------------------------------------------------------------ */
const usePositionClasses = (position: "left" | "right", isOpen: boolean) => {
  const mobile = {
    container: position === "left" ? "left-0" : "right-0",
    transform: isOpen
      ? "translate-x-0"
      : position === "left"
      ? "-translate-x-full"
      : "translate-x-full",
  };
  const desktop = position === "left" ? "left-0" : "right-0";
  const toggleBtn = position === "left" ? "left-4" : "right-4";
  const collapseBtn = position === "left" ? "right-3.5" : "left-3.5";

  return { mobile, desktop, toggleBtn, collapseBtn };
};

const useToggleDeskBtnClasses = (
  btnPos: SidebarProps["toggleDeskBtnPosition"] = "top-left"
) => {
  const map: Record<
    NonNullable<SidebarProps["toggleDeskBtnPosition"]>,
    string
  > = {
    "top-left": "top-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
  };
  return map[btnPos];
};

/* ------------------------------------------------------------------ */
/* Submenu position based on sidebar side                             */
/* ------------------------------------------------------------------ */
const useSubmenuPosition = (sidebarPosition: "left" | "right") => {
  return sidebarPosition === "left"
    ? { floating: "left-full ml-2", indent: "pl-8" }
    : { floating: "right-full mr-2", indent: "pr-8" };
};

/* ------------------------------------------------------------------ */
/* Smooth open/close animation for toggleDesk                         */
/* ------------------------------------------------------------------ */
const useToggleAnimation = (isVisible: boolean, position: "left" | "right") => {
  const base = isVisible
    ? "translate-x-0 opacity-100 scale-100"
    : "opacity-0 scale-95";
  const translate = isVisible
    ? "translate-x-0"
    : position === "left"
    ? "-translate-x-8"
    : "translate-x-8";
  return `${base} ${translate} transition-all duration-500 ease-out`;
};

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */
const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeItemId,
  onItemClick,
  user,
  showProfile = true,
  className = "",
  containerClassName = "",
  profileClassName = "",
  navClassName = "",
  sectionTitleClassName = "",
  itemClassName = "",
  submenuFloatingClassName = "",
  collapseToggleClassName = "",
  toggleDeskBtnClass = "",
  variant = "default",
  showActiveIndicator = true,
  hideOnDesk = false,
  toggleDesk = false,
  mobileBreakpoint = 768,
  position = "left",
  collapsible = false,
  collapsed: collapsedControlled,
  defaultCollapsed = false,
  onCollapseChange,
  collapseTogglePosition = "top",
  toggleDeskBtnPosition = "top-left",
}) => {
  /* --------------------- responsive detection --------------------- */
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => window.innerWidth < mobileBreakpoint;
    const onResize = () => {
      const mobile = check();
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    setIsMobile(check());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileBreakpoint]);

  /* --------------------- mobile drawer state --------------------- */
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const mobileControls: MobileSidebarControls = {
    isOpen: isMobileOpen,
    onOpen: () => setIsMobileOpen(true),
    onClose: () => setIsMobileOpen(false),
    onToggle: () => setIsMobileOpen((p) => !p),
  };

  /* --------------------- desktop visibility (toggleDesk) -------- */
  const [isDesktopVisible, setIsDesktopVisible] = useState(!hideOnDesk);

  /* --------------------- collapse (icons-only) ------------------- */
  const [collapsedInternal, setCollapsedInternal] =
    useState<boolean>(defaultCollapsed);
  const collapsed =
    typeof collapsedControlled === "boolean"
      ? collapsedControlled
      : collapsedInternal;

  const toggleCollapse = () => {
    const next =
      typeof collapsedControlled === "boolean"
        ? !collapsedControlled
        : !collapsedInternal;

    if (typeof collapsedControlled === "boolean") {
      onCollapseChange?.(next);
    } else {
      setCollapsedInternal(next);
      onCollapseChange?.(next);
    }
  };

  /* --------------------- submenu state -------------------------- */
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
  const [submenuStates, setSubmenuStates] = useState<Map<string, SubmenuState>>(
    new Map()
  );
  const submenuRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const map = new Map<string, SubmenuState>();
    const walk = (items: SidebarItem[]) => {
      items.forEach((it) => {
        if (it.subItems?.length) {
          map.set(it.id, {
            isOpen: openSubmenus.has(it.id),
            isAnimating: false,
            height: 0,
          });
          walk(it.subItems);
        }
      });
    };
    sections.forEach((s) => walk(s.items));
    setSubmenuStates(map);
  }, [sections]);

  useEffect(() => {
    const update = () => {
      setSubmenuStates((prev) => {
        const next = new Map(prev);
        openSubmenus.forEach((id) => {
          const el = submenuRefs.current.get(id);
          if (el) {
            next.set(id, {
              ...prev.get(id)!,
              height: el.scrollHeight,
              isOpen: true,
            });
          }
        });
        prev.forEach((st, id) => {
          if (!openSubmenus.has(id)) {
            next.set(id, { ...st, isOpen: false, height: 0 });
          }
        });
        return next;
      });
    };
    requestAnimationFrame(update);
  }, [openSubmenus]);

  const toggleSubmenu = (id: string) => {
    setSubmenuStates((p) => {
      const n = new Map(p);
      const s = n.get(id);
      if (s) n.set(id, { ...s, isAnimating: true });
      return n;
    });

    setOpenSubmenus((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

    setTimeout(() => {
      setSubmenuStates((p) => {
        const n = new Map(p);
        const s = n.get(id);
        if (s) n.set(id, { ...s, isAnimating: false });
        return n;
      });
    }, 300);
  };

  /* --------------------- style presets --------------------------- */
  const styleConfig = {
    default: {
      container: "bg-white rounded-2xl shadow-lg overflow-visible",
      item: "px-4 py-3",
      iconSize: 18,
      width: "w-64",
      collapsedWidth: "w-20",
    },
    compact: {
      container: "bg-white rounded-lg shadow overflow-visible",
      item: "px-3 py-2",
      iconSize: 16,
      width: "w-48",
      collapsedWidth: "w-16",
    },
    floating: {
      container:
        "bg-white rounded-2xl shadow-xl border border-gray-200 overflow-visible",
      item: "px-4 py-3",
      iconSize: 18,
      width: "w-64",
      collapsedWidth: "w-20",
    },
    fullscreen: {
      container: "",
      item: "px-6 py-4",
      iconSize: 20,
      width: "w-full",
      collapsedWidth: "w-24",
    },
  } as const;
  const cfg = styleConfig[variant];

  /* --------------------- position helpers ----------------------- */
  const pos = usePositionClasses(position, isMobileOpen);
  const toggleDeskBtnCls = useToggleDeskBtnClasses(toggleDeskBtnPosition);
  const submenuPos = useSubmenuPosition(position);
  const animationCls = useToggleAnimation(isDesktopVisible, position);

  /* --------------------- render helpers -------------------------- */
  const renderIcon = (Icon?: React.ElementType, size?: number) =>
    Icon ? (
      <Icon
        size={size ?? cfg.iconSize}
        className="shrink-0 text-primary transition-transform duration-200 group-hover:scale-110"
      />
    ) : null;

  const renderBadge = (b?: number | string) =>
    b ?? b === 0 ? (
      <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium min-w-5 text-center animate-pulse">
        {b}
      </span>
    ) : null;

  const getItemClass = (item: SidebarItem) => {
    const active = showActiveIndicator
      ? "bg-linear-to-r from-green-50 to-transparent text-green-700 font-medium border-l-4 border-l-green-500 shadow-sm"
      : "bg-gray-100 text-gray-900 font-medium";

    const base = `group flex items-center w-full text-sm rounded-lg ${cfg.item} transition-all duration-300 ease-out ${itemClassName}`;
    const disabled = item.disabled ? "opacity-50 cursor-not-allowed" : "";
    const hover = item.disabled
      ? ""
      : "hover:bg-gray-50 hover:shadow-md hover:translate-x-1 text-gray-800";

    const state = activeItemId === item.id ? active : hover;
    return `${base} ${disabled} ${state}`;
  };

  /* --------------------- items & sections ------------------------ */
  const renderItems = (items: SidebarItem[], depth = 0): React.ReactNode =>
    items.map((item) => {
      const hasSub = !!item.subItems?.length;
      const isOpen = openSubmenus.has(item.id);
      const subState = submenuStates.get(item.id);
      const baseCls = getItemClass(item);
      const indent = depth > 0 ? submenuPos.indent : "";

      const content = (
        <div
          className={`flex items-center justify-between w-full ${indent} transition-all duration-200`}
        >
          <div className="flex items-center gap-3">
            {renderIcon(item.icon)}
            {!collapsed && (
              <span className="truncate font-medium">{item.label}</span>
            )}
            {!collapsed && renderBadge(item.badge)}
          </div>

          {hasSub && !collapsed && (
            <MdExpandMore
              size={cfg.iconSize}
              className={`transition-transform duration-300 ease-in-out ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      );

      const FloatingSub =
        hasSub && collapsed ? (
          <div
            className={`absolute top-0 hidden group-hover:block z-50 min-w-[220px] ${submenuPos.floating} transition-all duration-300 ease-out ${submenuFloatingClassName}`}
          >
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 backdrop-blur-sm">
              <div className="font-bold text-sm mb-3 text-gray-700">
                {item.label}
              </div>
              <div className="space-y-1">
                {item.subItems!.map((si) => (
                  <a
                    key={si.id}
                    href={si.href ?? "#"}
                    onClick={(e) => {
                      e.preventDefault();
                      onItemClick(si.id, si);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-linear-to-r hover:from-blue-50 hover:to-transparent text-sm font-medium transition-all duration-200"
                  >
                    {si.icon && <si.icon size={16} />}
                    <span>{si.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : null;

      if (hasSub) {
        return (
          <div key={item.id} className="relative group ">
            <button
              onClick={() => !item.disabled && toggleSubmenu(item.id)}
              disabled={item.disabled}
              className={`${baseCls} ${collapsed ? "justify-center" : ""}`}
            >
              {content}
            </button>

            {!collapsed ? (
              <div
                ref={(el) => {
                  if (el) submenuRefs.current.set(item.id, el);
                  else submenuRefs.current.delete(item.id);
                }}
                className={`
      transition-all duration-300 ease-in-out overflow-auto
      ${subState?.isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
     
    `}
                style={{
                  // Use max-height for smooth scrollable collapse
                  maxHeight: subState?.isOpen ? subState.height : 0,
                }}
              >
                <div
                  className={`
        mt-2 space-y-1 pl-4 border-l-2 border-gray-100
        transition-opacity duration-300
        ${subState?.isOpen ? "pointer-events-auto" : "pointer-events-none"}
      `}
                >
                  {renderItems(item.subItems!, depth + 1)}
                </div>
              </div>
            ) : (
              FloatingSub
            )}
          </div>
        );
      }

      return (
        <button
          key={item.id}
          onClick={() => !item.disabled && onItemClick(item.id, item)}
          disabled={item.disabled}
          className={`${baseCls} ${collapsed ? "justify-center" : ""}`}
        >
          {content}
        </button>
      );
    });

  const renderSections = (secs: SidebarSection[]) =>
    secs.map((s, i) => (
      <div key={s.id ?? i} className="space-y-3">
        {!collapsed && s.title && (
          <div
            className={`text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1 transition-all duration-300 ${sectionTitleClassName}`}
          >
            {s.title}
          </div>
        )}
        <div className="space-y-1">{renderItems(s.items)}</div>
      </div>
    ));

  /* --------------------- width class ----------------------------- */
  const widthCls = collapsed ? cfg.collapsedWidth : cfg.width;
  const isFullScreen = variant === "fullscreen" && toggleDesk;

  /* --------------------- Desktop Sidebar ------------------------- */
  const DesktopSidebar = (
    <aside
      className={`
        ${
          isFullScreen
            ? "fixed inset-0 z-50 bg-white"
            : `fixed inset-y-0 ${widthCls}`
        }
        ${cfg.container} ${containerClassName} ${className}
        flex flex-col ${pos.desktop}
        ${animationCls}
        ${isFullScreen ? "backdrop-blur-sm" : ""}
      `}
      style={{
        transition:
          "transform 0.5s ease-out, opacity 0.5s ease-out, backdrop-filter 0.5s ease-out",
      }}
    >
      {/* collapse toggle */}
      {collapsible && !isFullScreen && (
        <div
          className={`
            absolute ${collapseTogglePosition === "top" ? "top-3" : "bottom-6"}
            ${pos.collapseBtn} z-50
          `}
        >
          <button
            onClick={toggleCollapse}
            className={`
              w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 
              flex items-center justify-center hover:scale-110 
              transition-all duration-300 ease-out ${collapseToggleClassName}
            `}
          >
            {position === "left" ? (
              collapsed ? (
                <MdChevronRight className="text-gray-600" />
              ) : (
                <MdChevronLeft className="text-gray-600" />
              )
            ) : collapsed ? (
              <MdChevronLeft className="text-gray-600" />
            ) : (
              <MdChevronRight className="text-gray-600" />
            )}
          </button>
        </div>
      )}

      {/* profile */}
      {showProfile && user && (
        <div
          className={`
            p-4 border-b flex items-center gap-4 transition-all duration-300
            ${collapsed ? "justify-center" : ""} ${profileClassName}
          `}
        >
          <img
            src={user.avatar}
            alt={user.name}
            width={collapsed ? 40 : 48}
            height={collapsed ? 40 : 48}
            className="rounded-full ring-2 ring-gray-200 transition-all duration-300"
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          )}
        </div>
      )}
      {/* overflow-y-auto */}
      {/* navigation */}
      <nav
        className={`
          flex-1 flex flex-col p-4 space-y-6 overflow-visible
          ${collapsed ? "items-center overflow-visible" : ""} ${navClassName}
        `}
      >
        {renderSections(sections)}
      </nav>
    </aside>
  );

  /* --------------------- Mobile Sidebar -------------------------- */
  const MobileSidebar = (
    <>
      {/* Header + menu button */}
      <div className="flex items-center justify-between h-[79px] px-4 bg-white shadow-sm">
        <a href="/" className="shrink-0">
          <img src="/img/logo/Logo.png" width={177} height={48} alt="Logo" />
        </a>

        <button
          onClick={mobileControls.onToggle}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          className="md:hidden p-2 text-black hover:scale-110 transition-transform duration-200"
        >
          {isMobileOpen ? <MdClose size={30} /> : <BiMenu size={30} />}
        </button>
      </div>

      {/* overlay */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden
          transition-opacity duration-300
          ${isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={mobileControls.onClose}
      />

      {/* drawer */}
      <aside
        className={`
          fixed top-0 h-full w-80 bg-white shadow-2xl
          transform transition-all duration-400 ease-out z-50 md:hidden
          ${pos.mobile.container} ${pos.mobile.transform}
        `}
      >
        <div className="flex flex-col h-full">
          {/* profile */}
          {showProfile && user && (
            <div className="p-5 border-b flex items-center gap-4 bg-linear-to-r from-blue-50 to-transparent">
              <img
                src={user.avatar}
                alt={user.name}
                width={56}
                height={56}
                className="rounded-full ring-4 ring-white shadow-md"
              />
              <div>
                <p className="font-bold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.role}</p>
              </div>
            </div>
          )}

          {/* navigation */}
          <nav className="flex-1 p-5 space-y-8 overflow-y-auto">
            {renderSections(sections)}
          </nav>
        </div>
      </aside>
    </>
  );

  /* --------------------- final render logic ---------------------- */
  if (isMobile === null) return null;

  if (isMobile) {
    return MobileSidebar;
  }

  /* ---------- Desktop ---------- */
  if (toggleDesk) {
    return (
      <>
        {/* Desktop toggle button */}
        <button
          onClick={() => setIsDesktopVisible((v) => !v)}
          aria-label={isDesktopVisible ? "Hide sidebar" : "Show sidebar"}
          className={`
            fixed ${toggleDeskBtnCls} z-50 p-3 bg-white border-2 border-gray-300 rounded-full shadow-xl
            hover:scale-110 hover:shadow-2xl hover:border-blue-400
            transition-all duration-300 ease-out ${toggleDeskBtnClass}
            ${isDesktopVisible ? "ring-4 ring-blue-100" : ""}
          `}
        >
          {isDesktopVisible ? (
            position === "left" ? (
              <MdChevronLeft size={20} />
            ) : (
              <MdChevronRight size={20} />
            )
          ) : position === "left" ? (
            <MdChevronRight size={20} />
          ) : (
            <MdChevronLeft size={20} />
          )}
        </button>

        {/* Fullscreen backdrop */}
        {isDesktopVisible && isFullScreen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-500"
            onClick={() => setIsDesktopVisible(false)}
          />
        )}

        {isDesktopVisible && DesktopSidebar}
      </>
    );
  }

  return hideOnDesk ? null : DesktopSidebar;
};

export default Sidebar;
