import ApiKeyInput from "@/components/ApiKeyInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  if (!session) {
    redirect("/signin");
  }
  const apiKeys = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      openAiApiKey: true,
      pineconeApiKey: true,
    },
  });
  return (
    <div className="h-screen flex items-center">
      <div className="max-w-lg mx-auto w-full">
        <h1 className="text-3xl font-bold mb-10">Account Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={session?.user?.image!}
                  alt={session?.user?.name}
                />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Full Name
                  </Label>
                  <p className="font-medium capitalize">
                    {session?.user?.name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Email Address
                  </Label>
                  <p className="font-medium">{session?.user?.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <ApiKeyInput
          openAiApiKey={apiKeys?.openAiApiKey}
          pineconeApiKey={apiKeys?.pineconeApiKey}
        />
      </div>
    </div>
  );
}
