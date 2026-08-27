import { useEffect, useState } from "react";

const baseUrl = "http://localhost:5000";

function SharedNote() {
  const [sharedNotes, setSharedNotes] = useState([]);
  const [error, setError] = useState(null);

  const fetchSharedNotes = async () => {
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
  };

  useEffect(() => {
    fetchSharedNotes();
  }, []);

  return (
    <div className="container mt-3">
      <h2>Shared Notes</h2>

      {error ? (
        <p>{error}</p>
      ) : sharedNotes.length === 0 ? (
        <p>No shared notes found</p>
      ) : (
        sharedNotes.map((note) => (
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