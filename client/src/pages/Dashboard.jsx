import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000";

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Header */}
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
          <span
            style={{ color: "#f9fafb", fontWeight: "600", fontSize: "15px" }}
          >
            DevBoard
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user && (
            <>
              <img
                src={user.avatar_url}
                alt="avatar"
                style={{ width: "28px", height: "28px", borderRadius: "50%" }}
              />
              <span style={{ color: "#9ca3af", fontSize: "13px" }}>
                {user.name}
              </span>
            </>
          )}
          <button
            onClick={() => navigate("/standup")}
            style={{
              background: "#1d4ed8",
              border: "0.5px solid #2563eb",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            My Standup
          </button>
          <button
            onClick={handleLogout}
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
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}
      >
        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "32px",
          }}
        >
          <div>
            <h1
              style={{
                color: "#f9fafb",
                fontSize: "22px",
                fontWeight: "500",
                margin: "0 0 4px",
                letterSpacing: "-0.01em",
              }}
            >
              Team Standups
            </h1>
            <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
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
                style={{
                  background: "#111827",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  color: "#9ca3af",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 8px rgba(16,185,129,0.5)",
                }}
              />
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                {standups.length} update{standups.length !== 1 ? "s" : ""} today
              </span>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {standups.length === 0 ? (
          <div
            style={{
              background: "#111827",
              border: "0.5px solid rgba(255,255,255,0.06)",
              borderRadius: "12px",
              padding: "48px",
              textAlign: "center",
            }}
          >
            <p
              style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 16px" }}
            >
              No standups submitted yet today.
            </p>
            <button
              onClick={() => navigate("/standup")}
              style={{
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
              Submit your standup
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {standups.map((standup) => (
              <div
                key={standup.id}
                style={{
                  background: "#111827",
                  border: "0.5px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    padding: "16px 24px",
                    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <img
                      src={standup.avatar_url}
                      alt={standup.name}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                      }}
                    />
                    <span
                      style={{
                        color: "#f9fafb",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      {standup.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      background: "rgba(16,185,129,0.1)",
                      color: "#10b981",
                      padding: "3px 10px",
                      borderRadius: "99px",
                      border: "0.5px solid rgba(16,185,129,0.25)",
                    }}
                  >
                    posted
                  </span>
                </div>

                {/* Card body */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                  }}
                >
                  {[
                    {
                      label: "Yesterday",
                      value: standup.yesterday,
                      highlight: false,
                    },
                    { label: "Today", value: standup.today, highlight: false },
                    {
                      label: "Blockers",
                      value: standup.blockers || "None",
                      highlight: !!standup.blockers,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "16px 24px",
                        borderRight:
                          i < 2 ? "0.5px solid rgba(255,255,255,0.06)" : "none",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "10px",
                          color: "#6b7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          margin: "0 0 8px",
                          fontWeight: "500",
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          fontSize: "13px",
                          color: item.highlight ? "#f87171" : "#d1d5db",
                          margin: 0,
                          lineHeight: "1.6",
                        }}
                      >
                        {item.value}
                      </p>
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
