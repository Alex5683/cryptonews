import { MessageCircle, User } from 'lucide-react';

interface Comment {
  _id: string;
  name: string;
  content: string;
  createdAt: string;
}

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment._id} className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{comment.name}</h4>
                <time className="text-sm text-gray-500">
                  {formatDate(comment.createdAt)}
                </time>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}