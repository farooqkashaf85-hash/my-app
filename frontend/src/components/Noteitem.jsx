import { memo, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { deleteNote } from "../store/notesSlice";
import socket from "../socket";
import { toast } from "react-toastify";
const baseUrl = "https://my-app-1-1xuw.onrender.com";

const Noteitem = (props) => {
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
      const response = await fetch(`${baseUrl}/Notes/share/${noteId}`, {
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
    <div className="col-md-4">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title">{Note.Title}</h5>
            <div className="icons">
              <AiFillEdit
                size={22}
                className="mx-2 "
                style={{ cursor: "pointer" }}
                onClick={() => {
                  updateNote(Note);
                }}
              />
              <MdDelete
                size={22}
                className="mx-2 "
                style={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(deleteNote(Note._id));
                  if (props.showAlert) {
                    props.showAlert("Note deleted successfully", "success");
                  }
                }}
              />
            </div>
            <button className="btn btn-primary mx-2" onClick={() => shareNote(Note._id)}>Share</button>
          </div>

          <p className="card-text"> {Note.Content} </p>
        </div>
      </div>
    </div>
  );
};

export default memo(Noteitem);
