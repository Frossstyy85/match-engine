"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
    count: {
        label: "Count",
    },
    users: {
        label: "Users",
        color: "var(--chart-1)",
    },
    projects: {
        label: "Projects",
        color: "var(--chart-2)",
    },
    teams: {
        label: "Teams",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig

interface OverviewBarChartProps {
    userCount: number
    projectCount: number
    teamCount: number
}

export function OverviewBarChart({ userCount, projectCount, teamCount }: OverviewBarChartProps) {
    const chartData = [
        { category: "users", count: userCount, fill: "var(--color-users)" },
        { category: "projects", count: projectCount, fill: "var(--color-projects)" },
        { category: "teams", count: teamCount, fill: "var(--color-teams)" },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]?.label
                            }
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="count"
                            strokeWidth={2}
                            radius={8}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
