import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@shared/supabase/server";

import { resolveNextDestination } from "../helpers";

const DEFAULT_REDIRECT_PATH = "/login";

const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};

export const GET = async (request: NextRequest) => {
  try {
    await signOut();
    const next = request.nextUrl.searchParams.get("next");
    const destination = resolveNextDestination(
      request.url,
      next,
      DEFAULT_REDIRECT_PATH
    );

    return NextResponse.redirect(destination);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "로그아웃 과정에서 오류가 발생했어요.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  const body = await request.json().catch(() => ({} as { next?: string }));

  try {
    await signOut();

    return NextResponse.json({
      success: true,
      next: body.next ?? DEFAULT_REDIRECT_PATH,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "로그아웃 과정에서 오류가 발생했어요.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
};
