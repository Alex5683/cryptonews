import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  content: string;
  status: 'pending' | 'approved' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'BlogPost',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'deleted'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);