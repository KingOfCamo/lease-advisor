import { Card, CardContent } from "@/components/ui/card";

export default function LeasesLoading() {
  return (
    <div>
      <div className="flex items-center justify-between pb-6">
        <div>
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
        </div>
        <div className="h-10 w-32 bg-muted rounded animate-pulse" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-80 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-56 bg-muted rounded animate-pulse" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-6 w-24 bg-muted rounded animate-pulse ml-auto" />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse ml-auto" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
