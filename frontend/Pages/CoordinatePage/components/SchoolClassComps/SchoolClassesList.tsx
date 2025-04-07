import React, { useEffect, useState } from "react";
import axios from "axios";
import { server_url } from "../../../../server_url";
import SchoolClassItem from "./SchoolClassItem";
import AddSchoolClassForm from "./AddSchoolClassForm";
import "../../../../CSS/SchoolClasses.css";

export interface SchoolClass {
  _id: string;
  name: string;
  grade: string;
  totalHours: number;
  bonusHours: number;
  category: {
    _id: string;
    name: string;
    teacherCount: number;
  };
}

const SchoolClassesList = () => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClasses = classes.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(classes.length / itemsPerPage);

  const fetchClasses = async () => {
    try {
      const user = localStorage.getItem("user");
      const res = await axios.post(`${server_url}/api/classes/all`, { user });
      setClasses(res.data);
    } catch (err) {
      console.error("שגיאה בטעינת כיתות", err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const addClass = (newClass: SchoolClass) => {
    setClasses((prev) => [...prev, newClass]);
  };

  const updateClass = (updatedClass: SchoolClass) => {
    setClasses((prev) =>
      prev.map((c) => (c._id === updatedClass._id ? updatedClass : c))
    );
  };

  const deleteClass = async (id: string) => {
    try {
      await axios.delete(`${server_url}/api/classes/${id}`);
      setClasses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("שגיאה במחיקת כיתה", err);
    }
  };

  return (
    <div className="classes-container">
      <h2>רשימת כיתות</h2>
      <AddSchoolClassForm onAdd={addClass} setClasses={setClasses} />
      <div className="class-list">
        {currentClasses.map((c) => (
          <SchoolClassItem
            key={c._id}
            schoolClass={c}
            onDelete={deleteClass}
            onUpdate={updateClass}
          />
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          הקודם
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? "active-page" : ""}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          הבא
        </button>
      </div>
    </div>
  );
};

export default SchoolClassesList;
