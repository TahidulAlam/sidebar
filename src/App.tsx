import { useState } from "react";
import "./App.css";

// ✅ Type-only import (for TS5+ with verbatimModuleSyntax)
import type { SidebarSection } from "./type";

import { MdDashboard, MdFileCopy, MdPeople, MdSettings } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import Sidebar from "./sidebar/Sidebar";

function App() {
  const [activeItemId, setActiveItemId] = useState("dashboard");

  // ✅ Sidebar content configuration
  const sections: SidebarSection[] = [
    {
      id: "main",
      title: "Main",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: MdDashboard,
        },
        {
          id: "users",
          label: "Users",
          icon: MdPeople,
          subItems: [
            { id: "all-users", label: "All Users" },
            {
              id: "add-user",
              label: "Add User",
              icon: FaUserPlus,
              // href: "#",
            },
          ],
        },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      items: [
        {
          id: "reports",
          label: "Reports",
          icon: MdFileCopy,
          // href: "#",
          subItems: [
            {
              id: "all-reports",
              label: "All Reports",
              // href: "#"
            },
          ],
        },
        {
          id: "preferences",
          label: "Preferences",
          icon: MdSettings,
          // href: "#",
        },
      ],
    },
  ];

  const handleItemClick = (id: string) => {
    console.log("Clicked:", id);
    setActiveItemId(id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="text-center font-bold text-5xl py-5">
        Sidebar Ninja
      </header>

      <Sidebar
        sections={sections}
        activeItemId={activeItemId}
        onItemClick={handleItemClick}
        // user={user}
        position="right"
        collapsible
        variant="fullscreen"
        hideOnDesk
        toggleDesk={true}
        toggleDeskBtnClass="z-9999 mx-20"
        toggleDeskBtnPosition="bottom-right"
        collapseTogglePosition="bottom"
      />
    </div>
  );
}

export default App;

// import { useState } from "react";
// import "./App.css";
// import Sidebar from "./Sidebar";
// // import type { SidebarSection, SidebarItem } from "./Sidebar";
// import {
//   MdDashboard,
//   MdFileCopy,
//   MdPeople,
//   MdSettings,
//   MdAnalytics,
//   MdShoppingCart,
//   MdEmail,
//   MdNotifications,
//   MdHelp,
//   MdSecurity,
// } from "react-icons/md";
// import {
//   FaUserPlus,
//   FaBell,
//   FaCog,
//   FaShieldAlt,
//   FaRocket,
//   FaChartLine,
// } from "react-icons/fa";
// import { IoIosStats } from "react-icons/io";
// import type { SidebarItem, SidebarSection } from "./type";

// function App() {
//   const [activeItemId, setActiveItemId] = useState<string>("dashboard");
//   const [sidebarVariant, setSidebarVariant] = useState<
//     "default" | "compact" | "floating" | "glass" | "minimal"
//   >("default");
//   const [sidebarTheme, setSidebarTheme] = useState<"light" | "dark" | "system">(
//     "light"
//   );
//   const [sidebarWidth, setSidebarWidth] = useState<
//     "narrow" | "normal" | "wide" | "icon-only"
//   >("normal");
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   // Comprehensive sidebar content configuration
//   const sections: SidebarSection[] = [
//     {
//       id: "main",
//       title: "Main Navigation",
//       items: [
//         {
//           id: "dashboard",
//           label: "Dashboard",
//           icon: MdDashboard,
//           badge: "New",
//           badgeVariant: "primary",
//         },
//         {
//           id: "analytics",
//           label: "Analytics",
//           icon: MdAnalytics,
//           subItems: [
//             {
//               id: "overview",
//               label: "Overview",
//               icon: IoIosStats,
//               badge: "3",
//               badgeVariant: "success",
//             },
//             {
//               id: "reports",
//               label: "Reports",
//               icon: MdFileCopy,
//               subItems: [
//                 { id: "sales-report", label: "Sales Report", badge: "Hot" },
//                 { id: "user-report", label: "User Report" },
//               ],
//             },
//             { id: "metrics", label: "Performance Metrics", icon: FaChartLine },
//           ],
//         },
//         {
//           id: "ecommerce",
//           label: "E-Commerce",
//           icon: MdShoppingCart,
//           badge: "12",
//           badgeVariant: "error",
//           subItems: [
//             { id: "products", label: "Products" },
//             { id: "orders", label: "Orders", badge: "5" },
//             { id: "customers", label: "Customers" },
//             { id: "inventory", label: "Inventory", disabled: true },
//           ],
//         },
//       ],
//     },
//     {
//       id: "communication",
//       title: "Communication",
//       collapsible: true,
//       defaultCollapsed: true,
//       items: [
//         {
//           id: "messages",
//           label: "Messages",
//           icon: MdEmail,
//           badge: "24",
//           badgeVariant: "primary",
//         },
//         {
//           id: "notifications",
//           label: "Notifications",
//           icon: MdNotifications,
//           badge: "99+",
//           badgeVariant: "warning",
//         },
//       ],
//     },
//     {
//       id: "management",
//       title: "User Management",
//       items: [
//         {
//           id: "users",
//           label: "Users",
//           icon: MdPeople,
//           subItems: [
//             {
//               id: "all-users",
//               label: "All Users",
//               icon: MdPeople,
//               badge: "1.2k",
//             },
//             {
//               id: "add-user",
//               label: "Add User",
//               icon: FaUserPlus,
//               badgeVariant: "success",
//             },
//             {
//               id: "user-roles",
//               label: "User Roles",
//               icon: FaShieldAlt,
//             },
//           ],
//         },
//         {
//           id: "teams",
//           label: "Teams",
//           icon: FaRocket,
//           disabled: true,
//         },
//       ],
//     },
//     {
//       id: "system",
//       title: "System",
//       items: [
//         {
//           id: "settings",
//           label: "Settings",
//           icon: MdSettings,
//           subItems: [
//             { id: "general", label: "General Settings", icon: FaCog },
//             { id: "security", label: "Security", icon: MdSecurity },
//             {
//               id: "notifications-settings",
//               label: "Notifications",
//               icon: FaBell,
//             },
//           ],
//         },
//         {
//           id: "support",
//           label: "Help & Support",
//           icon: MdHelp,
//           href: "https://help.example.com",
//           isExternal: true,
//         },
//       ],
//     },
//   ];

