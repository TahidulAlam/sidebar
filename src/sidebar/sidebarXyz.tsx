// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   MdClose,
//   MdExpandMore,
//   MdChevronLeft,
//   MdChevronRight,
// } from "react-icons/md";
// import { BiMenu } from "react-icons/bi";
// import type {
//   MobileSidebarControls,
//   SidebarItem,
//   SidebarProps,
//   SidebarSection,
// } from "./type";

// interface SubmenuState {
//   isOpen: boolean;
//   isAnimating: boolean;
//   height: number;
// }

// interface UpdatedSidebarProps extends SidebarProps {}

// const Sidebar: React.FC<UpdatedSidebarProps> = ({
//   sections,
//   activeItemId,
//   onItemClick,
//   user,
//   showProfile = true,
//   className = "",
//   header,
//   variant = "default",
//   showActiveIndicator = true,
//   hideOnDesktop = false,
//   toggleDesktop = false,
//   mobileBreakpoint = 768,
//   position = "left",
//   // collapsible additions
//   collapsible = false,
//   collapsed: collapsedControlled,
//   defaultCollapsed = false,
//   onCollapseChange,
//   collapseTogglePosition = "top",
// }) => {
//   // responsive / mobile detection
//   const [isMobile, setIsMobile] = useState<boolean | null>(null);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   // collapse state supports controlled or uncontrolled
//   const [collapsedInternal, setCollapsedInternal] =
//     useState<boolean>(defaultCollapsed);
//   const collapsed =
//     typeof collapsedControlled === "boolean"
//       ? collapsedControlled
//       : collapsedInternal;

//   // submenus (same logic as before)
//   const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
//   const [submenuStates, setSubmenuStates] = useState<Map<string, SubmenuState>>(
//     new Map()
//   );
//   const submenuRefs = useRef<Map<string, HTMLDivElement>>(new Map());
//   const sidebarRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const checkMobile = () => window.innerWidth < mobileBreakpoint;
//     const onResize = () => {
//       const mobile = checkMobile();
//       setIsMobile(mobile);
//       if (!mobile) setIsMobileOpen(false);
//     };
//     setIsMobile(checkMobile());
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, [mobileBreakpoint]);

//   const mobileControls: MobileSidebarControls = {
//     isOpen: isMobileOpen,
//     onOpen: () => setIsMobileOpen(true),
//     onClose: () => setIsMobileOpen(false),
//     onToggle: () => setIsMobileOpen((p) => !p),
//   };

//   useEffect(() => {
//     if (!isMobile) return;
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && isMobileOpen) mobileControls.onClose();
//     };
//     const onDocClick = (e: MouseEvent) => {
//       if (
//         isMobileOpen &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(e.target as Node)
//       ) {
//         mobileControls.onClose();
//       }
//     };
//     document.addEventListener("keydown", onKey);
//     document.addEventListener("mousedown", onDocClick);
//     return () => {
//       document.removeEventListener("keydown", onKey);
//       document.removeEventListener("mousedown", onDocClick);
//     };
//   }, [isMobile, isMobileOpen]);

//   // initialize submenu states
//   useEffect(() => {
//     const newStates = new Map<string, SubmenuState>();
//     const walk = (items: SidebarItem[]) => {
//       items.forEach((it) => {
//         if (it.subItems?.length) {
//           newStates.set(it.id, {
//             isOpen: openSubmenus.has(it.id),
//             isAnimating: false,
//             height: 0,
//           });
//           walk(it.subItems);
//         }
//       });
//     };
//     sections.forEach((s) => walk(s.items));
//     setSubmenuStates(newStates);
//   }, [sections]);

//   // measure submenu heights when openSubmenus changes
//   useEffect(() => {
//     const updateHeights = () => {
//       setSubmenuStates((prev) => {
//         const next = new Map(prev);
//         openSubmenus.forEach((id) => {
//           const el = submenuRefs.current.get(id);
//           if (el) {
//             const st = next.get(id);
//             if (st)
//               next.set(id, { ...st, height: el.scrollHeight, isOpen: true });
//           }
//         });
//         prev.forEach((st, id) => {
//           if (!openSubmenus.has(id) && st.isOpen)
//             next.set(id, { ...st, isOpen: false, height: 0 });
//         });
//         return next;
//       });
//     };
//     requestAnimationFrame(updateHeights);
//   }, [openSubmenus]);

//   const toggleSubmenu = (id: string) => {
//     setSubmenuStates((prev) => {
//       const next = new Map(prev);
//       const st = next.get(id);
//       if (st) next.set(id, { ...st, isAnimating: true });
//       return next;
//     });

//     setOpenSubmenus((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });

//     setTimeout(() => {
//       setSubmenuStates((prev) => {
//         const next = new Map(prev);
//         const st = next.get(id);
//         if (st) next.set(id, { ...st, isAnimating: false });
//         return next;
//       });
//     }, 300);
//   };

//   // collapse toggle handling (supports controlled)
//   const handleToggleCollapse = () => {
//     if (typeof collapsedControlled === "boolean") {
//       // controlled: notify only
//       onCollapseChange?.(!collapsedControlled);
//     } else {
//       setCollapsedInternal((prev) => {
//         const next = !prev;
//         onCollapseChange?.(next);
//         return next;
//       });
//     }
//   };

//   const effectiveHideOnDesktop = toggleDesktop ? false : hideOnDesktop;

//   // style config
//   const styleConfig = {
//     default: {
//       container: "bg-white rounded-2xl",
//       item: "px-4 py-3",
//       iconSize: 18,
//       width: "w-64",
//       collapsedWidth: "w-20",
//     },
//     compact: {
//       container: "bg-white rounded-lg",
//       item: "px-3 py-2",
//       iconSize: 16,
//       width: "w-48",
//       collapsedWidth: "w-16",
//     },
//     floating: {
//       container: "bg-white rounded-2xl shadow-lg border border-gray-200",
//       item: "px-4 py-3",
//       iconSize: 18,
//       width: "w-64",
//       collapsedWidth: "w-20",
//     },
//   } as const;
//   const cfg = styleConfig[variant];

//   // position classes
//   const getPositionClasses = () => {
//     const baseMobile =
//       "fixed top-0 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden";
//     if (position === "left") {
//       return {
//         mobileTransform: isMobileOpen ? "translate-x-0" : "-translate-x-full",
//         mobileContainer: `${baseMobile} left-0 w-80`,
//         desktopPosition: "left-0",
//         menuIcon: "ml-auto",
//         floatDropdownFrom: "left-full -ml-2",
//       };
//     }
//     return {
//       mobileTransform: isMobileOpen ? "translate-x-0" : "translate-x-full",
//       mobileContainer: `${baseMobile} right-0 w-80`,
//       desktopPosition: "right-0",
//       menuIcon: "mr-auto",
//       floatDropdownFrom: "right-full -mr-2",
//     };
//   };
//   const positionClasses = getPositionClasses();

//   const getItemBase = (item: SidebarItem) => {
//     if (item.disabled)
//       return `flex items-center bg-gray-100 w-full text-sm rounded-md ${cfg.item} text-gray-400 cursor-not-allowed opacity-60`;
//     const isActive = activeItemId === item.id;
//     const activeStyles = showActiveIndicator
//       ? "bg-green-50 text-green-700 font-medium border-l-2 border-l-green-500"
//       : "bg-gray-100 text-gray-900 font-medium";
//     return `flex items-center w-full text-sm rounded-md transition-all duration-200 ${
//       cfg.item
//     } ${
//       isActive
//         ? activeStyles
//         : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//     }`;
//   };

//   const renderIcon = (Icon?: React.ElementType, size?: number) =>
//     Icon ? (
//       <Icon size={size || cfg.iconSize} className="shrink-0 text-primary" />
//     ) : null;
//   const renderBadge = (badge?: number | string) =>
//     badge || badge === 0 ? (
//       <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium min-w-5 text-center">
//         {badge}
//       </span>
//     ) : null;

//   // rendering items; if sidebar collapsed -> show only icon and floating submenu on hover
//   const renderItems = (items: SidebarItem[], depth = 0) =>
//     items.map((item) => {
//       const hasSub = !!item.subItems?.length;
//       const isOpen = openSubmenus.has(item.id);
//       const st = submenuStates.get(item.id);
//       const base = getItemBase(item);
//       const indent = depth > 0 ? "pl-6" : "";

//       // content for expanded view
//       const content = (
//         <div className={`flex items-center justify-between w-full ${indent}`}>
//           <div className="flex items-center gap-3">
//             {item.icon && <span className="mr-1">{renderIcon(item.icon)}</span>}
//             {!collapsed && <span className="truncate">{item.label}</span>}
//             {!collapsed && renderBadge(item.badge)}
//           </div>

//           {hasSub && !collapsed && (
//             <MdExpandMore
//               size={cfg.iconSize}
//               className={`transition-transform duration-300 ${
//                 isOpen ? "rotate-180" : "rotate-0"
//               } ${st?.isAnimating ? "transition-none" : ""}`}
//             />
//           )}
//           {/* when collapsed, we still show badge as small dot */}
//           {hasSub && collapsed && (
//             <MdExpandMore size={20} className="opacity-50 " />
//           )}
//         </div>
//       );

//       // floating submenu for collapsed state: show on hover/focus
//       const FloatingSubmenu = hasSub ? (
//         <div
//           // position absolute next to sidebar; left or right depends on `position`
//           className={`absolute top-0 hidden group-hover:block group-focus:block z-50 min-w-[220px] ${positionClasses.floatDropdownFrom}`}
//         >
//           <div className="bg-white rounded-md shadow-lg border border-gray-200 p-3">
//             <div className="font-semibold text-sm mb-2">{item.label}</div>
//             <div className="space-y-1">
//               {item.subItems!.map((si) => (
//                 <a
//                   key={si.id}
//                   href={si.href || "#"}
//                   onClick={() => onItemClick(si.id, si)}
//                   className="block px-3 py-2 rounded hover:bg-gray-50 text-sm text-gray-700"
//                 >
//                   <div className="flex items-center gap-2">
//                     {si.icon && <si.icon size={16} />}
//                     <span className="truncate">{si.label}</span>
//                   </div>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       ) : null;

//       if (hasSub) {
//         return (
//           <div
//             key={item.id}
//             className={`relative group`}
//             aria-expanded={isOpen}
//           >
//             <button
//               onClick={() => !item.disabled && toggleSubmenu(item.id)}
//               disabled={item.disabled}
//               className={`${base} ${indent} ${
//                 collapsed ? "justify-center" : ""
//               }`}
//               aria-controls={`submenu-${item.id}`}
//               aria-expanded={isOpen}
//             >
//               {content}
//             </button>

//             {/* When collapsed: show floating submenu */}
//             {collapsed ? (
//               // hidden by default; shown via .group:hover
//               FloatingSubmenu
//             ) : (
//               // normal nested submenu when expanded
//               <div
//                 id={`submenu-${item.id}`}
//                 ref={(el) => {
//                   if (el) submenuRefs.current.set(item.id, el);
//                   else submenuRefs.current.delete(item.id);
//                 }}
//                 className="overflow-hidden transition-all duration-300 ease-in-out"
//                 style={{ height: st?.height || 0, opacity: isOpen ? 1 : 0.8 }}
//               >
//                 <div
//                   className={`transition-opacity duration-200 ease-in-out ${
//                     isOpen ? "opacity-100 delay-100" : "opacity-0"
//                   }`}
//                 >
//                   <div className="mt-1 space-y-1 pl-4">
//                     {renderItems(item.subItems || [], depth + 1)}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       }

//       // leaf item (no sub)
//       return item.href ? (
//         <a
//           key={item.id}
//           href={item.href}
//           onClick={() => {
//             onItemClick(item.id, item);
//             if (isMobile) mobileControls.onClose();
//           }}
//           className={`${base} ${indent} ${collapsed ? "justify-center" : ""}`}
//         >
//           {content}
//         </a>
//       ) : (
//         <button
//           key={item.id}
//           onClick={() => {
//             if (!item.disabled) {
//               onItemClick(item.id, item);
//               if (isMobile) mobileControls.onClose();
//             }
//           }}
//           disabled={item.disabled}
//           className={`${base} ${indent} ${collapsed ? "justify-center" : ""}`}
//         >
//           {content}
//         </button>
//       );
//     });

//   const renderSections = (secs: SidebarSection[]) =>
//     secs.map((s, i) => (
//       <div key={s.id || `section-${i}`}>
//         {!collapsed && s.title && (
//           <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
//             {s.title}
//           </div>
//         )}
//         <div className="space-y-1">{renderItems(s.items)}</div>
//       </div>
//     ));

//   // Desktop fixed sidebar uses width based on collapsed state
//   const desktopWidthClass = collapsed ? cfg.collapsedWidth : cfg.width;

//   const DesktopSidebar = (
//     <aside
//       ref={sidebarRef}
//       className={`fixed top-0 bottom-0 ${desktopWidthClass} ${
//         cfg.container
//       } ${className} flex flex-col ${
//         position === "left" ? "left-0" : "right-0"
//       } z-30 transition-all duration-300`}
//       role="navigation"
//       aria-hidden={false}
//     >
//       {/* collapse toggle (if enabled) */}
//       {collapsible && (
//         <div
//           className={`absolute  z-9999  ${
//             collapseTogglePosition === "top" ? "top-2" : "bottom-4"
//           } ${position === "left" ? "right-3.5" : "left-3.5"} z-40`}
//         >
//           <button
//             onClick={handleToggleCollapse}
//             aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//             className="w-7 h-7 rounded-full  cursor-pointer shadow border border-gray-200 flex items-center justify-center z-9999"
//           >
//             {position === "left" ? (
//               collapsed ? (
//                 <MdChevronRight />
//               ) : (
//                 <MdChevronLeft />
//               )
//             ) : collapsed ? (
//               <MdChevronLeft />
//             ) : (
//               <MdChevronRight />
//             )}
//           </button>
//         </div>
//       )}

//       {/* profile (compact when collapsed) */}
//       {showProfile && user && (
//         <div
//           className={`p-3 border-b border-gray-100 flex items-center gap-3 ${
//             collapsed ? "justify-center" : ""
//           }`}
//         >
//           <img
//             src={user.avatar}
//             alt={user.name}
//             width={collapsed ? 36 : 40}
//             height={collapsed ? 36 : 40}
//             className="rounded-full"
//           />
//           {!collapsed && (
//             <div className="flex flex-col min-w-0">
//               <p className="font-medium text-gray-900 truncate">{user.name}</p>
//               <p className="text-sm text-gray-500">{user.role}</p>
//             </div>
//           )}
//         </div>
//       )}
//       {/* overflow-y-auto */}
//       {/* nav */}
//       <nav
//         className={`flex-1 flex flex-col p-3 space-y-4  z-999 ${
//           collapsed ? "items-center ml-4" : "overflow-y-auto "
//         }`}
//       >
//         {renderSections(sections)}
//       </nav>
//     </aside>
//   );

//   // mobile layout similar to previous implementation (no collapse on mobile)
//   const MobileSidebar = (
//     <>
//       <div className="flex justify-between w-full items-center h-[79px]">
//         <a
//           href="/"
//           className={`shrink-0 ${position === "left" ? "ml-5" : "mr-5"}`}
//         >
//           <img src="/img/logo/Logo.png" width={177} height={48} alt="Logo" />
//         </a>
//         <button
//           onClick={mobileControls.onToggle}
//           aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
//           className={`md:hidden z-50 p-2 text-black ${
//             position === "left" ? "ml-auto" : "mr-auto"
//           }`}
//         >
//           {isMobileOpen ? <MdClose size={30} /> : <BiMenu size={30} />}
//         </button>
//       </div>

