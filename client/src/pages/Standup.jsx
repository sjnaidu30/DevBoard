import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Standup() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [commits, setCommits] = useState([]);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [existingStandup, setExistingStandup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    yesterday: "",
    today: "",
    blockers: "",
    team_id: 1,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userRes, commitsRes, standupRes] = await Promise.all([
          axios.get("http://localhost:5000/auth/me"),
          axios.get("http://localhost:5000/api/commits/yesterday"),
          axios.get("http://localhost:5000/api/standups/today"),
        ]);

        setUser(userRes.data.user);
        setCommits(commitsRes.data.commits);

        if (standupRes.data.submitted) {
          setAlreadySubmitted(true);
          setExistingStandup(standupRes.data.standup);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async () => {
    if (!form.yesterday || !form.today) {
      alert("Please fill in yesterday and today fields");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/standups", form);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "40vh" }}>
        Loading...
      </div>
    );

  if (alreadySubmitted)
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#1a1a2e",
          padding: "40px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ color: "#4CAF50" }}>✓ Standup submitted for today</h2>
          <div
            style={{
              backgroundColor: "#16213e",
              padding: "24px",
              borderRadius: "8px",
              marginTop: "20px",
            }}
          >
            <p style={{ color: "#888", marginBottom: "8px" }}>Yesterday</p>
            <p style={{ color: "white" }}>{existingStandup.yesterday}</p>
            <p
              style={{ color: "#888", marginBottom: "8px", marginTop: "16px" }}
            >
              Today
            </p>
            <p style={{ color: "white" }}>{existingStandup.today}</p>
            <p
              style={{ color: "#888", marginBottom: "8px", marginTop: "16px" }}
            >
              Blockers
            </p>
            <p style={{ color: "white" }}>
              {existingStandup.blockers || "None"}
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              marginTop: "20px",
              backgroundColor: "#0f3460",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            View Dashboard
          </button>
        </div>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a1a2e",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <h1 style={{ color: "white", margin: 0 }}>Daily Standup</h1>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={user.avatar_url}
                alt="avatar"
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
              />
              <span style={{ color: "#888" }}>{user.name}</span>
            </div>
          )}
        </div>

        {commits.length > 0 && (
          <div
            style={{
              backgroundColor: "#16213e",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{ color: "#888", margin: "0 0 12px 0", fontSize: "14px" }}
            >
              YESTERDAY'S COMMITS
            </h3>
            {commits.map((commit, i) => (
              <div key={i} style={{ marginBottom: "8px" }}>
                <a
                  href={commit.commit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#4a9eff",
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                >
                  {commit.message}
                </a>
                <span
                  style={{ color: "#555", fontSize: "12px", marginLeft: "8px" }}
                >
                  {commit.repo}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label
              style={{
                color: "#888",
                fontSize: "14px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              What did you do yesterday?
            </label>
            <textarea
              value={form.yesterday}
              onChange={(e) => setForm({ ...form, yesterday: e.target.value })}
              rows={3}
              style={{
                width: "100%",
                backgroundColor: "#16213e",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "12px",
                color: "white",
                fontSize: "14px",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                color: "#888",
                fontSize: "14px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              What will you do today?
            </label>
            <textarea
              value={form.today}
              onChange={(e) => setForm({ ...form, today: e.target.value })}
              rows={3}
              style={{
                width: "100%",
                backgroundColor: "#16213e",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "12px",
                color: "white",
                fontSize: "14px",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                color: "#888",
                fontSize: "14px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Any blockers?
            </label>
            <textarea
              value={form.blockers}
              onChange={(e) => setForm({ ...form, blockers: e.target.value })}
              rows={2}
              style={{
                width: "100%",
                backgroundColor: "#16213e",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "12px",
                color: "white",
                fontSize: "14px",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              backgroundColor: submitting ? "#333" : "#0f3460",
              color: "white",
              border: "none",
              padding: "14px",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: submitting ? "not-allowed" : "pointer",
              width: "100%",
            }}
          >
            {submitting ? "Submitting..." : "Submit Standup"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Standup;
