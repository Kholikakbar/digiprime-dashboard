export default function Loading() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 space-y-4 animate-in fade-in duration-500">
            <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-primary/20 animate-ping absolute inset-0" />
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 animate-spin shadow-lg shadow-primary/25 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-lg bg-background" />
                </div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
                    DigiPrime
                </h3>
                <p className="text-sm text-muted-foreground animate-pulse">
                    Preparing interface...
                </p>
            </div>
        </div>
    )
}
