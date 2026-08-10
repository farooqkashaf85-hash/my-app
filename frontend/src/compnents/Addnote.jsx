import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import NoteContext from '../context/notes/NoteContext';
const Addnote = (props) => {
      const context = useContext(NoteContext);
    const {addNote} = context;
    const [note, setNote] = useState({Title : "" , Content : ""})
    const handleSubmit =(e)=>{
        e.preventDefault(); 
        addNote(note.Title , note.Content);
        setNote({Title : "" , Content : ""});
        props.showAlert("Note added successfully", "success")
    }
    const handleInput =(e)=>{
        setNote({...note , [e.target.name] : e.target.value})
    }
  return (
    <div>
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
        <button disabled={note.Title.length < 5 || note.Content.length < 5} type="submit" style={{ backgroundColor: "#434379",  color: "white" }} onClick={handleSubmit}>
          Add Note
        </button>
      </form>
      </div>
    </div>
  )
}

export default Addnote
