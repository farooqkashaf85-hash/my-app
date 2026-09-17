import {useDispatch, useSelector} from 'react-redux';
import {fetchNotes, addNote, deleteNote ,editNote , setKeyword} from '../store/notesSlice';

export const useNotes = () => {
  const dispatch = useDispatch();
  const notesState = useSelector((state) => state.notes);

  return {
    ...notesState,
    fetchNotes: () => dispatch(fetchNotes()),
    addNote: (note) => dispatch(addNote(note)),
    deleteNote: (id) => dispatch(deleteNote(id)),
    editNote: (note) => dispatch(editNote(note)),
    setKeyword: (keyword) => dispatch(setKeyword(keyword)),
  };
};
