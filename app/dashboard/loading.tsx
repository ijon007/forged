export default function Loading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-gray-900 border-b-2" />
        <p className="text-muted-foreground text-sm">Loading dashboard...</p>
      </div>
    </div>
  );
}
