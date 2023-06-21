import { ErrorMessage, Form, Formik } from "formik";
import CustomModal from "./custom-modal";
import Input from "./input";
import { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Field is required"),
  email: Yup.string().email().required("Field is required"),
  phone: Yup.string().required("Field is required"),
  // Add more fields and validation rules as needed
});

const AddUserModal = ({ isOpen, onClose, submitFunc, user }) => {
  return (
    <CustomModal
      title={user ? "Edit User" : "Add User"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Formik
        initialValues={{
          name: user?.name ? user?.name : "",
          email: user?.email ? user?.email : "",
          phone: user?.phone ? user?.phone : "",
          products: user?.products,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          submitFunc(values);
          setSubmitting(false);
        }}
      >
        {({ setFieldValue }) => (
          <Form className="grid gap-y-[12px] mt-[20px]">
            <Input label="Name" name="name" />
            <Input label="Email" name="email" type="email" />
            <Input label="Phone" name="phone" type="phone" />
            <button
              type="submit"
              className="bg-green-200 py-[12px] px-[12px] mt-[20px]"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
};

export default AddUserModal;
