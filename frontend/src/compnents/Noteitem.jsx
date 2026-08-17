import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import NoteContext from "../context/notes/NoteContext";
import socket from "../socket";
import { toast } from "react-toastify";

const Noteitem = (props) => {
  const context = useContext(NoteContext);
  const {deleteNote} = context;
  const { showAlert } = props;
  const { Note, updateNote } = props;
   useEffect(() => {
        socket.on("note deleted", (data) => {
          toast.error(data.message);
        });
        return () => {
          socket.off("note deleted");
        }
      }, [])
  return (
    <div className="col-md-4">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title">{Note.Title}</h5>
            <div className="icons">
              <AiFillEdit  size={22} className="mx-2 " style={{ cursor: "pointer" }} onClick={() => {updateNote(Note)}}/>
              <MdDelete  size={22} className="mx-2 " style={{ cursor: "pointer" }} onClick={()=>{deleteNote(Note._id); props.showAlert("Note deleted successfully", "success")}} />
            </div>
          </div>

          <p className="card-text"> {Note.Content} </p>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
