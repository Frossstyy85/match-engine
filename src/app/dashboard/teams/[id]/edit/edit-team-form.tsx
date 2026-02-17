"use client";

import * as React from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Field, FieldGroup, FieldTitle } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { updateTeamMembers } from "@/lib/db/teams";

type EditTeamFormProps = {
    team: { id: number; name: string; project_id: number | null };
    profiles: { id: string; name: string | null; email: string | null; team_id: number | null }[];
};

export default function EditTeamForm({ team, profiles }: EditTeamFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const initialMemberIds = React.useMemo(
        () => profiles.filter((p) => p.team_id === team.id).map((p) => p.id),
        [profiles, team.id],
    );

    const [selected, setSelected] = React.useState<string[]>(initialMemberIds);

    function toggleMember(id: string) {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    }

    async function handleSubmit(formData: FormData) {
        const memberIds = Array.from(formData.getAll("memberIds")) as string[];
        startTransition(async () => {
            await updateTeamMembers(team.id, memberIds);
            router.refresh();
        });
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <FieldGroup>
                <Field>
                    <FieldTitle>Team name</FieldTitle>
                    <div>{team.name}</div>
                </Field>

                <Field>
                    <FieldTitle>Members</FieldTitle>
                    <div className="flex flex-col gap-2 text-sm max-h-64 overflow-auto border border-gray-200 rounded p-2">
                        {profiles.length === 0 && (
                            <p className="text-gray-400">No profiles available.</p>
                        )}
                        {profiles.map((profile) => (
                            <label
                                key={profile.id}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    name="memberIds"
                                    value={profile.id}
                                    checked={selected.includes(profile.id)}
                                    onChange={() => toggleMember(profile.id)}
                                />
                                <span>
                                    {profile.name ?? profile.email ?? "Unnamed"}{" "}
                                    {profile.team_id && profile.team_id !== team.id && (
                                        <span className="text-xs text-gray-400">
                                            (in another team)
                                        </span>
                                    )}
                                </span>
                            </label>
                        ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Select which profiles should belong to this team. Saving will
                        update team membership.
                    </p>
                </Field>
            </FieldGroup>

            <button
                type="submit"
                className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                disabled={isPending}
            >
                {isPending ? "Saving..." : "Save changes"}
            </button>
        </form>
    );
}
