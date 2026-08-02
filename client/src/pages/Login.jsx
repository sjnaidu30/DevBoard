function Login() {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#1a1a2e",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#16213e",
          padding: "48px",
          borderRadius: "12px",
          textAlign: "center",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        <h1 style={{ color: "#ffffff", fontSize: "32px", marginBottom: "8px" }}>
          DevBoard
        </h1>
        <p style={{ color: "#888", fontSize: "16px", marginBottom: "32px" }}>
          Async standups for remote teams
        </p>
        <button
          onClick={handleLogin}
          style={{
            backgroundColor: "#24292e",
            color: "#ffffff",
            border: "none",
            padding: "14px 28px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "0 auto",
          }}
        >
          Login with GitHub
        </button>
      </div>
    </div>
  );
}

export default Login;