//       {isMobileOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
//           onClick={mobileControls.onClose}
//         />
//       )}

//       <aside
//         ref={sidebarRef}
//         className={`${position === "left" ? "left-0" : "right-0"} ${
//           position === "left" ? "translate-x-0" : "translate-x-0"
//         } ${
//           position === "left" ? "md:hidden" : "md:hidden"
//         } fixed top-0 h-full w-80 z-50 bg-white shadow-lg`}
//       >
//         <div className="h-full flex flex-col">
//           <div className="px-4 py-2 border-b border-gray-100">
//             {header || (
//               <a
//                 href="/"
//                 className={`flex items-center ${
//                   position === "left" ? "ml-5" : "mr-5"
//                 }`}
//               >
//                 <img
//                   src="/img/logo/Logo.png"
//                   width={177}
//                   height={48}
//                   alt="Logo"
//                 />
//               </a>
//             )}
//           </div>

//           {showProfile && user && (
//             <div className="p-4 border-b border-gray-100 flex items-center gap-3">
//               <img
//                 src={user.avatar}
//                 alt={user.name}
//                 width={48}
//                 height={48}
//                 className="rounded-full"
//               />
//               <div>
//                 <p className="font-medium text-gray-900">{user.name}</p>
//                 <p className="text-sm text-gray-500">{user.role}</p>
//               </div>
//             </div>
//           )}

//           <nav className="flex flex-col p-4 space-y-6 overflow-y-auto">
//             {renderSections(sections)}
//           </nav>
//         </div>
//       </aside>
//     </>
//   );

//   if (isMobile === null) return null;
//   if (isMobile) return MobileSidebar;
//   return effectiveHideOnDesktop ? null : DesktopSidebar;
// };

// export default Sidebar;

// // Ok now its worked fine, I change it. Now add another varient. In the desktop screen sidebar, a new toggle button will be introduced, controlled by the variable **`toggleDesk`**, which works in conjunction with **`hideOnDesk`** to manage the sidebar’s behavior. When **`toggleDesk`** is set to **`true`**, the toggle button becomes visible, but only if **`hideOnDesk`** is **`false`**; if **`hideOnDesk`** is **`true`**, no toggle button will appear, and the sidebar will remain hidden. The toggle button, when visible, allows users to manually switch the sidebar between its **full (expanded)** and **hidden (collapsed)** states. Conversely, when **`toggleDesk`** is set to **`false`**, **`hideOnDesk`** must also be **`false`**, ensuring the sidebar remains visible by default, and no toggle button is displayed. This creates a direct relationship between the two variables, where **`toggleDesk`** determines the availability of the toggle button, while **`hideOnDesk`** controls the sidebar’s visibility, with the toggle button only appearing when both conditions align.

// import { MdClose, MdExpandMore } from "react-icons/md";

// import type {
//   MobileSidebarControls,
//   SidebarItem,
//   SidebarProps,
//   SidebarSection,
// } from "./type";
// import { BiMenu } from "react-icons/bi";

// interface SubmenuState {
//   isOpen: boolean;
//   isAnimating: boolean;
//   height: number;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   sections,
//   activeItemId,
//   onItemClick,
//   user,
//   showProfile = true,
//   className = "",
//   header,
//   variant = "default",
//   showActiveIndicator = true,
//   hideOnDesktop = false,
//   mobileBreakpoint = 768,
// }) => {
//   const [isMobile, setIsMobile] = useState<boolean | null>(null);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
//   const [submenuStates, setSubmenuStates] = useState<Map<string, SubmenuState>>(
//     new Map()
//   );
//   const submenuRefs = useRef<Map<string, HTMLDivElement>>(new Map());
//   const sidebarRef = useRef<HTMLDivElement>(null);

//   // Detect mobile/desktop with proper initialization
//   useEffect(() => {
//     const checkMobile = () => {
//       return window.innerWidth < mobileBreakpoint;
//     };

//     const handleResize = () => {
//       const mobile = checkMobile();
//       setIsMobile(mobile);
//       if (!mobile) {
//         setIsMobileOpen(false);
//       }
//     };

//     // Set initial state
//     setIsMobile(checkMobile());

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [mobileBreakpoint]);

//   const mobileControls: MobileSidebarControls = {
//     isOpen: isMobileOpen,
//     onOpen: () => setIsMobileOpen(true),
//     onClose: () => setIsMobileOpen(false),
//     onToggle: () => setIsMobileOpen((prev) => !prev),
//   };

//   useEffect(() => {
//     if (!isMobile) return;

//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && isMobileOpen) mobileControls.onClose();
//     };

//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         isMobileOpen &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(e.target as Node)
//       ) {
//         mobileControls.onClose();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isMobileOpen, isMobile]);

//   // Initialize submenu states
//   useEffect(() => {
//     const newStates = new Map<string, SubmenuState>();

//     const initializeStates = (items: SidebarItem[]) => {
//       items.forEach((item) => {
//         if (item.subItems?.length) {
//           newStates.set(item.id, {
//             isOpen: openSubmenus.has(item.id),
//             isAnimating: false,
//             height: 0,
//           });
//           // Recursively initialize nested submenus
//           initializeStates(item.subItems);
//         }
//       });
//     };

//     sections.forEach((section) => initializeStates(section.items));
//     setSubmenuStates(newStates);
//   }, [sections]);

//   // Measure submenu heights when they open/close
//   useEffect(() => {
//     const updateSubmenuHeights = () => {
//       setSubmenuStates((prev) => {
//         const newStates = new Map(prev);

//         openSubmenus.forEach((itemId) => {
//           const submenuElement = submenuRefs.current.get(itemId);
//           if (submenuElement) {
//             const state = newStates.get(itemId);
//             if (state) {
//               newStates.set(itemId, {
//                 ...state,
//                 height: submenuElement.scrollHeight,
//                 isOpen: true,
//               });
//             }
//           }
//         });

//         // Reset heights for closed submenus
//         prev.forEach((state, itemId) => {
//           if (!openSubmenus.has(itemId) && state.isOpen) {
//             newStates.set(itemId, {
//               ...state,
//               isOpen: false,
//               height: 0,
//             });
//           }
//         });

//         return newStates;
//       });
//     };

//     // Use requestAnimationFrame for smoother updates
//     requestAnimationFrame(updateSubmenuHeights);
//   }, [openSubmenus]);

//   const toggleSubmenu = async (itemId: string) => {
//     // Set animating state
//     setSubmenuStates((prev) => {
//       const newStates = new Map(prev);
//       const state = newStates.get(itemId);
//       if (state) {
//         newStates.set(itemId, {
//           ...state,
//           isAnimating: true,
//         });
//       }
//       return newStates;
//     });

//     // Toggle open state
//     setOpenSubmenus((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(itemId)) {
//         newSet.delete(itemId);
//       } else {
//         newSet.add(itemId);
//       }
//       return newSet;
//     });

//     // Clear animating state after transition
//     setTimeout(() => {
//       setSubmenuStates((prev) => {
//         const newStates = new Map(prev);
//         const state = newStates.get(itemId);
//         if (state) {
//           newStates.set(itemId, {
//             ...state,
//             isAnimating: false,
//           });
//         }
//         return newStates;
//       });
//     }, 300); // Match this with CSS transition duration
//   };

//   // Style presets
//   const styleConfig = {
//     default: {
//       container: "bg-white rounded-2xl ",
//       item: "px-4 py-3",
//       iconSize: 18,
//       width: "w-64",
//     },
//     compact: {
//       container: "bg-white rounded-lg ",
//       item: "px-3 py-2",
//       iconSize: 16,
//       width: "w-48",
//     },
//     floating: {
//       container: "bg-white rounded-2xl shadow-lg border border-gray-200",
//       item: "px-4 py-3",
//       iconSize: 18,
//       width: "w-64",
//     },
//   };

//   const config = styleConfig[variant];

//   const getItemStyles = (item: SidebarItem) => {
//     if (item.disabled) {
//       return `flex items-center bg-red-500 w-full text-sm rounded-md ${config.item} text-gray-400 cursor-not-allowed opacity-60`;
//     }
//     const isActive = activeItemId === item.id;
//     const activeStyles = showActiveIndicator
//       ? "bg-green-50 text-green-700 font-medium border-l-2 border-l-green-500"
//       : "bg-gray-100 text-gray-900 font-medium";
//     return `flex  items-center w-full text-sm rounded-md transition-all duration-200 ${
//       config.item
//     } ${
//       isActive
//         ? activeStyles
//         : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//     }`;
//   };

//   const renderIcon = (
//     IconComponent: React.ElementType | undefined,
//     size?: number
//   ) =>
//     IconComponent ? (
//       <IconComponent
//         size={size || config.iconSize}
//         className="shrink-0 text-primary"
//       />
//     ) : null;

//   const renderBadge = (badge?: number | string) =>
//     badge || badge === 0 ? (
//       <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium min-w-5 text-center">
//         {badge}
//       </span>
//     ) : null;

//   type SidebarItemWithChildren = SidebarItem & { subItems?: SidebarItem[] };

//   const renderItems = (items: SidebarItemWithChildren[], depth: number = 0) =>
//     items.map((item) => {
//       const hasSubItems = !!item.subItems?.length;
//       const isOpen = openSubmenus.has(item.id);
//       const submenuState = submenuStates.get(item.id);
//       const itemStyles = getItemStyles(item);
//       const indent = depth > 0 ? "pl-6" : "";

//       const content = (
//         <div
//           className={`flex items-center justify-between font-semibold text-dark  w-full ${indent}`}
//         >
//           <div className="flex items-center ">
//             {item.icon && <span className="mr-3">{renderIcon(item.icon)}</span>}
//             <span className=" truncate ">{item.label}</span>
//             {renderBadge(item.badge)}
//           </div>
//           {hasSubItems && (
//             <MdExpandMore
//               size={config.iconSize}
//               className={` transition-transform duration-300 ease-in-out ${
//                 isOpen ? "rotate-180" : "rotate-0"
//               } ${submenuState?.isAnimating ? "transition-none" : ""}`}
//             />
//           )}
//         </div>
//       );

//       if (hasSubItems) {
//         return (
//           <div key={item.id}>
//             <button
//               onClick={() => {
//                 if (!item.disabled) {
//                   toggleSubmenu(item.id);
//                 }
//               }}
//               disabled={item.disabled}
//               className={itemStyles}
//               aria-expanded={isOpen}
//               aria-controls={`submenu-${item.id}`}
//               aria-busy={submenuState?.isAnimating}
//             >
//               {content}
//             </button>

//             {/* Improved Submenu with smooth transitions */}
//             <div
//               id={`submenu-${item.id}`}
//               ref={(el) => {
//                 if (el) {
//                   submenuRefs.current.set(item.id, el);
//                 } else {
//                   submenuRefs.current.delete(item.id);
//                 }
//               }}
//               className="overflow-hidden  transition-all duration-300 ease-in-out"
//               style={{
//                 height: submenuState?.height || 0,
//                 opacity: isOpen ? 1 : 0.8,
//               }}
//             >
//               <div
//                 className={`transition-opacity duration-200 ease-in-out ${
//                   isOpen ? "opacity-100 delay-100" : "opacity-0"
//                 }`}
//               >
//                 <div className="mt-1 space-y-1">
//                   {renderItems(item.subItems || [], depth + 1)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       }

//       return item.href ? (
//         <a
//           key={item.id}
//           href={item.href}
//           onClick={() => {
//             onItemClick(item.id, item);
//             if (isMobile) {
//               mobileControls.onClose();
//             }
//           }}
//           className={`${itemStyles} ${indent}`}
//         >
//           {content}
//         </a>
//       ) : (
//         <button
//           key={item.id}
//           onClick={() => {
//             if (!item.disabled) {
//               onItemClick(item.id, item);
//               if (isMobile) {
//                 mobileControls.onClose();
//               }
//             }
//           }}
//           disabled={item.disabled}
//           className={`${itemStyles} ${indent}`}
//         >
//           {content}
//         </button>
//       );
//     });

//   const renderSections = (sections: SidebarSection[]) =>
//     sections.map((section, index) => (
//       <div key={section.id || `section-${index}`}>
//         {section.title && (
//           <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
//             {section.title}
//           </div>
//         )}
//         <div className="space-y-1">{renderItems(section.items)}</div>
//       </div>
//     ));

//   const DesktopSidebar = (
//     <aside
//       className={`${config.width} ${config.container} ${className} flex flex-col h-full sticky top-0`}
//     >
//       {showProfile && user && (
//         <div className="p-4 border-b border-gray-100 flex flex-col items-center gap-3 ">
//           <img
//             src={user.avatar}
//             alt={user.name}
//             width={40}
//             height={40}
//             className="rounded-full"
//           />
//           <div className="flex flex-col min-w-0">
//             <p className="font-medium text-gray-900 truncate">{user.name}</p>
//             {/* Added role for consistency with mobile */}
//             <p className="text-sm text-gray-500">{user.role}</p>
//           </div>
//         </div>
//       )}
//       <nav className="flex flex-col p-4 space-y-4 overflow-y-auto">
//         {renderSections(sections)}
//       </nav>
//     </aside>
//   );

//   const MobileSidebar = (
//     <>
//       <div className="flex justify-between w-full items-center h-[79px] ">
//         <a href="/" className="shrink-0 lg:ml-0 ml-5">
//           <img src="/img/logo/Logo.png" width={177} height={48} alt="Logo" />
//         </a>
//         <button
//           onClick={mobileControls.onToggle}
//           aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
//           aria-expanded={isMobileOpen}
//           className="md:hidden z-1001 p-2 text-white font-extrabold transition transform-gpu"
//         >
//           {isMobileOpen ? (
//             <MdClose
//               size={30}
//               className={`transform transition-transform ease-in-out -mt-[60px]  duration-700 text-black ${
//                 isMobileOpen
//                   ? "opacity-100 scale-100 rotate-0"
//                   : "opacity-0 scale-75 -rotate-45"
//               }`}
//             />
//           ) : (
//             <BiMenu
//               size={30}
//               className={`transition-all duration-300 transform text-black ${
//                 isMobileOpen
//                   ? "opacity-0 scale-75 rotate-45"
//                   : "opacity-100 scale-100 rotate-0 "
//               }`}
//             />
//           )}
//         </button>
//       </div>

//       {isMobileOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
//           onClick={mobileControls.onClose}
//         />
//       )}
//       <aside
//         ref={sidebarRef}
//         className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
//           isMobileOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//         role="navigation"
//         aria-hidden={!isMobileOpen}
//       >
//         <div className="h-full flex flex-col">
//           <div className="px-4 py-2 border-b border-gray-100">
//             {header || (
//               <a href="/" className="flex items-center lg:ml-0 ml-5">
//                 <img
//                   src="/img/logo/Logo.png"
//                   width={177}
//                   height={48}
//                   alt="Logo"
//                 />
//               </a>
//             )}
//           </div>
//           {showProfile && user && (
//             <div className="p-4 border-b border-gray-100 flex items-center gap-3">
//               <img
//                 src={user.avatar}
//                 alt={user.name}
//                 width={48}
//                 height={48}
//                 className="rounded-full"
//               />
//               <div>
//                 <p className="font-medium text-gray-900">{user.name}</p>
//                 <p className="text-sm text-gray-500">{user.role}</p>
//               </div>
//             </div>
//           )}
//           <nav className="flex flex-col p-4 space-y-6 overflow-y-auto">
//             {renderSections(sections)}
//           </nav>
//         </div>
//       </aside>
//     </>
//   );

