import { useState, useEffect } from "react";
import { useNotes } from "../hooks/useNotes";
import { toast } from "react-toastify";
import socket from "../socket";
const Addnote = (props) => {
  const {items : notes, addNote} = useNotes();
  const user = notes?.[0]?.user;
  const [note, setNote] = useState({ Title: "", Content: "" });
  const handleSubmit = (e) => {
    e.preventDefault();
    addNote({ Title: note.Title, Content: note.Content });
    setNote({ Title: "", Content: "" });
    props.showAlert("Note added successfully", "success");
  };
  const handleInput = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    socket.on("note created", (data) => {
      toast.success(data.message);
    });
    return () => {
      socket.off("note created");
    };
  }, []);
  return (
    <div>
      {user && (
        <div className="container user-welcome-card">
          <div className="card-body">
            <p className="eyebrow">WELCOME BACK</p>
            <h5 className="card-title">{user.name}</h5>

            <p className="card-text mb-1">
              <strong>Email:</strong> {user.email}
            </p>

            <p className="card-text mb-0">
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        </div>
      )}
      <div className="container add-note-panel">
        <div className="add-note-heading">
          <p className="eyebrow">CAPTURE AN IDEA</p>
          <h1>Add a Note</h1>
          <p>Write something worth remembering.</p>
        </div>
        <form className="add-note-form">
          <div className="mb-3">
            <label htmlFor="Title" className="form-label">
              Title
            </label>
            <input
              type="text"
              name="Title"
              value={note.Title}
              className="form-control"
              id="Title"
              onChange={handleInput}
              minLength={5}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Content" className="form-label">
              Content
            </label>
            <input
              type="text"
              name="Content"
              value={note.Content}
              className="form-control"
              id="Content"
              onChange={handleInput}
              minLength={5}
              required
            />
          </div>
          <button
            disabled={note.Title.length < 5 || note.Content.length < 5}
            type="submit"
            className="btn app-btn app-btn-primary"
            onClick={handleSubmit}
          >
            <i className="fas fa-plus" aria-hidden="true"></i>
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addnote;
