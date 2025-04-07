import React, { useState } from "react";
import "../../../../CSS/Modal.css";
import axios from "axios";
import { server_url } from "../../../../server_url";
import MapShow from "./MapShow";
import RegularShow from "./RegularShow";
import { Assignment } from "./types.ts";
import MapSavePopup from "./MapSavePopup.tsx";
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

interface Props {
  onClose: () => void;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

const EditSavedAssignmentsModal = ({
  onClose,
  assignments,
  setAssignments,
}: Props) => {
  const [mapView, setMapView] = useState(false);
  const [mapButtonText, setMapButtonText] = useState<
    "🗺️ תצוגת מפה" | "תצוגה רגילה"
  >("🗺️ תצוגת מפה");
  const [showSavePopup, setShowSavePopup] = useState(false);

  const handlePrintOnlyTable = () => {
    const tableContent = document.querySelector(".edit-table")?.outerHTML;
    const win = window.open("", "", "width=800,height=600");
    if (win && tableContent) {
      win.document.write(`
        <html>
          <head>
            <title>הדפסת שיבוץ</title>
            <style>
              body { font-family: Arial; font-size: 0.75rem; text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #ddd; padding: 6px; text-align: center; }
              th { background-color: #f9f9f9; }
            </style>
          </head>
          <body>
            ${tableContent}
          </body>
        </html>
      `);
      win.document.close();
      win.print();
    }
  };

  const handleExportToWord = async () => {
    const isMapView = mapView;

    if (isMapView) {
      const teacherMap = new Map<string, string[]>();
      assignments.forEach((a) => {
        const name = a.teacher.fullName;
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
          <title>שיבוץ - תצוגת מפה</title>
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; text-align: center; }
            table { width: 90%; margin: auto; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>שיבוץ - תצוגת מפה</h2>
          <table>
            <thead>
              <tr><th>מורה</th><th>כיתות ושעות</th></tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      saveAs(blob, "שיבוץ - מפה.html");
      return;
    }

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
                  text: a.teacher.fullName,
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
              children: [new Paragraph({ text: "כיתה", alignment: "center" })],
            }),
            new TableCell({
              children: [new Paragraph({ text: "מורה", alignment: "center" })],
            }),
            new TableCell({
              children: [new Paragraph({ text: "שעות", alignment: "center" })],
            }),
          ],
        }),
        ...rows,
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "שיבוץ - תצוגה רגילה",
              heading: "Heading1",
              alignment: "center",
            }),
            table,
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "שיבוץ.docx");
  };

  const handleCloseAndDelete = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await axios.post(`${server_url}/api/assigment/delete`, { user });
    } catch (err) {
      console.error("שגיאה במחיקת השיבוצים:", err);
    } finally {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>עריכת שיבוץ שמור</h2>
        {!mapView ? (
          <RegularShow
            assignments={assignments}
            setAssignments={setAssignments}
          />
        ) : (
          <MapShow assignments={assignments} />
        )}

        <div className="modal-actions">
          <button onClick={handleCloseAndDelete}>❌ סגור</button>
          <button
            onClick={() => {
              setMapView(!mapView);
              if (mapButtonText === "🗺️ תצוגת מפה")
                setMapButtonText("תצוגה רגילה");
              else setMapButtonText("🗺️ תצוגת מפה");
            }}
          >
            {mapButtonText}
          </button>
          <button onClick={handlePrintOnlyTable}>🖨️ הדפס</button>
          <button onClick={handleExportToWord}>⬇️ הורד לקובץ</button>
          <button onClick={() => setShowSavePopup(true)}>
            💾 שלח/י את השיבוצים למנהל/ת הפדגוגי
          </button>
          {showSavePopup && (
            <MapSavePopup
              onCancel={() => setShowSavePopup(false)}
              onSave={async (title: string) => {
                try {
                  const response = await axios.post<{
                    message: string;
                    map: { title: string };
                  }>(`${server_url}/api/assigment/save-map`, {
                    title,
                    assignments,
                  });
                  alert(
                    `🗺️ השיבוץ נשמר בהצלחה!\n\n📝 ${response.data?.map?.title}`
                  );
                } catch (err) {
                  alert("❌ שגיאה בשמירת התצוגה");
                  console.error(err);
                } finally {
                  setShowSavePopup(false);
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditSavedAssignmentsModal;