//   if (isMobile === null) {
//     return null;
//   }

//   if (isMobile) {
//     return MobileSidebar;
//   } else {
//     return hideOnDesktop ? null : DesktopSidebar;
//   }
// };

// export default Sidebar;

// Sidebar.tsx

// "use client";

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { createPortal } from "react-dom"; // This is the correct way to import
// import { BiMenu } from "react-icons/bi";
// import { MdClose, MdExpandMore } from "react-icons/md";
// import type {
//   SidebarItem,
//   SidebarProps,
//   SidebarSection,
//   SidebarSubItem,
// } from "./type";
// import clsx from "clsx";

// // Utility: manage submenu state for smooth open/close animation
// interface SubmenuState {
//   isOpen: boolean;
//   height: number;
//   isAnimating: boolean;
// }

// export const Sidebar: React.FC<SidebarProps> = ({
//   sections,
//   user,
//   activeItemId,
//   onItemClick,
//   variant = "fixed",
//   position = "left",
//   className = "",
//   collapsible = false,
//   collapsed: collapsedProp,
//   onCollapseChange,
//   collapseTogglePosition = "bottom",
//   hideOnDesk = false,
//   toggleDesk = false,
// }) => {
//   const [collapsed, setCollapsed] = useState<boolean>(!!collapsedProp);
//   const [mobileOpen, setMobileOpen] = useState<boolean>(false);
//   const [submenuStates, setSubmenuStates] = useState<
//     Record<string, SubmenuState>
//   >({});

//   const sidebarRef = useRef<HTMLDivElement | null>(null);

//   // Sync collapsed prop with state
//   useEffect(() => {
//     if (collapsedProp !== undefined) setCollapsed(collapsedProp);
//   }, [collapsedProp]);

//   const handleCollapseToggle = useCallback(() => {
//     const next = !collapsed;
//     setCollapsed(next);
//     onCollapseChange?.(next);
//   }, [collapsed, onCollapseChange]);

//   const handleMobileToggle = useCallback(() => {
//     setMobileOpen((prev) => !prev);
//   }, []);

//   // Handle submenu open/close
//   const toggleSubmenu = (id: string) => {
//     setSubmenuStates((prev) => {
//       const isOpen = !prev[id]?.isOpen;
//       return {
//         ...prev,
//         [id]: { isOpen, height: isOpen ? 999 : 0, isAnimating: true },
//       };
//     });
//   };

//   // Compute sidebar classes
//   const sidebarClasses = clsx(
//     "h-full flex flex-col bg-white shadow-md transition-all duration-300 ease-in-out overflow-hidden",
//     variant === "floating" ? "rounded-2xl m-4" : "border-r border-gray-200",
//     collapsed ? "w-20" : "w-64",
//     position === "right" && "order-last border-l",
//     className
//   );

//   const renderSubItems = (subitems: SidebarSubItem[], open: boolean) => (
//     <div
//       className={clsx(
//         "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
//         open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//       )}
//     >
//       {subitems.map((sub) => (
//         <button
//           key={sub.id}
//           className={clsx(
//             "w-full text-left pl-12 py-2 text-sm hover:bg-gray-100 transition",
//             activeItemId === sub.id && "bg-gray-200 font-semibold"
//           )}
//           onClick={() => onItemClick?.(sub.id)}
//         >
//           {sub.label}
//         </button>
//       ))}
//     </div>
//   );
//   // overflow-y-auto
//   const renderSidebarContent = () => (
//     <div className="flex flex-col flex-1 items-center">
//       {/* User Info */}
//       {user && !collapsed && (
//         <div className="p-4 flex items-center gap-3 border-b border-gray-200">
//           {user.avatar && (
//             <img
//               src={user.avatar}
//               alt={user.name}
//               className="w-10 h-10 rounded-full"
//             />
//           )}
//           <div>
//             <p className="font-semibold">{user.name}</p>
//             {user.role && <p className="text-sm text-gray-500">{user.role}</p>}
//           </div>
//         </div>
//       )}

//       {/* Sections */}
//       <div className="flex-1 py-4 space-y-4 ">
//         {sections.map((section: SidebarSection) => (
//           <div key={section.title || "default"}>
//             {!collapsed && section.title && (
//               <p className="text-xs text-gray-500 font-semibold px-4 mb-2 uppercase">
//                 {section.title}
//               </p>
//             )}
//             <div>
//               {section.items.map((item: SidebarItem) => {
//                 const submenuOpen = submenuStates[item.id]?.isOpen ?? false;
//                 const hasSubmenu = !!item.subitems?.length;

//                 return (
//                   <div key={item.id} className="relative">
//                     <button
//                       onClick={() =>
//                         hasSubmenu
//                           ? toggleSubmenu(item.id)
//                           : onItemClick?.(item.id)
//                       }
//                       className={clsx(
//                         "flex items-center w-full px-4 py-2 text-sm transition-colors",
//                         "hover:bg-gray-100",
//                         activeItemId === item.id && "bg-gray-200 font-semibold"
//                       )}
//                     >
//                       <span className="text-lg">{item.icon}</span>
//                       {!collapsed && (
//                         <span className="ml-3 flex-1 text-left">
//                           {item.label}
//                         </span>
//                       )}
//                       {hasSubmenu && !collapsed && (
//                         <MdExpandMore
//                           className={clsx(
//                             "transition-transform duration-300",
//                             submenuOpen && "rotate-180"
//                           )}
//                         />
//                       )}
//                     </button>

//                     {/* Subitems */}
//                     {!collapsed
//                       ? hasSubmenu &&
//                         renderSubItems(item.subitems!, submenuOpen)
//                       : hasSubmenu && (
//                           // Floating submenu when collapsed
//                           <div
//                             className={clsx(
//                               "absolute top-0 left-full ml-2 bg-white shadow-lg rounded-lg border border-gray-200  transition-all duration-300 origin-left z-9999",
//                               submenuOpen
//                                 ? "opacity-100 scale-100 visible"
//                                 : "opacity-0 scale-95 invisible pointer-events-none"
//                             )}
//                           >
//                             {item.subitems!.map((sub) => (
//                               <button
//                                 key={sub.id}
//                                 className="whitespace-nowrap px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
//                                 onClick={() => onItemClick?.(sub.id)}
//                               >
//                                 {sub.label}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Collapse toggle */}
//       {collapsible && (
//         <div
//           className={clsx(
//             "p-4 border-t border-gray-200 flex justify-center",
//             collapseTogglePosition === "top" &&
//               "order-first border-t-0 border-b"
//           )}
//         >
//           <button
//             onClick={handleCollapseToggle}
//             className="p-2 rounded-md hover:bg-gray-100 transition-transform duration-300"
//           >
//             {collapsed ? (
//               <MdExpandMore className="rotate-90 text-xl" />
//             ) : (
//               <MdExpandMore className="-rotate-90 text-xl" />
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   // Sidebar content for desktop
//   const desktopSidebar = (
//     <div
//       ref={sidebarRef}
//       className={sidebarClasses}
//       style={{
//         position: variant === "fixed" ? "fixed" : "relative",
//         [position]: 0,
//         top: 0,
//         bottom: 0,
//         zIndex: 40,
//       }}
//     >
//       {renderSidebarContent()}
//     </div>
//   );

//   // Mobile sidebar (portal)
//   const mobileSidebar = mobileOpen
//     ? createPortal(
//         <div className="fixed inset-0 z-50 flex">
//           <div
//             className="fixed inset-0 bg-black/40"
//             onClick={handleMobileToggle}
//           />
//           <div
//             className={clsx(
//               "relative bg-white shadow-xl w-64 h-full transition-transform duration-300 ease-in-out",
//               position === "left" ? "translate-x-0" : "translate-x-full right-0"
//             )}
//           >
//             <div className="absolute top-3 right-3">
//               <button
//                 onClick={handleMobileToggle}
//                 className="p-2 rounded hover:bg-gray-100"
//               >
//                 <MdClose size={22} />
//               </button>
//             </div>
//             {renderSidebarContent()}
//           </div>
//         </div>,
//         document.body
//       )
//     : null;

//   return (
//     <>
//       {/* Toggle Button for Desktop */}
//       {toggleDesk && !hideOnDesk && (
//         <button
//           onClick={handleCollapseToggle}
//           className={clsx(
//             "fixed top-4 z-50 bg-white p-2 shadow rounded-full hover:bg-gray-100 transition",
//             position === "left" ? "left-4" : "right-4"
//           )}
//         >
//           <BiMenu size={22} />
//         </button>
//       )}

//       {/* Mobile toggle */}
//       {hideOnDesk && (
//         <button
//           onClick={handleMobileToggle}
//           className={clsx(
//             "fixed top-4 z-50 bg-white p-2 shadow rounded-full hover:bg-gray-100 md:hidden",
//             position === "left" ? "left-4" : "right-4"
//           )}
//         >
//           <BiMenu size={22} />
//         </button>
//       )}

//       {/* Sidebar */}
//       {desktopSidebar}

//       {/* Mobile Sidebar Portal */}
//       {mobileSidebar}
//     </>
//   );
// };

// import { MdClose, MdExpandMore } from "react-icons/md";

// import type {
//   MobileSidebarControls,
//   SidebarItem,
//   SidebarProps,
//   SidebarSection,
// } from "./type";
// import { BiMenu } from "react-icons/bi";

// interface SubmenuState {
//   isOpen: boolean;
//   isAnimating: boolean;
//   height: number;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   sections,
//   activeItemId,
//   onItemClick,
//   user,
//   showProfile = true,
//   className = "",
//   header,
//   variant = "default",
//   showActiveIndicator = true,
//   hideOnDesktop = false,
//   mobileBreakpoint = 768,
// }) => {
//   const [isMobile, setIsMobile] = useState<boolean | null>(null);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
//   const [submenuStates, setSubmenuStates] = useState<Map<string, SubmenuState>>(
//     new Map()
//   );
//   const submenuRefs = useRef<Map<string, HTMLDivElement>>(new Map());
//   const sidebarRef = useRef<HTMLDivElement>(null);

//   // Detect mobile/desktop with proper initialization
//   useEffect(() => {
//     const checkMobile = () => {
//       return window.innerWidth < mobileBreakpoint;
//     };

//     const handleResize = () => {
//       const mobile = checkMobile();
//       setIsMobile(mobile);
//       if (!mobile) {
//         setIsMobileOpen(false);
//       }
//     };

//     // Set initial state
//     setIsMobile(checkMobile());

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [mobileBreakpoint]);

//   const mobileControls: MobileSidebarControls = {
//     isOpen: isMobileOpen,
//     onOpen: () => setIsMobileOpen(true),
//     onClose: () => setIsMobileOpen(false),
//     onToggle: () => setIsMobileOpen((prev) => !prev),
//   };

//   useEffect(() => {
//     if (!isMobile) return;

//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && isMobileOpen) mobileControls.onClose();
//     };

//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         isMobileOpen &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(e.target as Node)
//       ) {
//         mobileControls.onClose();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isMobileOpen, isMobile]);

//   // Initialize submenu states
//   useEffect(() => {
//     const newStates = new Map<string, SubmenuState>();

//     const initializeStates = (items: SidebarItem[]) => {
//       items.forEach((item) => {
//         if (item.subItems?.length) {
//           newStates.set(item.id, {
//             isOpen: openSubmenus.has(item.id),
//             isAnimating: false,
//             height: 0,
//           });
//           // Recursively initialize nested submenus
//           initializeStates(item.subItems);
//         }
//       });
//     };

//     sections.forEach((section) => initializeStates(section.items));
//     setSubmenuStates(newStates);
//   }, [sections]);

//   // Measure submenu heights when they open/close
//   useEffect(() => {
//     const updateSubmenuHeights = () => {
//       setSubmenuStates((prev) => {
//         const newStates = new Map(prev);

//         openSubmenus.forEach((itemId) => {
//           const submenuElement = submenuRefs.current.get(itemId);
//           if (submenuElement) {
//             const state = newStates.get(itemId);
//             if (state) {
//               newStates.set(itemId, {
//                 ...state,
//                 height: submenuElement.scrollHeight,
//                 isOpen: true,
//               });
//             }
//           }
//         });

//         // Reset heights for closed submenus
//         prev.forEach((state, itemId) => {
//           if (!openSubmenus.has(itemId) && state.isOpen) {
//             newStates.set(itemId, {
//               ...state,
//               isOpen: false,
//               height: 0,
//             });
//           }
//         });

//         return newStates;
//       });
//     };

//     // Use requestAnimationFrame for smoother updates
//     requestAnimationFrame(updateSubmenuHeights);
//   }, [openSubmenus]);

//   const toggleSubmenu = async (itemId: string) => {
//     // Set animating state
//     setSubmenuStates((prev) => {
//       const newStates = new Map(prev);
//       const state = newStates.get(itemId);
//       if (state) {
//         newStates.set(itemId, {
//           ...state,
//           isAnimating: true,
//         });
//       }
//       return newStates;
//     });

//     // Toggle open state
//     setOpenSubmenus((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(itemId)) {
//         newSet.delete(itemId);
//       } else {
//         newSet.add(itemId);
//       }
//       return newSet;
//     });

//     // Clear animating state after transition
//     setTimeout(() => {
//       setSubmenuStates((prev) => {
//         const newStates = new Map(prev);
//         const state = newStates.get(itemId);
//         if (state) {
//           newStates.set(itemId, {
//             ...state,
//             isAnimating: false,
//           });
//         }
//         return newStates;
//       });
//     }, 300); // Match this with CSS transition duration
//   };

//   // Style presets
//   const styleConfig = {
//     default: {
//       container: "bg-white rounded-2xl ",
//       item: "px-4 py-3",
//       iconSize: 18,
//       width: "w-64",
//     },
//     compact: {
//       container: "bg-white rounded-lg ",
//       item: "px-3 py-2",
//       iconSize: 16,
//       width: "w-48",
//     },
//     floating: {
//       container: "bg-white rounded-2xl shadow-lg border border-gray-200",
//       item: "px-4 py-3",
//       iconSize: 18,
//       width: "w-64",
//     },
//   };

//   const config = styleConfig[variant];

//   const getItemStyles = (item: SidebarItem) => {
//     if (item.disabled) {
//       return `flex items-center bg-red-500 w-full text-sm rounded-md ${config.item} text-gray-400 cursor-not-allowed opacity-60`;
//     }
//     const isActive = activeItemId === item.id;
//     const activeStyles = showActiveIndicator
//       ? "bg-green-50 text-green-700 font-medium border-l-2 border-l-green-500"
//       : "bg-gray-100 text-gray-900 font-medium";
//     return `flex  items-center w-full text-sm rounded-md transition-all duration-200 ${
//       config.item
//     } ${
//       isActive
//         ? activeStyles
//         : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//     }`;
//   };

//   const renderIcon = (
//     IconComponent: React.ElementType | undefined,
//     size?: number
//   ) =>
//     IconComponent ? (
//       <IconComponent
//         size={size || config.iconSize}
//         className="shrink-0 text-primary"
//       />
//     ) : null;

