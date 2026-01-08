"use server";

// Import the components we want to render on the dashboard

// import component from "@/app/dashboard/components/component

import { getAuthentication } from "@/lib/auth";
import { JwtUser } from "@/lib/jwt";

/**
 * DashboardPage is a Server Component.
 * It fetches the authenticated user info and renders different content
 * based on the user’s role.
 */
export default async function DashboardPage() {
    // -------------------------------
    // 1️⃣ Get authenticated user
    // -------------------------------
    // This calls your auth library and returns user info decoded from JWT
    const auth: JwtUser = await getAuthentication();

    // -------------------------------
    // 2️⃣ Extract the role from the authenticated user
    // -------------------------------
    const userRole = auth.role;

    // -------------------------------
    // 3️⃣ Conditional rendering by role
    // -------------------------------
    if (userRole === "ADMIN") {
        // ✅ If the user is an admin, show admin dashboard
        // You can add more components here for admin-specific views
        return (
            <div className="dashboard-container">
                <h2>Admin Dashboard</h2>
                {/* Stats cards (Teams, Projects) */}
                {/* List of all projects */}
                {/* List of all teams */}
                {/* You can add more admin-only components here */}
            </div>
        );
    }

    // -------------------------------
    // 4️⃣ USER view
    // -------------------------------
    // You can render a simpler view for normal users
    if (userRole === "USER") {
        return (
            <div className="dashboard-container">
                <h2>User Dashboard</h2>
                {/* You can show only relevant info */}
                {/* Maybe only projects related to this user */}
            </div>
        );
    }

    // -------------------------------
    // 5️⃣ Fallback: unknown role or unauthenticated
    // -------------------------------
    return (
        <div className="dashboard-container">
            <h2>Access Denied</h2>
            <p>You do not have permission to view this page.</p>
        </div>
    );
}
