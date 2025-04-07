import { useState } from "react";
import "../../CSS/Modal.css";
import RegularShow from "../CoordinatePage/components/AssignmentComps/RegularShow";
import MapShow from "../CoordinatePage/components/AssignmentComps/MapShow";
import { Assignment } from "../CoordinatePage/components/AssignmentComps/types";
import React from "react";
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
  title: string;
  assignments: {
    teacherName: string;
    className: string;
    hours: number;
  }[];
}

const SavedAssignmentPopup = ({ onClose, title, assignments }: Props) => {
  const [mapView, setMapView] = useState(false);

  // שמים את המידע ב־state כדי לאפשר עריכה
  const [editableAssignments, setEditableAssignments] = useState<Assignment[]>(
    assignments.map((a) => ({
      teacher: {
        _id: "",
        fullName: a.teacherName,
        idNumber: "",
      },
      class: {
        _id: "",
        name: a.className,
        grade: "י׳",
      },
      hours: a.hours,
    }))
  );

  const handlePrint = () => {
    const tableContent = document.querySelector(".edit-table")?.outerHTML;
    const win = window.open("", "", "width=800,height=600");
    if (win && tableContent) {
      win.document.write(`
        <html>
          <head>
            <title>הדפסת שיבוץ</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                font-size: 0.9rem;
                direction: rtl;
                text-align: center;
                padding: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
              }
              th, td {
                border: 1px solid #ccc;
                padding: 6px;
                text-align: center;
              }
              th {
                background-color: #f0f0f0;
              }
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
    if (mapView) {
      // תצוגת מפה - שומר HTML
      const teacherMap = new Map<string, string[]>();
      editableAssignments.forEach((a) => {
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
          <title>${title}</title>
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
          <h2>${title} - תצוגת מפה</h2>
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
      saveAs(blob, `${title}.html`);
    } else {
      // תצוגה רגילה - שומר DOCX
      const rows = editableAssignments.map(
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
                text: `${title} - שיבוץ`,
                heading: "Heading1",
                alignment: "center",
              }),
              table,
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${title}.docx`);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>

        {!mapView ? (
          <RegularShow
            assignments={editableAssignments}
            setAssignments={setEditableAssignments}
          />
        ) : (
          <MapShow assignments={editableAssignments} />
        )}

        <div className="modal-actions">
          <button onClick={onClose}>❌ סגור</button>
          <button
            onClick={() => setMapView((prev) => !prev)}
            style={{ marginRight: "1rem" }}
          >
            {mapView ? "תצוגה רגילה" : "🗺️ תצוגת מפה"}
          </button>
          <button onClick={handlePrint}>🖨️ הדפס</button>
          <button onClick={handleExportToWord}>⬇️ הורד לקובץ</button>
        </div>
      </div>
    </div>
  );
};

export default SavedAssignmentPopup;
