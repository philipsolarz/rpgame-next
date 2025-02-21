"use client"

import { Check, Sparkles, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PremiumDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PremiumDialog({ open, onOpenChange }: PremiumDialogProps) {
    const features = [
        "Unlimited AI conversations",
        "Access to all AI personalities",
        "Priority support",
        "Custom AI personality creation",
        "Advanced conversation analytics",
        "No ads",
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Upgrade to Premium
                    </DialogTitle>
                    <DialogDescription>Unlock the full potential of AI conversations</DialogDescription>
                </DialogHeader>
                <div className="mt-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="font-medium">Monthly Premium</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold">$9.99</span>
                                <Badge variant="secondary">SAVE 33%</Badge>
                            </div>
                        </div>
                        <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <ul className="mt-4 space-y-3">
                        {features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <Button className="mt-6 w-full" size="lg">
                        Upgrade Now
                    </Button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                        Secure payment powered by Stripe. Cancel anytime.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

