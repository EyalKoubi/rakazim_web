import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server_url } from "../../server_url";
import AssignmentPopup from "./AssignmentPopup";
import React from "react";
import "../../CSS/AdminDashboard.css"; // חשוב: הקובץ עם ה-CSS המעוצב
import AssigmentList from "./AssigmentList";

interface SavedAssignment {
  _id: string;
  title: string;
  assignments: {
    teacherName: string;
    className: string;
    hours: number;
  }[];
}

const ITEMS_PER_PAGE = 3;

const AdminDashboard = () => {
  const [maps, setMaps] = useState<SavedAssignment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMap, setSelectedMap] = useState<SavedAssignment | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<SavedAssignment[]>(`${server_url}/api/assigment/saved-maps`)
      .then((res) => setMaps(res.data))
      .catch((err) => console.error("שגיאה בטעינת מפות:", err));
  }, []);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMaps = maps.slice(startIndex, endIndex);

  return (
    <div className="admin-container">
      <h2 className="admin-title">👑 ברוך הבא למערכת הניהול</h2>
      <p className="admin-subtitle">כאן תוכל לצפות בשיבוצים ששמרו הרכזים</p>

      <button className="exit-button" onClick={() => navigate("/")}>
        ⬅️ יציאה
      </button>

      <AssigmentList
        currentMaps={currentMaps}
        setMaps={setMaps}
        setSelectedMap={setSelectedMap}
      />

      <div className="pagination">
        {Array.from({ length: Math.ceil(maps.length / ITEMS_PER_PAGE) }).map(
          (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`pagination-button ${
                currentPage === i + 1 ? "active" : ""
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      {selectedMap && (
        <AssignmentPopup
          title={selectedMap.title}
          assignments={selectedMap.assignments}
          onClose={() => setSelectedMap(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
