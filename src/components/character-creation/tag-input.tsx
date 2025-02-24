"use client"

import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { CharacterTag, CharacterTagsResponse } from "@/types"
import { useEffect, useState } from "react"

interface TagInputProps {
    value: string[]
    onChange: (value: string[]) => void
}


export function TagInput({ value, onChange }: TagInputProps) {
    const [open, setOpen] = useState(false)
    const [tags, setTags] = useState<CharacterTag[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchTags() {

            try {
                setLoading(true)
                const params = new URLSearchParams({ limit: "50" })
                const response = await fetch(`/api/characters/tags/?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                if (!response.ok) {
                    throw new Error("Failed to fetch tags")
                }
                const characterTagsResponse: CharacterTagsResponse = await response.json();
                setTags(characterTagsResponse.tags)
            } catch (error) {
                console.error("Error fetching tags:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchTags()
    }, [])

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

