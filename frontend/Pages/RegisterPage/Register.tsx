import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../CSS/Form.css";
import { server_url } from "../../server_url";

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const question = "?" + "יש לך כבר חשבון";

  const handleRegister = async (e: React.FormEvent) => {
    if (password !== confirmPassword) {
      e.preventDefault();
      setError("הסיסמאות אינן תואמות");
    } else {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      try {
        const response = await axios.post(`${server_url}/api/auth/register`, {
          fullName,
          email,
          username,
          password,
        });

        if (response.status === 201) {
          setSuccess("נרשמת בהצלחה!");
          setTimeout(() => navigate("/login"), 1500);
        } else {
          setError("משהו השתבש. נסה שוב מאוחר יותר.");
        }
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: { data?: { message?: string } } })
            .response?.data?.message === "string"
        ) {
          setError(
            (err as { response: { data: { message: string } } }).response.data
              .message
          );
        } else {
          setError("אירעה שגיאה בהרשמה");
        }
      }
    }
  };

  return (
    <div className="form-container">
      <h2>הרשמה</h2>
      <form className="form-box" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="שם מלא"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="כתובת אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="אימות סיסמא"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">הרשמה</button>
      </form>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", textAlign: "center" }}>{success}</p>
      )}

      <div className="redirect-link">
        <p>{question}</p>
        <button onClick={() => navigate("/login")}>חזרה לכניסה</button>
      </div>
    </div>
  );
};

export default Register;
