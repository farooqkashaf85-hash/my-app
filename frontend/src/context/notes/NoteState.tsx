import { useCallback, useEffect, useState, type PropsWithChildren } from "react";
import NoteContext from "./NoteContext";
import type { Note, NoteContextValue } from "../../types";
import { notesService } from "../../application/notesService";

const NoteState = ({ children }: PropsWithChildren) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const getNotes = useCallback(async (): Promise<void> => {
    try {
      const json: { data?: Note[] } = await notesService.fetchAll();
      setNotes(Array.isArray(json.data) ? json.data : []);
    } catch (error) {
      console.error("getNotes error:", error);
      setNotes([]);
    }
  }, []);

  const addNote = async (title: string, content: string): Promise<void> => {
    const json: { data?: Note } = await notesService.add({ Title: title, Content: content });
    if (json.data) setNotes((current) => current.concat(json.data!));
  };

  const deleteNote = async (id: string): Promise<void> => {
    await notesService.remove(id);
    setNotes((current) => current.filter((note) => note._id !== id));
  };

  const editNote = async (id: string, title: string, content: string): Promise<void> => {
    const json: { data?: Note } = await notesService.update(id, { Title: title, Content: content });
    if (json.data) {
      setNotes((current) => current.map((note) => note._id === id ? json.data! : note));
    }
  };

  useEffect(() => { void getNotes(); }, [getNotes]);

  const value: NoteContextValue = { notes, addNote, deleteNote, editNote, getNotes };
  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};

export default NoteState;