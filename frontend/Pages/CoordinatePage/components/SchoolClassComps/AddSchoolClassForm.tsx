import React, { useEffect, useState } from "react";
import axios from "axios";
import { SchoolClass } from "./SchoolClassesList";
import { server_url } from "../../../../server_url";
import "../../../../CSS/SchoolClasses.css";

interface Props {
  onAdd: (newClass: SchoolClass) => void;
  setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>;
}

interface Category {
  _id: string;
  name: string;
}

const grades = ["ז׳", "ח׳", "ט׳", "י׳", "י״א", "י״ב"];

const AddSchoolClassForm = ({ onAdd, setClasses }: Props) => {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalHours, setTotalHours] = useState("");
  const [bonusHours, setBonusHours] = useState("");

  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = localStorage.getItem("user");
      const res = await axios.post(`${server_url}/api/classes`, {
        name,
        grade,
        category,
        totalHours: Number(totalHours),
        bonusHours: Number(bonusHours),
        user,
      });
      const fullClass = await axios.get(
        `${server_url}/api/classes/${res.data._id}`
      );
      onAdd(fullClass.data);
      setName("");
      setGrade("");
      setCategory("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "שגיאה בהוספת כיתה");
    }
  };

  return (
    <form className="add-class-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="שם כיתה"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select value={grade} onChange={(e) => setGrade(e.target.value)} required>
        <option value="">בחר שכבה</option>
        {grades.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">בחר קטגוריה</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="כמות שעות"
        value={totalHours}
        onChange={(e) => setTotalHours(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="שעות גמול"
        value={bonusHours}
        onChange={(e) => setBonusHours(e.target.value)}
        required
      />
      <button type="submit">הוסף כיתה</button>
      <button
        type="button"
        className="delete-all-button"
        onClick={async () => {
          const confirm = window.confirm(
            "אתה בטוח שברצונך למחוק את כל הכיתות?"
          );
          if (!confirm) return;

          try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            await axios.post(`${server_url}/api/classes/delete-all`, { user });
            setClasses([]);
          } catch (err) {
            console.error("שגיאה במחיקת כל הכיתות", err);
          }
        }}
      >
        🗑️ מחק את כל הכיתות
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default AddSchoolClassForm;
