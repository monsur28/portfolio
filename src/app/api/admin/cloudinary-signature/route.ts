import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { cloudinaryConfig, signUploadParams, CLOUDINARY_FOLDER } from "@/lib/cloudinary";

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = cloudinaryConfig();
  if (!config) {
    console.error("Cloudinary env vars are not set");
    return NextResponse.json({ error: "Image uploads are not configured" }, { status: 500 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signUploadParams(
    { folder: CLOUDINARY_FOLDER, timestamp },
    config.apiSecret
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder: CLOUDINARY_FOLDER,
    apiKey: config.apiKey,
    cloudName: config.cloudName,
  });
}
