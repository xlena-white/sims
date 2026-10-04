import { AdminTabs } from "./admin-tabs";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-28 sm:px-10">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Admin</h1>
      <AdminTabs />
      <div className="mt-10">{children}</div>
    </div>
  );
}
