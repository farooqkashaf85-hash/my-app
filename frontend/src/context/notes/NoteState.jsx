import React, { useState, useEffect } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const initialNotes = [];
  const [notes, setNotes] = useState(initialNotes);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 5, pages: 1 });
  const [keyword, setKeyword] = useState("");
  const baseUrl = "http://localhost:5000";

  // Get all notes from backend
  const getNotes = async (page = 1, limit = 5, search = "") => {
    try {
      const query = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search.trim()) {
        query.append("keyword", search.trim());
      }

      const response = await fetch(`${baseUrl}/Notes/fetchallnotes?${query.toString()}`, {
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
      setPagination(json.pagination || { total: 0, page, limit, pages: 1 });
    } catch (error) {
      console.error("getNotes error:", error);
      setNotes([]);
    }
  };

  // Add a note and update local state
  const addNote = async (Title, Content) => {
    try {
      const response = await fetch(`${baseUrl}/Notes/addnewnote`, {
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
      const response = await fetch(`${baseUrl}/Notes/deletenote/${id}`, {
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
      const response = await fetch(`${baseUrl}/Notes/updatenote/${id}`, {
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
      value={{ notes, addNote, deleteNote, editNote, getNotes, pagination, keyword, setKeyword }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
