"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RoleCombobox } from "./role-combobox"
import { TagInput } from "./tag-input"
import { useAuthToken } from "@/hooks/useAuthToken"
import { Loader2 } from "lucide-react"
import { SuccessDialog } from "./success-dialog"

const characterFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    role: z.string().min(1, {
        message: "Please select a role.",
    }),
    bio: z.string().min(10, {
        message: "Bio must be at least 10 characters.",
    }),
    tags: z.array(z.string()).min(1, {
        message: "Please select at least one tag.",
    }),
})

type CharacterFormValues = z.infer<typeof characterFormSchema>

const defaultValues: Partial<CharacterFormValues> = {
    name: "",
    role: "",
    bio: "",
    tags: [],
}

export function CharacterForm() {
    const token = useAuthToken()
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [showSuccess, setShowSuccess] = React.useState(false)
    const [createdCharacter, setCreatedCharacter] = React.useState<CharacterFormValues | null>(null)

    const form = useForm<CharacterFormValues>({
        resolver: zodResolver(characterFormSchema),
        defaultValues,
    })

    async function onSubmit(data: CharacterFormValues) {
        try {
            setIsSubmitting(true)
            const formattedData = {
                name: data.name,
                role_id: data.role,
                bio: data.bio,
                tag_ids: data.tags,
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/characters`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formattedData),
            })

            if (!response.ok) {
                throw new Error("Failed to create character")
            }

            await response.json()
            setCreatedCharacter(data)
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
                                    <RoleCombobox value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormDescription>Select your character&apos;s role.</FormDescription>
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
                                    <TagInput value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormDescription>Add tags to categorize your character.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={!token || isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Character
                    </Button>
                </form>
            </Form>

            <SuccessDialog open={showSuccess} onOpenChange={setShowSuccess} character={createdCharacter} />
        </>
    )
}

