import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  categoryId: mongoose.Types.ObjectId;
  thumbnailUrl: string;
  views: number;
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: String, // IP address or session ID
  }],
}, {
  timestamps: true,
});

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);