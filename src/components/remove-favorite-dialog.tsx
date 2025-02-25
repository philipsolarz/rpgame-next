"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Character } from "@/types"

interface RemoveFavoriteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    character: Character | null
    onConfirm: () => Promise<void>
}

export function RemoveFavoriteDialog({
    open,
    onOpenChange,
    character,
    onConfirm
}: RemoveFavoriteDialogProps) {
    const [isRemoving, setIsRemoving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleRemove = async () => {
        try {
            setIsRemoving(true)
            setError(null)
            await onConfirm()
            onOpenChange(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to remove from favorites")
        } finally {
            setIsRemoving(false)
        }
    }

    if (!character) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <X className="h-5 w-5" />
                        Remove from Favorites
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to remove
                        <span className="font-medium text-foreground"> {character.name} </span>
                        from your favorites?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
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
                            type="button"
                            onClick={handleRemove}
                            disabled={isRemoving}
                        >
                            {isRemoving ? "Removing..." : "Remove"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}