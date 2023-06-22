import React, { useState, useContext, useEffect } from "react";
import Navigation from "../components/navigation";
import CustomModal from "../components/custom-modal";
import { ErrorMessage, Field, Form, Formik } from "formik";
import ProductCard from "../components/product-card";
import {
  createCategory,
  editCategoryById,
  getCategoriesAndDocuments,
  getCategoriesFromFirebase,
  pushDataToFirebase,
} from "../utils/firebase/firebase";
import AddCategoryModal from "../components/add-category-modal";
import Layout from "../components/layout";

const RentalPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, product: null });
  const [products, setProducts] = useState([]);
  const [updateData, setUpdateData] = useState(true);

  const fetchData = async () => {
    const categoryMap = await getCategoriesFromFirebase("categories");
    setProducts(categoryMap);
    setUpdateData(false);
  };

  useEffect(() => {
    if (updateData) {
      fetchData();
    }
  }, [updateData]);

  const onAddCategory = async (values) => {
    await pushDataToFirebase("categories", values);
    setUpdateData(true);
    setIsModalOpen(false);
  };

  const handleEditCategory = async (id, values) => {
    await editCategoryById(id, values);
    setUpdateData(true)
  };

  return (
    <Layout title="Categories">
      <AddCategoryModal
        category={editModal.product}
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, product: null })}
        submitFunc={async (values) => {
          await handleEditCategory(editModal.product.id, values);
          setEditModal({ open: false, product: null });
        }}
      />
      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submitFunc={onAddCategory}
      />
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="bg-purple-500 py-[8px] px-[12px] self-end mb-[50px]"
      >
        Add Category
      </button>
      <div className="grid grid-cols-4 gap-[30px] items-start">
        {products.map((shopItem) => {
          return (
            <ProductCard
              key={shopItem.id}
              id={shopItem.id}
              title={shopItem.title}
              image={shopItem.image}
              handleEditCategory={() =>
                setEditModal({ open: true, product: shopItem })
              }
            />
          );
        })}
      </div>
    </Layout>
  );
};

export default RentalPage;