//   const renderBadge = (badge?: number | string) =>
//     badge || badge === 0 ? (
//       <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium min-w-5 text-center">
//         {badge}
//       </span>
//     ) : null;

//   type SidebarItemWithChildren = SidebarItem & { subItems?: SidebarItem[] };

//   const renderItems = (items: SidebarItemWithChildren[], depth: number = 0) =>
//     items.map((item) => {
//       const hasSubItems = !!item.subItems?.length;
//       const isOpen = openSubmenus.has(item.id);
//       const submenuState = submenuStates.get(item.id);
//       const itemStyles = getItemStyles(item);
//       const indent = depth > 0 ? "pl-6" : "";

//       const content = (
//         <div
//           className={`flex items-center justify-between font-semibold text-dark  w-full ${indent}`}
//         >
//           <div className="flex items-center ">
//             {item.icon && <span className="mr-3">{renderIcon(item.icon)}</span>}
//             <span className=" truncate ">{item.label}</span>
//             {renderBadge(item.badge)}
//           </div>
//           {hasSubItems && (
//             <MdExpandMore
//               size={config.iconSize}
//               className={` transition-transform duration-300 ease-in-out ${
//                 isOpen ? "rotate-180" : "rotate-0"
//               } ${submenuState?.isAnimating ? "transition-none" : ""}`}
//             />
//           )}
//         </div>
//       );

//       if (hasSubItems) {
//         return (
//           <div key={item.id}>
//             <button
//               onClick={() => {
//                 if (!item.disabled) {
//                   toggleSubmenu(item.id);
//                 }
//               }}
//               disabled={item.disabled}
//               className={itemStyles}
//               aria-expanded={isOpen}
//               aria-controls={`submenu-${item.id}`}
//               aria-busy={submenuState?.isAnimating}
//             >
//               {content}
//             </button>

//             {/* Improved Submenu with smooth transitions */}
//             <div
//               id={`submenu-${item.id}`}
//               ref={(el) => {
//                 if (el) {
//                   submenuRefs.current.set(item.id, el);
//                 } else {
//                   submenuRefs.current.delete(item.id);
//                 }
//               }}
//               className="overflow-hidden  transition-all duration-300 ease-in-out"
//               style={{
//                 height: submenuState?.height || 0,
//                 opacity: isOpen ? 1 : 0.8,
//               }}
//             >
//               <div
//                 className={`transition-opacity duration-200 ease-in-out ${
//                   isOpen ? "opacity-100 delay-100" : "opacity-0"
//                 }`}
//               >
//                 <div className="mt-1 space-y-1">
//                   {renderItems(item.subItems || [], depth + 1)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       }

//       return item.href ? (
//         <a
//           key={item.id}
//           href={item.href}
//           onClick={() => {
//             onItemClick(item.id, item);
//             if (isMobile) {
//               mobileControls.onClose();
//             }
//           }}
//           className={`${itemStyles} ${indent}`}
//         >
//           {content}
//         </a>
//       ) : (
//         <button
//           key={item.id}
//           onClick={() => {
//             if (!item.disabled) {
//               onItemClick(item.id, item);
//               if (isMobile) {
//                 mobileControls.onClose();
//               }
//             }
//           }}
//           disabled={item.disabled}
//           className={`${itemStyles} ${indent}`}
//         >
//           {content}
//         </button>
//       );
//     });

//   const renderSections = (sections: SidebarSection[]) =>
//     sections.map((section, index) => (
//       <div key={section.id || `section-${index}`}>
//         {section.title && (
//           <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
//             {section.title}
//           </div>
//         )}
//         <div className="space-y-1">{renderItems(section.items)}</div>
//       </div>
//     ));

//   const DesktopSidebar = (
//     <aside
//       className={`${config.width} ${config.container} ${className} flex flex-col h-full sticky top-0`}
//     >
//       {showProfile && user && (
//         <div className="p-4 border-b border-gray-100 flex flex-col items-center gap-3 ">
//           <img
//             src={user.avatar}
//             alt={user.name}
//             width={40}
//             height={40}
//             className="rounded-full"
//           />
//           <div className="flex flex-col min-w-0">
//             <p className="font-medium text-gray-900 truncate">{user.name}</p>
//             {/* Added role for consistency with mobile */}
//             <p className="text-sm text-gray-500">{user.role}</p>
//           </div>
//         </div>
//       )}
//       <nav className="flex flex-col p-4 space-y-4 overflow-y-auto">
//         {renderSections(sections)}
//       </nav>
//     </aside>
//   );

//   const MobileSidebar = (
//     <>
//       <div className="flex justify-between w-full items-center h-[79px] ">
//         <a href="/" className="shrink-0 lg:ml-0 ml-5">
//           <img src="/img/logo/Logo.png" width={177} height={48} alt="Logo" />
//         </a>
//         <button
//           onClick={mobileControls.onToggle}
//           aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
//           aria-expanded={isMobileOpen}
//           className="md:hidden z-1001 p-2 text-white font-extrabold transition transform-gpu"
//         >
//           {isMobileOpen ? (
//             <MdClose
//               size={30}
//               className={`transform transition-transform ease-in-out -mt-[60px]  duration-700 text-black ${
//                 isMobileOpen
//                   ? "opacity-100 scale-100 rotate-0"
//                   : "opacity-0 scale-75 -rotate-45"
//               }`}
//             />
//           ) : (
//             <BiMenu
//               size={30}
//               className={`transition-all duration-300 transform text-black ${
//                 isMobileOpen
//                   ? "opacity-0 scale-75 rotate-45"
//                   : "opacity-100 scale-100 rotate-0 "
//               }`}
//             />
//           )}
//         </button>
//       </div>

//       {isMobileOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
//           onClick={mobileControls.onClose}
//         />
//       )}
//       <aside
//         ref={sidebarRef}
//         className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
//           isMobileOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//         role="navigation"
//         aria-hidden={!isMobileOpen}
//       >
//         <div className="h-full flex flex-col">
//           <div className="px-4 py-2 border-b border-gray-100">
//             {header || (
//               <a href="/" className="flex items-center lg:ml-0 ml-5">
//                 <img
//                   src="/img/logo/Logo.png"
//                   width={177}
//                   height={48}
//                   alt="Logo"
//                 />
//               </a>
//             )}
//           </div>
//           {showProfile && user && (
//             <div className="p-4 border-b border-gray-100 flex items-center gap-3">
//               <img
//                 src={user.avatar}
//                 alt={user.name}
//                 width={48}
//                 height={48}
//                 className="rounded-full"
//               />
//               <div>
//                 <p className="font-medium text-gray-900">{user.name}</p>
//                 <p className="text-sm text-gray-500">{user.role}</p>
//               </div>
//             </div>
//           )}
//           <nav className="flex flex-col p-4 space-y-6 overflow-y-auto">
//             {renderSections(sections)}
//           </nav>
//         </div>
//       </aside>
//     </>
//   );

//   if (isMobile === null) {
//     return null;
//   }

//   if (isMobile) {
//     return MobileSidebar;
//   } else {
//     return hideOnDesktop ? null : DesktopSidebar;
//   }
// };

// export default Sidebar;

// Sidebar.tsx
// "use client";

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { createPortal } from "react-dom"; // This is the correct way to import
// import { BiMenu } from "react-icons/bi";
// import { MdClose, MdExpandMore } from "react-icons/md";
// import type {
//   SidebarItem,
//   SidebarProps,
//   SidebarSection,
//   SidebarSubItem,
// } from "./type";
// import clsx from "clsx";

// // Utility: manage submenu state for smooth open/close animation
// interface SubmenuState {
//   isOpen: boolean;
//   height: number;
//   isAnimating: boolean;
// }

// export const Sidebar: React.FC<SidebarProps> = ({
//   sections,
//   user,
//   activeItemId,
//   onItemClick,
//   variant = "fixed",
//   position = "left",
//   className = "",
//   collapsible = false,
//   collapsed: collapsedProp,
//   onCollapseChange,
//   collapseTogglePosition = "bottom",
//   hideOnDesk = false,
//   toggleDesk = false,
// }) => {
//   const [collapsed, setCollapsed] = useState<boolean>(!!collapsedProp);
//   const [mobileOpen, setMobileOpen] = useState<boolean>(false);
//   const [submenuStates, setSubmenuStates] = useState<
//     Record<string, SubmenuState>
//   >({});

//   const sidebarRef = useRef<HTMLDivElement | null>(null);

//   // Sync collapsed prop with state
//   useEffect(() => {
//     if (collapsedProp !== undefined) setCollapsed(collapsedProp);
//   }, [collapsedProp]);

//   const handleCollapseToggle = useCallback(() => {
//     const next = !collapsed;
//     setCollapsed(next);
//     onCollapseChange?.(next);
//   }, [collapsed, onCollapseChange]);

//   const handleMobileToggle = useCallback(() => {
//     setMobileOpen((prev) => !prev);
//   }, []);

//   // Handle submenu open/close
//   const toggleSubmenu = (id: string) => {
//     setSubmenuStates((prev) => {
//       const isOpen = !prev[id]?.isOpen;
//       return {
//         ...prev,
//         [id]: { isOpen, height: isOpen ? 999 : 0, isAnimating: true },
//       };
//     });
//   };

//   // Compute sidebar classes
//   const sidebarClasses = clsx(
//     "h-full flex flex-col bg-white shadow-md transition-all duration-300 ease-in-out overflow-hidden",
//     variant === "floating" ? "rounded-2xl m-4" : "border-r border-gray-200",
//     collapsed ? "w-20" : "w-64",
//     position === "right" && "order-last border-l",
//     className
//   );

//   const renderSubItems = (subitems: SidebarSubItem[], open: boolean) => (
//     <div
//       className={clsx(
//         "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
//         open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//       )}
//     >
//       {subitems.map((sub) => (
//         <button
//           key={sub.id}
//           className={clsx(
//             "w-full text-left pl-12 py-2 text-sm hover:bg-gray-100 transition",
//             activeItemId === sub.id && "bg-gray-200 font-semibold"
//           )}
//           onClick={() => onItemClick?.(sub.id)}
//         >
//           {sub.label}
//         </button>
//       ))}
//     </div>
//   );
//   // overflow-y-auto
//   const renderSidebarContent = () => (
//     <div className="flex flex-col flex-1 items-center">
//       {/* User Info */}
//       {user && !collapsed && (
//         <div className="p-4 flex items-center gap-3 border-b border-gray-200">
//           {user.avatar && (
//             <img
//               src={user.avatar}
//               alt={user.name}
//               className="w-10 h-10 rounded-full"
//             />
//           )}
//           <div>
//             <p className="font-semibold">{user.name}</p>
//             {user.role && <p className="text-sm text-gray-500">{user.role}</p>}
//           </div>
//         </div>
//       )}

//       {/* Sections */}
//       <div className="flex-1 py-4 space-y-4 ">
//         {sections.map((section: SidebarSection) => (
//           <div key={section.title || "default"}>
//             {!collapsed && section.title && (
//               <p className="text-xs text-gray-500 font-semibold px-4 mb-2 uppercase">
//                 {section.title}
//               </p>
//             )}
//             <div>
//               {section.items.map((item: SidebarItem) => {
//                 const submenuOpen = submenuStates[item.id]?.isOpen ?? false;
//                 const hasSubmenu = !!item.subitems?.length;

//                 return (
//                   <div key={item.id} className="relative">
//                     <button
//                       onClick={() =>
//                         hasSubmenu
//                           ? toggleSubmenu(item.id)
//                           : onItemClick?.(item.id)
//                       }
//                       className={clsx(
//                         "flex items-center w-full px-4 py-2 text-sm transition-colors",
//                         "hover:bg-gray-100",
//                         activeItemId === item.id && "bg-gray-200 font-semibold"
//                       )}
//                     >
//                       <span className="text-lg">{item.icon}</span>
//                       {!collapsed && (
//                         <span className="ml-3 flex-1 text-left">
//                           {item.label}
//                         </span>
//                       )}
//                       {hasSubmenu && !collapsed && (
//                         <MdExpandMore
//                           className={clsx(
//                             "transition-transform duration-300",
//                             submenuOpen && "rotate-180"
//                           )}
//                         />
//                       )}
//                     </button>

//                     {/* Subitems */}
//                     {!collapsed
//                       ? hasSubmenu &&
//                         renderSubItems(item.subitems!, submenuOpen)
//                       : hasSubmenu && (
//                           // Floating submenu when collapsed
//                           <div
//                             className={clsx(
//                               "absolute top-0 left-full ml-2 bg-white shadow-lg rounded-lg border border-gray-200  transition-all duration-300 origin-left z-9999",
//                               submenuOpen
//                                 ? "opacity-100 scale-100 visible"
//                                 : "opacity-0 scale-95 invisible pointer-events-none"
//                             )}
//                           >
//                             {item.subitems!.map((sub) => (
//                               <button
//                                 key={sub.id}
//                                 className="whitespace-nowrap px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
//                                 onClick={() => onItemClick?.(sub.id)}
//                               >
//                                 {sub.label}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Collapse toggle */}
//       {collapsible && (
//         <div
//           className={clsx(
//             "p-4 border-t border-gray-200 flex justify-center",
//             collapseTogglePosition === "top" &&
//               "order-first border-t-0 border-b"
//           )}
//         >
//           <button
//             onClick={handleCollapseToggle}
//             className="p-2 rounded-md hover:bg-gray-100 transition-transform duration-300"
//           >
//             {collapsed ? (
//               <MdExpandMore className="rotate-90 text-xl" />
//             ) : (
//               <MdExpandMore className="-rotate-90 text-xl" />
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   // Sidebar content for desktop
//   const desktopSidebar = (
//     <div
//       ref={sidebarRef}
//       className={sidebarClasses}
//       style={{
//         position: variant === "fixed" ? "fixed" : "relative",
//         [position]: 0,
//         top: 0,
//         bottom: 0,
//         zIndex: 40,
//       }}
//     >
//       {renderSidebarContent()}
//     </div>
//   );

//   // Mobile sidebar (portal)
//   const mobileSidebar = mobileOpen
//     ? createPortal(
//         <div className="fixed inset-0 z-50 flex">
//           <div
//             className="fixed inset-0 bg-black/40"
//             onClick={handleMobileToggle}
//           />
//           <div
//             className={clsx(
//               "relative bg-white shadow-xl w-64 h-full transition-transform duration-300 ease-in-out",
//               position === "left" ? "translate-x-0" : "translate-x-full right-0"
//             )}
//           >
//             <div className="absolute top-3 right-3">
//               <button
//                 onClick={handleMobileToggle}
//                 className="p-2 rounded hover:bg-gray-100"
//               >
//                 <MdClose size={22} />
//               </button>
//             </div>
//             {renderSidebarContent()}
//           </div>
//         </div>,
//         document.body
//       )
//     : null;

//   return (
//     <>
//       {/* Toggle Button for Desktop */}
//       {toggleDesk && !hideOnDesk && (
//         <button
//           onClick={handleCollapseToggle}
//           className={clsx(
//             "fixed top-4 z-50 bg-white p-2 shadow rounded-full hover:bg-gray-100 transition",
//             position === "left" ? "left-4" : "right-4"
//           )}
//         >
//           <BiMenu size={22} />
//         </button>
//       )}

