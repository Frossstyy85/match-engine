import { fetchSkillsWithCategory, fetchCategories } from "@/lib/db/skills";
import CreateSkillForm from "@/app/dashboard/skills/create-skill-form";
import SkillsTable from "@/app/dashboard/skills/SkillsTable";
import type { SkillWithCategory } from "@/lib/types";

export default async function Page() {
    const [skills, categories] = await Promise.all([
        fetchSkillsWithCategory(),
        fetchCategories(),
    ]);

    return (
        <>
            <div className="flex justify-end">
                <CreateSkillForm categories={categories} />
            </div>
            <SkillsTable data={skills as SkillWithCategory[]} />
        </>
    );
}
