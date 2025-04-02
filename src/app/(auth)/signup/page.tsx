"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signupSchema } from "@/lib/schema";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  async function handleSignGoogle() {
    await authClient.signIn.social({
      provider: "google",
    });
  }
  async function onSubmit(formData: z.infer<typeof signupSchema>) {
    let loadingToast: number | string;
    const { data, error } = await authClient.signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        callbackURL: "/dashboard",
      },
      {
        onRequest: (ctx) => {
          loadingToast = toast.loading("Signing up...");
        },
        onSuccess: (ctx) => {
          toast.dismiss(loadingToast);
          toast.success("Signed up successfully");
          router.push("/dashboard");
        },
        onError: (ctx) => {
          toast.dismiss(loadingToast);
          toast.error(ctx.error.message);
        },
      }
    );
  }
  return (
    <div className="max-w-md w-full mx-auto p-8 rounded-lg shadow-lg bg-white">
      <Lock className="w-10 h-10 mx-auto text-primary" />
      <h1 className="text-2xl font-semibold mt-5 text-center">
        Welcome to ConvoFlo
      </h1>
      <p className="text-muted-foreground text-sm mt-2 text-center">
        Sign up to continue
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto pt-10 pb-5"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="" type="email" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      <div className="mt-5">
        <Button
          onClick={handleSignGoogle}
          className="w-full cursor-pointer"
          variant="secondary"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            ></path>
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            ></path>
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            ></path>
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            ></path>
          </svg>
          Continue with Google
        </Button>
        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
