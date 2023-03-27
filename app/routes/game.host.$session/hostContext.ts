import { createContext } from "use-context-selector";
import type { HostContextType } from "~/models/types.client";

const HostContext = createContext<HostContextType | null>(null);

export default HostContext;
