import { auth } from "@/lib/auth";
import { convertFilesToDocs } from "@/lib/convertFilesToDocs";
import googleOAuthClient from "@/lib/googleOAuthClient";
import { docsToVector } from "@/lib/processFiles";
import { prisma } from "@/lib/prisma";
import { google } from "googleapis";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const fileId = (await params).fileId;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userInfo = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      google_refresh_token: true,
      openAiApiKey: true,
      pineconeApiKey: true,
    },
  });

  if (!userInfo?.google_refresh_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log(userInfo);

  if (!userInfo.openAiApiKey || !userInfo.pineconeApiKey) {
    console.log("hello");
    return NextResponse.json({ error: "Missing API keys" }, { status: 400 });
  }
  console.log("hello2");
  googleOAuthClient.setCredentials({
    refresh_token: userInfo.google_refresh_token,
  });

  const drive = google.drive({
    version: "v3",
    auth: googleOAuthClient,
  });

  const res = await drive.files.get({
    fileId,
  });

  if (!res) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const mimeType = res.data.mimeType as string;
  const response = await drive.files.get(
    {
      fileId,
      alt: "media",
    },
    {
      responseType: "arraybuffer",
    }
  );

  const fileBlob = new Blob([response.data as ArrayBuffer]);
  let loader;
  try {
    loader = await convertFilesToDocs(fileBlob, mimeType);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 }
    );
  }

  const { status } = await docsToVector(
    loader,
    session.user.id.toLowerCase(),
    userInfo.openAiApiKey,
    userInfo.pineconeApiKey
  );
  if (status === 200) {
    return NextResponse.json(
      { message: "Successfully uploaded document" },
      { status: 200 }
    );
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
