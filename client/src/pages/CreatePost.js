import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { Navigate } from "react-router-dom";

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['link', 'image', 'video'],
        [{ color: [] }, { background: [] }],
        ['clean'],
    ],
};

const formats = [
    'bold', 'italic', 'underline', 'strike',
    'align', 'list', 'indent',
    'size', 'header',
    'link', 'image', 'video',
    'color', 'background',
    'clean',
];

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState(null);
    const [redirect, setRedirect] = useState(false);

    async function createNewPost(ev) {
        ev.preventDefault();
        
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        if (files && files.length > 0) {
            data.append('file', files[0]);
        }

        try {
            const response = await fetch('http://localhost:4000/post', {
                method: 'POST',
                body: data,
                credentials: 'include',
            });

            if (response.ok) {
                setRedirect(true);
            } else {
                // Handle error
                console.error('Failed to create post');
                alert('Failed to create post');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred while creating the post');
        }
    }

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <form onSubmit={createNewPost}>
            <input 
                type="text"
                placeholder="Title"
                value={title}
                onChange={ev => setTitle(ev.target.value)} 
            />
            <input 
                type="text"
                placeholder="Summary"
                value={summary}
                onChange={ev => setSummary(ev.target.value)} 
            />
            <input 
                type="file"
                onChange={ev => setFiles(ev.target.files)} 
            />
            <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
            />
            <button type="submit" style={{ marginTop: '5px' }}>
                Create post
            </button>
        </form>
    );
}
