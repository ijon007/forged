import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit",
  description: "Edit Mode",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
