"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { cn } from "@/lib/utils.ts";

interface TreeViewElement {
  children?: TreeViewElement[];
  id: string;
  isSelectable?: boolean;
  name: string;
}

interface TreeContextProps {
  closeIcon?: React.ReactNode;
  direction: "rtl" | "ltr";
  expandedItems: string[] | undefined;
  indicator: boolean;
  openIcon?: React.ReactNode;
  selectedId: string | undefined;
  selectItem: (id: string) => void;
  setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}

const TreeContext = createContext<TreeContextProps | null>(null);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used within a TreeProvider");
  }
  return context;
};

type Direction = "rtl" | "ltr" | undefined;

type TreeViewProps = {
  initialSelectedId?: string;
  indicator?: boolean;
  elements?: TreeViewElement[];
  initialExpandedItems?: string[];
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const Tree = ({
  className,
  elements,
  initialSelectedId,
  initialExpandedItems,
  children,
  indicator = true,
  openIcon,
  closeIcon,
  dir,
  ref,
  ...props
}: TreeViewProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialSelectedId
  );
  const [expandedItems, setExpandedItems] = useState<string[] | undefined>(
    initialExpandedItems
  );

  const selectItem = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleExpandedItemsChange = useCallback((items: string[]) => {
    setExpandedItems(items.map(String));
  }, []);

  const expandSpecificTargetedElements = useCallback(
    (treeElements?: TreeViewElement[], selectId?: string) => {
      if (!(treeElements && selectId)) {
        return;
      }
      const findParent = (
        currentElement: TreeViewElement,
        currentPath: string[] = []
      ) => {
        const isSelectable = currentElement.isSelectable ?? true;
        const newPath = [...currentPath, currentElement.id];
        if (currentElement.id === selectId) {
          if (isSelectable) {
            setExpandedItems((prev) => [...(prev ?? []), ...newPath]);
          } else if (newPath.includes(currentElement.id)) {
            newPath.pop();
            setExpandedItems((prev) => [...(prev ?? []), ...newPath]);
          }
          return;
        }
        if (
          isSelectable &&
          currentElement.children &&
          currentElement.children.length > 0
        ) {
          for (const child of currentElement.children) {
            findParent(child, newPath);
          }
        }
      };
      for (const element of treeElements) {
        findParent(element);
      }
    },
    []
  );

  useEffect(() => {
    if (initialSelectedId) {
      expandSpecificTargetedElements(elements, initialSelectedId);
    }
  }, [initialSelectedId, elements, expandSpecificTargetedElements]);

  const direction: "rtl" | "ltr" = dir === "rtl" ? "rtl" : "ltr";
  const contextValue = useMemo(
    () => ({
      closeIcon,
      direction,
      expandedItems,
      indicator,
      openIcon,
      selectedId,
      selectItem,
      setExpandedItems,
    }),
    [
      selectedId,
      expandedItems,
      selectItem,
      indicator,
      openIcon,
      closeIcon,
      direction,
    ]
  );

  return (
    <TreeContext.Provider value={contextValue}>
      <div className={cn("h-full min-w-fit", className)}>
        <ScrollArea
          className="relative h-full px-2"
          dir={dir as Direction}
          ref={ref}
        >
          <AccordionPrimitive.Root
            {...props}
            className="flex flex-col gap-1"
            defaultValue={expandedItems}
            dir={dir as Direction}
            multiple
            onValueChange={handleExpandedItemsChange}
            value={expandedItems}
          >
            {children}
          </AccordionPrimitive.Root>
        </ScrollArea>
      </div>
    </TreeContext.Provider>
  );
};

Tree.displayName = "Tree";

const TreeIndicator = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const { direction } = useTree();

  return (
    <div
      className={cn(
        "absolute left-1.5 h-full w-px rounded-md bg-muted py-3 duration-300 ease-in-out hover:bg-slate-300 rtl:right-1.5",
        className
      )}
      dir={direction}
      ref={ref}
      {...props}
    />
  );
};

TreeIndicator.displayName = "TreeIndicator";

type FolderProps = {
  expandedItems?: string[];
  element: string;
  isSelectable?: boolean;
  isSelect?: boolean;
} & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

