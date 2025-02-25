"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RoleCombobox } from "./role-combobox"
import { TagInput } from "./tag-input"
import { Loader2 } from "lucide-react"
import { SuccessDialog } from "./success-dialog"
import { useState } from "react"
import { Character, CharacterCreateRequest, CharacterCreateResponse, User } from "@/types"
import { redirect } from "next/navigation"

const characterFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    role: z.string().min(1, {
        message: "Please select a role.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    tags: z.array(z.string()).min(1, {
        message: "Please select at least one tag.",
    }),
})

type CharacterFormValues = z.infer<typeof characterFormSchema>

const defaultValues: Partial<CharacterFormValues> = {
    name: "",
    role: "",
    description: "",
    tags: [],
}

export function CharacterForm({ user }: { user: User }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [createdCharacter, setCreatedCharacter] = useState<Character | null>(null)

    const form = useForm<CharacterFormValues>({
        resolver: zodResolver(characterFormSchema),
        defaultValues,
    })

    async function onSubmit(data: CharacterFormValues) {
        try {
            setIsSubmitting(true)
            // Format the data to conform to the CharacterCreateRequest schema
            const formattedData: CharacterCreateRequest = {
                user_id: user.id,
                name: data.name,
                description: data.description,
                role_id: data.role,
                tag_ids: data.tags,
            }

            const response = await fetch(`/api/characters`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            })

            if (!response.ok) {
                throw new Error("Failed to create character")
            }

            const charactersResponse: CharacterCreateResponse = await response.json();
            setCreatedCharacter(charactersResponse.character);
            setShowSuccess(true)
            form.reset()
        } catch (error) {
            console.error("Failed to create character:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in-50 duration-500">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter character name"
                                        {...field}
                                        className="transition-colors focus-visible:ring-2"
                                    />
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
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <RoleCombobox value={field.value} onChange={field.onChange} isAdmin={user.is_admin} />
                                </FormControl>
                                <FormDescription>Select your character&apos;s role.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us about your character..."
                                        className="min-h-[120px] resize-none transition-colors focus-visible:ring-2"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>Write a brief description of your character.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <TagInput value={field.value} onChange={field.onChange} isAdmin={user.is_admin} />
                                </FormControl>
                                <FormDescription>Add tags to categorize your character.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Character
                    </Button>
                </form>
            </Form>

            <SuccessDialog open={showSuccess} onOpenChange={setShowSuccess} character={createdCharacter} />
        </>
    )
}
