import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** Tailwind classes for dashboard data tables (use on <table>) */
export const tableClasses =
  "w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm [&_thead_th]:bg-gray-100 [&_thead_th]:font-semibold [&_thead_th]:p-3.5 [&_thead_th]:px-3 [&_thead_th]:border-b [&_thead_th]:border-gray-200 [&_thead_th]:text-left [&_thead_th]:text-gray-700 [&_tbody_td]:p-3.5 [&_tbody_td]:px-3 [&_tbody_td]:border-b [&_tbody_td]:border-gray-200 [&_tbody_td]:text-gray-700 [&_tbody_tr:hover]:bg-gray-50"
