import RenderLoader from "@/components/RenderLoader";

export default async function RenderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RenderLoader boardId={id} />;
}
