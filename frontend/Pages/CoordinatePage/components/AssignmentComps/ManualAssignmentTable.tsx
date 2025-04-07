// ManualAssignmentTable.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { server_url } from "../../../../server_url";
import { newSchoolClass } from "./types";

const ManualAssignmentTable = () => {
  const [classes, setClasses] = useState<newSchoolClass[]>([]);
  const [manualAssignments, setManualAssignments] = useState<
    { classId: string; teacherName: string; hours: number }[]
  >([]);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const user = localStorage.getItem("user") || "{}"; // שליחה כמחרוזת בדיוק כמו שצריך
        const res = await axios.post(`${server_url}/api/classes/all`, { user });
        setClasses(res.data);
        setManualAssignments(
          res.data.map((c: newSchoolClass) => ({
            classId: c._id,
            teacherName: "",
            hours: Number((c.totalHours + c.bonusHours).toFixed(1)),
          }))
        );
      } catch (err) {
        setError("שגיאה בטעינת כיתות");
        console.error("❌ שגיאה בטעינת כיתות לשיבוץ ידני", err);
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (
    classId: string,
    field: "teacherName" | "hours",
    value: string
  ) => {
    setManualAssignments((prev) =>
      prev.map((a) =>
        a.classId === classId
          ? { ...a, [field]: field === "hours" ? +value : value }
          : a
      )
    );
  };

  const getClassName = (id: string) => {
    const match = classes.find((c) => c._id === id);
    return match ? `${match.name} (${match.grade})` : "כיתה לא נמצאה";
  };

  return (
    <div className="card">
      <h3>📝 שיבוץ ידני</h3>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>כיתה</th>
            <th>מורה</th>
            <th>שעות</th>
          </tr>
        </thead>
        <tbody>
          {manualAssignments.map((a) => (
            <tr key={a.classId}>
              <td>{getClassName(a.classId)}</td>
              <td>
                <input
                  type="text"
                  value={a.teacherName}
                  placeholder="הכנס שם מורה"
                  onChange={(e) =>
                    handleChange(a.classId, "teacherName", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={a.hours}
                  onChange={(e) =>
                    handleChange(a.classId, "hours", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManualAssignmentTable;
