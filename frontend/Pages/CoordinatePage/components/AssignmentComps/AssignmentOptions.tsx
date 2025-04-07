import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { server_url } from "../../../../server_url";
import "../../../../CSS/Assignments.css";
import EditSavedAssignmentsModal from "./EditSavedAssignmentsModal";
import { Assignment } from "./types.ts";
import "../../../../CSS/Assignments.css";
import ManualAssignmentPopup from "./ManualAssignmentPopup.tsx";

interface AssignmentOption {
  optionName: string;
  assignments: Assignment[];
}

const AssignmentOptions = () => {
  const [options, setOptions] = useState<AssignmentOption[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);
  const [editingSaved, setEditingSaved] = useState(false);
  const [savedAssignments, setSavedAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        await axios.post(`${server_url}/api/assigment/delete`, { user });
        const res = await axios.post(`${server_url}/api/assigment`, { user });
        setOptions(res.data);
      } catch (err) {
        console.error("שגיאה בטעינת אופציות שיבוץ", err);
        setError("שגיאה בטעינת נתוני שיבוץ");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const nextPage = () => {
    if (currentPage < options.length - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const fetchSavedAssignments = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const resAssignments = await axios.post(
        `${server_url}/api/assigment/saved`,
        { user }
      );

      setSavedAssignments(resAssignments.data);
      setEditingSaved(true);
    } catch (err) {
      console.error("שגיאה בטעינת שיבוצים שמורים", err);
      setError("שגיאה בטעינת שיבוצים שמורים");
    }
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const selected = options[currentPage];

      await axios.post(`${server_url}/api/assigment/save`, {
        user,
        assignments: selected.assignments,
      });

      await fetchSavedAssignments();
    } catch (err) {
      console.error("שגיאה בשמירת השיבוץ", err);
      alert("❌ שגיאה בשמירת השיבוץ");
    }
  };

  return (
    <div className="assignment-options">
      <h2>אופציות שיבוץ מורים</h2>
      {isLoading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>טוען שיבוצים...</p>
        </div>
      ) : (
        <>
          {error && <div className="error">{error}</div>}

          {options.length > 0 && (
            <>
              <div className="card">
                <div ref={printRef} className="assignment-option">
                  <h3>{options[currentPage].optionName}</h3>
                  <ul>
                    {options[currentPage].assignments.map((a, i) => (
                      <li key={i}>
                        🧑‍🏫 מורה: <strong>{a.teacher.fullName}</strong> (ת"ז:{" "}
                        {a.teacher.idNumber}) ➡️ כיתה:{" "}
                        <strong>{a.class.name}</strong> ({a.hours} שעות)
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => setShowManual(true)}
                  className="manual-assign-btn"
                >
                  ✍️ שיבוץ ידני (חדש)
                </button>
                <button onClick={handleSave} className="save-assignment-btn">
                  💾 שיבוץ שמור
                </button>
              </div>
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 0}>
                  הקודם
                </button>
                <span>
                  הצעה {currentPage + 1} מתוך {options.length}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === options.length - 1}
                >
                  הבא
                </button>
              </div>
            </>
          )}
          {editingSaved && (
            <EditSavedAssignmentsModal
              assignments={savedAssignments}
              setAssignments={setSavedAssignments}
              onClose={() => setEditingSaved(false)}
            />
          )}
        </>
      )}
      {showManual && (
        <ManualAssignmentPopup onClose={() => setShowManual(false)} />
      )}
    </div>
  );
};

export default AssignmentOptions;
