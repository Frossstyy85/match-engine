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
import { saveProfileLanguages } from "./actions";

export default function ProfileLanguagesForm({
	id,
	options = [],
	initialSelected = [],
}) {
	const anchor = useComboboxAnchor();
	const [selected, setSelected] = useState(initialSelected);
	const [state, formAction, isPending] = useActionState(saveProfileLanguages, {
		status: null,
		message: "",
	});

	useEffect(() => {
		setSelected(initialSelected);
	}, [initialSelected]);

	const languageNames = useMemo(() => options.map((l) => l.name), [options]);

	return (
		<form action={formAction} className="space-y-3">
			<input type="hidden" name="auth_id" value={id} />
			{selected.map((name) => (
				<input key={name} type="hidden" name="language_names" value={name} />
			))}
			<Field>
				<FieldTitle>Languages</FieldTitle>
				<Combobox
					multiple
					autoHighlight
					items={languageNames}
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
									<ComboboxChipsInput placeholder="Search languages…" />
								</>
							)}
						</ComboboxValue>
					</ComboboxChips>
					<ComboboxContent anchor={anchor}>
						<ComboboxEmpty>No languages found.</ComboboxEmpty>
						<ComboboxList>
							{options.map((lang) => (
								<ComboboxItem key={lang.id} value={lang.name}>
									{lang.name}
								</ComboboxItem>
							))}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>
			<div className="flex items-center gap-3">
				<Button type="submit" disabled={isPending}>
					{isPending ? "Saving…" : "Save languages"}
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
