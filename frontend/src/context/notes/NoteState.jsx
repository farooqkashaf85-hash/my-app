import React, { useState, useEffect } from "react";
import NoteContext from "./NoteContext";
import { API_URL } from "../../config";

const NoteState = (props) => {
  const initialNotes = [];
  const [notes, setNotes] = useState(initialNotes);
  // Get all notes from backend
  const getNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/Notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          jwttoken: localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      if (!response.ok) {
        console.error("getNotes error:", response.status, json);
        setNotes([]);
        return;
      }
      setNotes(Array.isArray(json.data) ? json.data : []);
    } catch (error) {
      console.error("getNotes error:", error);
      setNotes([]);
    }
  };

  // Add a note and update local state
  const addNote = async (Title, Content) => {
    try {
      const response = await fetch(`${API_URL}/Notes/addnewnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          jwttoken: localStorage.getItem("token"),
        },
        body: JSON.stringify({ Title, Content }),
      });
      const json = await response.json();
      // backend returns { data: createdNote, message }
      setNotes((prev) => prev.concat(json.data));
      console.log("added note:", json.data);
    } catch (error) {
      console.error("addNote error:", error);
    }
  };

  // Delete a note locally (caller should also request backend)
  const deleteNote = async(id) => {
    try {
      const response = await fetch(`${API_URL}/Notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          jwttoken: localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error("error:", error);
    }
    console.log("deleting a note with id " + id);
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
  };

  // Edit a note
  const editNote = async (id, Title, Content) => {
    try {
      const response = await fetch(`${API_URL}/Notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          jwttoken: localStorage.getItem("token"),
        },
        body: JSON.stringify({ Title, Content }),
      });
      const result = await response.json();
      console.log("edit result:", result.data);
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === id
            ? { ...note, Title: result.data.Title, Content: result.data.Content }
            : note
        )
      );
    } catch (error) {
      console.error("editNote error:", error);
    }
  };

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
