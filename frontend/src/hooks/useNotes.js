import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchNotes, addNote, deleteNote ,editNote , setKeyword} from '../store/notesSlice';

export const useNotes = () => {
  const dispatch = useDispatch();
  const notesState = useSelector((state) => state.notes);

  const loadNotes = useCallback((options) => dispatch(fetchNotes(options)), [dispatch]);
  const createNote = useCallback((note) => dispatch(addNote(note)), [dispatch]);
  const removeNote = useCallback((id) => dispatch(deleteNote(id)), [dispatch]);
  const updateNote = useCallback((note) => dispatch(editNote(note)), [dispatch]);
  const updateKeyword = useCallback((keyword) => dispatch(setKeyword(keyword)), [dispatch]);

  return {
    ...notesState,
    fetchNotes: loadNotes,
    addNote: createNote,
    deleteNote: removeNote,
    editNote: updateNote,
    setKeyword: updateKeyword,
  };
};
