import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  categoryId: mongoose.Types.ObjectId;
  tags?: string[];
  thumbnailUrl: string;
  metaTitle?: string;
  metaDescription?: string;
  authorId: mongoose.Types.ObjectId;
  isPublished: boolean;
  publishedAt?: Date;
  isFeatured?: boolean;
  views: number;
  likes: string[]; // user IDs
  commentsEnabled: boolean;
  commentsCount?: number;
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
  tags: [{
    type: String,
  }],
  thumbnailUrl: {
    type: String,
    required: true,
  },
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublished: {
    type: Boolean,
    required: true,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: String, // user IDs
  }],
  commentsEnabled: {
    type: Boolean,
    required: true,
    default: true,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
