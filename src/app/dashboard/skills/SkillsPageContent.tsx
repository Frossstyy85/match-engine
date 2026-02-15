"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { PaginationState } from "@tanstack/react-table";
import type { SkillWithCategory } from "@/lib/types";
import CreateSkillForm from "@/app/dashboard/skills/create-skill-form";
import SkillsTable from "@/app/dashboard/skills/SkillsTable";

export default function SkillsPageContent() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: DEFAULT_PAGE_SIZE,
    });

    const { data: categoriesData } = useQuery({
        queryKey: ["skill_categories"],
        queryFn: async () => {
            const { data, error } = await supabase.from("skill_categories").select("id, name");
            if (error) throw error;
            return data ?? [];
        },
    });

    const { data: skillsData, isLoading, isError, error } = useQuery({
        queryKey: ["skills", pagination.pageIndex, pagination.pageSize],
        queryFn: async () => {
            const from = pagination.pageIndex * pagination.pageSize;
            const to = from + pagination.pageSize - 1;
            const { data: rows, error: fetchError, count } = await supabase
                .from("skills")
                .select("id, name, skill_categories(name)", { count: "exact" })
                .range(from, to);
            if (fetchError) throw fetchError;
            return { data: rows ?? [], count: count ?? 0 };
        },
    });

    if (isError) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                <p className="text-sm text-destructive">{error?.message ?? "Failed to load skills"}</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-end">
                <CreateSkillForm categories={categoriesData ?? []} />
            </div>
            <SkillsTable
                data={(skillsData?.data ?? []) as unknown as SkillWithCategory[]}
                rowCount={skillsData?.count ?? 0}
                pageIndex={pagination.pageIndex}
                pageSize={pagination.pageSize}
                onPaginationChange={(updater) => setPagination((prev) => updater(prev))}
                isLoading={isLoading}
            />
        </>
    );
}
