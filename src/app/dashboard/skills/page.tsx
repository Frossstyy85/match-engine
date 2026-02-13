import { tableClasses } from "@/lib/utils";
import { fetchSkillsWithCategory, fetchCategories } from "@/lib/db/skills";
import CreateSkillForm from "@/app/dashboard/skills/create-skill-form";
import type { SkillWithCategory } from "@/lib/types";

export default async function Page() {
    const [skills, categories] = await Promise.all([
        fetchSkillsWithCategory(),
        fetchCategories(),
    ]);

    return (
        <div className="w-full min-w-0 p-4 sm:p-6">
            <div className="flex flex-col gap-4 w-full min-w-0">
                <div className="flex w-full justify-end">
                    <CreateSkillForm categories={categories} />
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm [-webkit-overflow-scrolling:touch]">
                    <table className={tableClasses}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(skills as SkillWithCategory[]).map((skill) => (
                                <tr key={skill.id}>
                                    <td data-label="Name">{skill.name}</td>
                                    <td data-label="Category">{skill.skill_categories?.name ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
