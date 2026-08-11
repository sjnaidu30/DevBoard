function Login() {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111827",
        display: "flex",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "56px 48px",
          maxWidth: "480px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "#2563eb",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="16"
              height="16"
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
            style={{ fontSize: "16px", fontWeight: "600", color: "#f9fafb" }}
          >
            DevBoard
          </span>
          <span
            style={{
              fontSize: "10px",
              background: "rgba(37,99,235,0.2)",
              color: "#60a5fa",
              padding: "2px 8px",
              borderRadius: "99px",
              border: "0.5px solid rgba(37,99,235,0.4)",
            }}
          >
            beta
          </span>
        </div>

        {/* Headline */}
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "600",
              color: "#f9fafb",
              margin: "0 0 12px",
              lineHeight: "1.25",
              letterSpacing: "-0.02em",
            }}
          >
            Standups that
            <br />
            <span style={{ color: "#3b82f6" }}>actually get read.</span>
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              lineHeight: "1.7",
              margin: 0,
            }}
          >
            Post your update in 60 seconds. GitHub commits surface
            automatically. Manager gets a digest at 9 AM — no meeting needed.
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "0",
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            marginBottom: "32px",
            overflow: "hidden",
          }}
        >
          {[
            { value: "60s", label: "to post", color: "#3b82f6" },
            { value: "9 AM", label: "digest sent", color: "#60a5fa" },
            { value: "0", label: "meetings", color: "#10b981" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "16px 8px",
                borderRight:
                  i < 2 ? "0.5px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: stat.color,
                  margin: "0 0 4px",
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: "11px", color: "#6b7280", margin: 0 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "13px 20px",
            background: "#1d4ed8",
            border: "0.5px solid #2563eb",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#fff",
            cursor: "pointer",
            transition: "background 0.15s",
            marginBottom: "12px",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#2563eb")}
          onMouseLeave={(e) => (e.target.style.background = "#1d4ed8")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Continue with GitHub
        </button>
        <p
          style={{
            fontSize: "11px",
            color: "#374151",
            textAlign: "center",
            margin: 0,
          }}
        >
          No password needed · just your GitHub account
        </p>
      </div>

      {/* Divider */}
      <div style={{ width: "0.5px", background: "rgba(255,255,255,0.06)" }} />

      {/* Right Panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          gap: "14px",
          background: "#0d1117",
        }}
      >
        {/* Commits card */}
        <div
          style={{
            width: "100%",
            maxWidth: "300px",
            background: "#161b22",
            border: "0.5px solid rgba(37,99,235,0.25)",
            borderRadius: "12px",
            padding: "16px",
            animation: "float1 4s ease-in-out infinite",
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
                fontSize: "10px",
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Yesterday's commits
            </span>
          </div>
          {[
            { msg: "feat: add GitHub OAuth strategy", color: "#3b82f6" },
            { msg: "fix: resolve dotenv path", color: "#60a5fa" },
            { msg: "chore: initialize project", color: "#10b981" },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                marginBottom: i < 2 ? "8px" : 0,
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: c.color,
                  marginTop: "5px",
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {c.msg}
              </p>
            </div>
          ))}
        </div>

        {/* Standup card */}
        <div
          style={{
            width: "100%",
            maxWidth: "300px",
            background: "#161b22",
            border: "0.5px solid rgba(59,130,246,0.2)",
            borderRadius: "12px",
            padding: "16px",
            animation: "float2 4s ease-in-out infinite 1.5s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "#fff",
                }}
              >
                JN
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#f9fafb",
                  fontWeight: "500",
                }}
              >
                Jigisha N
              </span>
            </div>
            <span
              style={{
                fontSize: "10px",
                background: "rgba(16,185,129,0.15)",
                color: "#10b981",
                padding: "2px 8px",
                borderRadius: "99px",
                border: "0.5px solid rgba(16,185,129,0.3)",
              }}
            >
              posted
            </span>
          </div>
          <div>
            <p
              style={{
                fontSize: "10px",
                color: "#6b7280",
                margin: "0 0 4px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              today
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                margin: "0 0 10px",
                lineHeight: 1.5,
              }}
            >
              Building standup form with commits auto-fetch
            </p>
            <div
              style={{
                height: "0.5px",
                background: "rgba(255,255,255,0.05)",
                marginBottom: "10px",
              }}
            />
            <p
              style={{
                fontSize: "10px",
                color: "#6b7280",
                margin: "0 0 4px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              blockers
            </p>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
              None
            </p>
          </div>
        </div>

        {/* Digest card */}
        <div
          style={{
            width: "100%",
            maxWidth: "300px",
            background: "#161b22",
            border: "0.5px solid rgba(16,185,129,0.2)",
            borderRadius: "12px",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "float3 4s ease-in-out infinite 0.8s",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "12px",
                color: "#f9fafb",
                margin: "0 0 2px",
                fontWeight: "500",
              }}
            >
              Digest sent to manager
            </p>
            <p style={{ fontSize: "11px", color: "#6b7280", margin: 0 }}>
              DevBoard Team · 09:00 AM · 3 updates
            </p>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Live indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "4px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 8px rgba(16,185,129,0.5)",
            }}
          />
          <span style={{ fontSize: "11px", color: "#6b7280" }}>
            2 of 3 teammates posted today
          </span>
        </div>
      </div>

      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes float3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>
    </div>
  );
}

export default Login;
