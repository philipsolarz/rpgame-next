export default function ConversationPage({ params }: { params: { id: string } }) {
    return (
        <div className="flex-1 p-8">
            <div className="rounded-lg border p-4">
                <h2 className="text-lg font-semibold">Conversation {params.id}</h2>
                <div className="mt-4 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-muted" />
                            <div className="flex-1">
                                <div className="h-4 w-24 rounded bg-muted" />
                                <div className="mt-2 h-16 rounded bg-muted/50" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

