import { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:4000/comments/${postId}`)
      .then(response => response.json())
      .then(data => setComments(data))
      .catch(err => console.error('Error fetching comments:', err));
  }, [postId]);

  async function addComment(ev) {
    ev.preventDefault();

    const response = await fetch('http://localhost:4000/comment', {
      method: 'POST',
      body: JSON.stringify({ content, postId }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (response.ok) {
      const newComment = await response.json();
      // Update the comments state with the new comment including the author information
      setComments([...comments, { ...newComment, author: { username: userInfo.username } }]);
      setContent('');
    } else {
      const errorData = await response.json();
      console.error('Error posting comment:', errorData.error);
    }
  }

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {userInfo && (
        <form onSubmit={addComment}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Add a comment..."
          ></textarea>
          <button type="submit">Post Comment</button>
        </form>
      )}
      <div className="comments">
        {comments.map(comment => (
          <div key={comment._id} className="comment">
            <p><strong>{comment.author.username}</strong>: {comment.content}</p>
            <time>{new Date(comment.createdAt).toLocaleString()}</time>
          </div>
        ))}
      </div>
    </div>
  );
}