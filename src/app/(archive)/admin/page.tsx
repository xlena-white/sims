import type { Metadata } from "next";
import { getGenerations, getSiteSettings } from "@/lib/data";
import { GenerationForm, SettingsForm } from "./forms";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const [settings, generations] = await Promise.all([getSiteSettings(), getGenerations()]);

  return (
    <div className="space-y-5">
      <SettingsForm settings={settings} />
      {generations.map((g) => (
        <GenerationForm key={g.number} generation={g} />
      ))}
    </div>
  );
}
