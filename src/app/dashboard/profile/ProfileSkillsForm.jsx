"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from "@/components/ui/combobox";
import { Field, FieldTitle } from "@/components/ui/field";
import { saveProfileSkills } from "./actions";

export default function ProfileSkillsForm({
	id,
	options = [],
	initialSelected = [],
}) {
	const anchor = useComboboxAnchor();
	const [selected, setSelected] = useState(initialSelected);
	const [state, formAction, isPending] = useActionState(saveProfileSkills, {
		status: null,
		message: "",
	});

	useEffect(() => {
		setSelected(initialSelected);
	}, [initialSelected]);

	const skillNames = useMemo(() => options.map((s) => s.name), [options]);

	return (
		<form action={formAction} className="space-y-3">
			<input type="hidden" name="auth_id" value={id} />
			{selected.map((name) => (
				<input key={name} type="hidden" name="skill_names" value={name} />
			))}
			<Field>
				<FieldTitle>Skills</FieldTitle>
				<Combobox
					multiple
					autoHighlight
					items={skillNames}
					value={selected}
					onValueChange={setSelected}
				>
					<ComboboxChips ref={anchor} className="w-full max-w-md min-w-0">
						<ComboboxValue>
							{(values) => (
								<>
									{values.map((value) => (
										<ComboboxChip key={value}>{value}</ComboboxChip>
									))}
									<ComboboxChipsInput placeholder="Search skills…" />
								</>
							)}
						</ComboboxValue>
					</ComboboxChips>
					<ComboboxContent anchor={anchor}>
						<ComboboxEmpty>No skills found.</ComboboxEmpty>
						<ComboboxList>
							{options.map((skill) => (
								<ComboboxItem key={skill.id} value={skill.name}>
									{skill.name}
								</ComboboxItem>
							))}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>
			<div className="flex items-center gap-3">
				<Button type="submit" disabled={isPending}>
					{isPending ? "Saving…" : "Save skills"}
				</Button>
				{state?.status === "error" && (
					<p className="text-destructive text-sm">{state.message}</p>
				)}
				{state?.status === "success" && (
					<p className="text-emerald-600 text-sm">{state.message}</p>
				)}
			</div>
		</form>
	);
}
