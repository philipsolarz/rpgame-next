"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { z } from "zod"

const characterSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    role: z.string().min(2, { message: "Role must be at least 2 characters." }),
    bio: z.string().min(10, { message: "Bio must be at least 10 characters." }),
    tags: z.array(z.string()).default([]),
})

type CharacterFormValues = z.infer<typeof characterSchema>

interface CharacterFormProps {
    predefinedRoles: { label: string; value: string }[]
    predefinedTags: { label: string; value: string }[]
}

export function CharacterForm({ predefinedRoles, predefinedTags }: CharacterFormProps) {
    const form = useForm<CharacterFormValues>({
        resolver: zodResolver(characterSchema),
        defaultValues: {
            name: "",
            role: "",
            bio: "",
            tags: [],
        },
    })

    const [roleOpen, setRoleOpen] = React.useState(false)
    const [tagsOpen, setTagsOpen] = React.useState(false)

    async function onSubmit(values: CharacterFormValues) {
        try {
            const response = await fetch("/api/characters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                throw new Error("Failed to create character")
            }

            // Redirect to characters list or show success message
        } catch (error) {
            console.error("Error creating character:", error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Character name" {...field} />
                            </FormControl>
                            <FormDescription>This is your character&apos;s display name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Role</FormLabel>
                            <Popover open={roleOpen} onOpenChange={setRoleOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={roleOpen}
                                            className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                        >
                                            {field.value ? predefinedRoles.find((role) => role.value === field.value)?.label : "Select role"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search role..." />
                                        <CommandList>
                                            <CommandEmpty>No role found.</CommandEmpty>
                                            <CommandGroup>
                                                {predefinedRoles.map((role) => (
                                                    <CommandItem
                                                        value={role.label}
                                                        key={role.value}
                                                        onSelect={() => {
                                                            form.setValue("role", role.value)
                                                            setRoleOpen(false)
                                                        }}
                                                    >
                                                        <Check className={cn("mr-2 h-4 w-4", role.value === field.value ? "opacity-100" : "opacity-0")} />
                                                        {role.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormDescription>The role or archetype of your character.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Tell us about your character..." {...field} />
                            </FormControl>
                            <FormDescription>A brief description of your character.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Tags</FormLabel>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {field.value.map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                        {predefinedTags.find((t) => t.value === tag)?.label}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-1 ml-1"
                                            onClick={() => {
                                                form.setValue("tags", field.value.filter((t) => t !== tag))
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                            <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={tagsOpen}
                                            className="w-full justify-between"
                                        >
                                            Add tags
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search tags..." />
                                        <CommandList>
                                            <CommandEmpty>No tag found.</CommandEmpty>
                                            <CommandGroup>
                                                {predefinedTags.map((tag) => (
                                                    <CommandItem
                                                        value={tag.label}
                                                        key={tag.value}
                                                        onSelect={() => {
                                                            const current = new Set(field.value)
                                                            if (!current.has(tag.value)) {
                                                                const newTags = [...current, tag.value]
                                                                form.setValue("tags", newTags)
                                                            }
                                                            setTagsOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                field.value.includes(tag.value) ? "opacity-100" : "opacity-0",
                                                            )}
                                                        />
                                                        {tag.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormDescription>Add tags to help categorize your character.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button type="submit">Create Character</Button>
                    <Button type="button" variant="outline" asChild>
                        <Link href="/">Cancel</Link>
                    </Button>
                </div>
            </form>
        </Form>
    )
}
