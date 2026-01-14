import AuthModal from "@/app/authenticate/components/AuthModal";
import Head from "next/head";



export default async function AuthenticatePage({ searchParams }) {

    const params = await searchParams;
    const redirectUri = await params["redirect-uri"] || "/dashboard";
    return (
        <div>
            <AuthModal redirectUri={redirectUri}/>
        </div>
    )
}
