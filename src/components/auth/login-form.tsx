    "use client"

    import { useState } from "react"
    import { cn } from "@/lib/utils"
    import { Button } from "@/components/ui/button"
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card"
    import {
        Field,
        FieldDescription,
        FieldGroup,
        FieldLabel,
    } from "@/components/ui/field"
    import { Input } from "@/components/ui/input"
    import { useForm } from "@tanstack/react-form"
    import { supabase } from "@/lib/supabase/client"
    import { useRouter } from "next/navigation"

    export function LoginForm({
        className,
        ...props
    }: React.ComponentProps<"div">) {
        const router = useRouter()
        const [error, setError] = useState<string | null>(null)
        const [loading, setLoading] = useState(false)

        const form = useForm({
            defaultValues: {
                email: "",
                password: "",
            },
            onSubmit: async ({ value }) => {
                setError(null)
                setLoading(true)
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email: value.email,
                    password: value.password,
                })
                setLoading(false)
                if (signInError) {
                    setError(signInError.message ?? "Invalid email or password")
                    return
                }
                if (data?.session) {
                    router.refresh()
                    router.push("/dashboard")
                }
            },
        })



        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader>
                        <CardTitle>Login to your account</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                form.handleSubmit()
                            }}
                        >
                            {error && (
                                <p className="text-sm text-destructive mb-4" role="alert">
                                    {error}
                                </p>
                            )}
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>


                                    <form.Field name={"email"}>
                                        {(field) => (
                                            <Input
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)
                                            }
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                required
                                            />
                                        )}
                                    </form.Field>


                                </Field>

                                <Field>
                                    <div className="flex items-center">
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <a
                                            href="#"
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>

                                    <form.Field name={"password"}>
                                        {(field) => (
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                        )}
                                    </form.Field>

                                </Field>
                                <Field>
                                    <Button type="submit" disabled={loading}>
                                    {loading ? "Signing in…" : "Login"}
                                </Button>
                                    <FieldDescription className="text-center">
                                        Don&apos;t have an account? <a href="#">Sign up</a>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }
