import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNote } from "../store/notesSlice";
import { toast } from "react-toastify";
import socket from "../socket";
const Addnote = (props) => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.items);
  const user = notes?.[0]?.user;
  const [note, setNote] = useState({ Title: "", Content: "" });
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addNote({ Title: note.Title, Content: note.Content }));
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
        <div className="container my-3 card mb-3">
          <div className="card-body">
            <h5 className="card-title">Welcome {user.name}</h5>

            <p className="card-text mb-1">
              <strong>Email:</strong> {user.email}
            </p>

            <p className="card-text mb-0">
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        </div>
      )}
      <div className="container my-3">
        <h1>Add a Note</h1>
        <form className="my-3">
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
            style={{ backgroundColor: "#434379", color: "white" }}
            onClick={handleSubmit}
          >
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addnote;
