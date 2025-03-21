import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        dropbox_refresh_token: null,
      },
    });
    return NextResponse.json(
      { message: " Dropbox Disconnected" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to disconnect Dropbox" },
      { status: 500 }
    );
  }
}
