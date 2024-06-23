import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import Editor from '../Editor';
export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  async function createNewPost(e) {
    e.preventDefault();

    const data = new FormData();
    data.append('title', title);
    data.append('summary', summary);
    data.append('content', content);
    data.append('category', category); 
    data.append('file', files[0]);

    try {
      const response = await fetch('http://localhost:5000/post', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        setRedirect(true);
      }
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
  }

  if (redirect) {
    navigate("/");
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setFiles(e.target.files)}
      />
      <Editor onChange={setContent} value={content} />
      <button type="submit" style={{ marginTop: '5px' }}>Create Post</button>
    </form>
  );
}
