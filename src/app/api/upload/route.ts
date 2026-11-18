
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.IMGBB_API;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ImgBB API key is missing" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { error: "Please select an image" },
        { status: 400 }
      );
    }

    // ImgBB free API supports images up to 32 MB.
    if (image.size > 32 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be smaller than 32 MB" },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("image", image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { error: result.error?.message || "Image upload failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.data.url,
    });

  } catch (error) {
    console.error("ImgBB upload error:", error);

    return NextResponse.json(
      { error: "Something went wrong while uploading" },
      { status: 500 }
    );
  }
}
