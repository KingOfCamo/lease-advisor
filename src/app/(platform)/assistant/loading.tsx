export default function AssistantLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="h-4 w-64 bg-gray-100 rounded" />
      <div className="h-[calc(100vh-16rem)] bg-gray-100 rounded-xl" />
    </div>
  );
}
