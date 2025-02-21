"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, Swords, Shield, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface SuccessDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    character: {
        name: string
        role: string
        tags: string[]
    } | null
}

const roleIcons = {
    warrior: Swords,
    mage: Sparkles,
    paladin: Shield,
    // Add more role icons as needed
}

export function SuccessDialog({ open, onOpenChange, character }: SuccessDialogProps) {
    if (!character) return null

    const RoleIcon = roleIcons[character.role as keyof typeof roleIcons] || Crown

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md border-2 p-0 shadow-lg">
                <DialogTitle className="sr-only">Character Created</DialogTitle>
                <div className="relative">
                    {/* Background decoration */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
                        <div className="absolute left-0 top-0 h-32 w-32 -translate-x-16 -translate-y-16 rounded-full bg-primary/10 blur-3xl" />
                        <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-primary/10 blur-3xl" />
                    </div>

                    {/* Content */}
                    <div className="relative px-6 pb-6 pt-12">
                        {/* Success icon */}
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                }}
                                className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-primary shadow-lg"
                            >
                                <RoleIcon className="h-8 w-8 text-primary-foreground" />
                            </motion.div>
                        </div>

                        {/* Character details */}
                        <div className="space-y-4 text-center">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <h2 className="text-2xl font-bold tracking-tight">Character Created!</h2>
                                <p className="text-muted-foreground">Your legend begins...</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-2 rounded-lg bg-muted p-4"
                            >
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">NAME</h3>
                                    <p className="text-xl font-semibold">{character.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">ROLE</h3>
                                    <p className="text-xl font-semibold capitalize">{character.role}</p>
                                </div>
                                {character.tags.length > 0 && (
                                    <div className="space-y-1.5">
                                        <h3 className="text-sm font-medium text-muted-foreground">TAGS</h3>
                                        <div className="flex flex-wrap justify-center gap-1.5">
                                            {character.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="capitalize">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <Button className="w-full" onClick={() => onOpenChange(false)}>
                                    Continue
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

