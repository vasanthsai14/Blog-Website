import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [category, setCategory] = useState('');
  useEffect(() => {
    // Fetch token from where you store it (e.g., local storage, context, etc.)
    const storedToken = localStorage.getItem('yourCustomKey'); // Change 'yourCustomKey' to your actual storage key

    fetch(`http://localhost:5000/post/${id}`, {
      headers: {
        'Authorization': `Bearer ${storedToken}`,
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(postInfo => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
        setCategory(postInfo.category || '');
      });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    data.set('category', category);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }

    try {
      const storedToken = localStorage.getItem('yourCustomKey'); // Change 'yourCustomKey' to your actual storage key
      const response = await fetch(`http://localhost:5000/post/${id}`, {
        method: 'PUT',
        body: data,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        setRedirect(true);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/' + id} />;
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="title"
        placeholder={'Title'}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={'Summary'}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(ev) => setCategory(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: '5px' }}>Update post</button>
      
    </form>
  );
}
