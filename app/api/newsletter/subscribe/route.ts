import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const normalised = email.toLowerCase().trim();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: normalised, source: "homepage", created_at: new Date().toISOString() });

    if (error) {
      // 23505 = unique constraint violation (already subscribed)
      if (error.code === "23505") {
        return NextResponse.json({ success: true, message: "Already subscribed." }, { status: 200 });
      }
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[newsletter/subscribe]", err);
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }
}
