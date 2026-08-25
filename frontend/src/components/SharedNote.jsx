import { useCallback, useEffect, useMemo, useState } from "react";

const baseUrl = "https://my-app-1-1xuw.onrender.com";

function SharedNote() {
  const [sharedNotes, setSharedNotes] = useState([]);
  const [error, setError] = useState(null);

  const fetchSharedNotes = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/Notes/shared`,
        {
          method: "GET",
          headers: {
            jwttoken: localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to fetch shared notes");
      }

      setSharedNotes(Array.isArray(data.data) ? data.data : []);
      setError(null);
    } catch (error) {
      console.error(error);
      setSharedNotes([]);
      setError("Unable to load shared notes");
    }
  }, []);

  const orderedSharedNotes = useMemo(
    () =>
      [...sharedNotes].sort(
        (firstNote, secondNote) =>
          new Date(secondNote.createdAt || 0) -
          new Date(firstNote.createdAt || 0),
      ),
    [sharedNotes],
  );

  useEffect(() => {
    fetchSharedNotes();
  }, [fetchSharedNotes]);

  return (
    <div className="container mt-3">
      <h2>Shared Notes</h2>

      {error ? (
        <p>{error}</p>
      ) : sharedNotes.length === 0 ? (
        <p>No shared notes found</p>
      ) : (
        orderedSharedNotes.map((note) => (
          <div
            key={note._id}
            className="card my-2 p-3"
          >
            <h4>{note.Title}</h4>
            <p>{note.Content}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default SharedNote;