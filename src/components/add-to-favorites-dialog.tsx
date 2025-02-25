"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Character } from "@/types"

interface AddToFavoritesDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    character: Character | null
    onConfirm: () => Promise<void>
}

export function AddToFavoritesDialog({
    open,
    onOpenChange,
    character,
    onConfirm
}: AddToFavoritesDialogProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAdd = async () => {
        try {
            setIsAdding(true)
            setError(null)
            await onConfirm()
            onOpenChange(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add to favorites")
        } finally {
            setIsAdding(false)
        }
    }

    if (!character) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-rose-500" />
                        Add to Favorites
                    </DialogTitle>
                    <DialogDescription>
                        Would you like to add
                        <span className="font-medium text-foreground"> {character.name} </span>
                        to your favorites?
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
                            onClick={handleAdd}
                            disabled={isAdding}
                            className="bg-rose-500 hover:bg-rose-600"
                        >
                            {isAdding ? "Adding..." : "Add to Favorites"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}