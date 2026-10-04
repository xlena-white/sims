"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PREVIEW_MODE } from "@/lib/supabase/env";

/**
 * Uploads an image to the Supabase "photos" bucket and writes the public URL
 * into a hidden form field named `name`. A URL can also be pasted directly.
 */
export function PhotoUpload({ name, folder, defaultValue }: { name: string; folder: string; defaultValue?: string | null }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (PREVIEW_MODE) {
      setStatus("Uploads need Supabase to be connected.");
      return;
    }
    setStatus("Uploading…");
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const supabase = createClient();
    const { error } = await supabase.storage.from("photos").upload(path, file, { cacheControl: "31536000" });
    if (error) {
      setStatus(`Upload failed: ${error.message}`);
      return;
    }
    setUrl(supabase.storage.from("photos").getPublicUrl(path).data.publicUrl);
    setStatus("Uploaded! Remember to save.");
  }

  return (
    <div className="flex gap-4">
      <div className="size-24 shrink-0 overflow-hidden rounded-2xl border border-ink-line bg-ink">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2.5">
        <input type="hidden" name={name} value={url} />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste an image link, or upload one"
          className="field text-sm"
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="btn btn-ghost cursor-pointer px-4 py-1.5 text-sm">
            Upload image
            <input type="file" accept="image/*" onChange={onFile} className="sr-only" />
          </label>
          {url && (
            <button type="button" onClick={() => setUrl("")} className="text-sm text-chalk-faint hover:text-chalk">
              Remove
            </button>
          )}
          {status && <span className="text-sm text-chalk-muted">{status}</span>}
        </div>
      </div>
    </div>
  );
}
