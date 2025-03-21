// import ApiKeyInput from "@/components/ApiKeyInput";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { auth } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { User } from "lucide-react";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// export default async function Page() {
//   const session = await auth.api.getSession({
//     headers: await headers(), // you need to pass the headers object.
//   });
//   if (!session) {
//     redirect("/signin");
//   }
//   const apiKeys = await prisma.user.findUnique({
//     where: {
//       id: session.user.id,
//     },
//     select: {
//       openAiApiKey: true,
//       pineconeApiKey: true,
//     },
//   });
//   return (
//     <div className="h-screen flex items-center">
//       <div className="max-w-lg mx-auto w-full">
//         <h1 className="text-3xl font-bold mb-10">Account Settings</h1>
//         <Card>
//           <CardHeader>
//             <CardTitle>User Profile</CardTitle>
//             <CardDescription>Your personal information</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-6">
//               <Avatar className="h-20 w-20">
//                 <AvatarImage
//                   src={session?.user?.image!}
//                   alt={session?.user?.name}
//                 />
//                 <AvatarFallback>
//                   <User className="h-10 w-10" />
//                 </AvatarFallback>
//               </Avatar>
//               <div className="space-y-2">
//                 <div>
//                   <Label className="text-sm text-muted-foreground">
//                     Full Name
//                   </Label>
//                   <p className="font-medium capitalize">
//                     {session?.user?.name}
//                   </p>
//                 </div>
//                 <div>
//                   <Label className="text-sm text-muted-foreground">
//                     Email Address
//                   </Label>
//                   <p className="font-medium">{session?.user?.email}</p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <ApiKeyInput
//           openAiApiKey={apiKeys?.openAiApiKey}
//           pineconeApiKey={apiKeys?.pineconeApiKey}
//         />
//       </div>
//     </div>
//   );
// }


import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RocketIcon, BrainIcon, EarIcon, ClockIcon } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              ConvoFlo
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered real-time sales assistance that listens, understands, and 
            delivers crucial insights during your meetings - so you never miss a beat.
          </p>
          
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors gap-2"
          >
            <RocketIcon className="h-5 w-5" />
            Get Started
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: BrainIcon,
              title: "AI-Powered Insights",
              description: "Real-time analysis of conversations using advanced RAG technology"
            },
            {
              icon: EarIcon,
              title: "Live Transcription",
              description: "Accurate voice-to-text conversion with speaker identification"
            },
            {
              icon: ClockIcon,
              title: "Historical Context",
              description: "Instant access to previous interactions and client history"
            },
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Never Miss a Detail</h2>
          <p className="text-lg mb-6">
            ConvoFlo actively monitors conversations to surface:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4">
              <div className="text-2xl font-bold mb-2">Key Points</div>
              <p className="opacity-90">Important discussion highlights</p>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold mb-2">Action Items</div>
              <p className="opacity-90">Automatically tracked next steps</p>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold mb-2">Decisions</div>
              <p className="opacity-90">Critical agreements made</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}