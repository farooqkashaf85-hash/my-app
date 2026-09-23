import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { useAuth } from "../hooks/useAuth";

function SharedNote() {
  const [sharedNotes, setSharedNotes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchSharedNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/Notes/shared`,
        {
          method: "GET",
          headers: {
            jwttoken: token,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          navigate("/login");
          return;
        }
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
  }, [logout, navigate]);

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