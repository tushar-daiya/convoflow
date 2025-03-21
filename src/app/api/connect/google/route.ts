import googleOAuthClient from "@/lib/googleOAuthClient";
import { NextResponse } from "next/server";

export async function GET() {
  const authUrl = googleOAuthClient.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.readonly"],
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  });
  return NextResponse.redirect(authUrl);
}
