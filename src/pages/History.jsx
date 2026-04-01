import { History } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
      <div className="text-center">
        <History className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-20" />
        <h2 className="text-lg sm:text-xl font-semibold mb-2">History</h2>
        <p className="text-sm sm:text-base">
          View your recent API requests
        </p>
      </div>
    </div>
  );
}