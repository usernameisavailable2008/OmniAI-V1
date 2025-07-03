export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1 space-y-3">
          {/* First line - longer */}
          <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
          {/* Second line - shorter */}
          <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
          {/* Third line - medium */}
          <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
        </div>
      </div>
      
      {/* Second paragraph */}
      <div className="flex space-x-4 mt-6">
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
        </div>
      </div>

      {/* Code block skeleton */}
      <div className="mt-6 space-y-2">
        <div className="h-4 bg-gray-800/50 rounded w-1/4"></div>
        <div className="h-24 bg-gray-800/50 rounded"></div>
      </div>
    </div>
  );
}

export function ChatLoadingSkeleton() {
  return (
    <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
      <div className="prose prose-invert max-w-none">
        <LoadingSkeleton />
      </div>
    </div>
  );
} 