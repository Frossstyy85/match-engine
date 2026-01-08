import AuthModal from "@/app/authenticate/components/AuthModal";


export default async function AuthenticatePage({ searchParams }) {

    const params = await searchParams;
    const redirectUri = await params["redirect-uri"] || "/dashboard";
    return <AuthModal redirectUri={redirectUri} />;
}
