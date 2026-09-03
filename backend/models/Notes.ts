import { Document, model, Schema, Types } from "mongoose";

export interface NoteDocument extends Document {
  user: Types.ObjectId;
  Title: string;
  Content: string;
  date: string;
}

const noteSchema = new Schema<NoteDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    Title: { type: String, required: true },
    Content: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true },
);

export default model<NoteDocument>("Mynotes", noteSchema);