//   const user = {
//     name: "John Doe",
//     role: "Administrator",
//     email: "john.doe@example.com",
//     avatar: "https://i.pravatar.cc/150?img=1",
//   };

//   const handleItemClick = (id: string, item: SidebarItem) => {
//     console.log("Clicked:", id, item);
//     setActiveItemId(id);

//     // Handle external links
//     if (item.href && item.isExternal) {
//       window.open(item.href, "_blank");
//       return;
//     }

//     // Handle regular navigation
//     if (item.href && !item.isExternal) {
//       // You can use your router here, e.g.:
//       // navigate(item.href);
//       console.log("Navigating to:", item.href);
//     }
//   };

//   const handleSearch = (query: string) => {
//     console.log("Searching for:", query);
//     // Implement your search logic here
//   };

//   const headerContent = (
//     <div className="flex items-center justify-between p-2">
//       <div className="flex items-center gap-3">
//         <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
//           <span className="text-white font-bold text-sm">SN</span>
//         </div>
//         <span className="font-bold text-lg">Sidebar Ninja</span>
//       </div>
//     </div>
//   );

//   const footerContent = (
//     <div className="text-center text-xs text-gray-500">
//       <p>Version 2.0.0</p>
//       <p>© 2024 Sidebar Ninja</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Demo Controls */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
//             Sidebar Ninja - Feature Demo
//           </h1>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             {/* Variant Control */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Variant
//               </label>
//               <select
//                 value={sidebarVariant}
//                 onChange={(e) => setSidebarVariant(e.target.value as any)}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="default">Default</option>
//                 <option value="compact">Compact</option>
//                 <option value="floating">Floating</option>
//                 <option value="glass">Glass</option>
//                 <option value="minimal">Minimal</option>
//               </select>
//             </div>

//             {/* Theme Control */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Theme
//               </label>
//               <select
//                 value={sidebarTheme}
//                 onChange={(e) => setSidebarTheme(e.target.value as any)}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="light">Light</option>
//                 <option value="dark">Dark</option>
//                 <option value="system">System</option>
//               </select>
//             </div>

//             {/* Width Control */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Width
//               </label>
//               <select
//                 value={sidebarWidth}
//                 onChange={(e) => setSidebarWidth(e.target.value as any)}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="narrow">Narrow</option>
//                 <option value="normal">Normal</option>
//                 <option value="wide">Wide</option>
//                 <option value="icon-only">Icon Only</option>
//               </select>
//             </div>

