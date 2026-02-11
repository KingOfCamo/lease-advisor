import { Card, CardContent } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div>
      <div className="pb-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-4 w-72 bg-muted rounded animate-pulse mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="h-3 w-20 bg-muted rounded animate-pulse mb-2" />
              <div className="h-7 w-16 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="h-5 w-32 bg-muted rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-12 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