//       {/* Mobile toggle */}
//       {hideOnDesk && (
//         <button
//           onClick={handleMobileToggle}
//           className={clsx(
//             "fixed top-4 z-50 bg-white p-2 shadow rounded-full hover:bg-gray-100 md:hidden",
//             position === "left" ? "left-4" : "right-4"
//           )}
//         >
//           <BiMenu size={22} />
//         </button>
//       )}

//       {/* Sidebar */}
//       {desktopSidebar}

//       {/* Mobile Sidebar Portal */}
//       {mobileSidebar}
//     </>
//   );
// };
// src/components/sidebar/Sidebar.tsx

// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   MdExpandMore,
//   MdChevronLeft,
//   MdChevronRight,
//   MdClose,
// } from "react-icons/md";
// import type {
//   MobileSidebarControls,
//   SidebarItem,
//   SidebarProps,
//   SidebarSection,
// } from "./type";
// import { BiMenu } from "react-icons/bi";

// interface SubmenuState {
//   isOpen: boolean;
//   isAnimating: boolean;
//   height: number;
// }

// interface UpdatedSidebarProps extends SidebarProps {}

// const Sidebar: React.FC<UpdatedSidebarProps> = ({
//   sections,
//   activeItemId,
//   onItemClick,
//   user,
//   showProfile = true,
//   className = "",
//   // header,
//   variant = "default",
//   showActiveIndicator = true,
//   hideOnDesk = false,
//   toggleDesk = false,
//   mobileBreakpoint = 768,
//   position = "left",
//   collapsible = false,
//   collapsed: collapsedControlled,
//   defaultCollapsed = false,
//   onCollapseChange,
//   collapseTogglePosition = "top",
// }) => {
//   const [isMobile, setIsMobile] = useState<boolean | null>(null);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [isDesktopVisible, setIsDesktopVisible] = useState(!hideOnDesk);

//   const [collapsedInternal, setCollapsedInternal] =
//     useState<boolean>(defaultCollapsed);
//   const collapsed =
//     typeof collapsedControlled === "boolean"
//       ? collapsedControlled
//       : collapsedInternal;

//   const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
//   const [submenuStates, setSubmenuStates] = useState<Map<string, SubmenuState>>(
//     new Map()
//   );
//   const submenuRefs = useRef<Map<string, HTMLDivElement>>(new Map());
//   const sidebarRef = useRef<HTMLDivElement>(null);

//   // detect mobile
//   useEffect(() => {
//     const checkMobile = () => window.innerWidth < mobileBreakpoint;
//     const handleResize = () => {
//       const mobile = checkMobile();
//       setIsMobile(mobile);
//       if (!mobile) setIsMobileOpen(false);
//     };
//     setIsMobile(checkMobile());
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [mobileBreakpoint]);

//   const mobileControls: MobileSidebarControls = {
//     isOpen: isMobileOpen,
//     onOpen: () => setIsMobileOpen(true),
//     onClose: () => setIsMobileOpen(false),
//     onToggle: () => setIsMobileOpen((p) => !p),
//   };

//   // escape & outside click (mobile)
//   useEffect(() => {
//     if (!isMobile) return;
//     const handleKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && isMobileOpen) mobileControls.onClose();
//     };
//     const handleClick = (e: MouseEvent) => {
//       if (
//         isMobileOpen &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(e.target as Node)
//       )
//         mobileControls.onClose();
//     };
//     document.addEventListener("keydown", handleKey);
//     document.addEventListener("mousedown", handleClick);
//     return () => {
//       document.removeEventListener("keydown", handleKey);
//       document.removeEventListener("mousedown", handleClick);
//     };
//   }, [isMobile, isMobileOpen]);

//   // initialize submenu states
//   useEffect(() => {
//     const newStates = new Map<string, SubmenuState>();
//     const traverse = (items: SidebarItem[]) => {
//       items.forEach((it) => {
//         if (it.subItems?.length) {
//           newStates.set(it.id, {
//             isOpen: openSubmenus.has(it.id),
//             isAnimating: false,
//             height: 0,
//           });
//           traverse(it.subItems);
//         }
//       });
//     };
//     sections.forEach((s) => traverse(s.items));
//     setSubmenuStates(newStates);
//   }, [sections]);

//   // measure submenu heights
//   useEffect(() => {
//     const updateHeights = () => {
//       setSubmenuStates((prev) => {
//         const next = new Map(prev);
//         openSubmenus.forEach((id) => {
//           const el = submenuRefs.current.get(id);
//           if (el)
//             next.set(id, {
//               ...prev.get(id)!,
//               height: el.scrollHeight,
//               isOpen: true,
//             });
//         });
//         prev.forEach((st, id) => {
//           if (!openSubmenus.has(id))
//             next.set(id, { ...st, isOpen: false, height: 0 });
//         });
//         return next;
//       });
//     };
//     requestAnimationFrame(updateHeights);
//   }, [openSubmenus]);

//   const toggleSubmenu = (id: string) => {
//     setSubmenuStates((prev) => {
//       const next = new Map(prev);
//       const st = next.get(id);
//       if (st) next.set(id, { ...st, isAnimating: true });
//       return next;
//     });

//     setOpenSubmenus((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });

//     setTimeout(() => {
//       setSubmenuStates((prev) => {
//         const next = new Map(prev);
//         const st = next.get(id);
//         if (st) next.set(id, { ...st, isAnimating: false });
//         return next;
//       });
//     }, 300);
//   };

//   const handleToggleCollapse = () => {
//     if (typeof collapsedControlled === "boolean")
//       onCollapseChange?.(!collapsedControlled);
//     else
//       setCollapsedInternal((p) => {
//         const next = !p;
//         onCollapseChange?.(next);
//         return next;
//       });
//   };

//   // style presets
//   const styleConfig = {
//     default: {
//       container: "bg-white rounded-2xl",
//       item: "px-4 py-3",
//       iconSize: 18,
//       width: "w-64",
//       collapsedWidth: "w-20",
//     },
//     compact: {
//       container: "bg-white rounded-lg",
//       item: "px-3 py-2",
//       iconSize: 16,
//       width: "w-48",
//       collapsedWidth: "w-16",
//     },
//     floating: {
//       container: "bg-white rounded-2xl shadow-lg border border-gray-200",
//       item: "px-4 py-3",
//       iconSize: 18,
//       width: "w-64",
//       collapsedWidth: "w-20",
//     },
//   } as const;
//   const cfg = styleConfig[variant];

//   const positionCfg =
//     position === "left"
//       ? {
//           mobileTransform: isMobileOpen ? "translate-x-0" : "-translate-x-full",
//           floatDropdownFrom: "left-full -ml-2",
//         }
//       : {
//           mobileTransform: isMobileOpen ? "translate-x-0" : "translate-x-full",
//           floatDropdownFrom: "right-full -mr-2",
//         };

//   const renderIcon = (Icon?: React.ElementType, size?: number) =>
//     Icon ? (
//       <Icon size={size || cfg.iconSize} className="shrink-0 text-primary" />
//     ) : null;

//   const renderBadge = (badge?: number | string) =>
//     badge || badge === 0 ? (
//       <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium min-w-5 text-center">
//         {badge}
//       </span>
//     ) : null;

//   const getItemBase = (item: SidebarItem) => {
//     const isActive = activeItemId === item.id;
//     const active =
//       showActiveIndicator &&
//       "bg-green-50 text-green-700 font-medium border-l-2 border-l-green-500";
//     return `flex items-center w-full text-sm rounded-md ${
//       cfg.item
//     } transition-all duration-200 ${
//       item.disabled
//         ? "opacity-60 cursor-not-allowed"
//         : isActive
//         ? active
//         : "hover:bg-gray-50 text-gray-700"
//     }`;
//   };

//   const renderItems = (items: SidebarItem[]) =>
//     items.map((item) => {
//       const hasSub = !!item.subItems?.length;
//       const isOpen = openSubmenus.has(item.id);
//       const st = submenuStates.get(item.id);
//       const base = getItemBase(item);

//       const content = (
//         <div className="flex items-center justify-between w-full">
//           <div className="flex items-center gap-3">
//             {renderIcon(item.icon)}
//             {!collapsed && <span>{item.label}</span>}
//             {!collapsed && renderBadge(item.badge)}
//           </div>
//           {hasSub && !collapsed && (
//             <MdExpandMore
//               size={cfg.iconSize}
//               className={`transition-transform duration-300 ${
//                 isOpen ? "rotate-180" : ""
//               }`}
//             />
//           )}
//         </div>
//       );

//       const FloatingSubmenu =
//         hasSub && collapsed ? (
//           <div
//             className={`absolute top-0 hidden group-hover:block z-50 min-w-[220px] ${positionCfg.floatDropdownFrom}`}
//           >
//             <div className="bg-white rounded-md shadow-lg border p-3">
//               <div className="font-semibold text-sm mb-2">{item.label}</div>
//               <div className="space-y-1">
//                 {item.subItems!.map((si) => (
//                   <a
//                     key={si.id}
//                     href={si.href || "#"}
//                     onClick={() => onItemClick(si.id, si)}
//                     className="block px-3 py-2 rounded hover:bg-gray-50 text-sm"
//                   >
//                     <div className="flex items-center gap-2">
//                       {si.icon && <si.icon size={16} />}
//                       <span>{si.label}</span>
//                     </div>
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ) : null;

//       if (hasSub)
//         return (
//           <div key={item.id} className="relative group">
//             <button
//               onClick={() => toggleSubmenu(item.id)}
//               className={`${base} ${collapsed ? "justify-center" : ""}`}
//             >
//               {content}
//             </button>
//             {collapsed ? (
//               FloatingSubmenu
//             ) : (
//               <div
//                 ref={(el) => {
//                   if (el) submenuRefs.current.set(item.id, el);
//                   else submenuRefs.current.delete(item.id);
//                 }}
//                 className="overflow-hidden transition-all duration-300"
//                 style={{ height: st?.height || 0 }}
//               >
//                 <div className="pl-4">{renderItems(item.subItems || [])}</div>
//               </div>
//             )}
//           </div>
//         );

//       return (
//         <button
//           key={item.id}
//           onClick={() => onItemClick(item.id, item)}
//           disabled={item.disabled}
//           className={`${base} ${collapsed ? "justify-center" : ""}`}
//         >
//           {content}
//         </button>
//       );
//     });

//   const renderSections = (secs: SidebarSection[]) =>
//     secs.map((s, i) => (
//       <div key={s.id || i}>
//         {!collapsed && s.title && (
//           <div className="text-xs font-semibold text-gray-500 mb-3 uppercase">
//             {s.title}
//           </div>
//         )}
//         <div className="space-y-1">{renderItems(s.items)}</div>
//       </div>
//     ));

//   const desktopWidthClass = collapsed ? cfg.collapsedWidth : cfg.width;

//   const DesktopSidebar = (
//     <aside
//       ref={sidebarRef}
//       className={`fixed top-0 bottom-0 ${desktopWidthClass} ${
//         cfg.container
//       } ${className} flex flex-col ${
//         position === "left" ? "left-0" : "right-0"
//       } z-30 transition-all duration-300 relative`}
//     >
//       {collapsible && (
//         <div
//           className={`absolute ${
//             collapseTogglePosition === "top" ? "top-2" : "bottom-4"
//           } ${position === "left" ? "right-3.5" : "left-3.5"} z-40`}
//         >
//           <button
//             onClick={handleToggleCollapse}
//             className="w-7 h-7 rounded-full shadow border flex items-center justify-center"
//           >
//             {position === "left" ? (
//               collapsed ? (
//                 <MdChevronRight />
//               ) : (
//                 <MdChevronLeft />
//               )
//             ) : collapsed ? (
//               <MdChevronLeft />
//             ) : (
//               <MdChevronRight />
//             )}
//           </button>
//         </div>
//       )}

//       {showProfile && user && (
//         <div
//           className={`p-3 border-b flex items-center gap-3 ${
//             collapsed ? "justify-center" : ""
//           }`}
//         >
//           <img
//             src={user.avatar}
//             alt={user.name}
//             width={collapsed ? 36 : 40}
//             height={collapsed ? 36 : 40}
//             className="rounded-full"
//           />
//           {!collapsed && (
//             <div>
//               <p className="font-medium">{user.name}</p>
//               <p className="text-sm text-gray-500">{user.role}</p>
//             </div>
//           )}
//         </div>
//       )}

//       <nav
//         className={`flex-1 flex flex-col p-3 space-y-4 ${
//           collapsed ? "items-center" : "overflow-y-auto"
//         }`}
//       >
//         {renderSections(sections)}
//       </nav>
//     </aside>
//   );
//   const MobileSidebar = (
//     <>
//       <div className="flex justify-between w-full items-center h-[79px] ">
//         <a href="/" className="shrink-0 lg:ml-0 ml-5">
//           <img src="/img/logo/Logo.png" width={177} height={48} alt="Logo" />
//         </a>
//         <button
//           onClick={mobileControls.onToggle}
//           aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
//           aria-expanded={isMobileOpen}
//           className="md:hidden z-1001 p-2 text-white font-extrabold transition transform-gpu"
//         >
//           {isMobileOpen ? (
//             <MdClose
//               size={30}
//               className={`transform transition-transform ease-in-out -mt-[60px]  duration-700 text-black ${
//                 isMobileOpen
//                   ? "opacity-100 scale-100 rotate-0"
//                   : "opacity-0 scale-75 -rotate-45"
//               }`}
//             />
//           ) : (
//             <BiMenu
//               size={30}
//               className={`transition-all duration-300 transform text-black ${
//                 isMobileOpen
//                   ? "opacity-0 scale-75 rotate-45"
//                   : "opacity-100 scale-100 rotate-0 "
//               }`}
//             />
//           )}
//         </button>
//       </div>

//       {isMobileOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
//           onClick={mobileControls.onClose}
//         />
//       )}
//       <aside
//         ref={sidebarRef}
//         className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
//           isMobileOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//         role="navigation"
//         aria-hidden={!isMobileOpen}
//       >
//         <div className="h-full flex flex-col">
//           {/* <div className="px-4 py-2 border-b border-gray-100">
//             {header || (
//               <a href="/" className="flex items-center lg:ml-0 ml-5">
//                 <img
//                   src="/img/logo/Logo.png"
//                   width={177}
//                   height={48}
//                   alt="Logo"
//                 />
//               </a>
//             )}
//           </div> */}
//           {showProfile && user && (
//             <div className="p-4 border-b border-gray-100 flex items-center gap-3">
//               <img
//                 src={user.avatar}
//                 alt={user.name}
//                 width={48}
//                 height={48}
//                 className="rounded-full"
//               />
//               <div>
//                 <p className="font-medium text-gray-900">{user.name}</p>
//                 <p className="text-sm text-gray-500">{user.role}</p>
//               </div>
//             </div>
//           )}
//           <nav className="flex flex-col p-4 space-y-6 overflow-y-auto">
//             {renderSections(sections)}
//           </nav>
//         </div>
//       </aside>
//     </>
//   );
//   const handleDesktopToggle = () => setIsDesktopVisible((prev) => !prev);
//   // --- Final Render Logic ---
//   if (isMobile === null) return null;

//   // MOBILE SIDEBAR
//   if (isMobile) {
//     return (
//       <>
//         {/* Mobile Sidebar */}
//         {MobileSidebar}

