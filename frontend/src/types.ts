export type AlertType = "success" | "danger" | "warning" | "info";

export interface AlertState {
  msg: string;
  type: AlertType;
}

export interface Note {
  _id: string;
  Title: string;
  Content: string;
  user?: string | { name?: string; email?: string; role?: string };
}

export interface NoteContextValue {
  notes: Note[];
  addNote: (title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  editNote: (id: string, title: string, content: string) => Promise<void>;
  getNotes: () => Promise<void>;
}

export type ShowAlert = (message: string, type: AlertType) => void;