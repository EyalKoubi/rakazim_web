import React, { useState } from "react";
import axios from "axios";
import { Teacher } from "./TeachersList";
import { server_url } from "../../../../server_url";
import "../../../../CSS/Teachers.css";

interface Props {
  onAdd: (newTeacher: Teacher) => void;
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

const AddTeacherForm = ({ onAdd, setTeachers }: Props) => {
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [professionalHours, setProfessionalHours] = useState<string>("");
  const [dutyHours, setDutyHours] = useState<string>("");
  const [teachingLevel, setTeachingLevel] = useState<"middle" | "high" | "all">(
    "all"
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user || !user._id) {
        setError("לא נמצא מזהה משתמש");
        return;
      }

      const res = await axios.post(`${server_url}/api/teachers`, {
        fullName,
        idNumber,
        professionalHours: Number(professionalHours),
        dutyHours: Number(dutyHours),
        teachingLevel,
        coordinatorId: user._id,
      });

      onAdd(res.data);
      setFullName("");
      setIdNumber("");
      setProfessionalHours("");
      setDutyHours("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "שגיאה בהוספת מורה");
    }
  };

  return (
    <form className="add-teacher-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="שם מלא"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="תעודת זהות"
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="זכויות פרופרסיונאליות"
        value={professionalHours}
        onChange={(e) => setProfessionalHours(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="שעות תפקיד"
        value={dutyHours}
        onChange={(e) => setDutyHours(e.target.value)}
        required
      />
      <select
        value={teachingLevel}
        onChange={(e) =>
          setTeachingLevel(e.target.value as "middle" | "high" | "all")
        }
        required
      >
        <option value="middle">חטיבת ביניים</option>
        <option value="high">חטיבה עליונה</option>
        <option value="all">כל השכבות</option>
      </select>
      <button type="submit">הוסף מורה</button>
      <button
        type="button"
        className="delete-all-button"
        onClick={async () => {
          const confirm = window.confirm(
            "האם אתה בטוח שברצונך למחוק את כל המורים?"
          );
          if (!confirm) return;

          try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            await axios.post(`${server_url}/api/teachers/delete-all`, { user });
            setTeachers([]);
          } catch (err) {
            console.error("שגיאה במחיקת כל המורים", err);
          }
        }}
      >
        🗑️ מחק את כל המורים
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default AddTeacherForm;
