"use client";

import { useRef, useState } from "react";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

const MAX_BYTES = 10 * 1024 * 1024;

type Signature = {
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
};

function uploadToCloudinary(file: File, sig: Signature, onProgress: (pct: number) => void) {
  return new Promise<string>((resolve, reject) => {
    const body = new FormData();
    body.append("file", file);
    body.append("api_key", sig.apiKey);
    body.append("timestamp", String(sig.timestamp));
    body.append("folder", sig.folder);
    body.append("signature", sig.signature);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    });

    xhr.addEventListener("load", () => {
      let payload: { secure_url?: string; error?: { message?: string } } = {};
      try {
        payload = JSON.parse(xhr.responseText);
      } catch {
        reject(new Error("Cloudinary returned a response we could not read."));
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300 && payload.secure_url) {
        resolve(payload.secure_url);
      } else {
        reject(new Error(payload.error?.message || `Cloudinary rejected the upload (${xhr.status}).`));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Could not reach Cloudinary. Check your connection and try again."))
    );

    xhr.send(body);
  });
}

export default function ImageUploadField({
  value,
  onChange,
  label = "Project Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("That file is not an image. Pick a PNG, JPG, or WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(
        `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 10 MB - export a smaller version and try again.`
      );
      return;
    }

    setProgress(0);
    try {
      let uploadedUrl: string | null = null;

      // 1. Attempt direct client-side upload to Cloudinary using signed signature
      try {
        const res = await fetch("/api/admin/cloudinary-signature", { method: "POST" });
        const sigData = await res.json().catch(() => ({}));
        if (res.ok && sigData.signature && sigData.apiKey && sigData.cloudName) {
          uploadedUrl = await uploadToCloudinary(file, sigData, setProgress);
        }
      } catch (clientErr) {
        console.warn("Direct Cloudinary upload failed, attempting server upload fallback:", clientErr);
      }

      // 2. If direct client upload fails or is blocked, fallback to server upload endpoint
      if (!uploadedUrl) {
        setProgress(50);
        const serverFormData = new FormData();
        serverFormData.append("file", file);
        const serverRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: serverFormData,
        });
        const serverData = (await serverRes.json().catch(() => ({}))) as {
          secure_url?: string;
          error?: string;
        };
        if (!serverRes.ok || !serverData.secure_url) {
          throw new Error(serverData.error || "Upload failed on both direct and server channels.");
        }
        uploadedUrl = serverData.secure_url;
        setProgress(100);
      }

      if (!uploadedUrl) {
        throw new Error("Upload failed: No image URL returned.");
      }

      onChange(uploadedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setProgress(null);
    }
  };

  const uploading = progress !== null;
  const preview = cloudinaryUrl(value, 600);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-[var(--color-dim-text)] text-xs tracking-wider block uppercase">
        {label}
      </label>

      {value && (
        <div className="relative overflow-hidden rounded border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview ?? value} alt={`${label} preview`} className="max-h-56 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-3 rounded bg-black/70 px-3 py-1.5 text-xs uppercase tracking-wider text-white hover:bg-black"
          >
            Remove
          </button>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        tabIndex={0}
        onPaste={(e) => {
          const file = e.clipboardData.files?.[0];
          if (file && file.type.startsWith("image/")) {
            e.preventDefault();
            handleFile(file);
          }
        }}
        className={`rounded border border-dashed p-6 text-center transition-colors focus:outline-none focus:border-emerald-400/50 ${
          dragging ? "border-emerald-400/60 bg-emerald-400/5" : "border-white/15 bg-white/5"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />

        {uploading ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-white/70">Uploading… {progress}%</p>
            <div className="h-1 w-full overflow-hidden rounded bg-white/10">
              <div
                className="h-full bg-emerald-400 transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded border border-white/20 px-5 py-2.5 text-sm uppercase tracking-wider text-white hover:bg-white/10"
            >
              {value ? "Replace image" : "Upload image"}
            </button>
            <p className="mt-2 text-xs text-white/40">or drop a file here - PNG, JPG, or WebP up to 10 MB</p>
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <input
        name="imageUrl"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste an image URL"
        className="w-full rounded border border-white/10 bg-white/5 p-3 text-sm text-white"
      />
    </div>
  );
}
