import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000";

function Standup() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [commits, setCommits] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [existingStandup, setExistingStandup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ yesterday: "", today: "", blockers: "" });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userRes, commitsRes, standupRes, teamsRes] = await Promise.all([
          axios.get(`${API}/auth/me`),
          axios.get(`${API}/api/commits/yesterday`),
          axios.get(`${API}/api/standups/today`),
          axios.get(`${API}/api/standups/my-teams`),
        ]);
        setUser(userRes.data.user);
        setCommits(commitsRes.data.commits);
        setTeams(teamsRes.data.teams);
        if (teamsRes.data.teams.length > 0) {
          setSelectedTeamId(teamsRes.data.teams[0].id);
        }
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
    if (!selectedTeamId) {
      alert("No team found. Please contact your manager.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/standups`, {
        ...form,
        team_id: selectedTeamId,
      });
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "#161b22",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "12px",
    color: "#f9fafb",
    fontSize: "14px",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    outline: "none",
    lineHeight: "1.6",
  };

  const labelStyle = {
    color: "#6b7280",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
  };

  const Header = () => (
    <div
      style={{
        background: "#111827",
        borderBottom: "0.5px solid rgba(255,255,255,0.06)",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            background: "#2563eb",
            borderRadius: "7px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </div>
        <span style={{ color: "#f9fafb", fontWeight: "600", fontSize: "15px" }}>
          DevBoard
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {user && (
          <img
            src={user.avatar_url}
            alt="avatar"
            style={{ width: "28px", height: "28px", borderRadius: "50%" }}
          />
        )}
        {user && (
          <span style={{ color: "#9ca3af", fontSize: "13px" }}>
            {user.name}
          </span>
        )}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "transparent",
            border: "0.5px solid rgba(255,255,255,0.1)",
            color: "#9ca3af",
            padding: "6px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Dashboard
        </button>
      </div>
    </div>
  );

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0d1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#6b7280", fontSize: "14px" }}>Loading...</p>
      </div>
    );

  if (alreadySubmitted)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0d1117",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <Header />
        <div
          style={{ maxWidth: "600px", margin: "48px auto", padding: "0 24px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                background: "rgba(16,185,129,0.15)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2
              style={{
                color: "#f9fafb",
                fontSize: "18px",
                fontWeight: "500",
                margin: 0,
              }}
            >
              Standup submitted
            </h2>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>today</span>
          </div>
          <div
            style={{
              background: "#111827",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {[
              { label: "Yesterday", value: existingStandup.yesterday },
              { label: "Today", value: existingStandup.today },
              { label: "Blockers", value: existingStandup.blockers || "None" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "20px 24px",
                  borderBottom:
                    i < 2 ? "0.5px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <p style={{ ...labelStyle, marginBottom: "6px" }}>
                  {item.label}
                </p>
                <p
                  style={{
                    color:
                      item.label === "Blockers" && existingStandup.blockers
                        ? "#f87171"
                        : "#d1d5db",
                    fontSize: "14px",
                    margin: 0,
                    lineHeight: "1.6",
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              marginTop: "16px",
              background: "#1d4ed8",
              border: "none",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            View team dashboard →
          </button>
        </div>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <Header />
      <div
        style={{ maxWidth: "600px", margin: "48px auto", padding: "0 24px" }}
      >
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              color: "#f9fafb",
              fontSize: "22px",
              fontWeight: "500",
              margin: "0 0 6px",
              letterSpacing: "-0.01em",
            }}
          >
            Daily standup
          </h1>
          <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {teams.length > 1 && (
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Posting for team</label>
            <select
              value={selectedTeamId || ""}
              onChange={(e) => setSelectedTeamId(Number(e.target.value))}
              style={{ ...inputStyle, resize: "none", cursor: "pointer" }}
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {commits.length > 0 && (
          <div
            style={{
              background: "#111827",
              border: "0.5px solid rgba(37,99,235,0.2)",
              borderRadius: "10px",
              padding: "16px 20px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
              </svg>
              <span
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Yesterday's commits
              </span>
            </div>
            {commits.map((commit, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  marginBottom: i < commits.length - 1 ? "8px" : 0,
                }}
              >
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#3b82f6",
                    marginTop: "6px",
                    flexShrink: 0,
                  }}
                />
                <a
                  href={commit.commit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#9ca3af",
                    fontSize: "13px",
                    textDecoration: "none",
                    lineHeight: 1.5,
                  }}
                >
                  {commit.message}{" "}
                  <span style={{ color: "#4b5563" }}>· {commit.repo}</span>
                </a>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={labelStyle}>What did you do yesterday?</label>
            <textarea
              value={form.yesterday}
              onChange={(e) => setForm({ ...form, yesterday: e.target.value })}
              rows={3}
              placeholder="Describe what you worked on..."
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>What will you do today?</label>
            <textarea
              value={form.today}
              onChange={(e) => setForm({ ...form, today: e.target.value })}
              rows={3}
              placeholder="Describe your plan for today..."
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Any blockers?</label>
            <textarea
              value={form.blockers}
              onChange={(e) => setForm({ ...form, blockers: e.target.value })}
              rows={2}
              placeholder="Leave empty if none..."
              style={inputStyle}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              background: submitting ? "#1e3a5f" : "#1d4ed8",
              border: "0.5px solid #2563eb",
              color: "#fff",
              padding: "13px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: submitting ? "not-allowed" : "pointer",
              width: "100%",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Submitting..." : "Submit standup →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Standup;
