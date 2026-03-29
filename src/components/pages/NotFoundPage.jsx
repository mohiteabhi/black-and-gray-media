import React from "react";
import { Link } from "react-router-dom";

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: "#fff",
    textAlign: "center",
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
  },
  code: {
    fontSize: "clamp(7rem, 20vw, 14rem)",
    fontWeight: "900",
    lineHeight: 1,
    background: "linear-gradient(135deg, #ffffff 30%, #555 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.02em",
    marginBottom: "0.25rem",
    userSelect: "none",
  },
  divider: {
    width: "60px",
    height: "3px",
    background: "linear-gradient(90deg, #888, #fff, #888)",
    border: "none",
    borderRadius: "2px",
    margin: "1.5rem auto",
  },
  heading: {
    fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
    fontWeight: "600",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#ccc",
    marginBottom: "1rem",
  },
  description: {
    fontSize: "1rem",
    color: "#888",
    maxWidth: "380px",
    lineHeight: "1.7",
    marginBottom: "2.5rem",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 2rem",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "4px",
    color: "#fff",
    textDecoration: "none",
    fontSize: "0.9rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: "500",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(8px)",
    transition: "all 0.3s ease",
  },
};

export default function NotFoundPage() {
  return (
    <div style={styles.container}>
      <div style={styles.code}>404</div>
      <hr style={styles.divider} />
      <h1 style={styles.heading}>Page Not Found</h1>
      <p style={styles.description}>
        The page you're looking for doesn't exist or has been moved. Let's get
        you back on track.
      </p>
      <Link
        to="/"
        style={styles.button}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
        }}
      >
        ← Back to Home
      </Link>
    </div>
  );
}
