// MapSavePopup.tsx
import React from "react";
import { useState } from "react";

interface Props {
  onSave: (title: string) => void;
  onCancel: () => void;
}

const MapSavePopup = ({ onSave, onCancel }: Props) => {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (title.trim()) {
      onSave(title.trim());
    } else {
      alert("יש להזין כותרת לפני השמירה");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>תן שם לתצוגת המפה</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="לדוגמה: שיבוץ מורים אזרחות"
        />
        <div className="modal-actions">
          <button onClick={onCancel}>ביטול</button>
          <button onClick={handleSubmit}>שמור</button>
        </div>
      </div>
    </div>
  );
};

export default MapSavePopup;
