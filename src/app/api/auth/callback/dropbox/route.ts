import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
  if (error) {
    return NextResponse.json(
      {
        error: "Failed to authenticate with Dropbox",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const tokenResponse = await axios.post(
      "https://api.dropboxapi.com/oauth2/token",
      null,
      {
        params: {
          code,
          grant_type: "authorization_code",
          client_id: process.env.AUTH_DROPBOX_ID,
          client_secret: process.env.AUTH_DROPBOX_SECRET,
          redirect_uri: "http://localhost:3000/api/auth/callback/dropbox",
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    await prisma.user.update({
      where: {
        id: session?.user?.id,
      },
      data: {
        dropbox_refresh_token: tokenResponse.data.refresh_token,
      },
    });

    // Save token in session, database, etc.
    return NextResponse.redirect(new URL("/dashboard/dropbox", req.url));
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to authenticate with Dropbox",
      },
      {
        status: 400,
      }
    );
  }
}
