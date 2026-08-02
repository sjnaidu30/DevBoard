import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [standups, setStandups] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const teamId = 1;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userRes, standupsRes] = await Promise.all([
          axios.get("http://localhost:5000/auth/me"),
          axios.get(`http://localhost:5000/api/standups/team/${teamId}`),
        ]);

        setUser(userRes.data.user);
        setStandups(standupsRes.data.standups);
        setDate(standupsRes.data.date);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    await axios.get("http://localhost:5000/auth/logout");
    navigate("/login");
  };

  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "40vh" }}>
        Loading...
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a1a2e",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#16213e",
          padding: "16px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #333",
        }}
      >
        <h1 style={{ color: "white", margin: 0, fontSize: "20px" }}>
          DevBoard
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {user && (
            <>
              <img
                src={user.avatar_url}
                alt="avatar"
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
              />
              <span style={{ color: "#888" }}>{user.name}</span>
            </>
          )}
          <button
            onClick={() => navigate("/standup")}
            style={{
              backgroundColor: "#0f3460",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            My Standup
          </button>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              color: "#888",
              border: "1px solid #333",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ color: "white", margin: "0 0 8px 0" }}>Team Standups</h2>
          <p style={{ color: "#888", margin: 0 }}>{date}</p>
        </div>

        {standups.length === 0 ? (
          <div
            style={{
              backgroundColor: "#16213e",
              padding: "40px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#888" }}>No standups submitted yet today.</p>
            <button
              onClick={() => navigate("/standup")}
              style={{
                marginTop: "16px",
                backgroundColor: "#0f3460",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Submit Your Standup
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {standups.map((standup) => (
              <div
                key={standup.id}
                style={{
                  backgroundColor: "#16213e",
                  borderRadius: "8px",
                  padding: "24px",
                  border: "1px solid #333",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <img
                    src={standup.avatar_url}
                    alt={standup.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                  />
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {standup.name}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "#888",
                        fontSize: "12px",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                      }}
                    >
                      Yesterday
                    </p>
                    <p style={{ color: "white", fontSize: "14px", margin: 0 }}>
                      {standup.yesterday}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#888",
                        fontSize: "12px",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                      }}
                    >
                      Today
                    </p>
                    <p style={{ color: "white", fontSize: "14px", margin: 0 }}>
                      {standup.today}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#888",
                        fontSize: "12px",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                      }}
                    >
                      Blockers
                    </p>
                    <p
                      style={{
                        color: standup.blockers ? "#ff6b6b" : "#888",
                        fontSize: "14px",
                        margin: 0,
                      }}
                    >
                      {standup.blockers || "None"}
                    </p>
                  </div>
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
