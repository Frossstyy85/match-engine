import Link from "next/link";
import { fetchSkill } from "@/lib/db/skills";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    const skill = await fetchSkill(Number(id));
    if (!skill) notFound();

    return (
        <div className="w-full min-w-0 p-3 sm:p-4">
            <div className="flex flex-col gap-4 w-full max-w-xl overflow-auto border border-gray-200 bg-white shadow-sm rounded p-4 sm:p-6">
                <Link
                    href="/dashboard/skills"
                    className="text-sm text-blue-600 hover:underline"
                >
                    Back to skills
                </Link>
                <h1 className="text-lg font-semibold">Edit skill</h1>
                <p className="text-sm text-muted-foreground">
                    {skill.name}
                    {skill.skill_categories && typeof skill.skill_categories === "object" && "name" in skill.skill_categories
                        ? ` · ${(skill.skill_categories as { name?: string }).name}`
                        : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                    Edit form can be added here.
                </p>
            </div>
        </div>
    );
}
