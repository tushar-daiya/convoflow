import DisconnectDropbox from "@/components/DisconnectDropbox";
import DropboxFiles from "@/components/DropboxFiles";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  if (!session) {
    redirect("/signin");
  }
  const refreshToken = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      dropbox_refresh_token: true,
    },
  });
  return (
    <div>
      <div className="flex items-center justify-between p-5">
        <p className="text-2xl font-bold">Dropbox</p>
        {refreshToken?.dropbox_refresh_token ? (
          <DisconnectDropbox />
        ) : (
          <Button asChild>
            <Link href={"/api/connect/dropbox"}>Connect Dropbox</Link>
          </Button>
        )}
      </div>
      <div className="mt-5">
        {refreshToken?.dropbox_refresh_token && <DropboxFiles />}
      </div>
    </div>
  );
}
