"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthToken } from "@/hooks/useAuthToken"

interface RoleComboboxProps {
    value: string
    onChange: (value: string) => void
}

interface Role {
    name: string
    description: string
    id: string
    created_at: string
    updated_at: string
}

export function RoleCombobox({ value, onChange }: RoleComboboxProps) {
    const token = useAuthToken()
    const [open, setOpen] = React.useState(false)
    const [roles, setRoles] = React.useState<Role[]>([])
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        async function fetchRoles() {
            if (!token) return

            try {
                setLoading(true)
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/character/roles`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!response.ok) {
                    throw new Error("Failed to fetch roles")
                }
                const data = await response.json()
                setRoles(data)
            } catch (error) {
                console.error("Error fetching roles:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchRoles()
    }, [token])

    if (loading) {
        return <Skeleton className="h-10 w-full" />
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={loading}
                >
                    {value ? roles.find((role) => role.id === value)?.name : "Select role..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" sideOffset={4}>
                <Command className="border shadow-md">
                    <CommandInput placeholder="Search roles..." className="border-none focus:ring-0" />
                    <CommandList>
                        <CommandEmpty className="py-4 text-center text-sm">No role found.</CommandEmpty>
                        <CommandGroup className="px-1 py-2">
                            {roles.map((role, index) => (
                                <CommandItem
                                    key={role.id || `role-${index}`}
                                    value={role.id}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                    className="cursor-pointer rounded-md aria-selected:bg-primary aria-selected:text-primary-foreground"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4 transition-opacity",
                                            value === role.id ? "opacity-100" : "opacity-0",
                                        )}
                                    />
                                    {role.name}
                                </CommandItem>
                            ))}

                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

