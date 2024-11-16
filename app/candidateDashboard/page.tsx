"use client";
import { onSubmitAction } from "./formSubmit";
import { useForm } from "react-hook-form";
import { schema, Tschema } from "../models/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useRef } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { X } from "lucide-react";
import { Button } from "../components/ui/button";
import ResumeUploader from "./resumeUploader";

export default function CandidateDashboardPage() {
  const [state, formAction] = useActionState(onSubmitAction, {
    message: "",
  });

  const form = useForm<Tschema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      job_title: "",
      ...(state?.fields ?? {}),
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <Form {...form}>
        {state?.message !== "" && !state.issues && (
          <div className="text-red-500 text-center font-bold">{state.message}</div>
        )}
        {state?.issues && (
          <div className="text-red-500">
            <ul>
              {state.issues.map((issue) => (
                <li key={issue} className="flex gap-1">
                  <X fill="red" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
        <form
          action={formAction}
          ref={formRef}
          className="space-y-8 flex justify-center items-center flex-col"
          onSubmit={(evt) => {
            evt.preventDefault();
            startTransition(() => {
              if (formRef.current) {
                const formData = new FormData(formRef.current);
                formAction(formData); // Dispatch or handle the form data
              }
            });
          }}
        >
          <div className="flex gap-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>Your Name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>Your Email</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <FormField
              name="job_title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>Your Job Title</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <ResumeUploader />
          {state.message && <p>{state.message}</p>}
          <Button
            type="submit"
            className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}