import { auth } from "@/lib/auth";
import { convertFilesToDocs } from "@/lib/convertFilesToDocs";
import { prisma } from "@/lib/prisma";
import { docsToVector } from "@/lib/processFiles";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files[]");
  if (!files) {
    return NextResponse.json(
      { error: "No files found in request" },
      { status: 400 }
    );
  }
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    console.log("Session not found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userInfo = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      openAiApiKey: true,
      pineconeApiKey: true,
    },
  });
  if (!userInfo?.openAiApiKey || !userInfo?.pineconeApiKey) {
    return NextResponse.json({ error: "Missing API keys" }, { status: 400 });
  }

  for (const file of files) {
    if (file instanceof File) {
      const mimeType = file.type as string;
      const fileBlob = new Blob([file], { type: mimeType });
      let loader;
      try {
        loader = await convertFilesToDocs(fileBlob, mimeType);
      } catch (error) {
        console.error(error);
        return NextResponse.json(
          { error: "Unsupported file type for file " + file.name },
          { status: 400 }
        );
      }

      const { status } = await docsToVector(
        loader,
        session.user.id.toLowerCase(),
        userInfo.openAiApiKey,
        userInfo.pineconeApiKey
      );
      if (status !== 200) {
        return NextResponse.json(
          { error: "Failed to upload file " + file.name },
          { status: status }
        );
      }
    }
  }
  return NextResponse.json(
    { message: "Files uploaded successfully" },
    { status: 200 }
  );
}
