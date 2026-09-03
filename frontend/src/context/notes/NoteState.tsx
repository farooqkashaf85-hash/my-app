import { useCallback, useEffect, useState, type PropsWithChildren } from "react";
import NoteContext from "./NoteContext";
import type { Note, NoteContextValue } from "../../types";
import { API_URL } from "../../config";

const authHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  jwttoken: localStorage.getItem("token") ?? "",
});

const NoteState = ({ children }: PropsWithChildren) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const getNotes = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/Notes/fetchallnotes`, {
        headers: authHeaders(),
      });
      const json: { data?: Note[] } = await response.json();
      setNotes(response.ok && Array.isArray(json.data) ? json.data : []);
    } catch (error) {
      console.error("getNotes error:", error);
      setNotes([]);
    }
  }, []);

  const addNote = async (title: string, content: string): Promise<void> => {
    const response = await fetch(`${API_URL}/Notes/addnewnote`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ Title: title, Content: content }),
    });
    const json: { data?: Note } = await response.json();
    if (response.ok && json.data) setNotes((current) => current.concat(json.data!));
  };

  const deleteNote = async (id: string): Promise<void> => {
    await fetch(`${API_URL}/Notes/deletenote/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    setNotes((current) => current.filter((note) => note._id !== id));
  };

  const editNote = async (id: string, title: string, content: string): Promise<void> => {
    const response = await fetch(`${API_URL}/Notes/updatenote/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ Title: title, Content: content }),
    });
    const json: { data?: Note } = await response.json();
    if (response.ok && json.data) {
      setNotes((current) => current.map((note) => note._id === id ? json.data! : note));
    }
  };

  useEffect(() => { void getNotes(); }, [getNotes]);

  const value: NoteContextValue = { notes, addNote, deleteNote, editNote, getNotes };
  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};

export default NoteState;