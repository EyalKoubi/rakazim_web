import React from "react";
import { Assignment } from "./types.ts";

interface mapShowProps {
  assignments: Assignment[];
}

const MapShow = ({ assignments }: mapShowProps) => {
  return (
    <table className="edit-table">
      <thead>
        <tr>
          <th>מורה</th>
          <th>כיתות ושעות</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(
          assignments.reduce((map, a) => {
            const name = a.teacher.fullName;
            if (!map.has(name)) map.set(name, []);
            map.get(name)?.push(`${a.class.name} (${a.hours} שעות)`);
            return map;
          }, new Map<string, string[]>())
        ).map(([teacher, classes], i) => (
          <tr key={i}>
            <td>{teacher}</td>
            <td>{classes.join(", ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MapShow;
