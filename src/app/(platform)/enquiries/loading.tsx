export default function EnquiriesLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 rounded bg-gray-200" />
      <div className="mt-2 h-4 w-64 rounded bg-gray-100" />

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <div className="h-4 w-full rounded bg-gray-200" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-gray-100 px-4 py-3">
            <div className="h-4 w-full rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
