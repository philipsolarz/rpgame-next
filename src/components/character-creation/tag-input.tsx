"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthToken } from "@/hooks/useAuthToken"

interface TagInputProps {
    value: string[]
    onChange: (value: string[]) => void
}

interface Tag {
    name: string
    description: string
    id: string
    created_at: string
    updated_at: string
    // value: string
    // label: string
}

export function TagInput({ value, onChange }: TagInputProps) {
    const token = useAuthToken()
    const [open, setOpen] = React.useState(false)
    const [tags, setTags] = React.useState<Tag[]>([])
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        async function fetchTags() {
            if (!token) return

            try {
                setLoading(true)
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/character/tags`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!response.ok) {
                    throw new Error("Failed to fetch tags")
                }
                const data = await response.json()
                setTags(data)
            } catch (error) {
                console.error("Error fetching tags:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchTags()
    }, [token])

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((tag) => tag !== tagToRemove))
    }

    if (loading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {value.map((tag) => {
                    const tagData = tags.find((t) => t.id === tag)
                    return (
                        <Badge key={tag} variant="secondary" className="animate-in fade-in-0 zoom-in-95 duration-200">
                            {tagData?.name ?? tag}
                            <button
                                type="button"
                                className="ml-1 rounded-full outline-none ring-offset-background transition-colors hover:bg-secondary/80 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onClick={() => removeTag(tag)}
                            >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove {tag}</span>
                            </button>
                        </Badge>
                    )
                })}

            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={loading}
                    >
                        Select tags...
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" sideOffset={4}>
                    <Command className="border shadow-md">
                        <CommandInput placeholder="Search tags..." className="border-none focus:ring-0" />
                        <CommandList>
                            <CommandEmpty className="py-4 text-center text-sm">No tag found.</CommandEmpty>
                            <CommandGroup className="px-1 py-2">
                                {tags.map((tag, index) => (
                                    <CommandItem
                                        key={tag.id || `tag-${index}`}
                                        value={tag.id}
                                        onSelect={(currentValue) => {
                                            onChange(
                                                value.includes(currentValue)
                                                    ? value.filter((val) => val !== currentValue)
                                                    : [...value, currentValue],
                                            )
                                        }}
                                        className="cursor-pointer rounded-md aria-selected:bg-primary aria-selected:text-primary-foreground"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4 transition-opacity",
                                                value.includes(tag.id) ? "opacity-100" : "opacity-0",
                                            )}
                                        />
                                        {tag.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

