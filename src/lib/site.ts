export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const author = {
  name: "Abul Monsur",
  role: "Full-Stack Software Engineer",
  github: "https://github.com/monsur28",
  url: siteUrl,
};

export const blogMeta = {
  title: "Writing",
  description:
    "Engineering notes from Abul Monsur on Next.js, React, Node.js, databases, performance, and shipping production web systems.",
};

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
