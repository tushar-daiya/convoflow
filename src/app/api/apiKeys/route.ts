import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

  const { openai, pinecone } = await req.json();

  if (!openai || !pinecone) {
    return NextResponse.json(
      {
        error: "Missing openai or pinecone key",
      },
      {
        status: 400,
      }
    );
  }

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        openAiApiKey: openai,
        pineconeApiKey: pinecone,
      },
    });

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
