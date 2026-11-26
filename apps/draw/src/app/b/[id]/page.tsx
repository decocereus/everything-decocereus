import Script from "next/script";
import EditorLoader from "@/components/editor-loader.tsx";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <EditorLoader boardId={id} />
      {/* Publishes the board tools to in-browser agents through WebMCP. */}
      <Script src="/api/mcp?webmcp-script" strategy="afterInteractive" />
    </>
  );
}
