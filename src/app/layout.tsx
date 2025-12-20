import "./globals.css";

export const metadata = {
    title: "Fullstack App",
    description: "Fullstack application",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
            {children}
            </body>
        </html>
    );
}
