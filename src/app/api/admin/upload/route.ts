import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { cloudinaryConfig, signUploadParams, CLOUDINARY_FOLDER } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = cloudinaryConfig();
    if (!config) {
      return NextResponse.json({ error: 'Cloudinary configuration is missing' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = signUploadParams(
      { folder: CLOUDINARY_FOLDER, timestamp },
      config.apiSecret
    );

    const uploadBody = new FormData();
    uploadBody.append('file', file);
    uploadBody.append('api_key', config.apiKey);
    uploadBody.append('timestamp', String(timestamp));
    uploadBody.append('folder', CLOUDINARY_FOLDER);
    uploadBody.append('signature', signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
      method: 'POST',
      body: uploadBody,
    });

    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      throw new Error(data.error?.message || `Cloudinary upload failed (${res.status})`);
    }

    return NextResponse.json({
      success: true,
      secure_url: data.secure_url,
      public_id: data.public_id,
      width: data.width,
      height: data.height,
    });
  } catch (error) {
    console.error('Server upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
