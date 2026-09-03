import { createContext } from "react";
import type { NoteContextValue } from "../../types";

const NoteContext = createContext<NoteContextValue | undefined>(undefined);

export default NoteContext;