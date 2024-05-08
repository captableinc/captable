// CREDITS https://github.com/reach/reach-ui/blob/dev/packages/descendants/src/reach-descendants.tsx

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import { useForceUpdate } from "@/hooks/use-force-update";
import { useIsomorphicLayoutEffect as useLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop(): void {}

function createDescendantContext<DescendantType extends Descendant>(
  name: string,
  initialValue = {},
) {
  type T = DescendantContextValue<DescendantType>;
  const descendants: DescendantType[] = [];
  const ctx = React.createContext<T>({
    descendants,
    registerDescendant: () => noop,
    ...initialValue,
  });
  ctx.displayName = name;
  return ctx;
}

function useDescendant<DescendantType extends Descendant>(
  descendant: Omit<DescendantType, "index">,
  context: React.Context<DescendantContextValue<DescendantType>>,
  indexProp?: number,
) {
  const forceUpdate = useForceUpdate();
  const { registerDescendant, descendants } = React.useContext(context);

  // This will initially return -1 because we haven't registered the descendant
  // on the first render. After we register, this will then return the correct
  // index on the following render and we will re-register descendants so that
  // everything is up-to-date before the user interacts with a collection.
  const index =
    indexProp ??
    descendants.findIndex((item) => item.element === descendant.element);

  // Prevent any flashing
  useLayoutEffect(() => {
    if (!descendant.element) forceUpdate();
    return registerDescendant({ ...descendant, index } as DescendantType);
  }, [
    descendant,
    forceUpdate,
    index,
    registerDescendant,
    // eslint-disable-next-line react-hooks/exhaustive-deps, @typescript-eslint/no-unsafe-assignment
    ...Object.values(descendant),
  ]);

  return index;
}

function useDescendantsInit<DescendantType extends Descendant>() {
  return React.useState<DescendantType[]>([]);
}

function useDescendants<DescendantType extends Descendant>(
  ctx: React.Context<DescendantContextValue<DescendantType>>,
) {
  return React.useContext(ctx).descendants;
}

function DescendantProvider<DescendantType extends Descendant>({
  context: Ctx,
  children,
  items,
  set,
}: {
  context: React.Context<DescendantContextValue<DescendantType>>;
  children: React.ReactNode;
  items: DescendantType[];
  set: React.Dispatch<React.SetStateAction<DescendantType[]>>;
}) {
  const registerDescendant = React.useCallback(
    ({
      element,
      index: explicitIndex,
      ...rest
    }: Omit<DescendantType, "index"> & { index?: number | undefined }) => {
      if (!element) return noop;

      set((items) => {
        if (explicitIndex != null && explicitIndex !== -1) {
          return insertAt(
            items,
            { element, index: explicitIndex, ...rest } as DescendantType,
            explicitIndex,
          );
        }

        if (items.length === 0) {
          // If there are no items, register at index 0 and bail.
          return [{ ...rest, element, index: 0 } as DescendantType];
        }

        const index = findDOMIndex(items, element);
        let newItems: DescendantType[];
        if (index === -1) {
          newItems = [
            ...items,
            { ...rest, element, index: items.length } as DescendantType,
          ];
        } else {
          newItems = insertAt(
            items,
            { ...rest, element, index } as DescendantType,
            index,
          );
        }
        return newItems;
      });

      return () => {
        if (!element) return;
        set((items) => items.filter((item) => element !== item.element));
      };
    },
    // set is a state setter initialized by the useDescendantsInit hook.
    // We can safely ignore the lint warning here because it will not change
    // between renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Ctx.Provider
      value={React.useMemo(() => {
        return {
          descendants: items,
          registerDescendant,
        };
      }, [items, registerDescendant])}
    >
      {children}
    </Ctx.Provider>
  );
}

function isElementPreceding(a: Element, b: Element) {
  return Boolean(
    b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING,
  );
}

function findDOMIndex<DescendantType extends Descendant>(
  items: DescendantType[],
  element: Element,
) {
  if (!element) return -1;
  if (!items.length) return -1;

  let length = items.length;
  // Most of the times, the new item will be added at the end of the list, so we
  // do a findeIndex in reverse order, instead of wasting time searching the
  // index from the beginning.
  while (length--) {
    const currentElement = items?.[length]?.element;
    if (!currentElement) continue;
    if (isElementPreceding(currentElement, element)) {
      return length + 1;
    }
  }
  return -1;
}

/**
 * Copy an array of items with a new item added at a specific index.
 * @param array The source array
 * @param item The item to insert into the array
 * @param index The index to insert the item at
 * @returns A copy of the array with the item inserted at the specified index
 */
function insertAt<T extends any[]>(
  array: T,
  item: T[number],
  index?: number,
): T {
  if (index == null || !(index in array)) {
    return [...array, item] as T;
  }
  return [...array.slice(0, index), item, ...array.slice(index)] as T;
}

////////////////////////////////////////////////////////////////////////////////
// Types

type SomeElement<T> = T extends Element ? T : HTMLElement;

type Descendant<Data = { title: string }, ElementType = HTMLElement> = {
  element: SomeElement<ElementType> | null;
  index: number;
  data: Data;
};

interface DescendantContextValue<DescendantType extends Descendant> {
  descendants: DescendantType[];
  registerDescendant(descendant: DescendantType): () => void;
}

////////////////////////////////////////////////////////////////////////////////
// Exports

export {
  DescendantProvider,
  createDescendantContext,
  useDescendant,
  useDescendants,
  useDescendantsInit,
};
export type { Descendant, DescendantContextValue };
