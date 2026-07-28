const express = require("express");
const router = express.Router();
const notes = require("../models/Notes");

//Create a Note
router.post("/", async(req, res) => {
  const Notes = await notes.create(req.body);
  console.log("Notes", Notes);
  res.status(201).json({
    data : Notes,
    message: "New Note Created" });
});

//get all notes
router.get("/", async(req, res) => {
  const Notes = await notes.find();
  console.log("Notes", Notes);
  if (Notes.length === 0) {
     return res.status(404).json({ message: "No Note Found" });
  }
  {
    res.status(200).json({ 
        data : Notes,
        message: "Get All Notes" });
  }
});

//get notes by a single id
router.get("/:id", async(req, res) => {
  const Notes = await notes.findById(req.params.id);
  console.log("Notes", Notes);
  if (!Notes) 
    {
     return res.status(404).json({ message: "No Note Found" });
  }
  {
    res.status(200).json({ 
        data : Notes,
        message: "Get Notes by single Id" });
  }
});

//Update Note
router.put("/:id" , async(req, res) => {
    const Notes = await notes.findByIdAndUpdate(req.params.id , req.body,  {new : true});
    console.log("Note updated" , Notes);
    res.status(201).json({
        data : Notes,
        message : "Notes are Update"});
});

//Delete Note 
router.delete("/:id" ,async (req, res) => {
    const Notes = await notes.findByIdAndDelete(req.params.id , req.body, {new : true});
    console.log("Notes deleted" , Notes);
    res.status(201).json({
        data : Notes,
        message : "Note deleted"});
});

module.exports = router;
