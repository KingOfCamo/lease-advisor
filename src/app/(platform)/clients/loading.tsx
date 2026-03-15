import { Card, CardContent } from "@/components/ui/card";

export default function ClientsLoading() {
  return (
    <div>
      <div className="flex items-center justify-between pb-6">
        <div>
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
        </div>
        <div className="h-10 w-32 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
              </div>
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
