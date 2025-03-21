import React from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";

const BlogList = ({ posts }) => {
  return (
    <div className="blog-container">
      <div className="blog-list">
        {posts.map((post) => (
          <div className="blog-post" key={post._id}>
            {/* ✅ Ensure correct image path */}
            {post.filePath && (
              <img src={post.filePath} alt={post.title} className="blog-image" />
            )}
            <div className="blog-content">
              <h2 className="blog-title">
                <Link to={`/post/${post._id}`}>{post.title}</Link>
              </h2>
              <p className="blog-meta">
                <strong>{post.author?.email || "Unknown"}</strong> {/* ✅ Show Email */}
                {" · " + new Date(post.createdAt).toLocaleString()}
              </p>
              <p className="blog-summary">{post.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
