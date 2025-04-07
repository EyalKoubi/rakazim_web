import React, { useEffect, useState } from "react";
import axios from "axios";
import { server_url } from "../../../../server_url";
import TeacherItem from "./TeacherItem";
import AddTeacherForm from "./AddTeacherForm";
import "../../../../CSS/Teachers.css";

export interface Teacher {
  _id: string;
  fullName: string;
  idNumber: string;
  professionalHours: number;
  dutyHours: number;
  teachingLevel: "middle" | "high" | "all";
}

const TeachersList = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTeachers = teachers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(teachers.length / itemsPerPage);

  const fetchTeachers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await axios.post(`${server_url}/api/teachers/all`, {
        user,
      });

      setTeachers(res.data);
    } catch (err) {
      console.error("שגיאה בהבאת מורים", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const addTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [...prev, newTeacher]);
  };

  const deleteTeacher = async (id: string) => {
    try {
      await axios.delete(`${server_url}/api/teachers/${id}`);
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("שגיאה במחיקת מורה", err);
    }
  };

  const updateTeacher = (updated: Teacher) => {
    setTeachers((prev) =>
      prev.map((t) => (t._id === updated._id ? updated : t))
    );
  };

  return (
    <div className="teachers-container">
      <h2>רשימת מורים</h2>
      <AddTeacherForm onAdd={addTeacher} setTeachers={setTeachers} />
      <div className="teacher-list">
        {currentTeachers.map((teacher) =>
          teacher && teacher._id ? (
            <TeacherItem
              key={teacher._id}
              teacher={teacher}
              onDelete={deleteTeacher}
              onUpdate={updateTeacher}
            />
          ) : null
        )}
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

export default TeachersList;
