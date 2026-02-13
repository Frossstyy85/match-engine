import {Montserrat} from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["500", "700"],
});

export const metadata = {
    title: "Match Engine",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({children}) {

    return (
        <html lang="en" className={"light"}>
        <body className={montserrat.className}>{children}</body>
        </html>
    );
}


