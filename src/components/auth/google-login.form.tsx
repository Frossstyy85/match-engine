import {Button} from "@/components/ui/button";
import {supabase} from "@/lib/supabase/client";


export default function GoogleLoinForm(){

    const handleClick = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        })
    }

    return (
        <Button variant={"outline"} type={"button"} onSubmit={handleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3">
                <path
                    d="M533.5 278.4c0-17.5-1.6-34.3-4.6-50.6H272v95.7h146.9c-6.3 34.1-25.1 62.9-53.6 82v68h86.5c50.8-46.8 80.7-115.8 80.7-195.1z"
                    fill="#4285F4"
                />
                <path
                    d="M272 544.3c72.6 0 133.6-24.1 178-65.4l-86.5-68c-24.1 16.2-55 25.8-91.5 25.8-70.4 0-130-47.5-151.4-111.1H32.7v69.9c44.3 87.5 135.7 149.8 239.3 149.8z"
                    fill="#34A853"
                />
                <path
                    d="M120.6 324.4c-10.5-31.4-10.5-65.2 0-96.6V158.1H32.7c-37.4 74.8-37.4 163.9 0 238.7l87.9-72.4z"
                    fill="#FBBC05"
                />
                <path
                    d="M272 107.6c38.9-.6 76 14.1 104.2 40.7l78.1-78.1C405.1 24.1 344.1 0 272 0 168.4 0 77 62.3 32.7 150.8l87.9 69.9C142 155.1 201.6 107.6 272 107.6z"
                    fill="#EA4335"
                />
            </svg>
            Login with Google
        </Button>
    )


}