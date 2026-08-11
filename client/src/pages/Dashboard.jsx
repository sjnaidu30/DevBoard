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
  content: { maxWidth: "860px", margin: "0 auto", padding: "32px 24px" },
  pageHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  pageTitle: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#e6edf3",
    margin: "0 0 2px",
  },
  pageDate: { fontSize: "13px", color: "#8b949e", margin: 0 },
  liveIndicator: { display: "flex", alignItems: "center", gap: "6px" },
  liveDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#3fb950",
    boxShadow: "0 0 6px rgba(63,185,80,0.4)",
  },
  liveText: { fontSize: "12px", color: "#8b949e" },
  cardList: { display: "flex", flexDirection: "column", gap: "8px" },
  card: {
    background: "#161b22",
    border: "0.5px solid #30363d",
    borderRadius: "10px",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "12px 16px",
    borderBottom: "0.5px solid #30363d",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardUser: { display: "flex", alignItems: "center", gap: "8px" },
  cardName: { fontSize: "13px", fontWeight: "500", color: "#e6edf3" },
  badge: {
    fontSize: "11px",
    background: "rgba(63,185,80,0.1)",
    color: "#3fb950",
    padding: "2px 8px",
    borderRadius: "99px",
    border: "0.5px solid rgba(63,185,80,0.3)",
  },
  cardGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr" },
  cardCell: (last) => ({
    padding: "12px 16px",
    borderRight: last ? "none" : "0.5px solid #30363d",
  }),
  cellLabel: {
    fontSize: "10px",
    color: "#8b949e",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: "0 0 6px",
    fontWeight: "500",
  },
  cellValue: (danger) => ({
    fontSize: "13px",
    color: danger ? "#f85149" : "#8b949e",
    margin: 0,
    lineHeight: "1.5",
  }),
  emptyState: {
    background: "#161b22",
    border: "0.5px solid #30363d",
    borderRadius: "10px",
    padding: "40px",
    textAlign: "center",
  },
  emptyText: { fontSize: "13px", color: "#8b949e", margin: "0 0 16px" },
  select: {
    background: "#161b22",
    border: "0.5px solid #30363d",
    color: "#8b949e",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
  },
};

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [standups, setStandups] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userRes, teamsRes] = await Promise.all([
          axios.get(`${API}/auth/me`),
          axios.get(`${API}/api/standups/my-teams`),
        ]);
        setUser(userRes.data.user);
        setTeams(teamsRes.data.teams);
        if (teamsRes.data.teams.length > 0) {
          const firstTeamId = teamsRes.data.teams[0].id;
          setSelectedTeamId(firstTeamId);
          const standupsRes = await axios.get(
            `${API}/api/standups/team/${firstTeamId}`,
          );
          setStandups(standupsRes.data.standups);
          setDate(standupsRes.data.date);
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleTeamChange = async (teamId) => {
    setSelectedTeamId(teamId);
    try {
      const res = await axios.get(`${API}/api/standups/team/${teamId}`);
      setStandups(res.data.standups);
      setDate(res.data.date);
    } catch (err) {
      console.error("Error switching team:", err);
    }
  };

  const handleLogout = async () => {
    await axios.get(`${API}/auth/logout`);
    navigate("/login");
  };

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

  return (
    <div style={styles.page}>
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
          <span
            style={{ fontSize: "14px", fontWeight: "500", color: "#e6edf3" }}
          >
            DevBoard
          </span>
        </div>
        <div style={styles.nav}>
          {user && (
            <img src={user.avatar_url} alt="avatar" style={styles.avatar} />
          )}
          {user && <span style={styles.userName}>{user.name}</span>}
          <button
            onClick={() => navigate("/standup")}
            style={styles.btnPrimary}
          >
            My standup
          </button>
          <button onClick={handleLogout} style={styles.btnGhost}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <div>
            <p style={styles.pageTitle}>Team standups</p>
            <p style={styles.pageDate}>
              {date &&
                new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                })}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {teams.length > 1 && (
              <select
                value={selectedTeamId || ""}
                onChange={(e) => handleTeamChange(Number(e.target.value))}
                style={styles.select}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
            <div style={styles.liveIndicator}>
              <div style={styles.liveDot} />
              <span style={styles.liveText}>
                {standups.length} update{standups.length !== 1 ? "s" : ""} today
              </span>
            </div>
          </div>
        </div>

        {standups.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No standups submitted yet today.</p>
            <button
              onClick={() => navigate("/standup")}
              style={styles.btnPrimary}
            >
              Submit your standup
            </button>
          </div>
        ) : (
          <div style={styles.cardList}>
            {standups.map((standup) => (
              <div key={standup.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardUser}>
                    <img
                      src={standup.avatar_url}
                      alt={standup.name}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                      }}
                    />
                    <span style={styles.cardName}>{standup.name}</span>
                  </div>
                  <span style={styles.badge}>posted</span>
                </div>
                <div style={styles.cardGrid}>
                  {[
                    {
                      label: "Yesterday",
                      value: standup.yesterday,
                      danger: false,
                    },
                    { label: "Today", value: standup.today, danger: false },
                    {
                      label: "Blockers",
                      value: standup.blockers || "None",
                      danger: !!standup.blockers,
                    },
                  ].map((item, i) => (
                    <div key={i} style={styles.cardCell(i === 2)}>
                      <p style={styles.cellLabel}>{item.label}</p>
                      <p style={styles.cellValue(item.danger)}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
