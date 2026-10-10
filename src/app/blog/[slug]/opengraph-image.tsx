import { ImageResponse } from "next/og";
import { formatDate, getPublishedPost, readingMinutes } from "@/lib/blog";
import { author } from "@/lib/site";

export const alt = "Article by Abul Monsur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPublishedPost((await params).slug);
  const title = post?.title ?? "Engineering notes";
  const meta = post
    ? `${formatDate(post.publishedAt ?? post.createdAt)}  ·  ${readingMinutes(post.content)} min read`
    : "Writing";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(70% 60% at 10% 0%, #0f3b2e 0%, #0a0a0a 70%)",
          color: "#e8e4d9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, letterSpacing: 4, color: "#6ee7b7" }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#34d399" }} />
          {(post?.tags[0] ?? "WRITING").toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 70 ? 56 : 68,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.08,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "#a8a69f" }}>
          <span style={{ color: "#e8e4d9", fontWeight: 600 }}>{author.name}</span>
          <span>{meta}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
