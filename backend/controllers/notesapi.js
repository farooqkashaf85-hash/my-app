const express = require("express");
const router = express.Router();
const notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchUser");
const authorizeRoles = require("../middleware/authorizeRole");
const { body, validationResult } = require("express-validator");
//Create a Note.Login required
router.post(
  "/addnewnote",
  fetchuser,
  [
    body("Title", "Enter valid title").isLength({ min: 5 }),
    body("Content", "Content atleast 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { Title, Content } = req.body;
      //if error occurs
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const Note = new notes({ Title, Content, user: req.user.id });
      const saveNote = await Note.save();
      res.status(201).json({
        data: Note,
        message: "New Note Created",
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  },
);

//get all notes.Login rquired
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const Notes = req.user.role === "admin"
      ? await notes.find()
      : await notes.find({ user: req.user.id });

    res.status(200).json({
      data: Notes,
      message: "Get All Notes",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

router.get("/admin/allnotes", fetchuser, authorizeRoles("admin"), async (req, res) => {
  try {
    const Notes = await notes.find().populate("user", "name email role");
    res.status(200).json({
      data: Notes,
      message: "Admin fetched all notes",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

//get notes by a single id
router.get("/:id", async (req, res) => {
  const Notes = await notes.findById(req.params.id);
  console.log("Notes", Notes);
  if (!Notes) {
    return res.status(404).json({ message: "No Note Found" });
  }
  {
    res.status(200).json({
      data: Notes,
      message: "Get Notes by single Id",
    });
  }
});

//Update Note
router.put(
  "/updatenote/:id",
  fetchuser,
  [
    body("Title", "Enter valid title").isLength({ min: 5 }),
    body("Content", "Content atleast 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      //allow  updation if user owns the note
      const Note = await notes.findById(req.params.id);

      if (!Note) {
        return res.status(404).json({
          message: "Note not found",
        });
      }

      if (Note.user.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(401).send("Not Allowed");
      }
      const Notes = await notes.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      console.log("Note updated", Notes);
      res.status(201).json({
        data: Notes,
        message: "Notes are Update",
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  },
);

//Delete Note
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const Note = await notes.findById(req.params.id);
    if (!Note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (Note.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).send("Not Allowed");
    }
    const delNotes = await notes.findByIdAndDelete(req.params.id, req.body, {
      new: true,
    });

    console.log("Notes deleted", delNotes);
    res.status(201).json({
      data: delNotes,
      message: "Note deleted",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

module.exports = router;
