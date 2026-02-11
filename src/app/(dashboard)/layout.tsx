"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spin } from "antd";
import { PlusOutlined, LogoutOutlined } from "@ant-design/icons";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import WalletIcon from "@/components/icons/WalletIcon";
import HistoryIcon from "@/components/icons/HistoryIcon";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [balance, setBalance] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
    }
  }, [user, mounted, router]);

  useEffect(() => {
    if (user) {
      api
        .get<{ balance: number }>("/settlements/balance")
        .then(({ data }) => setBalance(data.balance))
        .catch(() => {});
    }
  }, [user]);

  if (!mounted || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const isNewOrder = pathname.includes("/orders/new");

  const getPageTitle = () => {
    if (isNewOrder) return { regular: "Crear un", bold: " env\u00edo" };
    return { regular: "", bold: "Mis env\u00edos" };
  };

  const title = getPageTitle();

  const menuItems = [
    {
      key: "/orders/new",
      label: "Crear orden",
      icon: <PlusOutlined style={{ fontSize: 20 }} />,
    },
    {
      key: "/orders",
      label: "Historial",
      icon: <HistoryIcon style={{ fontSize: 20 }} />,
    },
  ];

  const selectedKey = isNewOrder ? "/orders/new" : "/orders";

  return (
    <div className="flex min-h-screen bg-white">
      <aside
        className="fixed left-0 top-0 bottom-0 z-10 flex flex-col gap-8 px-4 py-10"
        style={{
          width: 344,
          background: "var(--dark-gray-50)",
          backdropFilter: "blur(50px)",
        }}
      >
        <div className="px-6">
          <img src="/logo.svg" alt="boxful" width={250} />
        </div>

        <p
          className="px-6 text-[14px] font-bold"
          style={{ color: "var(--azul-oscuro)" }}
        >
          MENÚ
        </p>

        <nav className="flex flex-col gap-6 px-4">
          {menuItems.map((item) => {
            const isActive = item.key === selectedKey;
            return (
              <button
                key={item.key}
                onClick={() => router.push(item.key)}
                className="flex cursor-pointer items-center gap-6 rounded px-8 py-6"
                style={{
                  background: isActive ? "var(--primary)" : "transparent",
                  color: isActive
                    ? "var(--primary-light)"
                    : "var(--dark-gray-500)",
                  border: "none",
                  fontSize: 16,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col" style={{ marginLeft: 344 }}>
        <header
          className="flex items-center justify-between px-8"
          style={{
            height: 90,
            background: "var(--dark-gray-50)",
            backdropFilter: "blur(2px)",
          }}
        >
          <h1 className="text-[28px]" style={{ color: "var(--azul-oscuro)" }}>
            {title.regular && (
              <span className="font-normal">{title.regular}</span>
            )}
            <span className="font-bold">{title.bold}</span>
          </h1>

          <div className="flex items-center gap-3">
            {balance !== null && (
              <div
                className="flex items-center gap-1.5 rounded px-2 py-2"
                style={{ background: "var(--verde-oscuro-50)" }}
              >
                <WalletIcon style={{ fontSize: 20, color: "var(--verde-oscuro-500)" }} />
                <span
                  className="text-[16px]"
                  style={{ color: "var(--verde-oscuro-500)" }}
                >
                  Monto a liquidar <strong>$ {balance.toFixed(2)}</strong>
                </span>
              </div>
            )}
            <span
              className="text-[22px]"
              style={{ color: "var(--azul-oscuro)" }}
            >
              {user.name} {user.lastName}
            </span>
            <button
              onClick={logout}
              className="flex items-center justify-center rounded"
              style={{
                width: 40,
                height: 40,
                background: "transparent",
                border: "1px solid var(--dark-gray-200)",
                color: "var(--dark-gray-500)",
                cursor: "pointer",
              }}
              title="Cerrar sesión"
            >
              <LogoutOutlined style={{ fontSize: 18 }} />
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 py-8" style={{ background: "var(--dark-gray-50)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
