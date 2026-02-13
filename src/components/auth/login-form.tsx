"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Field as FieldWrapper,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import GithubLoginForm from "@/components/auth/github-login-form";
import GoogleLoinForm from "@/components/auth/google-login.form";

function getErrorMessage(err: unknown): string {
    if (err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string") {
        return (err as { message: string }).message;
    }
    return String(err);
}

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            setSubmitError(null);
            const { error } = await supabase.auth.signInWithPassword({
                email: value.email,
                password: value.password,
            });
            if (error) {
                setSubmitError(getErrorMessage(error));
                throw error;
            }
            router.push("/dashboard");
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
            }}
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to login to your account
                    </p>
                </div>

                {submitError && (
                    <div
                        className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
                        role="alert"
                    >
                        {submitError}
                    </div>
                )}

                <form.Field
                    name="email"
                    validators={{
                        onChange: ({ value }) =>
                            !value?.trim() ? "Email is required" : undefined,
                    }}
                >
                    {(field) => (
                        <FieldWrapper>
                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="email"
                                placeholder="m@example.com"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />
                            {!field.state.meta.isValid &&
                                field.state.meta.errors.length > 0 && (
                                    <p
                                        className="text-sm text-destructive mt-1"
                                        role="alert"
                                    >
                                        {field.state.meta.errors.join(", ")}
                                    </p>
                                )}
                        </FieldWrapper>
                    )}
                </form.Field>

                <form.Field
                    name="password"
                    validators={{
                        onChange: ({ value }) =>
                            !value?.trim() ? "Password is required" : undefined,
                    }}
                >
                    {(field) => (
                        <FieldWrapper>
                            <div className="flex items-center">
                                <FieldLabel htmlFor={field.name}>
                                    Password
                                </FieldLabel>
                                <a
                                    href="#"
                                    className="ml-auto text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="password"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />
                            {!field.state.meta.isValid &&
                                field.state.meta.errors.length > 0 && (
                                    <p
                                        className="text-sm text-destructive mt-1"
                                        role="alert"
                                    >
                                        {field.state.meta.errors.join(", ")}
                                    </p>
                                )}
                        </FieldWrapper>
                    )}
                </form.Field>

                <FieldWrapper>
                    <Button
                        type="submit"
                        disabled={form.state.isSubmitting}
                    >
                        {form.state.isSubmitting ? "Signing in…" : "Login"}
                    </Button>
                </FieldWrapper>

                <FieldSeparator>Or continue with</FieldSeparator>
                <FieldWrapper>
                    <GithubLoginForm />
                    <GoogleLoinForm />
                    <FieldDescription className="text-center">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/auth/signup"
                            className="underline underline-offset-4"
                        >
                            Sign up
                        </Link>
                    </FieldDescription>
                </FieldWrapper>
            </FieldGroup>
        </form>
    );
}
