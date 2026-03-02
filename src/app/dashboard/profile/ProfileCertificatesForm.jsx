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
import { saveProfileCertificates } from "./actions";

export default function ProfileCertificatesForm({
	id,
	options = [],
	initialSelected = [],
}) {
	const anchor = useComboboxAnchor();
	const [selected, setSelected] = useState(initialSelected);
	const [state, formAction, isPending] = useActionState(
		saveProfileCertificates,
		{ status: null, message: "" },
	);

	useEffect(() => {
		setSelected(initialSelected);
	}, [initialSelected]);

	const certificateNames = useMemo(() => options.map((c) => c.name), [options]);

	return (
		<form action={formAction} className="space-y-3">
			<input type="hidden" name="auth_id" value={id} />
			{selected.map((name) => (
				<input key={name} type="hidden" name="certificate_names" value={name} />
			))}
			<Field>
				<FieldTitle>Certificates</FieldTitle>
				<Combobox
					multiple
					autoHighlight
					items={certificateNames}
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
									<ComboboxChipsInput placeholder="Search certificates…" />
								</>
							)}
						</ComboboxValue>
					</ComboboxChips>
					<ComboboxContent anchor={anchor}>
						<ComboboxEmpty>No certificates found.</ComboboxEmpty>
						<ComboboxList>
							{options.map((cert) => (
								<ComboboxItem key={cert.id} value={cert.name}>
									{cert.name}
								</ComboboxItem>
							))}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>
			<div className="flex items-center gap-3">
				<Button type="submit" disabled={isPending}>
					{isPending ? "Saving…" : "Save certificates"}
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
