import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const tableClasses =
  "w-full min-w-[480px] border-collapse bg-white text-sm shadow-sm " +
  "[&_thead_th]:bg-gray-100 [&_thead_th]:font-semibold [&_thead_th]:p-2 [&_thead_th]:sm:p-3 [&_thead_th]:text-left [&_thead_th]:text-gray-700 [&_thead_th]:border-b [&_thead_th]:border-gray-200 " +
  "[&_tbody_tr]:border-b [&_tbody_tr]:border-gray-200 [&_tbody_tr]:last:border-b-0 [&_tbody_tr:hover]:bg-gray-50 " +
  "[&_tbody_td]:p-2 [&_tbody_td]:sm:p-3 [&_tbody_td]:border-b [&_tbody_td]:border-gray-200 [&_tbody_td]:text-gray-700"
