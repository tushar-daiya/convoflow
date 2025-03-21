import { auth } from "@/lib/auth";
import googleOAuthClient from "@/lib/googleOAuthClient";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      {
        error: "No code provided",
      },
      {
        status: 400,
      }
    );
  }

  const { tokens } = await googleOAuthClient.getToken(code);
  if (!tokens) {
    return NextResponse.json(
      {
        error: "No tokens provided",
      },
      {
        status: 400,
      }
    );
  }

  const { refresh_token } = tokens;
  if (!refresh_token) {
    return NextResponse.json(
      {
        error: "No refresh token provided",
      },
      {
        status: 400,
      }
    );
  }
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      {
        error: "No session provided",
      },
      {
        status: 400,
      }
    );
  }

  await prisma.user.update({
    where: {
      id: session?.user?.id,
    },
    data: {
      google_refresh_token: refresh_token,
    },
  });

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
