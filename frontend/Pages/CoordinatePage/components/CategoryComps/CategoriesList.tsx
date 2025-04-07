import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryItem from "./CategoryItem";
import AddCategoryForm from "./AddCategoryForm";
import "../../../../CSS/Categories.css";
import { server_url } from "../../../../server_url";

export interface Category {
  _id: string;
  name: string;
  teacherCount: 1 | 2;
}

const CategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const fetchCategories = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await axios.post(`${server_url}/api/categories/all`, {
        user,
      });

      if ("data" in res) setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await axios.delete(`${server_url}/api/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  const updateCategory = (updated: Category) => {
    setCategories((prev) =>
      prev.map((cat) => (cat._id === updated._id ? updated : cat))
    );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = (newCategory: Category) => {
    setCategories([...categories, newCategory]);
  };

  return (
    <div className="categories-container">
      <h2>רשימת קטגוריות כיתה</h2>
      <AddCategoryForm onAdd={addCategory} setCategories={setCategories} />

      <div className="category-list">
        {currentCategories.map((cat) => (
          <CategoryItem
            key={cat._id}
            category={cat}
            onDelete={deleteCategory}
            onUpdate={updateCategory}
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

export default CategoriesList;