//         {/* Optional: Mobile toggle button (if desired) */}
//         {/* <button
//         onClick={mobileControls.onToggle}
//         aria-label={mobileControls.isOpen ? "Close menu" : "Open menu"}
//         className={`fixed top-4 ${
//           position === "left" ? "left-4" : "right-4"
//         } z-9999 p-2 bg-white border rounded-full shadow hover:bg-gray-50`}
//       >
//         {mobileControls.isOpen ? (
//           position === "left" ? <MdChevronLeft /> : <MdChevronRight />
//         ) : position === "left" ? (
//           <MdChevronRight />
//         ) : (
//           <MdChevronLeft />
//         )}
//       </button> */}
//       </>
//     );
//   }

//   // DESKTOP SIDEBAR
//   if (toggleDesk) {
//     return (
//       <>
//         <button
//           onClick={handleDesktopToggle}
//           aria-label={isDesktopVisible ? "Hide sidebar" : "Show sidebar"}
//           className={`fixed top-4 ${
//             position === "left" ? "left-4" : "right-4"
//           } z-9999 p-2 bg-white border rounded-full shadow hover:bg-gray-50`}
//         >
//           {isDesktopVisible ? (
//             position === "left" ? (
//               <MdChevronLeft />
//             ) : (
//               <MdChevronRight />
//             )
//           ) : position === "left" ? (
//             <MdChevronRight />
//           ) : (
//             <MdChevronLeft />
//           )}
//         </button>
//         {isDesktopVisible && DesktopSidebar}
//       </>
//     );
//   }

//   // DEFAULT DESKTOP (no toggle)
//   return hideOnDesk ? null : DesktopSidebar;
// };

// export default Sidebar;

// const MobileSidebar = (
//   <>
//     <div className="flex items-center justify-between h-[79px] px-4 bg-white shadow-sm">
//       <a href="/" className="shrink-0">
//         <img src="/img/logo/Logo.png" width={177} height={48} alt="Logo" />
//       </a>

//       <button
//         onClick={mobileControls.onToggle}
//         aria-label={isMobileOpen ? "Close menu" : "Open menu"}
//         className="md:hidden p-2 text-black hover:scale-110 transition-transform duration-200"
//       >
//         {isMobileOpen ? <MdClose size={30} /> : <BiMenu size={30} />}
//       </button>
//     </div>

//     {/* overlay */}
//     <div
//       className={`
//         fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden
//         transition-opacity duration-300
//         ${isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
//       `}
//       onClick={mobileControls.onClose}
//     />

//     {/* drawer */}
//     <aside
//       className={`
//         fixed top-0 h-full w-80 bg-white shadow-2xl
//         transform transition-all duration-400 ease-out z-50 md:hidden
//         ${pos.mobile.container} ${pos.mobile.transform}
//       `}
//     >
//       <div className="flex flex-col h-full">
//         {showProfile && user && (
//           <div className="p-5 border-b flex items-center gap-4 bg-linear-to-r from-blue-50 to-transparent">
//             <img
//               src={user.avatar}
//               alt={user.name}
//               width={56}
//               height={56}
//               className="rounded-full ring-4 ring-white shadow-md"
//             />
//             <div>
//               <p className="font-bold text-gray-900">{user.name}</p>
//               <p className="text-sm text-gray-600">{user.role}</p>
//             </div>
//           </div>
//         )}
//         <nav className="flex-1 p-5 space-y-8 overflow-y-auto">
//           {renderSections(sections)}
//         </nav>
//       </div>
//     </aside>
//   </>
// );

// /* eslint-disable react-hooks/exhaustive-deps */

// /* eslint-disable @typescript-eslint/no-unused-expressions */

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import {
//   MdExpandMore,
//   MdChevronLeft,
//   MdChevronRight,
//   MdClose,
// } from "react-icons/md";
// import { BiMenu } from "react-icons/bi";
// import type {
//   MobileSidebarControls,
//   SidebarItem,
//   SidebarProps,
//   SidebarSection,
// } from "./type";

// interface SubmenuState {
//   isOpen: boolean;
//   isAnimating: boolean;
//   height: number;
// }

// /* ------------------------------------------------------------------ */
// /* Helper – position-aware classes (mobile & desktop)                 */
// /* ------------------------------------------------------------------ */
// const usePositionClasses = (position: "left" | "right", isOpen: boolean) => {
//   const mobile = {
//     container: position === "left" ? "left-0" : "right-0",
//     transform: isOpen
//       ? "translate-x-0"
//       : position === "left"
//       ? "-translate-x-full"
//       : "translate-x-full",
//   };
//   const desktop = position === "left" ? "left-0" : "right-0";

//   const toggleBtn = position === "left" ? "left-4" : "right-4";

//   const collapseBtn = position === "left" ? "right-3.5" : "left-3.5";

//   return { mobile, desktop, toggleBtn, collapseBtn };
// };

// /* ------------------------------------------------------------------ */
// /* Main component                                                     */
// /* ------------------------------------------------------------------ */
// const Sidebar: React.FC<SidebarProps> = ({
//   sections,
//   activeItemId,
//   onItemClick,
//   user,
//   showProfile = true,
//   className = "",
//   variant = "default",
//   showActiveIndicator = true,
//   hideOnDesk = false,
//   toggleDesk = false,
//   mobileBreakpoint = 768,
//   position = "left",
//   collapsible = false,
//   collapsed: collapsedControlled,
//   defaultCollapsed = false,
//   onCollapseChange,
//   collapseTogglePosition = "top",
// }) => {
//   /* --------------------- responsive detection --------------------- */
//   const [isMobile, setIsMobile] = useState<boolean | null>(null);
//   useEffect(() => {
//     const check = () => window.innerWidth < mobileBreakpoint;
//     const onResize = () => {
//       const mobile = check();
//       setIsMobile(mobile);
//       if (!mobile) setIsMobileOpen(false);
//     };
//     setIsMobile(check());
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, [mobileBreakpoint]);

//   /* --------------------- mobile drawer state --------------------- */
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const mobileControls: MobileSidebarControls = {
//     isOpen: isMobileOpen,
//     onOpen: () => setIsMobileOpen(true),
//     onClose: () => setIsMobileOpen(false),
//     onToggle: () => setIsMobileOpen((p) => !p),
//   };

//   /* --------------------- desktop visibility (toggleDesk) -------- */
//   const [isDesktopVisible, setIsDesktopVisible] = useState(!hideOnDesk);

//   /* --------------------- collapse (icons-only) ------------------- */
//   const [collapsedInternal, setCollapsedInternal] =
//     useState<boolean>(defaultCollapsed);
//   const collapsed =
//     typeof collapsedControlled === "boolean"
//       ? collapsedControlled
//       : collapsedInternal;

//   const toggleCollapse = () => {
//     const next =
//       typeof collapsedControlled === "boolean"
//         ? !collapsedControlled
//         : !collapsedInternal;

//     if (typeof collapsedControlled === "boolean") {
//       onCollapseChange?.(next);
//     } else {
//       setCollapsedInternal(next);
//       onCollapseChange?.(next);
//     }
//   };

//   /* --------------------- submenu state -------------------------- */
//   const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
//   const [submenuStates, setSubmenuStates] = useState<Map<string, SubmenuState>>(
//     new Map()
//   );
//   const submenuRefs = useRef<Map<string, HTMLDivElement>>(new Map());

//   // init submenu map
//   useEffect(() => {
//     const map = new Map<string, SubmenuState>();
//     const walk = (items: SidebarItem[]) => {
//       items.forEach((it) => {
//         if (it.subItems?.length) {
//           map.set(it.id, {
//             isOpen: openSubmenus.has(it.id),
//             isAnimating: false,
//             height: 0,
//           });
//           walk(it.subItems);
//         }
//       });
//     };
//     sections.forEach((s) => walk(s.items));
//     setSubmenuStates(map);
//   }, [sections]);

//   // measure heights
//   useEffect(() => {
//     const update = () => {
//       setSubmenuStates((prev) => {
//         const next = new Map(prev);
//         openSubmenus.forEach((id) => {
//           const el = submenuRefs.current.get(id);
//           if (el) {
//             next.set(id, {
//               ...prev.get(id)!,
//               height: el.scrollHeight,
//               isOpen: true,
//             });
//           }
//         });
//         prev.forEach((st, id) => {
//           if (!openSubmenus.has(id)) {
//             next.set(id, { ...st, isOpen: false, height: 0 });
//           }
//         });
//         return next;
//       });
//     };
//     requestAnimationFrame(update);
//   }, [openSubmenus]);

//   const toggleSubmenu = (id: string) => {
//     setSubmenuStates((p) => {
//       const n = new Map(p);
//       const s = n.get(id);
//       if (s) n.set(id, { ...s, isAnimating: true });
//       return n;
//     });

//     setOpenSubmenus((p) => {
//       const n = new Set(p);
//       n.has(id) ? n.delete(id) : n.add(id);
//       return n;
//     });

//     setTimeout(() => {
//       setSubmenuStates((p) => {
//         const n = new Map(p);
//         const s = n.get(id);
//         if (s) n.set(id, { ...s, isAnimating: false });
//         return n;
//       });
//     }, 300);
//   };

//   /* --------------------- style presets --------------------------- */
//   const styleConfig = {
//     default: {
//       container: "bg-white rounded-2xl",
//       item: "px-4 py-3",
//       iconSize: 18,
//       width: "w-64",
//       collapsedWidth: "w-20",
//     },
//     compact: {
//       container: "bg-white rounded-lg",
//       item: "px-3 py-2",
//       iconSize: 16,
//       width: "w-48",
//       collapsedWidth: "w-16",
//     },
//     floating: {
//       container: "bg-white rounded-2xl shadow-lg border border-gray-200",
//       item: "px-4 py-3",
//       iconSize: 18,
//       width: "w-64",
//       collapsedWidth: "w-20",
//     },
//   } as const;
//   const cfg = styleConfig[variant];

//   /* --------------------- position helper -------------------------- */
//   const pos = usePositionClasses(position, isMobileOpen);

//   /* --------------------- render helpers -------------------------- */
//   const renderIcon = (Icon?: React.ElementType, size?: number) =>
//     Icon ? (
//       <Icon size={size ?? cfg.iconSize} className="shrink-0 text-primary" />
//     ) : null;

//   const renderBadge = (b?: number | string) =>
//     b ?? b === 0 ? (
//       <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium min-w-5 text-center">
//         {b}
//       </span>
//     ) : null;

//   const getItemClass = (item: SidebarItem) => {
//     const active = showActiveIndicator
//       ? "bg-green-50 text-green-700 font-medium border-l-2 border-l-green-500"
//       : "bg-gray-100 text-gray-900 font-medium";

//     const base = `flex items-center w-full text-sm rounded-md ${cfg.item} transition-all duration-200`;
//     const disabled = item.disabled ? "opacity-60 cursor-not-allowed" : "";
//     const hover = item.disabled ? "" : "hover:bg-gray-50 text-gray-700";

//     const state = activeItemId === item.id ? active : hover;
//     return `${base} ${disabled} ${state}`;
//   };

//   /* --------------------- items & sections ------------------------ */
//   const renderItems = (items: SidebarItem[], depth = 0): React.ReactNode =>
//     items.map((item) => {
//       const hasSub = !!item.subItems?.length;
//       const isOpen = openSubmenus.has(item.id);
//       const subState = submenuStates.get(item.id);
//       const baseCls = getItemClass(item);
//       const indent = depth > 0 ? "pl-6" : "";

//       const content = (
//         <div className={`flex items-center justify-between w-full ${indent}`}>
//           <div className="flex items-center gap-3">
//             {renderIcon(item.icon)}
//             {!collapsed && <span className="truncate">{item.label}</span>}
//             {!collapsed && renderBadge(item.badge)}
//           </div>

//           {hasSub && !collapsed && (
//             <MdExpandMore
//               size={cfg.iconSize}
//               className={`transition-transform duration-300 ${
//                 isOpen ? "rotate-180" : ""
//               }`}
//             />
//           )}
//         </div>
//       );

//       /* ---- floating submenu when collapsed ---- */
//       const FloatingSub =
//         hasSub && collapsed ? (
//           <div
//             className={`absolute top-0 hidden group-hover:block z-50 min-w-[220px] ${
//               position === "left" ? "left-full -ml-2" : "right-full -mr-2"
//             }`}
//           >
//             <div className="bg-white rounded-md shadow-lg border p-3">
//               <div className="font-semibold text-sm mb-2">{item.label}</div>
//               <div className="space-y-1">
//                 {item.subItems!.map((si) => (
//                   <a
//                     key={si.id}
//                     href={si.href ?? "#"}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       onItemClick(si.id, si);
//                     }}
//                     className="block px-3 py-2 rounded hover:bg-gray-50 text-sm"
//                   >
//                     <div className="flex items-center gap-2">
//                       {si.icon && <si.icon size={16} />}
//                       <span>{si.label}</span>
//                     </div>
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ) : null;

//       /* ---- item with sub-items ---- */
//       if (hasSub) {
//         return (
//           <div key={item.id} className="relative group">
//             <button
//               onClick={() => !item.disabled && toggleSubmenu(item.id)}
//               disabled={item.disabled}
//               className={`${baseCls} ${collapsed ? "justify-center" : ""}`}
//             >
//               {content}
//             </button>

//             {collapsed ? (
//               FloatingSub
//             ) : (
//               <div
//                 ref={(el) => {
//                   if (el) submenuRefs.current.set(item.id, el);
//                   else submenuRefs.current.delete(item.id);
//                 }}
//                 className="overflow-hidden transition-all duration-300"
//                 style={{ height: subState?.height ?? 0 }}
//               >
//                 <div className="mt-1 space-y-1">
//                   {renderItems(item.subItems!, depth + 1)}
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       }

//       /* ---- simple item ---- */
//       return (
//         <button
//           key={item.id}
//           onClick={() => !item.disabled && onItemClick(item.id, item)}
//           disabled={item.disabled}
//           className={`${baseCls} ${collapsed ? "justify-center" : ""}`}
//         >
//           {content}
//         </button>
//       );
//     });

//   const renderSections = (secs: SidebarSection[]) =>
//     secs.map((s, i) => (
//       <div key={s.id ?? i}>
//         {!collapsed && s.title && (
//           <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
//             {s.title}
//           </div>
//         )}
//         <div className="space-y-1">{renderItems(s.items)}</div>
//       </div>
//     ));

//   /* --------------------- width class ----------------------------- */
//   const widthCls = collapsed ? cfg.collapsedWidth : cfg.width;

//   /* --------------------- Desktop Sidebar ------------------------- */
//   const DesktopSidebar = (
//     <aside
//       className={`
//         fixed inset-y-0 ${widthCls} ${cfg.container} ${className}
//         flex flex-col ${pos.desktop} z-30 transition-all duration-300
//       `}
//     >
//       {/* collapse toggle */}
//       {collapsible && (
//         <div
//           className={`
//             absolute ${collapseTogglePosition === "top" ? "top-2" : "bottom-4"}
//             ${pos.collapseBtn} z-40
//           `}
//         >
//           <button
//             onClick={toggleCollapse}
//             className="w-7 h-7 rounded-full bg-white shadow border flex items-center justify-center hover:bg-gray-50"
//           >
//             {position === "left" ? (
//               collapsed ? (
//                 <MdChevronRight />
//               ) : (
//                 <MdChevronLeft />
//               )
//             ) : collapsed ? (
//               <MdChevronLeft />
//             ) : (
//               <MdChevronRight />
//             )}
//           </button>
//         </div>
//       )}

