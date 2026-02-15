    "use client"

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
    import {useForm} from "@tanstack/react-form";
    import {supabase} from "@/lib/supabase/client";
    import {useRouter} from "next/navigation";
    import GoogleLoinForm from "@/components/auth/google-login.form";

    export function LoginForm({
                                  className,
                                  ...props
                              }: React.ComponentProps<"div">) {

        const router = useRouter();

        const form = useForm({
            defaultValues: {
                email: "",
                password: "",
            },
            onSubmit: async ({ value }) => {
                const {  data, error } = await supabase.auth.signInWithPassword({
                    email: value.email,
                    password: value.password
                })
                console.log(data, error)
                if (data) router.push("/dashboard")
            }
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
                                e.preventDefault();
                                form.handleSubmit()
                            }}
                        >
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>¨


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
                                    <Button type="submit">Login</Button>
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
