import Link from "next/link";
import { SKILL_TREE_ELEMENTS, SOCIALS } from "@/lib/constants";
import { Tree, Folder, File, type TreeViewElement } from "./ui/file-tree";

const collectExpandableIds = (elements: TreeViewElement[]): string[] => {
  const ids: string[] = [];

  const traverse = (nodes: TreeViewElement[]) => {
    for (const node of nodes) {
      if (node.children?.length) {
        ids.push(node.id);
        traverse(node.children);
      }
    }
  };

  traverse(elements);
  return ids;
};

const findFirstSelectableId = (
  elements: TreeViewElement[]
): string | undefined => {
  for (const node of elements) {
    const isSelectable = node.isSelectable ?? true;
    if (isSelectable && !node.children?.length) {
      return node.id;
    }

    if (node.children?.length) {
      const childSelectableId = findFirstSelectableId(node.children);
      if (childSelectableId) {
        return childSelectableId;
      }

      if (isSelectable) {
        return node.id;
      }
    }
  }

  return undefined;
};

const SKILL_TREE_EXPANDED_IDS = collectExpandableIds(SKILL_TREE_ELEMENTS);
const SKILL_TREE_DEFAULT_SELECTED_ID =
  findFirstSelectableId(SKILL_TREE_ELEMENTS);

const renderTreeNodes = (nodes: TreeViewElement[]) =>
  nodes.map((node) => {
    if (node.children?.length) {
      return (
        <Folder
          key={node.id}
          value={node.id}
          element={node.name}
          isSelectable={node.isSelectable}
        >
          {renderTreeNodes(node.children)}
        </Folder>
      );
    }

    return (
      <File key={node.id} value={node.id} isSelectable={node.isSelectable}>
        <p>{node.name}</p>
      </File>
    );
  });

const About = () => {
  return (
    <section
      id="about"
      className="w-full max-w-3xl mx-auto py-6 animate-fadeIn min-h-[312px]"
    >
      <div className="space-y-6 flex flex-col lg:flex-row justify-start lg:justify-between">
        <div className="flex flex-col items-center justify-start gap-y-2 w-full lg:mt-16">
          <div className="space-y-2 w-full">
            <h1 className="text-4xl font-medium tracking-tight text-foreground">
              Amartya Singh
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Full Stack Engineer proficient in Next.js, Node.js and Web3
            </p>
          </div>
          <div className="space-y-2 w-full">
            <p className="text-base text-foreground">
              Reach out to me on any of the following platforms
            </p>
            <div className="flex flex-wrap gap-x-6">
              {SOCIALS.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {social.name}
                </Link>
              ))}
              <Link
                href="mailto:amartyasinghkings07@gmail.com"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Email
              </Link>
            </div>
          </div>
        </div>
        <Tree
          className="bg-background overflow-hidden rounded-md p-2"
          initialSelectedId={SKILL_TREE_DEFAULT_SELECTED_ID}
          initialExpandedItems={SKILL_TREE_EXPANDED_IDS}
          elements={SKILL_TREE_ELEMENTS}
        >
          {renderTreeNodes(SKILL_TREE_ELEMENTS)}
        </Tree>
      </div>
    </section>
  );
};

export default About;