//       {/* profile */}
//       {showProfile && user && (
//         <div
//           className={`
//             p-3 border-b flex items-center gap-3
//             ${collapsed ? "justify-center" : ""}
//           `}
//         >
//           <img
//             src={user.avatar}
//             alt={user.name}
//             width={collapsed ? 36 : 40}
//             height={collapsed ? 36 : 40}
//             className="rounded-full"
//           />
//           {!collapsed && (
//             <div className="min-w-0">
//               <p className="font-medium text-gray-900 truncate">{user.name}</p>
//               <p className="text-sm text-gray-500">{user.role}</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* navigation */}
//       <nav
//         className={`
//           flex-1 flex flex-col p-3 space-y-4
//           ${collapsed ? "items-center" : "overflow-y-auto"}
//         `}
//       >
//         {renderSections(sections)}
//       </nav>
//     </aside>
//   );

//   /* --------------------- Mobile Sidebar -------------------------- */
//   const MobileSidebar = (
//     <>
//       {/* Header + menu button */}
//       <div className="flex items-center justify-between h-[79px] px-4">
//         <a href="/" className="shrink-0">
//           <img src="/img/logo/Logo.png" width={177} height={48} alt="Logo" />
//         </a>

//         <button
//           onClick={mobileControls.onToggle}
//           aria-label={isMobileOpen ? "Close menu" : "Open menu"}
//           className="md:hidden p-2 text-black"
//         >
//           {isMobileOpen ? <MdClose size={30} /> : <BiMenu size={30} />}
//         </button>
//       </div>

//       {/* overlay */}
//       {isMobileOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 md:hidden"
//           onClick={mobileControls.onClose}
//         />
//       )}

//       {/* drawer */}
//       <aside
//         className={`
//           fixed top-0 h-full w-80 bg-white shadow-xl
//           transform transition-transform duration-300 ease-in-out z-50 md:hidden
//           ${pos.mobile.container} ${pos.mobile.transform}
//         `}
//       >
//         <div className="flex flex-col h-full">
//           {/* profile */}
//           {showProfile && user && (
//             <div className="p-4 border-b flex items-center gap-3">
//               <img
//                 src={user.avatar}
//                 alt={user.name}
//                 width={48}
//                 height={48}
//                 className="rounded-full"
//               />
//               <div>
//                 <p className="font-medium text-gray-900">{user.name}</p>
//                 <p className="text-sm text-gray-500">{user.role}</p>
//               </div>
//             </div>
//           )}

//           {/* navigation */}
//           <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
//             {renderSections(sections)}
//           </nav>
//         </div>
//       </aside>
//     </>
//   );

//   /* --------------------- final render logic ---------------------- */
//   if (isMobile === null) return null;

//   if (isMobile) {
//     return MobileSidebar;
//   }

//   // Desktop
//   if (toggleDesk) {
//     return (
//       <>
//         {/* desktop hide/show toggle */}
//         <button
//           onClick={() => setIsDesktopVisible((v) => !v)}
//           aria-label={isDesktopVisible ? "Hide sidebar" : "Show sidebar"}
//           className={`
//             fixed top-4 ${pos.toggleBtn} z-50 p-2 bg-white border rounded-full shadow
//             hover:bg-gray-50
//           `}
//         >
//           {isDesktopVisible ? (
//             position === "left" ? (
//               <MdChevronLeft />
//             ) : (
//               <MdChevronRight />
//             )
//           ) : position === "left" ? (
//             <MdChevronRight />
//           ) : (
//             <MdChevronLeft />
//           )}
//         </button>

//         {isDesktopVisible && DesktopSidebar}
//       </>
//     );
//   }

//   return hideOnDesk ? null : DesktopSidebar;
// };

// export default Sidebar;

// src/components/sidebar/Sidebar.tsx
// src/components/sidebar/Sidebar.tsx

// src/components/sidebar/Sidebar.tsx

// src/components/sidebar/Sidebar.tsx

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import {
//   MdExpandMore,
//   MdChevronLeft,
//   MdChevronRight,
//   MdClose,
// } from "react-icons/md";
// import { BiMenu } from "react-icons/bi";
// import type {
//   MobileSidebarControls,
//   SidebarItem,
//   SidebarProps,
//   SidebarSection,
// } from "./type";

// interface SubmenuState {
//   isOpen: boolean;
//   isAnimating: boolean;
//   height: number;
// }

// /* ------------------------------------------------------------------ */
// /* Position helpers                                                   */
// /* ------------------------------------------------------------------ */
// const usePositionClasses = (position: "left" | "right", isOpen: boolean) => {
//   const mobile = {
//     container: position === "left" ? "left-0" : "right-0",
//     transform: isOpen
//       ? "translate-x-0"
//       : position === "left"
//       ? "-translate-x-full"
//       : "translate-x-full",
//   };
//   const desktop = position === "left" ? "left-0" : "right-0";

//   const toggleBtn = position === "left" ? "left-4" : "right-4";
//   const collapseBtn = position === "left" ? "right-3.5" : "left-3.5";

//   return { mobile, desktop, toggleBtn, collapseBtn };
// };

// /* ------------------------------------------------------------------ */
// /* Desktop toggle-button position helper                              */
// /* ------------------------------------------------------------------ */
// const useToggleDeskBtnClasses = (
//   btnPos: SidebarProps["toggleDeskBtnPosition"] = "top-left"
// ) => {
//   const map: Record<
//     NonNullable<SidebarProps["toggleDeskBtnPosition"]>,
//     string
//   > = {
//     "top-left": "top-4 left-4",
//     "top-center": "top-4 left-1/2 -translate-x-1/2",
//     "top-right": "top-4 right-4",
//     "bottom-left": "bottom-4 left-4",
//     "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
//     "bottom-right": "bottom-4 right-4",
//   };
//   return map[btnPos];
// };

// /* ------------------------------------------------------------------ */
// /* Main component                                                     */
// /* ------------------------------------------------------------------ */
// const Sidebar: React.FC<SidebarProps> = ({
//   sections,
//   activeItemId,
//   onItemClick,
//   user,
//   showProfile = true,
//   className = "",
//   variant = "default",
//   showActiveIndicator = true,
//   hideOnDesk = false,
//   toggleDesk = false,
//   mobileBreakpoint = 768,
//   position = "left",
//   collapsible = false,
//   collapsed: collapsedControlled,
//   defaultCollapsed = false,
//   onCollapseChange,
//   collapseTogglePosition = "top",
//   toggleDeskBtnPosition = "top-left",
//   toggleDeskBtnClass = "",
// }) => {
//   /* --------------------- responsive detection --------------------- */
//   const [isMobile, setIsMobile] = useState<boolean | null>(null);
//   useEffect(() => {
//     const check = () => window.innerWidth < mobileBreakpoint;
//     const onResize = () => {
//       const mobile = check();
//       setIsMobile(mobile);
//       if (!mobile) setIsMobileOpen(false);
//     };
//     setIsMobile(check());
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, [mobileBreakpoint]);

//   /* --------------------- mobile drawer state --------------------- */
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const mobileControls: MobileSidebarControls = {
//     isOpen: isMobileOpen,
//     onOpen: () => setIsMobileOpen(true),
//     onClose: () => setIsMobileOpen(false),
//     onToggle: () => setIsMobileOpen((p) => !p),
//   };

//   /* --------------------- desktop visibility (toggleDesk) -------- */
//   const [isDesktopVisible, setIsDesktopVisible] = useState(!hideOnDesk);

//   /* --------------------- collapse (icons-only) ------------------- */
//   const [collapsedInternal, setCollapsedInternal] =
//     useState<boolean>(defaultCollapsed);
//   const collapsed =
//     typeof collapsedControlled === "boolean"
//       ? collapsedControlled
//       : collapsedInternal;

//   const toggleCollapse = () => {
//     const next =
//       typeof collapsedControlled === "boolean"
//         ? !collapsedControlled
//         : !collapsedInternal;

//     if (typeof collapsedControlled === "boolean") {
//       onCollapseChange?.(next);
//     } else {
//       setCollapsedInternal(next);
//       onCollapseChange?.(next);
//     }
//   };

//   /* --------------------- submenu state -------------------------- */
//   const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
//   const [submenuStates, setSubmenuStates] = useState<Map<string, SubmenuState>>(
//     new Map()
//   );
//   const submenuRefs = useRef<Map<string, HTMLDivElement>>(new Map());

//   // init submenu map
//   useEffect(() => {
//     const map = new Map<string, SubmenuState>();
//     const walk = (items: SidebarItem[]) => {
//       items.forEach((it) => {
//         if (it.subItems?.length) {
//           map.set(it.id, {
//             isOpen: openSubmenus.has(it.id),
//             isAnimating: false,
//             height: 0,
//           });
//           walk(it.subItems);
//         }
//       });
//     };
//     sections.forEach((s) => walk(s.items));
//     setSubmenuStates(map);
//   }, [sections]);

//   // measure heights
//   useEffect(() => {
//     const update = () => {
//       setSubmenuStates((prev) => {
//         const next = new Map(prev);
//         openSubmenus.forEach((id) => {
//           const el = submenuRefs.current.get(id);
//           if (el) {
//             next.set(id, {
//               ...prev.get(id)!,
//               height: el.scrollHeight,
//               isOpen: true,
//             });
//           }
//         });
//         prev.forEach((st, id) => {
//           if (!openSubmenus.has(id)) {
//             next.set(id, { ...st, isOpen: false, height: 0 });
//           }
//         });
//         return next;
//       });
//     };
//     requestAnimationFrame(update);
//   }, [openSubmenus]);

//   const toggleSubmenu = (id: string) => {
//     setSubmenuStates((p) => {
//       const n = new Map(p);
//       const s = n.get(id);
//       if (s) n.set(id, { ...s, isAnimating: true });
//       return n;
//     });

//     setOpenSubmenus((p) => {
//       const n = new Set(p);
//       n.has(id) ? n.delete(id) : n.add(id);
//       return n;
//     });

//     setTimeout(() => {
//       setSubmenuStates((p) => {
//         const n = new Map(p);
//         const s = n.get(id);
//         if (s) n.set(id, { ...s, isAnimating: false });
//         return n;
//       });
//     }, 300);
//   };

//   /* --------------------- style presets --------------------------- */
//   const styleConfig = {
//     default: {
//       container: "bg-white rounded-2xl",
//       item: "px-4 py-3",
//       iconSize: 18,
//       width: "w-64",
//       collapsedWidth: "w-20",
//     },
//     compact: {
//       container: "bg-white rounded-lg",
//       item: "px-3 py-2",
//       iconSize: 16,
//       width: "w-48",
//       collapsedWidth: "w-16",
//     },
//     floating: {
//       container: "bg-white rounded-2xl shadow-lg border border-gray-200",
//       item: "px-4 py-3",
//       iconSize: 18,
//       width: "w-64",
//       collapsedWidth: "w-20",
//     },
//     fullscreen: {
//       container: "", // no bg/rounded – full-screen overlay
//       item: "px-4 py-3",
//       iconSize: 18,
//       width: "w-full", // full width
//       collapsedWidth: "w-20",
//     },
//   } as const;
//   const cfg = styleConfig[variant];

//   /* --------------------- position helpers ----------------------- */
//   const pos = usePositionClasses(position, isMobileOpen);
//   const toggleDeskBtnCls = useToggleDeskBtnClasses(toggleDeskBtnPosition);

//   /* --------------------- render helpers -------------------------- */
//   const renderIcon = (Icon?: React.ElementType, size?: number) =>
//     Icon ? (
//       <Icon size={size ?? cfg.iconSize} className="shrink-0 text-primary" />
//     ) : null;

//   const renderBadge = (b?: number | string) =>
//     b ?? b === 0 ? (
//       <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium min-w-5 text-center">
//         {b}
//       </span>
//     ) : null;

//   const getItemClass = (item: SidebarItem) => {
//     const active = showActiveIndicator
//       ? "bg-green-50 text-green-700 font-medium border-l-2 border-l-green-500"
//       : "bg-gray-100 text-gray-900 font-medium";

//     const base = `flex items-center w-full text-sm rounded-md ${cfg.item} transition-all duration-200`;
//     const disabled = item.disabled ? "opacity-60 cursor-not-allowed" : "";
//     const hover = item.disabled ? "" : "hover:bg-gray-50 text-gray-700";

//     const state = activeItemId === item.id ? active : hover;
//     return `${base} ${disabled} ${state}`;
//   };

//   /* --------------------- items & sections ------------------------ */
//   const renderItems = (items: SidebarItem[], depth = 0): React.ReactNode =>
//     items.map((item) => {
//       const hasSub = !!item.subItems?.length;
//       const isOpen = openSubmenus.has(item.id);
//       const subState = submenuStates.get(item.id);
//       const baseCls = getItemClass(item);
//       const indent = depth > 0 ? "pl-6" : "";

//       const content = (
//         <div className={`flex items-center justify-between w-full ${indent}`}>
//           <div className="flex items-center gap-3">
//             {renderIcon(item.icon)}
//             {!collapsed && <span className="truncate">{item.label}</span>}
//             {!collapsed && renderBadge(item.badge)}
//           </div>

//           {hasSub && !collapsed && (
//             <MdExpandMore
//               size={cfg.iconSize}
//               className={`transition-transform duration-300 ${
//                 isOpen ? "rotate-180" : ""
//               }`}
//             />
//           )}
//         </div>
//       );

//       const FloatingSub =
//         hasSub && collapsed ? (
//           <div
//             className={`absolute top-0 hidden group-hover:block z-50 min-w-[220px] ${
//               position === "left" ? "left-full -ml-2" : "right-full -mr-2"
//             }`}
//           >
//             <div className="bg-white rounded-md shadow-lg border p-3">
//               <div className="font-semibold text-sm mb-2">{item.label}</div>
//               <div className="space-y-1">
//                 {item.subItems!.map((si) => (
//                   <a
//                     key={si.id}
//                     href={si.href ?? "#"}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       onItemClick(si.id, si);
//                     }}
//                     className="block px-3 py-2 rounded hover:bg-gray-50 text-sm"
//                   >
//                     <div className="flex items-center gap-2">
//                       {si.icon && <si.icon size={16} />}
//                       <span>{si.label}</span>
//                     </div>
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ) : null;

//       if (hasSub) {
//         return (
//           <div key={item.id} className="relative group">
//             <button
//               onClick={() => !item.disabled && toggleSubmenu(item.id)}
//               disabled={item.disabled}
//               className={`${baseCls} ${collapsed ? "justify-center" : ""}`}
//             >
//               {content}
//             </button>

//             {collapsed ? (
//               FloatingSub
//             ) : (
//               <div
//                 ref={(el) => {
//                   if (el) submenuRefs.current.set(item.id, el);
//                   else submenuRefs.current.delete(item.id);
//                 }}
//                 className="overflow-hidden transition-all duration-300"
//                 style={{ height: subState?.height ?? 0 }}
//               >
//                 <div className="mt-1 space-y-1">
//                   {renderItems(item.subItems!, depth + 1)}
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       }

//       return (
//         <button
//           key={item.id}
//           onClick={() => !item.disabled && onItemClick(item.id, item)}
//           disabled={item.disabled}
//           className={`${baseCls} ${collapsed ? "justify-center" : ""}`}
//         >
//           {content}
//         </button>
//       );
//     });

