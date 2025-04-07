import React from "react";
import { useState } from "react";
import axios from "axios";
import { Category } from "./CategoriesList";
import { server_url } from "../../../../server_url";
import "../../../../CSS/Categories.css";

interface Props {
  onAdd: (newCategory: Category) => void;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const AddCategoryForm = ({ onAdd, setCategories }: Props) => {
  const [name, setName] = useState("");
  const [teacherCount, setTeacherCount] = useState<1 | 2>(1);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await axios.post(`${server_url}/api/categories`, {
        name,
        teacherCount,
        user,
      });

      onAdd(res.data);
      setName("");
      setTeacherCount(1);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "שגיאה בהוספה");
    }
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="שם קטגוריה"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select
        value={teacherCount}
        onChange={(e) => setTeacherCount(Number(e.target.value) as 1 | 2)}
      >
        <option value={1}>1 מורה</option>
        <option value={2}>2 מורים</option>
      </select>
      <button type="submit">הוסף קטגוריה</button>
      <button
        type="button"
        className="delete-all-button"
        onClick={async () => {
          const confirm = window.confirm(
            "האם אתה בטוח שברצונך למחוק את כל הקטגוריות והכיתות?"
          );
          if (!confirm) return;

          try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            await axios.post(`${server_url}/api/categories/delete-all`, {
              user,
            });
            setCategories([]);
          } catch (err) {
            console.error("Failed to delete all categories", err);
          }
        }}
      >
        🗑️ מחק את כל הקטגוריות
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default AddCategoryForm;
