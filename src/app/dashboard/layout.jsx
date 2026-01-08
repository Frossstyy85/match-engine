import Sidebar from "@/components/Sidebar";
import "./layout.css";
import {redirect} from "next/navigation";

import { getAuthentication } from "@/lib/auth";

export default async function DashboardLayout({ children }) {

    const auth = await getAuthentication();

    if (!auth) {
        redirect("/authenticate?redirect-uri=/dashboard");
    }


  return (
    <div>
        <Sidebar/>
      <main className={"main-content"}>{children}</main>
    </div>
  );
}
