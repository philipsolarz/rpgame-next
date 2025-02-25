"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CharacterRole } from "@/types"

interface CreateRoleDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: (newRole: CharacterRole) => void
}

export function CreateRoleDialog({
    open,
    onOpenChange,
    onSuccess
}: CreateRoleDialogProps) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation() // Stop event from propagating to parent form

        if (!name.trim()) {
            setError("Role name is required")
            return
        }

        try {
            setIsSubmitting(true)
            setError(null)

            const response = await fetch("/api/characters/roles", {
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
                throw new Error(errorData.error || "Failed to create role")
            }

            const data = await response.json()
            onSuccess(data.role)
            onOpenChange(false)

            // Reset form
            setName("")
            setDescription("")

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while creating the role")
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
                        Create New Role
                    </DialogTitle>
                    <DialogDescription>
                        Add a new character role to the system.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="role-name">Name<span className="text-destructive">*</span></Label>
                        <Input
                            id="role-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="E.g., Warrior, Mage, Healer"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role-description">Description</Label>
                        <Textarea
                            id="role-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the purpose and abilities of this role..."
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
                            {isSubmitting ? "Creating..." : "Create Role"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}