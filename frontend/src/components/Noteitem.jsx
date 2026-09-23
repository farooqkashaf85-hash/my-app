import { memo, useCallback, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { useNotes } from "../hooks/useNotes";
import {removeNoteOptimistic} from "../store/notesSlice";
import socket from "../socket";
import { toast } from "react-toastify";
import { API_URL } from "../config";
import { useDispatch } from "react-redux";

const Noteitem = (props) => {
  const {deleteNote} = useNotes();
  const dispatch = useDispatch();
  const { Note, updateNote } = props;
  useEffect(() => {
    socket.on("note deleted", (data) => {
      toast.error(data.message);
    });
    return () => {
      socket.off("note deleted");
    };
  }, []);
  // Function to handle sharing a note
  const shareNote = useCallback(async (noteId) => {
    try {
      const useremail = prompt("Enter User Email");
      if (!useremail?.trim()) {
        return;
      }
      const response = await fetch(`${API_URL}/Notes/share/${noteId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          jwttoken: localStorage.getItem("token"),
        },
        body: JSON.stringify({ useremail }),
      });
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { message: responseText || "Unable to share note" };
      }
      if (data.message === "Note shared successfully") {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Error sharing note");
    }
  }, []);
  useEffect(() => {
    socket.on("note shared", (data) => {
      toast.success(data.message);
    });

    return () => {
      socket.off("note shared");
    };
  }, []);

  return (
    <div className="col-md-6 col-xl-4 note-grid-item">
      <article className="card note-card">
        <div className="card-body note-card-body">
          <div className="note-card-heading">
            <h5 className="card-title note-card-title">{Note.Title}</h5>
            <div className="note-card-actions" aria-label="Note actions">
              <AiFillEdit
                size={22}
                className="note-action note-action-edit"
                title="Edit note"
                onClick={() => {
                  updateNote(Note);
                }}
              />
              <MdDelete
                size={22}
                className="note-action note-action-delete"
                title="Delete note"
                onClick={() => {
                  dispatch(removeNoteOptimistic(Note._id));
                  deleteNote(Note._id);
                  if (props.showAlert) {
                    props.showAlert("Note deleted successfully", "success");
                  }
                }}
              />
            </div>
          </div>
          <p className="card-text note-card-content">{Note.Content}</p>
          <button className="btn app-btn app-btn-share" onClick={() => shareNote(Note._id)}>
            <i className="fas fa-share-alt" aria-hidden="true"></i>
            Share note
          </button>
        </div>
      </article>
    </div>
  );
};

export default memo(Noteitem);
