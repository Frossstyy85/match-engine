import Sidebar from "@/components/Sidebar";
import "./layout.css";
import {AUTH_COOKIE_NAME} from "@/lib/authCookies";
import {verifyAuthToken} from "@/lib/jwt";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import {getAuthentication} from "@/lib/auth";

export default async function DashboardLayout({ children }) {

    const auth = await getAuthentication();

    if (!auth) {
        redirect("/");
    }
  return (
    <div>
      <aside>
        <Sidebar />
      </aside>
      <main className={"main-content"}>{children}</main>
    </div>
  );
}
