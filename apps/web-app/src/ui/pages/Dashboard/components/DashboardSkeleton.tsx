

export const DashboardSkeleton: React.FC = () => {
    return (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50"
                >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Main Info Skeleton */}
                        <div className="flex items-start gap-4">
                            <div className="h-14 w-14 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                            <div className="space-y-2">
                                <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="flex -space-x-2 pt-1">
                                    <div className="h-7 w-7 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                                    <div className="h-7 w-7 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                                    <div className="h-7 w-7 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                                </div>
                            </div>
                        </div>

                        {/* Balance Info Skeleton */}
                        <div className="flex min-w-[120px] flex-col items-end gap-2">
                            <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="h-6 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
