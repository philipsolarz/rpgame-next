"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Character } from "@/types"

interface DeleteCharacterDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    character: Character | null
    onConfirm: () => Promise<void>
}

export function DeleteCharacterDialog({
    open,
    onOpenChange,
    character,
    onConfirm
}: DeleteCharacterDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [confirmText, setConfirmText] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async () => {
        if (confirmText !== "Delete") {
            setError("Please type 'Delete' to confirm")
            return
        }

        try {
            setIsDeleting(true)
            setError(null)
            await onConfirm()
            onOpenChange(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete character")
        } finally {
            setIsDeleting(false)
        }
    }

    if (!character) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Character
                    </DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the character
                        <span className="font-medium text-foreground"> {character.name}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="confirm">Type <span className="font-bold">Delete</span> to confirm</Label>
                        <Input
                            id="confirm"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="border-destructive focus-visible:ring-destructive"
                            placeholder="Delete"
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting || confirmText !== "Delete"}
                        >
                            {isDeleting ? "Deleting..." : "Delete Character"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}