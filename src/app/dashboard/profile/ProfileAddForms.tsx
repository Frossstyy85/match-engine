"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldTitle } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    addProfileSkill,
    addProfileLanguage,
    addProfileCertificate,
} from "@/lib/db/profile";

const LEVEL_OPTIONS = ["beginner", "intermediate", "advanced"] as const;

type Option = { id: number; name: string | null };

export function ProfileAddSkillForm({ options }: { options: Option[] }) {
    const [skillId, setSkillId] = React.useState<string>("");
    const [skillLevel, setSkillLevel] = React.useState<string>(LEVEL_OPTIONS[0]!);

    return (
        <form action={addProfileSkill} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <input type="hidden" name="skillId" value={skillId} />
            <input type="hidden" name="skillLevel" value={skillLevel} />
            <Field className="w-full min-w-0 sm:w-auto">
                <FieldTitle>Skill</FieldTitle>
                <Select value={skillId} onValueChange={setSkillId}>
                    <SelectTrigger className="w-full min-w-0 sm:w-44">
                        <SelectValue placeholder="Select skill" />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((opt) => (
                            <SelectItem key={opt.id} value={String(opt.id)}>
                                {opt.name ?? "—"}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>
            <Field className="w-full min-w-0 sm:w-auto">
                <FieldTitle>Level</FieldTitle>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                    <SelectTrigger className="w-full min-w-0 sm:w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {LEVEL_OPTIONS.map((level) => (
                            <SelectItem key={level} value={level}>
                                {level}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>
            <Button type="submit" disabled={!skillId}>
                Add
            </Button>
        </form>
    );
}

export function ProfileAddLanguageForm({ options }: { options: Option[] }) {
    const [languageId, setLanguageId] = React.useState<string>("");

    return (
        <form action={addProfileLanguage} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <input type="hidden" name="languageId" value={languageId} />
            <Field className="w-full min-w-0 sm:w-auto">
                <FieldTitle>Language</FieldTitle>
                <Select value={languageId} onValueChange={setLanguageId} required>
                    <SelectTrigger className="w-full min-w-0 sm:w-44">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((opt) => (
                            <SelectItem key={opt.id} value={String(opt.id)}>
                                {opt.name ?? "—"}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>
            <Button type="submit" disabled={!languageId}>
                Add
            </Button>
        </form>
    );
}

export function ProfileAddCertificateForm({ options }: { options: Option[] }) {
    const [certificateId, setCertificateId] = React.useState<string>("");

    return (
        <form action={addProfileCertificate} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <input type="hidden" name="certificateId" value={certificateId} />
            <Field className="w-full min-w-0 sm:w-auto">
                <FieldTitle>Certificate</FieldTitle>
                <Select value={certificateId} onValueChange={setCertificateId} required>
                    <SelectTrigger className="w-full min-w-0 sm:w-44">
                        <SelectValue placeholder="Select certificate" />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((opt) => (
                            <SelectItem key={opt.id} value={String(opt.id)}>
                                {opt.name ?? "—"}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>
            <Button type="submit" disabled={!certificateId}>
                Add
            </Button>
        </form>
    );
}
