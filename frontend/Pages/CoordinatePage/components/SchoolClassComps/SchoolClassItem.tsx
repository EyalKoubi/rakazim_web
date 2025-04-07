import React, { useEffect, useState } from "react";
import { SchoolClass } from "./SchoolClassesList";
import "../../../../CSS/SchoolClasses.css";
import axios from "axios";
import { server_url } from "../../../../server_url";

interface Props {
  schoolClass: SchoolClass;
  onDelete: (id: string) => void;
  onUpdate: (updated: SchoolClass) => void;
}

interface UpdateClassPayload {
  name: string;
  grade: string;
  totalHours: number;
  bonusHours: number;
  coordinator: string;
  category?: string;
}

const SchoolClassItem = ({ schoolClass, onDelete, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(schoolClass.name);
  const [grade, setGrade] = useState(schoolClass.grade);
  const [category, setCategory] = useState(schoolClass.category?._id || "");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [totalHours, setTotalHours] = useState(
    schoolClass.totalHours.toString()
  );
  const [bonusHours, setBonusHours] = useState(
    schoolClass.bonusHours.toString()
  );
  const [error, setError] = useState("");

  const grades = ["ז׳", "ח׳", "ט׳", "י׳", "י״א", "י״ב"];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const res = await axios.post(`${server_url}/api/categories/all`, {
          user,
        });
        setCategories(res.data);
      } catch (err) {
        console.error("שגיאה בטעינת קטגוריות", err);
      }
    };

    if (isEditing) fetchCategories();
  }, [isEditing]);

  const handleUpdate = async () => {
    try {
      const payload: UpdateClassPayload = {
        name,
        grade,
        totalHours: Number(totalHours),
        bonusHours: Number(bonusHours),
        coordinator: JSON.parse(localStorage.getItem("user") || "{}")._id,
      };

      if (category) {
        payload.category = category;
      }
      await axios.put(`${server_url}/api/classes/${schoolClass._id}`, {
        name,
        grade,
        category,
        totalHours: Number(totalHours),
        bonusHours: Number(bonusHours),
        coordinator: JSON.parse(localStorage.getItem("user") || "{}")._id,
      });

      const full = await axios.get(
        `${server_url}/api/classes/${schoolClass._id}`
      );
      onUpdate(full.data);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      setError("שגיאה בעדכון הכיתה");
    }
  };

  return (
    <div className="card">
      {isEditing ? (
        <>
          <div className="edit-fields">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="שם כיתה"
            />
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="כמות שעות"
              value={totalHours}
              onChange={(e) => setTotalHours(e.target.value)}
            />
            <input
              type="number"
              placeholder="שעות גמול"
              value={bonusHours}
              onChange={(e) => setBonusHours(e.target.value)}
            />
          </div>
          <div className="buttons">
            <button className="edit-btn" onClick={handleUpdate}>
              שמור
            </button>
            <button className="delete-btn" onClick={() => setIsEditing(false)}>
              ביטול
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </>
      ) : (
        <div className="class-item">
          <div>
            <strong>{schoolClass.name}</strong> – שכבה: {schoolClass.grade}
          </div>
          <div>קטגוריה: {schoolClass.category?.name || "לא ידועה"}</div>
          <div>
            כמות שעות: {schoolClass.totalHours} | גמול: {schoolClass.bonusHours}
          </div>

          <div className="buttons">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              ערוך
            </button>
            <button
              className="delete-btn"
              onClick={() => {
                const confirm = window.confirm(
                  `האם למחוק את "${schoolClass.name}"?`
                );
                if (confirm) onDelete(schoolClass._id);
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

export default SchoolClassItem;
