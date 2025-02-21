export default function CharacterPage({ params }: { params: { id: string } }) {
    return (
        <div className="flex-1 p-8">
            <div className="rounded-lg border p-4">
                <div className="mb-6 flex items-center gap-4">
                    <div className="h-24 w-24 rounded-full bg-muted" />
                    <div>
                        <h2 className="text-2xl font-bold">Character {params.id}</h2>
                        <p className="text-muted-foreground">Character Role</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 w-24 rounded bg-muted" />
                            <div className="h-20 rounded bg-muted/50" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

