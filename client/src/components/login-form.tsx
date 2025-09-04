import { GalleryVerticalEnd } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import axios from "axios";
import { useToken } from "@/stores/token";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const setAccessToken = useToken((state) => state.setAccessToken);

  const onSubmit = async (form: z.infer<typeof loginSchema>) => {
    try {
      const { data } = await axios.post<{
        token: string;
        user: { email: string; userId: string };
      }>("/api/auth/login", form, { withCredentials: true });
      setAccessToken(data.token);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">NoteAI</span>
              </a>
              <h1 className="text-xl font-bold">Welcome to NoteAI</h1>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Button variant="link" className="p-0">
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
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
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </div>
        </form>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </Form>
    </div>
  );
}
