"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    role: z.string().min(2, {
        message: "Role must be at least 2 characters.",
    }),
    bio: z.string().min(10, {
        message: "Bio must be at least 10 characters.",
    }),
    tags: z.string().optional(),
})

export default function NewCharacterPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            role: "",
            bio: "",
            tags: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // This would save to your database
        console.log(values)
    }

    return (
        <div className="mx-auto max-w-2xl p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Create New Character</h1>
                <p className="text-muted-foreground">Fill out the form below to create a new character.</p>
            </div>

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
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <Input placeholder="Character role" {...field} />
                                </FormControl>
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
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <Input placeholder="Hero, Warrior, Magic User (comma separated)" {...field} />
                                </FormControl>
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
        </div>
    )
}

