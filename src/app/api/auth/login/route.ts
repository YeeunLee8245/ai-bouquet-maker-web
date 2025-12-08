import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@shared/supabase/server";

import { buildCallbackUrl, resolveProvider } from "../helpers";

export async function GET(request: NextRequest) {
  try {
    const provider = resolveProvider(
      request.nextUrl.searchParams.get("provider")
    );
    const next = request.nextUrl.searchParams.get("next");
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: buildCallbackUrl(request.url, next),
      },
    });

    if (error || !data?.url) {
      throw new Error(error?.message ?? "로그인을 시작할 수 없어요.");
    }

    return NextResponse.redirect(data.url, { status: 302 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "로그인 요청을 처리할 수 없어요.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
