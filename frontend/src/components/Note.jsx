import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Noteitem from "./Noteitem";
import { useDispatch, useSelector } from "react-redux";
import { editNote, fetchNotes, setKeyword } from "../store/notesSlice";
import Addnote from "./Addnote";
import socket from "../socket";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
const Note = (props) => {
  let navigate = useNavigate();
  const { showAlert } = props;
  const dispatch = useDispatch();
  const {
    items: notes,
    pagination,
    keyword,
  } = useSelector((state) => state.notes);
  const [currentPage, setCurrentPage] = useState(1);
  const loadingRef = useRef(false);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 400);
  const noteItems = useMemo(
    () => (Array.isArray(notes) ? notes : []),
    [notes],
  );

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchNotes({ page: currentPage, limit: 5, keyword }));
    } else {
      navigate("/login");
      showAlert("Please login to access your notes", "danger");
    }
  }, [currentPage, dispatch, keyword, navigate, showAlert]);
  loadingRef.current = false;
  useEffect(() => {
    dispatch(setKeyword(debouncedSearchText));
    setCurrentPage(1);
  }, [debouncedSearchText, dispatch]);
  const ref = useRef(null);
  const refclose = useRef(null);
  const [note, setNote] = useState({ id: "", eTitle: "", eContent: "" });
  const updateNote = useCallback((currentnote) => {
    ref.current.click();
    setNote({
      id: currentnote._id,
      eTitle: currentnote.Title,
      eContent: currentnote.Content,
    });
  }, []);

  const handleSubmit = useCallback(() => {
    console.log("Updating note", note);
    dispatch(
      editNote({ id: note.id, Title: note.eTitle, Content: note.eContent }),
    );
    refclose.current.click();
    showAlert("Note updated successfully", "success");
  }, [dispatch, note, showAlert]);
  useEffect(() => {
    socket.on("note updated", (data) => {
      toast.info(data.message);
    });
    return () => {
      socket.off("note updated");
    };
  }, []);
  const handleInput = useCallback((e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  }, [note]);
  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const changePage = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);
  useEffect(() => {
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 100 &&
      pagination.hasNextPage &&
      !loadingRef.current
    ) {
      loadingRef.current = true;
      setCurrentPage((prev) => prev + 1);
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [pagination.hasNextPage]);

  return (
    <>
      <Addnote showAlert={props.showAlert} />

      <button
        type="button"
        ref={ref}
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="Title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    name="eTitle"
                    value={note.eTitle}
                    className="form-control"
                    id="eTitle"
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
                    name="eContent"
                    value={note.eContent}
                    className="form-control"
                    id="eContent"
                    onChange={handleInput}
                    minLength={5}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={refclose}
              >
                Close
              </button>
              <button
                disabled={note.eTitle.length < 5 || note.eContent.length < 5}
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <h1>Your Notes</h1>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search notes"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <div className="container">
            {noteItems.length === 0 && "No notes to display"}
          </div>
          {Array.isArray(notes) ? (
            noteItems.map((Note) => {
              return (
                <Noteitem
                  key={Note._id}
                  updateNote={updateNote}
                  Note={Note}
                  showAlert={props.showAlert}
                />
              );
            })
          ) : (
            <div>Loading notes...</div>
          )}
           {/*
          {pagination.pages > 1 && (
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={pagination.page <= 1}
                onClick={() => changePage(pagination.page - 1)}
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={!pagination.hasNextPage}
                onClick={() => changePage(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
          */}
        </div>
      </div>
    </>
  );
};

export default Note;
