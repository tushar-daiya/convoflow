import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
      dropbox_refresh_token: true,
    },
  });

  if (!refreshToken?.dropbox_refresh_token) {
    return NextResponse.json(
      {
        error: "Dropbox not connected",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const url = "https://api.dropboxapi.com/oauth2/token";
    const response = await axios.post(
      url,
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken?.dropbox_refresh_token,
        client_id: process.env.AUTH_DROPBOX_ID!,
        client_secret: process.env.AUTH_DROPBOX_SECRET!,
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = response.data.access_token;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const body = {
      path: "", // Empty string to list root folder
      recursive: true, // Set to true to get all files from subfolders
    };

    const res = await axios.post(
      "https://api.dropboxapi.com/2/files/list_folder",
      body,
      { headers }
    );
    const data = res.data;
    const files = data.entries.filter(
      (entry: { [key: string]: any }) => entry[".tag"] === "file"
    ); //eslint-disable-line
    return NextResponse.json(files, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
