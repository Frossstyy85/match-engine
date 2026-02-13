"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    value?: Date
    onSelect?: (date: Date | undefined) => void
    placeholder?: string
}

export function DatePicker({ value, onSelect, placeholder = "Pick a date" }: DatePickerProps) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button
                variant="outline"
                data-empty={!value}
                className="data-[empty=true]:text-muted-foreground w-full min-w-0 max-w-[280px] justify-start text-left font-normal"
            >
                <CalendarIcon />
                <span>{placeholder}</span>
            </Button>
        )
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!value}
                    className="data-[empty=true]:text-muted-foreground w-full min-w-0 max-w-[280px] justify-start text-left font-normal"
                >
                    <CalendarIcon />
                    {value ? format(value, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={value} onSelect={onSelect} />
            </PopoverContent>
        </Popover>
    )
}
