import type { MutableRefObject } from "react";
import { useRef } from "react";
import { shallowEqualObjects } from "shallow-equal";
import { useContextSelector } from "use-context-selector";

import HostContext from "./hostContext";
import type { HostContextType } from "~/models/types.client";

function identity<T>(a: T) {
  return a;
}

function useHost(): HostContextType;
function useHost<T>(selector: (ctx: HostContextType) => T): T;
function useHost<T extends {}>(
  selector: (ctx: HostContextType) => T,
  isMulti: boolean
): T;
function useHost<T>(
  selector: (ctx: HostContextType) => T | HostContextType = identity,
  isMulti: boolean = false
): T | HostContextType {
  const ref: MutableRefObject<T | HostContextType | undefined> = useRef();

  const equalityFnCallback = (ctx: HostContextType | null) => {
    if (!ctx) {
      throw "No context";
    }
    const selected = selector(ctx);
    if (
      ref.current &&
      ((isMulti && ref.current === selected) ||
        (!isMulti && shallowEqualObjects(ref.current, selected as {})))
    ) {
      return ref.current;
    }
    ref.current = selected;
    return selected;
  };

  // Update the selector fn to memoize the selected value by [equalityFn].
  return useContextSelector(HostContext, equalityFnCallback);
}

export default useHost;
