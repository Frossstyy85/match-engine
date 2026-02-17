"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { PaginationState } from "@tanstack/react-table";
import UsersTable from "@/app/dashboard/users/UsersTable";
import { adminCreateUserAndProfile } from "@/lib/db/users";

export default function UsersPageContent() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: DEFAULT_PAGE_SIZE,
    });

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["profiles", pagination.pageIndex, pagination.pageSize],
        queryFn: async () => {
            const from = pagination.pageIndex * pagination.pageSize;
            const to = from + pagination.pageSize - 1;
            const { data: rows, error: fetchError, count } = await supabase
                .from("profiles")
                .select("*", { count: "exact" })
                .range(from, to);
            if (fetchError) throw fetchError;
            return { data: rows ?? [], count: count ?? 0 };
        },
    });

    async function handleCreateUser(formData: FormData) {
        try {
            await adminCreateUserAndProfile(formData);
            await refetch();
        } catch (e) {
            console.error("Failed to create user", e);
        }
    }

    if (isError) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                <p className="text-sm text-destructive">{error?.message ?? "Failed to load users"}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <form
                action={handleCreateUser}
                className="flex flex-wrap items-end gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm"
            >
                <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-600" htmlFor="name">
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className="mt-1 rounded border border-gray-300 px-2 py-1 text-sm"
                        placeholder="Full name"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-600" htmlFor="email">
                        Email *
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-1 rounded border border-gray-300 px-2 py-1 text-sm"
                        placeholder="user@example.com"
                    />
                </div>
                <button
                    type="submit"
                    className="inline-flex h-8 items-center rounded bg-blue-600 px-3 text-xs font-medium text-white hover:bg-blue-700"
                >
                    Create user
                </button>
            </form>

            <UsersTable
                data={data?.data ?? []}
                rowCount={data?.count ?? 0}
                pageIndex={pagination.pageIndex}
                pageSize={pagination.pageSize}
                onPaginationChange={(updater) => setPagination((prev) => updater(prev))}
                isLoading={isLoading}
            />
        </div>
    );
}
