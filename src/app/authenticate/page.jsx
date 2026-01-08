import AuthModal from "@/app/authenticate/AuthModal";

export default function AuthenticatePage({ searchParams }) {
    const redirectUri = searchParams["redirect-uri"] || "/dashboard";
    return <AuthModal redirectUri={redirectUri} />;
}
