import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type CreateLetterBody = {
  content?: string;
};

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("future_letters")
    .select("id, content, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { message: `Lỗi khi lấy dữ liệu: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateLetterBody;
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json(
        { message: "Nội dung thư không được để trống." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("future_letters")
      .insert({ content })
      .select("id, content, created_at")
      .single();

    if (error) {
      return NextResponse.json(
        { message: `Lỗi khi lưu dữ liệu: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Đã lưu thư thành công.", data },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Không đọc được dữ liệu gửi lên." },
      { status: 400 }
    );
  }
}
