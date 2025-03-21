import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/App.css";

const CreatePost = ({ isOpen, onClose, addPost }) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("content", content);
    if (file) formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // After successful post creation, update the blog list in the parent component
      addPost(response.data); // Pass new post data to addPost

      onClose(); // Close modal
    } catch (err) {
      console.error("Error:", err.response?.data?.error || err.message);
      alert(err.response?.data?.error || "Failed to create post.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="text" placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} required />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <ReactQuill value={content} onChange={setContent} />
          <button type="submit">Publish</button>
          <button type="button" className="close-btn" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
