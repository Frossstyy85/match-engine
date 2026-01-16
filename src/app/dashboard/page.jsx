"use client"
import "./dashboard.css";
import AdminDashboard from "@/app/dashboard/components/AdminDashboard";
import ProjectLeadDashboard from "@/app/dashboard/components/ProjectLeadDashboard";
import HrDashboard from "@/app/dashboard/components/HrDashboard";
import UserDashboard from "@/app/dashboard/components/UserDashboard";
import {useState} from "react";

export default  function DashboardPage() {

    const roles = ["ADMIN", "USER", "HR", "PROJECT_LEAD"];

    const [counter, setCounter] = useState(0)


    const changeRole = () => {
        setCounter((prev) => (prev + 1) % roles.length)
    }

    const role = roles[counter];

    return(
        <>
            <button onClick={changeRole}>Dev | Change role</button>

            {role === "ADMIN" && <AdminDashboard/>}
            {role === "USER" && <UserDashboard/>}
            {role === "HR" && <HrDashboard/>}
            {role === "PROJECT_LEAD" && <ProjectLeadDashboard/>}
        </>
    )
    



}
