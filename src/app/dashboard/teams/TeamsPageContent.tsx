"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { PaginationState } from "@tanstack/react-table";
import TeamsTable from "@/app/dashboard/teams/TeamsTable";

export default function TeamsPageContent() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: DEFAULT_PAGE_SIZE,
    });

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teams", pagination.pageIndex, pagination.pageSize],
        queryFn: async () => {
            const from = pagination.pageIndex * pagination.pageSize;
            const to = from + pagination.pageSize - 1;
            const { data: rows, error: fetchError, count } = await supabase
                .from("teams")
                .select("*", { count: "exact" })
                .range(from, to);
            if (fetchError) throw fetchError;
            return { data: rows ?? [], count: count ?? 0 };
        },
    });

    if (isError) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                <p className="text-sm text-destructive">{error?.message ?? "Failed to load teams"}</p>
            </div>
        );
    }

    return (
        <TeamsTable
            data={data?.data ?? []}
            rowCount={data?.count ?? 0}
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            onPaginationChange={(updater) => setPagination((prev) => updater(prev))}
            isLoading={isLoading}
        />
    );
}
