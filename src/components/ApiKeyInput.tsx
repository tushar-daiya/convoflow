"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiKeySchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ApiKeyInput() {
  const form = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
  });

  async function onSubmit(data: z.infer<typeof apiKeySchema>) {
    console.log(data);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Manage your API keys for external services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-3xl mx-auto"
          >
            <FormField
              control={form.control}
              name="openai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Open AI </FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pinecone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PineCone</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
