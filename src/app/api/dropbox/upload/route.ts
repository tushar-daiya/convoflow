import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import mime from "mime-types";
import { prisma } from "@/lib/prisma";
import { convertFilesToDocs } from "@/lib/convertFilesToDocs";
import { docsToVector } from "@/lib/processFiles";
export async function POST(req: NextRequest) {
  const body = await req.json();
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

  const userInfo = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      dropbox_refresh_token: true,
      openAiApiKey: true,
      pineconeApiKey: true,
    },
  });

  if (!userInfo?.dropbox_refresh_token) {
    return NextResponse.json(
      {
        error: "Dropbox not connected",
      },
      {
        status: 400,
      }
    );
  }

  if (!userInfo.openAiApiKey || !userInfo.pineconeApiKey) {
    return NextResponse.json(
      {
        error: "Missing API keys",
      },
      {
        status: 400,
      }
    );
  }

  const url = "https://api.dropboxapi.com/oauth2/token";
  const response = await axios.post(
    url,
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: userInfo?.dropbox_refresh_token,
      client_id: process.env.AUTH_DROPBOX_ID!,
      client_secret: process.env.AUTH_DROPBOX_SECRET!,
    }).toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  const accessToken = response.data.access_token;

  const headersaxios = {
    Authorization: `Bearer ${accessToken}`,
    "Dropbox-API-Arg": JSON.stringify({ path: body.path }),
    "Content-Type": "application/octet-stream",
  };
  try {
    const mimeType = mime.lookup(body.path) as string;

    const res = await axios.post(
      "https://content.dropboxapi.com/2/files/download",
      null,
      { headers: headersaxios, responseType: "arraybuffer" }
    );
    const data = await res.data;
    const fileBlob = new Blob([data]);
    let loader;
    try {
      loader = await convertFilesToDocs(fileBlob, mimeType);
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }
    const { status } = await docsToVector(
      loader,
      session?.user?.id.toLowerCase(),
      userInfo.openAiApiKey,
      userInfo.pineconeApiKey
    );
    if (status === 200) {
      return NextResponse.json({ message: "Successfully uploaded document" });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
