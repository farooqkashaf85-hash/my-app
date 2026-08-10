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

const getPagedNotes = async (req, res, isAdminRoute = false) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = (req.query.keyword || "").trim();
    const skip = (page - 1) * limit;

    const query = {};
    if (!isAdminRoute) {
      query.user = req.user.id;
    }

    if (keyword) {
      query.$or = [
        { Title: { $regex: keyword, $options: "i" } },
        { Content: { $regex: keyword, $options: "i" } },
      ];
    }

    const total = await notes.countDocuments(query);
    const pages = Math.ceil(total / limit) || 1;
    let noteQuery = notes.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    if (isAdminRoute) {
      noteQuery = noteQuery.populate("user", "name email role");
    }

    const Notes = await noteQuery;

    res.status(200).json({
      data: Notes,
      message: isAdminRoute ? "Admin fetched notes" : "Get All Notes",
      pagination: {
        total,
        page,
        limit,
        pages,
        hasNextPage: page < pages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
};

//get all notes.Login rquired
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  await getPagedNotes(req, res, false);
});

router.get("/search", fetchuser, async (req, res) => {
  await getPagedNotes(req, res, false);
});

router.get("/admin/allnotes", fetchuser, authorizeRoles("admin"), async (req, res) => {
  await getPagedNotes(req, res, true);
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
