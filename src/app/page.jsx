import Link from "next/link";

export default function Home() {
    return (
        <div>
            <Link href="/dashboard">Go to Dashboard</Link>
            {" · "}
            <Link href="/authenticate?redirect-uri=/dashboard">Login</Link>
        </div>
    );
}
