import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/App.css";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/posts/${id}`)
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="post-detail">
      <h1 className="post-title">{post.title}</h1>
      <p className="post-meta">
        {new Date(post.createdAt).toLocaleString()} by{" "}
        <strong>{post.author?.email || "Unknown"}</strong> {/* ✅ Show Email */}
      </p>

      {/* ✅ Fix Image Display */}
      {post.filePath && (
        <img
          src={post.filePath}
          alt={post.title}
          className="post-image"
        />
      )}

      {/* ✅ Fix Content Rendering */}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default PostDetail;
