import React, { useState } from "react";
import { Category } from "./CategoriesList";
import "../../../../CSS/Categories.css";
import axios from "axios";
import { server_url } from "../../../../server_url";

interface Props {
  category: Category;
  onDelete: (id: string) => void;
  onUpdate: (updated: Category) => void;
}

const CategoryItem = ({ category, onDelete, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);
  const [editedCount, setEditedCount] = useState<1 | 2>(category.teacherCount);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${server_url}/api/categories/${category._id}`,
        {
          name: editedName,
          teacherCount: editedCount,
        }
      );
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
        <>
          <div className="edit-fields">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
            <select
              value={editedCount}
              onChange={(e) => setEditedCount(Number(e.target.value) as 1 | 2)}
            >
              <option value={1}>1 מורה</option>
              <option value={2}>2 מורים</option>
            </select>
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
        <div className="category-item">
          <div>
            <strong>{category.name}</strong> – {category.teacherCount} מורים
          </div>
          <div className="buttons">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              ערוך
            </button>
            <button
              className="delete-btn"
              onClick={() => {
                const confirm = window.confirm(
                  `האם אתה בטוח שברצונך למחוק את "${category.name}"?`
                );
                if (confirm) onDelete(category._id);
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

export default CategoryItem;
