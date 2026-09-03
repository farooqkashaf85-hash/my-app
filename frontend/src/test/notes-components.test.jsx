import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch, useSelector } from "react-redux";
import Addnote from "../components/Addnote";
import { addNote } from "../store/notesSlice";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("../store/notesSlice", () => ({
  addNote: jest.fn((note) => ({ type: "notes/add", note })),
}));

jest.mock("../socket", () => ({
  on: jest.fn(),
  off: jest.fn(),
}));

describe("Addnote", () => {
  test("keeps Add Note disabled until both fields are valid", async () => {
    const user = userEvent.setup();
    const dispatch = jest.fn();
    const showAlert = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockReturnValue([]);
    render(<Addnote showAlert={showAlert} />);

    const button = screen.getByRole("button", { name: "Add Note" });
    expect(button).toBeDisabled();

    await user.type(screen.getByLabelText("Title"), "A valid title");
    await user.type(screen.getByLabelText("Content"), "Useful content");
    expect(button).toBeEnabled();

    await user.click(button);
    expect(addNote).toHaveBeenCalledWith({ Title: "A valid title", Content: "Useful content" });
    expect(dispatch).toHaveBeenCalledWith({
      type: "notes/add",
      note: { Title: "A valid title", Content: "Useful content" },
    });
    expect(showAlert).toHaveBeenCalledWith("Note added successfully", "success");
  });
});