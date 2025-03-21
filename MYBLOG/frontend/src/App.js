import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import CreatePost from "./components/CreatePost";
import BlogList from "./components/BlogList";
import PostDetail from "./components/PostDetail"; // 🆕 Import PostDetail component

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [posts, setPosts] = useState([]); // Holds all posts

  useEffect(() => {
    axios.get("http://localhost:5000/posts")
      .then(({ data }) => setPosts(data))
      .catch(err => console.error("Error fetching posts:", err));
  }, []);

  // Function to add new post to the list
  const addPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Adds new post at top
  };

  return (
    <Router>
      <Navbar user={user} setUser={setUser} setCreatePostOpen={setCreatePostOpen} />
      
      {isCreatePostOpen && user && (
        <CreatePost
          isOpen={isCreatePostOpen}
          onClose={() => setCreatePostOpen(false)}
          addPost={addPost} // Pass function to update posts
        />
      )}

      <Routes>
        {/* Home - Blog List */}
        <Route path="/" element={<BlogList posts={posts} />} />

        {/* Post Detail Page (Clicking on a blog opens this) */}
        <Route path="/post/:id" element={<PostDetail />} />

        {/* Login & Register Pages with Authentication Redirect */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
