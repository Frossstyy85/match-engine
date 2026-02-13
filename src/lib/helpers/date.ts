export function formatDate(
    value: string | Date | null | undefined,
    locale?: string
): string {
    if (value == null || value === "") return "—";
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatDateForInput(value: string | Date | null | undefined): string {
    if (value == null || value === "") return "";
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0]!;
}
