"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@ant-design/v5-patch-for-react-19";
import { Button, Menu, MenuProps, unstableSetRender } from "antd";
import { createRoot } from "react-dom/client";
import {
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "./lib/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Configure AntD for React 19
unstableSetRender((node, container) => {
  container._reactRoot ||= createRoot(container);
  const root = container._reactRoot;
  root.render(node);
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    root.unmount();
  };
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  type MenuItem = Required<MenuProps>["items"][number];

  const items: MenuItem[] = [
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: "Dashboard",
    },
    { key: "2", icon: <DesktopOutlined />, label: "User" },
    { key: "3", icon: <ContainerOutlined />, label: "Option 3" },
  ];

  const page = [
    {
      key: "1",
      path: "/dashboard",
    },
    {
      key: "2",
      path: "/user",
    },
  ];

  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  const handleSelect = ({
    item,
    key,
    keyPath,
    selectedKeys,
    domEvent,
  }: any) => {
    console.log({ item, key, keyPath, selectedKeys, domEvent });

    router.push(page.find((el) => el.key === key)?.path || "/dashboard");
  };

  const queryClient = new QueryClient();
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {pathname === "/login" || pathname === "/" ? (
          <div>{children}</div>
        ) : (
          <Provider store={storeRef.current}>
            <QueryClientProvider client={queryClient}>
              <div className="">
                <div className="w-[90%] m-auto flex justify-between">
                  <div>Dashboard</div>
                  <Button onClick={handleLogOut}>Log out</Button>
                </div>

                {/* Menu */}
                <div className="flex mt-20">
                  <div style={{ width: 256 }}>
                    <Menu
                      defaultSelectedKeys={["1"]}
                      defaultOpenKeys={["sub1"]}
                      mode="inline"
                      theme="dark"
                      items={items}
                      onSelect={handleSelect}
                    />
                  </div>
                  <div className="ml-4">{children}</div>
                </div>
              </div>
            </QueryClientProvider>
          </Provider>
        )}
      </body>
    </html>
  );
}