//   const renderSections = (secs: SidebarSection[]) =>
//     secs.map((s, i) => (
//       <div key={s.id ?? i}>
//         {!collapsed && s.title && (
//           <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
//             {s.title}
//           </div>
//         )}
//         <div className="space-y-1">{renderItems(s.items)}</div>
//       </div>
//     ));

//   /* --------------------- width class ----------------------------- */
//   const widthCls = collapsed ? cfg.collapsedWidth : cfg.width;

//   /* --------------------- Desktop Sidebar ------------------------- */
//   const isFullScreen = variant === "fullscreen" && toggleDesk;

//   const DesktopSidebar = (
//     <aside
//       className={`
//         ${
//           isFullScreen
//             ? "fixed inset-0 z-50 bg-white"
//             : `fixed inset-y-0 ${widthCls} ${cfg.container}`
//         }
//         ${className} flex flex-col ${pos.desktop}
//         transition-all duration-300
//       `}
//     >
//       {/* collapse toggle (only for non-fullscreen) */}
//       {collapsible && !isFullScreen && (
//         <div
//           className={`
//             absolute ${collapseTogglePosition === "top" ? "top-2" : "bottom-4"}
//             ${pos.collapseBtn} z-40
//           `}
//         >
//           <button
//             onClick={toggleCollapse}
//             className="w-7 h-7 rounded-full bg-white shadow border flex items-center justify-center hover:bg-gray-50"
//           >
//             {position === "left" ? (
//               collapsed ? (
//                 <MdChevronRight />
//               ) : (
//                 <MdChevronLeft />
//               )
//             ) : collapsed ? (
//               <MdChevronLeft />
//             ) : (
//               <MdChevronRight />
//             )}
//           </button>
//         </div>
//       )}

//       {/* profile */}
//       {showProfile && user && (
//         <div
//           className={`
//             p-3 border-b flex items-center gap-3
//             ${collapsed ? "justify-center" : ""}
//           `}
//         >
//           <img
//             src={user.avatar}
//             alt={user.name}
//             width={collapsed ? 36 : 40}
//             height={collapsed ? 36 : 40}
//             className="rounded-full"
//           />
//           {!collapsed && (
//             <div className="min-w-0">
//               <p className="font-medium text-gray-900 truncate">{user.name}</p>
//               <p className="text-sm text-gray-500">{user.role}</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* navigation */}
//       <nav
//         className={`
//           flex-1 flex flex-col p-3 space-y-4
//           ${collapsed ? "items-center" : "overflow-y-auto"}
//         `}
//       >
//         {renderSections(sections)}
//       </nav>
//     </aside>
//   );

//   /* --------------------- Mobile Sidebar -------------------------- */
//   const MobileSidebar = (
//     <>
//       {/* Header + menu button */}
//       <div className="flex items-center justify-between h-[79px] px-4">
//         <a href="/" className="shrink-0">
//           <img src="/img/logo/Logo.png" width={177} height={48} alt="Logo" />
//         </a>

//         <button
//           onClick={mobileControls.onToggle}
//           aria-label={isMobileOpen ? "Close menu" : "Open menu"}
//           className="md:hidden p-2 text-black"
//         >
//           {isMobileOpen ? <MdClose size={30} /> : <BiMenu size={30} />}
//         </button>
//       </div>

//       {/* overlay */}
//       {isMobileOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 md:hidden"
//           onClick={mobileControls.onClose}
//         />
//       )}

//       {/* drawer */}
//       <aside
//         className={`
//           fixed top-0 h-full w-80 bg-white shadow-xl
//           transform transition-transform duration-300 ease-in-out z-50 md:hidden
//           ${pos.mobile.container} ${pos.mobile.transform}
//         `}
//       >
//         <div className="flex flex-col h-full">
//           {showProfile && user && (
//             <div className="p-4 border-b flex items-center gap-3">
//               <img
//                 src={user.avatar}
//                 alt={user.name}
//                 width={48}
//                 height={48}
//                 className="rounded-full"
//               />
//               <div>
//                 <p className="font-medium text-gray-900">{user.name}</p>
//                 <p className="text-sm text-gray-500">{user.role}</p>
//               </div>
//             </div>
//           )}
//           <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
//             {renderSections(sections)}
//           </nav>
//         </div>
//       </aside>
//     </>
//   );

//   /* --------------------- final render logic ---------------------- */
//   if (isMobile === null) return null;

//   if (isMobile) {
//     return MobileSidebar;
//   }

//   /* ---------- Desktop ---------- */
//   if (toggleDesk) {
//     return (
//       <>
//         {/* Desktop toggle button – always shown when toggleDesk is true */}
//         <button
//           onClick={() => setIsDesktopVisible((v) => !v)}
//           aria-label={isDesktopVisible ? "Hide sidebar" : "Show sidebar"}
//           className={`
//             fixed ${toggleDeskBtnCls} z-50 p-2 bg-white border rounded-full shadow
//             hover:bg-gray-50 ${toggleDeskBtnClass}
//           `}
//         >
//           {isDesktopVisible ? (
//             position === "left" ? (
//               <MdChevronLeft />
//             ) : (
//               <MdChevronRight />
//             )
//           ) : position === "left" ? (
//             <MdChevronRight />
//           ) : (
//             <MdChevronLeft />
//           )}
//         </button>

//         {isDesktopVisible && DesktopSidebar}
//       </>
//     );
//   }

//   /* hideOnDesk handling (no toggle) */
//   return hideOnDesk ? null : DesktopSidebar;
// };

// export default Sidebar;

// import type  { ReactElement, MouseEvent } from "react";

// export interface SidebarItem {
//   id: string;
//   label: string;
//   icon?: React.ElementType;
//   href?: string;
//   badge?: number | string;
//   disabled?: boolean;
//   /** NEW – recursive sub-menu items */
//   subItems?: SidebarItem[];
//   /** Optional click handler (used for logout, etc.) */
//   onClick?: (e: MouseEvent) => void;
// }

// export interface SidebarSection {
//    id?: string;
//   title?: string;
//   items: SidebarItem[];

// }

// export interface SidebarUser {

//   name: string;
//   avatar: string;
//   role: string;
// }

// export interface MobileSidebarControls {
//   isOpen: boolean;
//   onOpen: () => void;
//   onClose: () => void;
//   onToggle: () => void;
// }

// /* Props for the Sidebar component */
// export interface SidebarProps {
//   sections: SidebarSection[];
//   activeItemId: string;
//   onItemClick: (id: string, item: SidebarItem) => void;
//   user?: SidebarUser;
//   showProfile?: boolean;
//   className?: string;
//   header?: ReactElement;
//   variant?: "default" | "compact" | "floating";
//   showActiveIndicator?: boolean;
//   hideOnDesktop?: boolean;
//   mobileBreakpoint?: number;
// }

// type.ts
// types.ts
// export type DesktopSize = "wide" | "compact" | "icon";
// export type SubmenuStyle = "dropdown" | "tooltip";
// export type SidebarPosition = "left" | "right";
// export type ToggleButtonPosition =
//   | "top-left"
//   | "top-right"
//   | "bottom-left"
//   | "bottom-right"
//   | "center-center"
//   | "top-center"
//   | "center-left"
//   | "center-right"
//   | string;
// export type CustomTogglePosition = React.CSSProperties;

// export interface SidebarItem {
//   id: string;
//   label: string;
//   /** Icon component (React component type) */
//   icon?: React.ElementType;
//   href?: string;
//   badge?: number | string;
//   disabled?: boolean;
//   /** Nested subitems (use `subItems` consistently everywhere) */
//   subItems?: SidebarItem[];
// }

// export interface SidebarSection {
//   id?: string;
//   title?: string;
//   items: SidebarItem[];
// }

// export interface User {
//   name: string;
//   role?: string;
//   avatar?: string;
// }

// export interface MobileSidebarControls {
//   isOpen: boolean;
//   onOpen: () => void;
//   onClose: () => void;
//   onToggle: () => void;
// }

// export interface SubmenuState {
//   isOpen: boolean;
//   isAnimating: boolean;
//   height?: number;
// }

// export interface SidebarProps {
//   sections: SidebarSection[];
//   activeItemId?: string | null;
//   onItemClick: (id: string, item: SidebarItem) => void;
//   user?: User | null;
//   showProfile?: boolean;
//   toggleDesktop?:boolean;
//   className?: string;
//   header?: React.ReactNode;
//   variant?: "default" | "compact" | "floating";
//   showActiveIndicator?: boolean;
//   hideOnDesktop?: boolean;
//   mobileBreakpoint?: number;

//   position?: SidebarPosition;
//   showToggleButton?: boolean;
//   toggleButtonPosition?: ToggleButtonPosition;
//   customTogglePosition?: CustomTogglePosition;
//   desktopSize?: DesktopSize;
//   submenuStyle?: SubmenuStyle;
// }
// type.ts
// import React from "react";

// export type SidebarItem = {
//   id: string;
//   label: string;
//   icon?: React.ElementType;
//   href?: string;
//   badge?: number | string;
//   disabled?: boolean;
//   subItems?: SidebarItem[];
//   onClick?: () => void;
// };

// export type SidebarSection = {
//   id?: string;
//   title?: string;
//   items: SidebarItem[];
// };

// export type MobileSidebarControls = {
//   isOpen: boolean;
//   onOpen: () => void;
//   onClose: () => void;
//   onToggle: () => void;
// };

// export type SidebarProps = {
//   sections: SidebarSection[];
//   activeItemId?: string;
//   onItemClick: (id: string, item?: SidebarItem) => void;
//   user?: { name: string; role?: string; avatar?: string };
//   showProfile?: boolean;
//   className?: string;
//   header?: React.ReactNode;
//   variant?: "default" | "compact" | "floating";
//   showActiveIndicator?: boolean;
//   hideOnDesk?: boolean;
//   toggleDesk?: boolean;
//   mobileBreakpoint?: number;
//   position?: "left" | "right";
//   // New collapsible props
//   collapsible?: boolean; // enable collapse feature
//   collapsed?: boolean | undefined; // controlled collapsed state (optional)
//   defaultCollapsed?: boolean; // uncontrolled default
//   onCollapseChange?: (collapsed: boolean) => void;
//   collapseTogglePosition?: "top" | "bottom"; // toggle button position
// };

// import type { ReactElement, MouseEvent } from "react";

// export interface SidebarUser {
//   name: string;
//   avatar: string;
//   role?: string;
//   email?: string;
// }

// export interface SidebarItem {
//   id: string;
//   label: string;
//   icon?: React.ElementType;
//   href?: string;
//   badge?: number | string;
//   badgeVariant?: "default" | "primary" | "success" | "warning" | "error";
//   disabled?: boolean;
//   subItems?: SidebarItem[];
//   onClick?: (item: SidebarItem) => void;
//   isExternal?: boolean;
// }

// export interface SidebarSection {
//   id?: string;
//   title?: string;
//   items: SidebarItem[];
//   collapsible?: boolean;
//   defaultCollapsed?: boolean;
// }

// export interface MobileSidebarControls {
//   isOpen: boolean;
//   onOpen: () => void;
//   onClose: () => void;
//   onToggle: () => void;
// }

// export interface SidebarProps {
//   // Content
//   sections: SidebarSection[];
//   activeItemId?: string;
//   onItemClick: (id: string, item: SidebarItem) => void;
//   user?: SidebarUser;
//   header?: React.ReactNode;
//   footer?: React.ReactNode;

//   // Position & Layout
//   position?: "left" | "right";
//   toggleButtonPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";

//   // Width & Display Modes
//   width?: "narrow" | "normal" | "wide" | "icon-only";
//   collapsible?: boolean;
//   defaultCollapsed?: boolean;

//   // Responsive Behavior
//   responsiveMode?: "auto" | "always-mobile" | "always-desktop";
//   mobileBreakpoint?: number;

//   // Styling & Theme
//   variant?: "default" | "compact" | "floating" | "glass" | "minimal";
//   theme?: "light" | "dark" | "system";
//   showProfile?: boolean;
//   showActiveIndicator?: boolean;
//   className?: string;
//   hideOnDesktop?: boolean;

//   // Mobile Specific
//   mobileOverlay?: boolean;
//   mobileSlideFrom?: "left" | "right";
//   mobileWidth?: number | string;

//   // Animation
//   animationDuration?: number;
//   disableAnimations?: boolean;

//   // Enhanced Features
//   searchable?: boolean;
//   searchPlaceholder?: string;
//   onSearch?: (query: string) => void;
//   showScrollbar?: boolean;
//   stickyHeader?: boolean;
//   customTheme?: {
//     bg?: string;
//     text?: string;
//     textSecondary?: string;
//     textMuted?: string;
//     hover?: string;
//     active?: string;
//     border?: string;
//   };
// }

// // Optional: Export a default theme configuration for reuse
// export const defaultThemeConfig = {
//   light: {
//     bg: "bg-white",
//     text: "text-gray-900",
//     textSecondary: "text-gray-600",
//     textMuted: "text-gray-400",
//     hover: "hover:bg-gray-50",
//     active: "bg-blue-50 text-blue-700 border-blue-500",
//     border: "border-gray-200",
//   },
//   dark: {
//     bg: "bg-gray-900",
//     text: "text-white",
//     textSecondary: "text-gray-300",
//     textMuted: "text-gray-500",
//     hover: "hover:bg-gray-800",
//     active: "bg-blue-900/50 text-blue-300 border-blue-400",
//     border: "border-gray-700",
//   },
// } as const;

// // Optional: Export width configurations
// export const widthConfig = {
//   "icon-only": "w-16",
//   narrow: "w-48",
//   normal: "w-64",
//   wide: "w-80",
// } as const;

// // Optional: Export variant configurations
// export const variantConfig = {
//   default: {
//     container: "bg-white border-r border-gray-200",
//     item: "px-4 py-3",
//     iconSize: 20,
//   },
//   compact: {
//     container: "bg-white border-r border-gray-200",
//     item: "px-3 py-2",
//     iconSize: 18,
//   },
//   floating: {
//     container: "bg-white rounded-2xl shadow-lg border border-gray-200 m-4",
//     item: "px-4 py-3",
//     iconSize: 20,
//   },
//   glass: {
//     container: "bg-white/80 backdrop-blur-lg border-r border-white/20 shadow-xl",
//     item: "px-4 py-3",
//     iconSize: 20,
//   },
//   minimal: {
//     container: "bg-transparent border-r border-gray-100",
//     item: "px-4 py-3",
//     iconSize: 20,
//   },
// } as const;

// // Optional: Export badge configurations
// export const badgeConfig = {
//   default: "bg-gray-500 text-white",
//   primary: "bg-blue-500 text-white",
//   success: "bg-green-500 text-white",
//   warning: "bg-yellow-500 text-white",
//   error: "bg-red-500 text-white",
// } as const;

// // Type helpers for better TypeScript experience
// export type SidebarVariant = keyof typeof variantConfig;
// export type SidebarTheme = "light" | "dark" | "system";
// export type SidebarWidth = keyof typeof widthConfig;
// export type BadgeVariant = keyof typeof badgeConfig;
// export type SidebarPosition = "left" | "right";
// export type ToggleButtonPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
// export type ResponsiveMode = "auto" | "always-mobile" | "always-desktop";
// export type MobileSlideFrom = "left" | "right";
