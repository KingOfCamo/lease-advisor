import { renderToBuffer } from "@react-pdf/renderer";
import type React from "react";

/**
 * Wrapper around @react-pdf/renderer's renderToBuffer that handles
 * the type mismatch between React.createElement output and the
 * expected DocumentProps generic parameter.
 */
export async function renderPdfToBuffer(
  element: React.ReactElement
): Promise<Buffer> {
  // The renderToBuffer function expects ReactElement<DocumentProps>
  // but our components return valid Document elements through createElement.
  // This wrapper bridges the type gap.
  return renderToBuffer(
    element as Parameters<typeof renderToBuffer>[0]
  );
}
