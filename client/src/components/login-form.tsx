import { Eye, EyeOff, GalleryVerticalEnd, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/stores/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
import { useState } from "react";
import { toast } from "sonner";

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
  const setAuth = useAuth((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (form: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);
      const { data } = await axios.post<{
        accessToken: string;
        user: { email: string; userId: string };
      }>(`${import.meta.env.VITE_API_URL}/api/auth/login`, form, {
        withCredentials: true,
      });
      setAuth(data.accessToken, data.user);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <GalleryVerticalEnd className="size-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Welcome to NoteAI
                </h1>
                <p className="text-muted-foreground text-sm">
                  Sign in to your account to continue
                </p>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Button variant="link" className="p-0 h-auto font-semibold">
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        autoComplete="username"
                        inputMode="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        className="h-11"
                        {...field}
                      />
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
                    <FormLabel className="text-sm font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          id="password"
                          autoComplete="current-password"
                          autoCapitalize="none"
                          spellCheck={false}
                          className="h-11 pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-11 w-10 hover:bg-transparent text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-11 mt-2"
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                Sign In
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