//             {/* Collapse Control */}
//             <div className="flex items-end">
//               <button
//                 onClick={() => setIsCollapsed(!isCollapsed)}
//                 className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
//               >
//                 {isCollapsed ? "Expand" : "Collapse"}
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//             <div className="text-center p-3 bg-blue-50 rounded-lg">
//               <div className="font-semibold text-blue-800">Active Item</div>
//               <div className="text-blue-600">{activeItemId}</div>
//             </div>
//             <div className="text-center p-3 bg-green-50 rounded-lg">
//               <div className="font-semibold text-green-800">Variant</div>
//               <div className="text-green-600">{sidebarVariant}</div>
//             </div>
//             <div className="text-center p-3 bg-purple-50 rounded-lg">
//               <div className="font-semibold text-purple-800">Theme</div>
//               <div className="text-purple-600">{sidebarTheme}</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content with Sidebar */}
//       <div className="flex">
//         {/* Sidebar with ALL features demonstrated */}
//         <Sidebar
//           // Content
//           sections={sections}
//           activeItemId={activeItemId}
//           onItemClick={handleItemClick}
//           user={user}
//           header={headerContent}
//           footer={footerContent}
//           // Position & Layout
//           position="left"
//           toggleButtonPosition="top-left"
//           // Width & Display Modes
//           width={sidebarWidth}
//           collapsible={true}
//           defaultCollapsed={isCollapsed}
//           // Responsive Behavior
//           responsiveMode="auto"
//           mobileBreakpoint={768}
//           // Styling & Theme
//           variant={sidebarVariant}
//           theme={sidebarTheme}
//           showProfile={true}
//           showActiveIndicator={true}
//           className="shrink-0"
//           // Mobile Specific
//           mobileOverlay={true}
//           mobileSlideFrom="left"
//           mobileWidth="320px"
//           // Animation
//           animationDuration={300}
//           disableAnimations={false}
//           // Enhanced Features
//           searchable={true}
//           searchPlaceholder="Search menus..."
//           onSearch={handleSearch}
//           showScrollbar={true}
//           stickyHeader={true}

//           // Custom Theme Example (uncomment to use)
//           // customTheme={{
//           //   bg: "bg-gradient-to-b from-purple-900 to-indigo-800",
//           //   text: "text-white",
//           //   textSecondary: "text-purple-200",
//           //   textMuted: "text-purple-400",
//           //   hover: "hover:bg-purple-700",
//           //   active: "bg-purple-600 text-white border-l-4 border-purple-300",
//           //   border: "border-purple-600",
//           // }}//

//         {/* Main Content Area */}
//         <main className="flex-1 p-8">
//           <div className="max-w-4xl mx-auto">
//             <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">
//                 Welcome to Sidebar Ninja Demo
//               </h2>
//               <p className="text-gray-600 mb-6">
//                 This demo showcases all the powerful features of the Sidebar
//                 Ninja component. Use the controls above to customize the sidebar
//                 in real-time.
//               </p>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-blue-50 p-6 rounded-xl">
//                   <h3 className="font-semibold text-blue-800 mb-3">
//                     ✨ Features Demonstrated
//                   </h3>
//                   <ul className="text-blue-700 space-y-2">
//                     <li>• Multiple sidebar variants</li>
//                     <li>• Light/Dark/System themes</li>
//                     <li>• Collapsible sections</li>
//                     <li>• Nested submenus</li>
//                     <li>• Search functionality</li>
//                     <li>• Badges with variants</li>
//                     <li>• User profile section</li>
//                     <li>• Responsive design</li>
//                     <li>• Smooth animations</li>
//                     <li>• Custom headers & footers</li>
//                   </ul>
//                 </div>

//                 <div className="bg-green-50 p-6 rounded-xl">
//                   <h3 className="font-semibold text-green-800 mb-3">
//                     🎯 Interactive Elements
//                   </h3>
//                   <ul className="text-green-700 space-y-2">
//                     <li>• Try collapsing/expanding</li>
//                     <li>• Hover over collapsed items</li>
//                     <li>• Use search in sidebar</li>
//                     <li>• Click on badges</li>
//                     <li>• Test on mobile view</li>
//                     <li>• Toggle dark/light mode</li>
//                     <li>• Collapse individual sections</li>
//                     <li>• Navigate nested menus</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
//               <h3 className="text-xl font-bold mb-4">🚀 Getting Started</h3>
//               <p className="mb-4">
//                 To use Sidebar Ninja in your project, simply import the
//                 component and configure your sidebar sections with the desired
//                 features.
//               </p>
//               <div className="bg-black/30 p-4 rounded-lg font-mono text-sm">
//                 {`import Sidebar from './Sidebar';\n\nconst sections = [\n  {\n    title: "Main",\n    items: [\n      { id: "dashboard", label: "Dashboard", icon: MdDashboard }\n    ]\n  }\n];`}
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default App;
