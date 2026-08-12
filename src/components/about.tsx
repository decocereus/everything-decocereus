import Link from "next/link";
import { SKILL_TREE_ELEMENTS, SOCIALS } from "@/lib/constants.ts";
import { File, Folder, Tree, type TreeViewElement } from "./ui/file-tree.tsx";

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
};

const SKILL_TREE_EXPANDED_IDS = collectExpandableIds(SKILL_TREE_ELEMENTS);
const SKILL_TREE_DEFAULT_SELECTED_ID =
  findFirstSelectableId(SKILL_TREE_ELEMENTS);

const renderTreeNodes = (nodes: TreeViewElement[]) =>
  nodes.map((node) => {
    if (node.children?.length) {
      return (
        <Folder
          element={node.name}
          isSelectable={node.isSelectable}
          key={node.id}
          value={node.id}
        >
          {renderTreeNodes(node.children)}
        </Folder>
      );
    }

    return (
      <File isSelectable={node.isSelectable} key={node.id} value={node.id}>
        <p>{node.name}</p>
      </File>
    );
  });

const About = () => (
  <section
    className="mx-auto min-h-[312px] w-full max-w-3xl animate-fadeIn py-6"
    id="about"
  >
    <div className="flex flex-col justify-start space-y-6 lg:flex-row lg:justify-between">
      <div className="flex w-full flex-col items-center justify-start gap-y-2 lg:mt-16">
        <div className="w-full space-y-2">
          <h1 className="font-medium text-4xl text-foreground tracking-tight">
            Amartya Singh
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Full Stack Engineer proficient in Next.js, Node.js and Web3
          </p>
        </div>
        <div className="w-full space-y-2">
          <p className="text-base text-foreground">
            Reach out to me on any of the following platforms
          </p>
          <div className="flex flex-wrap gap-x-6">
            {SOCIALS.map((social) => (
              <Link
                className="text-muted-foreground text-sm transition-colors duration-200 hover:text-foreground"
                href={social.url}
                key={social.name}
                rel="noreferrer"
                target="_blank"
              >
                {social.name}
              </Link>
            ))}
            <Link
              className="text-muted-foreground text-sm transition-colors duration-200 hover:text-foreground"
              href="mailto:amartyasinghkings07@gmail.com"
            >
              Email
            </Link>
          </div>
        </div>
      </div>
      <Tree
        className="overflow-hidden rounded-md bg-background p-2"
        elements={SKILL_TREE_ELEMENTS}
        initialExpandedItems={SKILL_TREE_EXPANDED_IDS}
        initialSelectedId={SKILL_TREE_DEFAULT_SELECTED_ID}
      >
        {renderTreeNodes(SKILL_TREE_ELEMENTS)}
      </Tree>
    </div>
  </section>
);

export default About;
