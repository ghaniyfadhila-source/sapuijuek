import { NextRequest, NextResponse } from "next/server";
import { getAnonClient } from "@/lib/supabase/db";
import { contactSchema } from "@/lib/validation/contact";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Input tidak valid" },
      { status: 400 },
    );
  }

  const supabase = getAnonClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .insert(parsed.data)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: "Gagal mengirim pesan" }, { status: 500 });
  }
  return NextResponse.json({ data: data as { id: string } }, { status: 201 });
}