const Folder = ({
  className,
  element,
  value,
  isSelectable = true,
  isSelect,
  children,
  ref,
  ...props
}: FolderProps &
  React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
  }) => {
  const {
    direction,
    expandedItems,
    indicator,
    setExpandedItems,
    openIcon,
    closeIcon,
  } = useTree();
  const handleExpandedItemsChange = useCallback(
    (items: string[]) => setExpandedItems?.(items.map(String)),
    [setExpandedItems]
  );

  return (
    <AccordionPrimitive.Item
      ref={ref}
      {...props}
      className="relative h-full overflow-hidden"
      value={value}
    >
      <AccordionPrimitive.Trigger
        className={cn("flex items-center gap-1 rounded-md text-sm", className, {
          "cursor-not-allowed opacity-50": !isSelectable,
          "cursor-pointer": isSelectable,
          "rounded-md bg-muted": isSelect && isSelectable,
        })}
        disabled={!isSelectable}
      >
        {expandedItems?.includes(value)
          ? (openIcon ?? <FolderOpenIcon className="size-4" />)
          : (closeIcon ?? <FolderIcon className="size-4" />)}
        <span>{element}</span>
      </AccordionPrimitive.Trigger>
      <AccordionPrimitive.Panel className="relative h-[var(--accordion-panel-height)] overflow-hidden text-sm transition-[height] duration-200 data-[ending-style]:h-0 data-[starting-style]:h-0">
        {Boolean(element) && indicator && <TreeIndicator aria-hidden="true" />}
        <AccordionPrimitive.Root
          className="ml-5 flex flex-col gap-1 py-1 rtl:mr-5"
          defaultValue={expandedItems}
          dir={direction}
          multiple
          onValueChange={handleExpandedItemsChange}
          value={expandedItems}
        >
          {children}
        </AccordionPrimitive.Root>
      </AccordionPrimitive.Panel>
    </AccordionPrimitive.Item>
  );
};

Folder.displayName = "Folder";

const File = ({
  value,
  className,
  handleSelect,
  isSelectable = true,
  isSelect,
  fileIcon,
  children,
  ref,
  ...props
}: {
  value: string;
  handleSelect?: (id: string) => void;
  isSelectable?: boolean;
  isSelect?: boolean;
  fileIcon?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & {
    ref?: React.Ref<HTMLButtonElement>;
  }) => {
  const { direction, selectedId, selectItem } = useTree();
  const isSelected = isSelect ?? selectedId === value;
  const selectFile = useCallback(() => {
    selectItem(value);
    handleSelect?.(value);
  }, [handleSelect, selectItem, value]);
  return (
    <button
      className={cn(
        "flex w-fit items-center gap-1 rounded-md pr-1 text-sm duration-200 ease-in-out rtl:pr-0 rtl:pl-1",
        {
          "bg-muted": isSelected && isSelectable,
        },
        isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
        direction === "rtl" ? "rtl" : "ltr",
        className
      )}
      disabled={!isSelectable}
      onClick={selectFile}
      ref={ref}
      type="button"
      {...props}
    >
      {fileIcon ?? <FileIcon className="size-4" />}
      {children}
    </button>
  );
};

File.displayName = "File";

const CollapseButton = ({
  className,
  elements,
  expandAll = false,
  children,
  ref,
  ...props
}: {
  elements: TreeViewElement[];
  expandAll?: boolean;
} & React.HTMLAttributes<HTMLButtonElement> & {
    ref?: React.Ref<HTMLButtonElement>;
  }) => {
  const { expandedItems, setExpandedItems } = useTree();

  const expendAllTree = useCallback(
    (treeElements: TreeViewElement[]) => {
      const expandTree = (element: TreeViewElement) => {
        const isSelectable = element.isSelectable ?? true;
        if (isSelectable && element.children && element.children.length > 0) {
          setExpandedItems?.((prev) => [...(prev ?? []), element.id]);
          for (const child of element.children) {
            expandTree(child);
          }
        }
      };

      for (const element of treeElements) {
        expandTree(element);
      }
    },
    [setExpandedItems]
  );

  const closeAll = useCallback(() => {
    setExpandedItems?.([]);
  }, [setExpandedItems]);

  const toggleExpandedItems = useCallback(() => {
    if (expandedItems && expandedItems.length > 0) {
      closeAll();
      return;
    }
    expendAllTree(elements);
  }, [closeAll, elements, expandedItems, expendAllTree]);

  useEffect(() => {
    if (expandAll) {
      expendAllTree(elements);
    }
  }, [elements, expandAll, expendAllTree]);

  return (
    <Button
      className={cn("absolute right-2 bottom-1 h-8 w-fit p-1", className)}
      onClick={toggleExpandedItems}
      ref={ref}
      variant={"ghost"}
      {...props}
    >
      {children}
      <span className="sr-only">Toggle</span>
    </Button>
  );
};

CollapseButton.displayName = "CollapseButton";

export { CollapseButton, File, Folder, Tree, type TreeViewElement };
