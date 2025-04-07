import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/Coordinator.css";
import CategoriesList from "./components/CategoryComps/CategoriesList";
import TeachersList from "./components/TeacherComps/TeachersList";
import SchoolClassesList from "./components/SchoolClassComps/SchoolClassesList";
import AssignmentOptions from "./components/AssignmentComps/AssignmentOptions";

const CoordinatorHome = ({ coordi }: { coordi: string }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<
    "home" | "categories" | "teachers" | "classes" | "assignments"
  >("home");

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="coordinator-container">
      <nav className="navbar">
        <h2 className="navbar-title">מערכת שיבוץ מורים על פי תחומי דעת </h2>
        <ul className="nav-links">
          <li onClick={() => setActiveSection("teachers")}>מורים </li>
          <li onClick={() => setActiveSection("classes")}>כיתות</li>
          <li onClick={() => setActiveSection("assignments")}>שיבוצים</li>
          <li onClick={() => setActiveSection("categories")}>קטגוריות</li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          יציאה
        </button>
      </nav>

      <main className="welcome-box">
        {activeSection === "home" ? (
          <>
            <h1>ברוכים הבאים {coordi}</h1>
            <p>בחר פעולה מהתפריט למעלה כדי להתחיל</p>
          </>
        ) : activeSection === "categories" ? (
          <CategoriesList />
        ) : activeSection === "teachers" ? (
          <TeachersList />
        ) : activeSection === "classes" ? (
          <SchoolClassesList />
        ) : activeSection === "assignments" ? (
          <AssignmentOptions />
        ) : null}
      </main>
    </div>
  );
};

export default CoordinatorHome;
