import { ErrorMessage, Form, Formik } from "formik";
import CustomModal from "./custom-modal";
import Input from "./input";
import { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Field is required"),
  description: Yup.string().required("Field is required"),
  price: Yup.number().min(0).required("Field is required"),
  image: Yup.string().required("Field is required"),
  // Add more fields and validation rules as needed
});

const AddProductModal = ({ isOpen, onClose, submitFunc, product }) => {
  const [previewImage, setPreviewImage] = useState(
    product?.image ? product?.image : ""
  );

  return (
    <CustomModal
      title={product ? "Edit Product" : "Add Product"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Formik
        initialValues={{
          title: product?.title ? product?.title : "",
          price: product?.price ? product?.price : "",
          description: product?.description ? product?.description : "",
          image: product?.image ? product?.image : "",
          rented: product?.rented,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          submitFunc(values);
          setSubmitting(false);
        }}
      >
        {({ setFieldValue }) => (
          <Form className="grid gap-y-[12px] mt-[20px]">
            <Input label="Title" name="title" />

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
                accept="image/jpeg, image/png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // if (file.size > maxSizeInBytes) {
                    //   alert("File size exceeds the maximum limit.");
                    //   return;
                    // }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFieldValue("image", reader.result);
                      setPreviewImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setPreviewImage("");
                  }
                }}
              />
              <ErrorMessage
                name="image"
                component="div"
                className="text-[12px] text-red-500 mt-[10px]"
              />
            </div>
            {previewImage && (
              <div>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )}
            <Input label="Description" name="description" type="textarea" />
            <Input label="Rent per day" name="price" type="number" />
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
  );
};

export default AddProductModal;
