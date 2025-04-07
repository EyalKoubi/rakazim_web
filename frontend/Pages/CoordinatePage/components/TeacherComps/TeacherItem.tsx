import React, { useState } from "react";
import { Teacher } from "./TeachersList";
import { server_url } from "../../../../server_url";
import axios from "axios";
import "../../../../CSS/Teachers.css";

interface Props {
  teacher: Teacher;
  onDelete: (id: string) => void;
  onUpdate: (updated: Teacher) => void;
}

const TeacherItem = ({ teacher, onDelete, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(teacher.fullName);
  const [idNumber, setIdNumber] = useState(teacher.idNumber);
  const [professionalHours, setProfessionalHours] = useState(
    teacher.professionalHours.toString()
  );
  const [dutyHours, setDutyHours] = useState(teacher.dutyHours.toString());
  const [teachingLevel, setTeachingLevel] = useState<"middle" | "high" | "all">(
    teacher.teachingLevel
  );
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${server_url}/api/teachers/${teacher._id}`, {
        fullName,
        idNumber,
        professionalHours: Number(professionalHours),
        dutyHours: Number(dutyHours),
        teachingLevel,
      });
      onUpdate(res.data);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "שגיאה בעדכון");
    }
  };

  return (
    <div className="card">
      {isEditing ? (
        <div className="edit-fields">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
          />
          <input
            type="number"
            value={professionalHours}
            onChange={(e) => setProfessionalHours(e.target.value)}
          />
          <input
            type="number"
            value={dutyHours}
            onChange={(e) => setDutyHours(e.target.value)}
          />
          <select
            value={teachingLevel}
            onChange={(e) =>
              setTeachingLevel(e.target.value as "middle" | "high" | "all")
            }
          >
            <option value="middle">חטיבת ביניים</option>
            <option value="high">חטיבה עליונה</option>
            <option value="all">כל השכבות</option>
          </select>
          <div className="buttons">
            <button className="edit-btn" onClick={handleUpdate}>
              שמור
            </button>
            <button className="delete-btn" onClick={() => setIsEditing(false)}>
              ביטול
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </div>
      ) : (
        <div className="teacher-item">
          <div>
            <strong>{teacher.fullName}</strong> – ת"ז: {teacher.idNumber}
          </div>
          <div>
            זכויות פרופסיונליות: {teacher.professionalHours} | שעות תפקיד:{" "}
            {teacher.dutyHours} | שעות זמינות:{" "}
            {teacher.professionalHours - teacher.dutyHours}
          </div>
          <div>
            שכבות הוראה:{" "}
            {teacher.teachingLevel === "middle"
              ? "חטיבת ביניים"
              : teacher.teachingLevel === "high"
              ? "חטיבה עליונה"
              : "כל השכבות"}
          </div>
          <div className="buttons">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              ערוך
            </button>
            <button
              className="delete-btn"
              onClick={() => {
                const confirmDelete = window.confirm(
                  `האם אתה בטוח שברצונך למחוק את ${teacher.fullName}?`
                );
                if (confirmDelete) onDelete(teacher._id);
              }}
            >
              מחק
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherItem;
