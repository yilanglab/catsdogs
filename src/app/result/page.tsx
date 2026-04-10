import { Suspense } from "react";
import ResultPageClient from "@/components/ResultPageClient";

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAF8]">
          <div className="text-center">
            <p className="text-4xl mb-3">🐾</p>
            <p className="text-[#8B9DAF]">正在揭晓你的动物人格…</p>
          </div>
        </div>
      }
    >
      <ResultPageClient />
    </Suspense>
  );
}

