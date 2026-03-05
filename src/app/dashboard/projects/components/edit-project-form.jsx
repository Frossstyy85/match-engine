"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxItem,
	ComboboxLabel,
	ComboboxList,
	ComboboxSeparator,
	ComboboxValue,
	useComboboxAnchor,
} from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProject } from "@/lib/db/projects";
import { createTeamForProject, deleteTeam } from "@/lib/db/teams";
import { formatDateForInput } from "@/lib/helpers/date";
import { ConfirmDeleteDialog } from "@/shared/dialogs/confirm-delete-dialog";

export default function EditProjectForm({
	project,
	skills,
	projectSkills = [],
	languages = [],
	certificates = [],
	projectLanguages = [],
	projectCertificates = [],
	teams = [],
}) {
	const router = useRouter();
	const skillsAnchor = useComboboxAnchor();
	const languagesAnchor = useComboboxAnchor();
	const certificatesAnchor = useComboboxAnchor();

	const [name, setName] = React.useState(project.name ?? "");
	const [description, setDescription] = React.useState(
		project.description ?? "",
	);
	const [startDate, setStartDate] = React.useState(
		project.startDate ?? undefined,
	);
	const [endDate, setEndDate] = React.useState(project.endDate ?? undefined);
	const [selectedSkills, setSelectedSkills] = React.useState(projectSkills);
	const [selectedLanguages, setSelectedLanguages] =
		React.useState(projectLanguages);
	const [selectedCertificates, setSelectedCertificates] =
		React.useState(projectCertificates);

	const [saving, setSaving] = React.useState(false);
	const [addTeamOpen, setAddTeamOpen] = React.useState(false);
	const [deletingId, setDeletingId] = React.useState(null);
	const [teamToDelete, setTeamToDelete] = React.useState(null);

	const allSkillNames = React.useMemo(
		() =>
			skills.flatMap((category) => category.skills.map((skill) => skill.name)),
		[skills],
	);
	const allLanguageNames = React.useMemo(
		() => languages.map((language) => language.name),
		[languages],
	);
	const allCertificateNames = React.useMemo(
		() => certificates.map((certificate) => certificate.name),
		[certificates],
	);

	async function handleSave() {
		if (!name.trim()) return;

		setSaving(true);

		try {
			await updateProject(
				project.id,
				{
					name: name.trim(),
					description: description.trim() || undefined,
					start_date: formatDateForInput(startDate) || null,
					end_date: formatDateForInput(endDate) || null,
				},
				selectedSkills,
				selectedLanguages,
				selectedCertificates,
			);
		} catch (error) {
			console.error("Failed to save project:", error);
		} finally {
			setSaving(false);
		}
	}

	async function handleCreateTeam(event) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const name = formData.get("name");
		if (!name) return;

		try {
			await createTeamForProject(project.id, String(name));
			setAddTeamOpen(false);
			router.refresh();
			event.currentTarget.reset();
		} catch (error) {
			console.error("Failed to create team:", error);
		}
	}

	async function handleConfirmDeleteTeam() {
		if (teamToDelete == null) return;

		setDeletingId(teamToDelete);

		try {
			await deleteTeam(teamToDelete);
			setTeamToDelete(null);
			router.refresh();
		} catch (error) {
			console.error("Failed to delete team:", error);
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className="space-y-6">
			<Field>
				<Label>
					Name
					<span className="text-destructive">*</span>
				</Label>
				<Input
					value={name}
					onChange={(event) => setName(event.target.value)}
					placeholder="Project name"
				/>
			</Field>

			<Field>
				<Label>Description</Label>
				<Textarea
					rows={3}
					value={description}
					onChange={(event) => setDescription(event.target.value)}
					placeholder="Optional description"
				/>
			</Field>

			<FieldGroup className="flex flex-col gap-4 sm:flex-row sm:gap-6">
				<Field>
					<Label>Start date</Label>
					<DatePicker value={startDate} onSelect={setStartDate} />
				</Field>
				<Field>
					<Label>End date</Label>
					<DatePicker value={endDate} onSelect={setEndDate} />
				</Field>
			</FieldGroup>

			<Field>
				<Label>Teams</Label>
				<div className="flex flex-col gap-2">
					{teams.length === 0 ? (
						<p className="text-sm text-muted-foreground">No teams yet.</p>
					) : (
						<ul className="flex flex-col gap-1.5">
							{teams.map((team) => (
								<li
									key={team.id}
									className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
								>
									<Button
										asChild
										variant="link"
										className="h-auto p-0 font-medium"
									>
										<Link href={`/dashboard/teams/${team.id}`}>
											{team.name}
										</Link>
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
										disabled={deletingId === team.id}
										onClick={() => setTeamToDelete(team.id)}
										aria-label={`Delete ${team.name}`}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</li>
							))}
						</ul>
					)}

					<ConfirmDeleteDialog
						open={teamToDelete !== null}
						onOpenChange={(open) => !open && setTeamToDelete(null)}
						title="Delete team?"
						description="This will remove the team from the project. This action cannot be undone."
						onConfirm={handleConfirmDeleteTeam}
					/>

					<Dialog open={addTeamOpen} onOpenChange={setAddTeamOpen}>
						<DialogTrigger asChild>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="w-fit"
							>
								Add team
							</Button>
						</DialogTrigger>

						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add team</DialogTitle>
							</DialogHeader>

							<form onSubmit={handleCreateTeam} className="flex flex-col gap-4">
								<FieldGroup>
									<Field>
										<Label>Team name</Label>
										<Input name="name" placeholder="Team name" required />
									</Field>
								</FieldGroup>
								<Button type="submit">Create</Button>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</Field>

			<Field>
				<Label>Requirements</Label>
				<Combobox
					multiple
					autoHighlight
					items={allSkillNames}
					value={selectedSkills}
					onValueChange={setSelectedSkills}
				>
					<ComboboxChips ref={skillsAnchor} className="w-full max-w-sm min-w-0">
						<ComboboxValue>
							{(values) => (
								<>
									{values.map((value) => (
										<ComboboxChip key={value}>{value}</ComboboxChip>
									))}
									<ComboboxChipsInput placeholder="Search skills..." />
								</>
							)}
						</ComboboxValue>
					</ComboboxChips>

					<ComboboxContent anchor={skillsAnchor}>
						<ComboboxEmpty>No skills found.</ComboboxEmpty>
						<ComboboxList>
							{skills.map((category, index) => (
								<React.Fragment key={category.id}>
									{index > 0 ? <ComboboxSeparator /> : null}
									<ComboboxGroup>
										<ComboboxLabel>{category.name}</ComboboxLabel>
										{category.skills.map((skill) => (
											<ComboboxItem key={skill.id} value={skill.name}>
												{skill.name}
											</ComboboxItem>
										))}
									</ComboboxGroup>
								</React.Fragment>
							))}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>

			<Field>
				<Label>Required languages</Label>
				<Combobox
					multiple
					autoHighlight
					items={allLanguageNames}
					value={selectedLanguages}
					onValueChange={setSelectedLanguages}
				>
					<ComboboxChips
						ref={languagesAnchor}
						className="w-full max-w-sm min-w-0"
					>
						<ComboboxValue>
							{(values) => (
								<>
									{values.map((value) => (
										<ComboboxChip key={value}>{value}</ComboboxChip>
									))}
									<ComboboxChipsInput placeholder="Search languages..." />
								</>
							)}
						</ComboboxValue>
					</ComboboxChips>

					<ComboboxContent anchor={languagesAnchor}>
						<ComboboxEmpty>No languages found.</ComboboxEmpty>
						<ComboboxList>
							{languages.map((language) => (
								<ComboboxItem key={language.id} value={language.name}>
									{language.name}
								</ComboboxItem>
							))}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>

			<Field>
				<Label>Required certificates</Label>
				<Combobox
					multiple
					autoHighlight
					items={allCertificateNames}
					value={selectedCertificates}
					onValueChange={setSelectedCertificates}
				>
					<ComboboxChips
						ref={certificatesAnchor}
						className="w-full max-w-sm min-w-0"
					>
						<ComboboxValue>
							{(values) => (
								<>
									{values.map((value) => (
										<ComboboxChip key={value}>{value}</ComboboxChip>
									))}
									<ComboboxChipsInput placeholder="Search certificates..." />
								</>
							)}
						</ComboboxValue>
					</ComboboxChips>

					<ComboboxContent anchor={certificatesAnchor}>
						<ComboboxEmpty>No certificates found.</ComboboxEmpty>
						<ComboboxList>
							{certificates.map((certificate) => (
								<ComboboxItem key={certificate.id} value={certificate.name}>
									{certificate.name}
								</ComboboxItem>
							))}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>

			<Button onClick={handleSave} disabled={saving || !name.trim()}>
				{saving ? "Saving..." : "Save"}
			</Button>
		</div>
	);
}
