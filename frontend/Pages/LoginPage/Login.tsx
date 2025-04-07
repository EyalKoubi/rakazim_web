import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../CSS/Form.css";
import { server_url } from "../../server_url";

type User = {
  _id: unknown;
  email: string;
  fullName: string;
  username: string;
};

const Login = ({
  setCoordi,
}: {
  setCoordi: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const question = "?" + "אין לך עדיין חשבון";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (username === "pedagogi" && password === "manager&rav&tchumi") {
        navigate("/admin");
        return;
      }
      const response:
        | { message: string }
        | {
            data: {
              token: string;
              user: User;
            };
          } = await axios.post(`${server_url}/api/auth/login`, {
        username,
        password,
      });

      if (!("data" in response)) {
        setError("שם משתמש או סיסמא לא נכונים");
      } else {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        console.log("🚀 ~ handleLogin ~ user:", user);
        localStorage.setItem("user", JSON.stringify(user));
        setCoordi(user.fullName);
        setError("");
      }

      navigate("/home");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
      ) {
        setError("שם משתמש או סיסמא אינם נכונים");
      } else {
        setError("שם משתמש או סיסמא אינם נכונים");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>כניסה</h2>
      <form className="form-box" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="שם משתמש"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="סיסמא"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">כניסה</button>
      </form>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div className="redirect-link">
        <p>{question}</p>
        <button onClick={() => navigate("/register")}>להרשמה</button>
      </div>
    </div>
  );
};

export default Login;
