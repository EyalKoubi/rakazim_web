import axios from "axios";
import { server_url } from "../../server_url";
import React from "react";

interface SavedAssignment {
  _id: string;
  title: string;
  assignments: {
    teacherName: string;
    className: string;
    hours: number;
  }[];
}

interface AssigmentItemProps {
  map: SavedAssignment;
  setSelectedMap: React.Dispatch<React.SetStateAction<SavedAssignment | null>>;
  setMaps: React.Dispatch<React.SetStateAction<SavedAssignment[]>>;
}

const AssigmentItem = ({
  map,
  setSelectedMap,
  setMaps,
}: AssigmentItemProps) => {
  return (
    <div
      key={map._id}
      className="admin-card"
      onClick={() => setSelectedMap(map)}
    >
      <h3>{map.title}</h3>
      <button
        className="delete-button"
        onClick={async (e) => {
          e.stopPropagation();
          const confirmed = window.confirm(
            "האם אתה בטוח שברצונך למחוק את השיבוץ?"
          );
          if (!confirmed) return;

          try {
            await axios.delete(
              `${server_url}/api/assigment/saved-maps/${map._id}`
            );
            setMaps((prev) => prev.filter((m) => m._id !== map._id));
          } catch (err) {
            console.error("❌ שגיאה במחיקת שיבוץ:", err);
            alert("אירעה שגיאה בעת המחיקה");
          }
        }}
      >
        🗑️
      </button>
    </div>
  );
};

export default AssigmentItem;
