import { auth } from "@/lib/auth";
import googleOAuthClient from "@/lib/googleOAuthClient";
import { prisma } from "@/lib/prisma";
import { google } from "googleapis";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
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

  const refreshToken = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      google_refresh_token: true,
    },
  });

  if (!refreshToken?.google_refresh_token) {
    return NextResponse.json(
      {
        error: "Google Drive not connected",
      },
      {
        status: 400,
      }
    );
  }

  try {
    googleOAuthClient.setCredentials({
      refresh_token: refreshToken.google_refresh_token,
    });
    const drive = google.drive({ version: "v3", auth: googleOAuthClient });
    const files = await drive.files.list({
      fields: "files(id, name, mimeType, parents)",
      spaces: "drive",
      q: "mimeType='application/pdf' OR mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document' OR mimeType='text/plain' OR mimeType='text/csv'",
    });
    console.log(files.data.files);
    return NextResponse.json(files.data.files, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching files" },
      { status: 500 }
    );
  }
}
