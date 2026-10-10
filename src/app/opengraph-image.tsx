import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";

export const alt = "Abul Monsur - Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const settings = await prisma.landingPage.findUnique({ where: { id: 1 } });
  const name = settings?.heroName || "ABUL MONSUR";
  const role = settings?.heroRole || "FULL-STACK DEVELOPER";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0a",
          color: "#e8e4d9",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: 22,
            letterSpacing: "4px",
            color: "#899980",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#899980",
            }}
          />
          {role.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: "-2px",
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          {name}
        </div>
      </div>
    ),
    { ...size }
  );
}
