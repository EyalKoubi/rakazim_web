import React, { useState, useEffect } from "react";
import "../../../../CSS/Modal.css";
import { Assignment, newSchoolClass } from "./types";
import RegularShow from "./RegularShow";
import MapShow from "./MapShow";
import axios from "axios";
import { server_url } from "../../../../server_url";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import MapSavePopup from "./MapSavePopup";

interface Props {
  onClose: () => void;
}

const ManualAssignmentPopup = ({ onClose }: Props) => {
  const [classes, setClasses] = useState<newSchoolClass[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [mapView, setMapView] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [pendingAssignments, setPendingAssignments] = useState<unknown[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const user = localStorage.getItem("user");
        const res = await axios.post(`${server_url}/api/classes/all`, { user });
        setClasses(res.data);

        const initial: Assignment[] = res.data.map((cls: newSchoolClass) => ({
          class: {
            _id: cls._id,
            name: cls.name,
            grade: cls.grade,
          },
          teacher: {
            _id: "",
            fullName: "",
            idNumber: "",
          },
          hours: cls.totalHours + cls.bonusHours,
        }));

        setAssignments(initial);
      } catch (err) {
        console.error("שגיאה בטעינת כיתות", err);
      }
    };

    fetchClasses();
  }, []);

  const confirmSaveWithTitle = async (title: string) => {
    try {
      await axios.post(`${server_url}/api/assigment/save-map`, {
        title,
        assignments: pendingAssignments,
      });

      alert("✅ השיבוץ הידני נשמר בהצלחה!");
      setShowSavePopup(false);
      onClose();
    } catch (err) {
      console.error("❌ שגיאה בשמירת השיבוץ הידני", err);
      alert("❌ שגיאה בשמירת השיבוץ");
    }
  };

  const handleSave = () => {
    const fakeAssignments = assignments.map((a) => ({
      teacher: { fullName: a.teacher?.fullName || "לא צויין" },
      class: { name: a.class?.name || "לא צויין" },
      hours: typeof a.hours === "number" ? a.hours : 0,
    }));

    if (fakeAssignments.length === 0) {
      alert("❌ אין שיבוצים לשמור");
      return;
    }

    setPendingAssignments(fakeAssignments);
    setShowSavePopup(true);
  };

  const handleExportToWord = async () => {
    if (mapView) {
      const teacherMap = new Map<string, string[]>();
      assignments.forEach((a) => {
        const name = a.teacher.fullName || "לא צוין";
        if (!teacherMap.has(name)) teacherMap.set(name, []);
        teacherMap.get(name)!.push(`${a.class.name} (${a.hours} שעות)`);
      });

      let rowsHtml = "";
      teacherMap.forEach((classes, teacher) => {
        rowsHtml += `
          <tr>
            <td>${teacher}</td>
            <td>${classes.join(", ")}</td>
          </tr>
        `;
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="he" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>שיבוץ ידני</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              direction: rtl;
              text-align: center;
              padding: 20px;
            }
            table {
              width: 90%;
              margin: auto;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h2>📝 שיבוץ ידני - תצוגת מפה</h2>
          <table>
            <thead>
              <tr>
                <th>מורה</th>
                <th>כיתות ושעות</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      saveAs(blob, `שיבוץ_ידני.html`);
    } else {
      const rows = assignments.map(
        (a) =>
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({ text: a.class.name, alignment: "center" }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: a.teacher.fullName || "",
                    alignment: "center",
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: a.hours.toString(),
                    alignment: "center",
                  }),
                ],
              }),
            ],
          })
      );

      const table = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({ text: "כיתה", alignment: "center" }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({ text: "מורה", alignment: "center" }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({ text: "שעות", alignment: "center" }),
                ],
              }),
            ],
          }),
          ...rows,
        ],
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
      });

      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: "שיבוץ ידני - רגיל",
                heading: "Heading1",
                alignment: "center",
              }),
              table,
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "שיבוץ_ידני.docx");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>📝 שיבוץ ידני</h2>

        {!mapView ? (
          <RegularShow
            assignments={assignments}
            setAssignments={setAssignments}
          />
        ) : (
          <MapShow assignments={assignments} />
        )}

        <div className="modal-actions">
          <button onClick={onClose}>❌ סגור</button>
          <button onClick={() => setMapView((prev) => !prev)}>
            {mapView ? "תצוגה רגילה" : "🗺️ תצוגת מפה"}
          </button>
          <button onClick={() => window.print()}>🖨️ הדפס</button>
          <button onClick={handleExportToWord}>⬇️ הורד קובץ</button>
          <button onClick={handleSave}>💾 שמור ושלח לרכז</button>
        </div>
      </div>
      {showSavePopup && (
        <MapSavePopup
          onSave={confirmSaveWithTitle}
          onCancel={() => setShowSavePopup(false)}
        />
      )}
    </div>
  );
};

export default ManualAssignmentPopup;
