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

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validators: {
            onChange: ({ value }) => {
                if (value.password && value.confirmPassword && value.password !== value.confirmPassword) {
                    return {
                        fields: {
                            confirmPassword: "Passwords do not match.",
                        },
                    };
                }
                return undefined;
            },
        },
        onSubmit: async ({ value }) => {
            setSubmitError(null);
            const { error: signUpError, data } = await supabase.auth.signUp({
                email: value.email,
                password: value.password,
                options: {
                    data: { full_name: value.name },
                },

            });

            if (signUpError) {
                setSubmitError(getErrorMessage(signUpError));
                throw signUpError;
            }

            if (data?.user && !data?.session) {
                router.push(
                    "/auth/login?message=Check your email to confirm your account."
                );
                return;
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
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Fill in the form below to create your account
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
                    name="name"
                    validators={{
                        onChange: ({ value }) =>
                            !value?.trim() ? "Name is required" : undefined,
                    }}
                >
                    {(field) => (
                        <FieldWrapper>
                            <FieldLabel htmlFor={field.name}>
                                Full Name
                            </FieldLabel>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="text"
                                placeholder="John Doe"
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
                            <FieldDescription>
                                We&apos;ll use this to contact you. We will not
                                share your email with anyone else.
                            </FieldDescription>
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
                            !value?.trim()
                                ? "Password is required"
                                : (value && value.length < 8
                                    ? "Must be at least 8 characters"
                                    : undefined),
                    }}
                >
                    {(field) => (
                        <FieldWrapper>
                            <FieldLabel htmlFor={field.name}>
                                Password
                            </FieldLabel>
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
                            <FieldDescription>
                                Must be at least 8 characters long.
                            </FieldDescription>
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
                    name="confirmPassword"
                    validators={{
                        onChange: ({ value }) =>
                            !value?.trim()
                                ? "Please confirm your password"
                                : undefined,
                    }}
                >
                    {(field) => (
                        <FieldWrapper>
                            <FieldLabel htmlFor={field.name}>
                                Confirm Password
                            </FieldLabel>
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
                            <FieldDescription>
                                Please confirm your password.
                            </FieldDescription>
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
                        {form.state.isSubmitting
                            ? "Creating account…"
                            : "Create Account"}
                    </Button>
                </FieldWrapper>

                <FieldSeparator>Or continue with</FieldSeparator>
                <FieldWrapper>
                    <GithubLoginForm />
                    <GoogleLoinForm />
                    <FieldDescription className="px-6 text-center">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="underline underline-offset-4"
                        >
                            Sign in
                        </Link>
                    </FieldDescription>
                </FieldWrapper>
            </FieldGroup>
        </form>
    );
}
