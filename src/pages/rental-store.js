import React, { useState, useContext } from "react";
import Navigation from "../components/navigation";
import CustomModal from "../components/custom-modal";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { ProductsContext } from "../contexts/product-context";
import ProductCard from "../components/product-card";

const RentalPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const { products } = useContext(ProductsContext);

  return (
    <>
      <Navigation />
      <CustomModal
        title="Add item"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Formik
          initialValues={{ name: "", price: "" }}
          onSubmit={(values, { setSubmitting }) => {
            console.log("submit item", values);
            setSubmitting(false);
          }}
        >
          {({ setFieldValue }) => (
            <Form className="grid gap-y-[12px] mt-[20px]">
              <div className="grid">
                <label htmlFor="name">Name</label>
                <Field
                  type="text"
                  name="name"
                  className="border border-[#aaa] px-[16px] py-[8px]"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-[12px] text-red-500"
                />
              </div>

              <div className="py-[10px]">
                <label
                  htmlFor="image"
                  className="bg-purple-300 py-[8px] px-[12px]"
                >
                  Image Upload
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFieldValue("image", file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewImage(reader.result);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setPreviewImage("");
                    }
                  }}
                />
              </div>
              <div>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ maxWidth: "200px" }}
                />
              </div>

              <div className="grid">
                <label htmlFor="price">Price</label>
                <Field
                  type="number"
                  name="price"
                  className="border border-[#aaa] px-[16px] py-[8px]"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-[12px] text-red-500"
                />
              </div>
              <button
                type="submit"
                className="bg-green-200 py-[12px] px-[12px] mt-[20px]"
              >
                Add Item
              </button>
            </Form>
          )}
        </Formik>
      </CustomModal>
      <div className="pt-[56px] min-h-screen grid justify-center">
        <div className="container py-[50px] grid">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-500 py-[8px] px-[12px] justify-self-end mb-[50px]"
          >
            Add Rental Item
          </button>
          <div className="grid grid-cols-4 gap-[30px]">
            {products.map((shopItem) => {
              return (
                <ProductCard
                  key={shopItem.id}
                  id={shopItem.id}
                  name={shopItem.name}
                  price={shopItem.price}
                  image={shopItem.image}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default RentalPage;
