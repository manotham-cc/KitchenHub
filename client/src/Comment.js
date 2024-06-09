import { useState, useEffect } from "react";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetch(`http://localhost:4000/comments/${postId}`)
      .then(response => response.json())
      .then(data => setComments(data));
  }, [postId]);

  async function addComment(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/comment', {
      method: 'POST',
      body: JSON.stringify({ postId, content: newComment }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    if (response.ok) {
      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment('');
    }
  }

  return (
    <div className="comments">
      <form onSubmit={addComment}>
        <textarea
          value={newComment}
          onChange={ev => setNewComment(ev.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">Add Comment</button>
      </form>
      {comments.length > 0 && comments.map(comment => (
        <div key={comment._id} className="comment">
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
}