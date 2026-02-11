import { AnalysisResult, LeaseWithRelations } from "./types";
import { analyseWithMockEngine } from "./mock-analysis";

export async function analyseLease(
  lease: LeaseWithRelations
): Promise<AnalysisResult> {
  const mode = process.env.AI_MODE || "mock";

  if (mode === "live") {
    // Future: return analyseWithClaude(lease);
    throw new Error("Live AI mode not yet implemented. Set AI_MODE=mock in .env");
  }

  return analyseWithMockEngine(lease);
}

export type { AnalysisResult, LeaseWithRelations } from "./types";
