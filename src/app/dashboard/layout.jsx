import Sidebar from "@/components/sidebar/Sidebar";
import "./layout.css";

import ApolloWrapper from "@/components/ApolloWrapper";

export default async function DashboardLayout({ children }) {

  return (
    <ApolloWrapper>
      <div className="dashboard-layout">
          <Sidebar/>
        <main className={"main-content"}>{children}</main>
      </div>
    </ApolloWrapper>
  );
}

