import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0d1117",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: "#e6edf3",
  },
  header: {
    background: "#161b22",
    borderBottom: "0.5px solid #30363d",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { display: "flex", alignItems: "center", gap: "8px" },
  logoIcon: {
    width: "24px",
    height: "24px",
    background: "#1f6feb",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  nav: { display: "flex", alignItems: "center", gap: "8px" },
  avatar: { width: "24px", height: "24px", borderRadius: "50%" },
  userName: { fontSize: "13px", color: "#8b949e" },
  btnPrimary: {
    background: "#1f6feb",
    border: "0.5px solid #388bfd",
    color: "#fff",
    padding: "5px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
  },
  btnGhost: {
    background: "transparent",
    border: "0.5px solid #30363d",
    color: "#8b949e",
    padding: "5px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },
  content: { maxWidth: "580px", margin: "0 auto", padding: "32px 24px" },
  pageTitle: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#e6edf3",
    margin: "0 0 2px",
  },
  pageDate: { fontSize: "13px", color: "#8b949e", margin: "0 0 24px" },
  label: {
    fontSize: "10px",
    color: "#8b949e",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    display: "block",
    marginBottom: "6px",
    fontWeight: "500",
  },
  textarea: {
    width: "100%",
    background: "#161b22",
    border: "0.5px solid #30363d",
    borderRadius: "6px",
    padding: "10px 12px",
    color: "#e6edf3",
    fontSize: "13px",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    outline: "none",
    lineHeight: "1.6",
  },
  formGroup: { marginBottom: "16px" },
  commitsBox: {
    background: "#161b22",
    border: "0.5px solid #30363d",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "20px",
  },
  commitsLabel: {
    fontSize: "10px",
    color: "#8b949e",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: "0 0 10px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  commitItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginBottom: "6px",
  },
  commitDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "#1f6feb",
    marginTop: "6px",
    flexShrink: 0,
  },
  submitBtn: (disabled) => ({
    background: disabled ? "#1a2332" : "#1f6feb",
    border: "0.5px solid #388bfd",
    color: disabled ? "#8b949e" : "#fff",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: disabled ? "not-allowed" : "pointer",
    width: "100%",
    opacity: disabled ? 0.6 : 1,
    marginTop: "8px",
  }),
  successBox: {
    background: "#161b22",
    border: "0.5px solid #30363d",
    borderRadius: "10px",
    overflow: "hidden",
  },
  successCell: (last) => ({
    padding: "14px 16px",
    borderBottom: last ? "none" : "0.5px solid #30363d",
  }),
};

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
        if (teamsRes.data.teams.length > 0)
          setSelectedTeamId(teamsRes.data.teams[0].id);
        if (standupRes.data.submitted) {
          setAlreadySubmitted(true);
          setExistingStandup(standupRes.data.standup);
        }
      } catch (err) {
        console.error("Error loading:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async () => {
    if (!form.yesterday || !form.today) {
      alert("Please fill in yesterday and today");
      return;
    }
    if (!selectedTeamId) {
      alert("No team found");
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

  const Header = () => (
    <div style={styles.header}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </div>
        <span style={{ fontSize: "14px", fontWeight: "500", color: "#e6edf3" }}>
          DevBoard
        </span>
      </div>
      <div style={styles.nav}>
        {user && (
          <img src={user.avatar_url} alt="avatar" style={styles.avatar} />
        )}
        {user && <span style={styles.userName}>{user.name}</span>}
        <button onClick={() => navigate("/dashboard")} style={styles.btnGhost}>
          Dashboard
        </button>
      </div>
    </div>
  );

  if (loading)
    return (
      <div
        style={{
          ...styles.page,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#8b949e", fontSize: "13px" }}>Loading...</p>
      </div>
    );

  if (alreadySubmitted)
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.content}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3fb950"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p style={{ ...styles.pageTitle, margin: 0 }}>Standup submitted</p>
            <span style={{ fontSize: "12px", color: "#8b949e" }}>today</span>
          </div>
          <div style={styles.successBox}>
            {[
              { label: "Yesterday", value: existingStandup.yesterday },
              { label: "Today", value: existingStandup.today },
              { label: "Blockers", value: existingStandup.blockers || "None" },
            ].map((item, i) => (
              <div key={i} style={styles.successCell(i === 2)}>
                <p style={styles.label}>{item.label}</p>
                <p
                  style={{
                    fontSize: "13px",
                    color:
                      item.label === "Blockers" && existingStandup.blockers
                        ? "#f85149"
                        : "#8b949e",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ ...styles.btnPrimary, marginTop: "16px" }}
          >
            View team dashboard →
          </button>
        </div>
      </div>
    );

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.content}>
        <p style={styles.pageTitle}>Daily standup</p>
        <p style={styles.pageDate}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>

        {teams.length > 1 && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Posting for team</label>
            <select
              value={selectedTeamId || ""}
              onChange={(e) => setSelectedTeamId(Number(e.target.value))}
              style={{
                ...styles.textarea,
                resize: "none",
                cursor: "pointer",
                padding: "8px 12px",
              }}
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {commits.length > 0 && (
          <div style={styles.commitsBox}>
            <p style={styles.commitsLabel}>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8b949e"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
              </svg>
              Yesterday's commits
            </p>
            {commits.map((c, i) => (
              <div key={i} style={styles.commitItem}>
                <div style={styles.commitDot} />
                <a
                  href={c.commit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "12px",
                    color: "#8b949e",
                    textDecoration: "none",
                    lineHeight: 1.5,
                  }}
                >
                  {c.message}{" "}
                  <span style={{ color: "#484f58" }}>· {c.repo}</span>
                </a>
              </div>
            ))}
          </div>
        )}

        <div style={styles.formGroup}>
          <label style={styles.label}>What did you do yesterday?</label>
          <textarea
            value={form.yesterday}
            onChange={(e) => setForm({ ...form, yesterday: e.target.value })}
            rows={3}
            placeholder="Describe what you worked on..."
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>What will you do today?</label>
          <textarea
            value={form.today}
            onChange={(e) => setForm({ ...form, today: e.target.value })}
            rows={3}
            placeholder="Describe your plan for today..."
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Any blockers?</label>
          <textarea
            value={form.blockers}
            onChange={(e) => setForm({ ...form, blockers: e.target.value })}
            rows={2}
            placeholder="Leave empty if none..."
            style={styles.textarea}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={styles.submitBtn(submitting)}
        >
          {submitting ? "Submitting..." : "Submit standup →"}
        </button>
      </div>
    </div>
  );
}

export default Standup;
