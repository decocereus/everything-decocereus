import RenderLoader from "@/components/render-loader.tsx";

export default async function RenderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RenderLoader boardId={id} />;
}
