import React, { useEffect, useState } from "react";
import { Assignment } from "./types.ts";

interface RegularShowProps {
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

const RegularShow = ({ assignments, setAssignments }: RegularShowProps) => {
  const [hourInputs, setHourInputs] = useState<string[]>(
    assignments.map((a) => a.hours.toString())
  );

  useEffect(() => {
    if (assignments.length > 0 && hourInputs.length === 0) {
      setHourInputs(assignments.map((a) => a.hours.toString()));
    }
  }, [assignments]);

  const handleChangeHours = (index: number, value: string) => {
    const newInputs = [...hourInputs];
    newInputs[index] = value;
    setHourInputs(newInputs);

    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      const updated = [...assignments];
      updated[index].hours = parsed;
      setAssignments(updated);
    }
  };

  const handleChangeTeacherName = (index: number, newName: string) => {
    const updated = [...assignments];
    updated[index].teacher.fullName = newName;
    setAssignments(updated);
  };
  return (
    <table className="edit-table">
      <thead>
        <tr>
          <th>כיתה</th>
          <th>מורה</th>
          <th>שעות</th>
        </tr>
      </thead>
      <tbody>
        {assignments.map((a, i) => (
          <tr key={i}>
            <td>{a.class.name}</td>
            <td>
              <input
                type="text"
                value={a.teacher.fullName}
                onChange={(e) => handleChangeTeacherName(i, e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                value={hourInputs[i]}
                onChange={(e) => handleChangeHours(i, e.target.value)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RegularShow;
