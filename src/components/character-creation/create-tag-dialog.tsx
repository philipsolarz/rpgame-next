"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CharacterTag } from "@/types"

interface CreateTagDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: (newTag: CharacterTag) => void
}

export function CreateTagDialog({
    open,
    onOpenChange,
    onSuccess
}: CreateTagDialogProps) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation() // Stop event from propagating to parent form

        if (!name.trim()) {
            setError("Tag name is required")
            return
        }

        try {
            setIsSubmitting(true)
            setError(null)

            const response = await fetch("/api/characters/tags", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim() || undefined
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to create tag")
            }

            const data = await response.json()
            onSuccess(data.tag)
            onOpenChange(false)

            // Reset form
            setName("")
            setDescription("")

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while creating the tag")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5" />
                        Create New Tag
                    </DialogTitle>
                    <DialogDescription>
                        Add a new character tag to the system.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="tag-name">Name<span className="text-destructive">*</span></Label>
                        <Input
                            id="tag-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="E.g., Fantasy, Sci-Fi, Historical"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tag-description">Description</Label>
                        <Textarea
                            id="tag-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what this tag represents..."
                            rows={3}
                        />
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                        >
                            {isSubmitting ? "Creating..." : "Create Tag"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}