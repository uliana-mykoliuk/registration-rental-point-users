import {
  createUserDocumentFromAuth,
  signInWithGooglePopup,
  createAuthUserWithEmailAndPassword,
} from "../utils/firebase/firebase";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";

const SignUpPage = () => {
  const handleRegistration = async ({ displayName, email, password }) => {
    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      await createUserDocumentFromAuth(user, { displayName });
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot create user, email already in use");
      } else {
        console.log("user creation encountered an error", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="m-[24px] grid justify-items-center">
        <div className="p-[16px] border border-[#aaa] grid bg-[#fff] drop-shadow-2xl">
          <h2 className="text-[36px] text-center mb-[12px]">
            Don't have an account?
          </h2>
          <h3 className="text-[24px] text-[#aaa] font-light text-center mb-[24px]">
            Sign Up with your email and password
          </h3>
          <Formik
            initialValues={{ email: "", password: "", displayName: "" }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Введіть електронну пошту";
              }
              if (!values.password) {
                errors.password = "Введіть пароль";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              handleRegistration(values);
              setSubmitting(false);
            }}
          >
            <Form className="grid gap-y-[12px]">
              <div className="grid">
                <label htmlFor="displayName">Display Name</label>
                <Field
                  type="text"
                  name="displayName"
                  className="border border-[#aaa] px-[16px] py-[8px]"
                />
                <ErrorMessage
                  name="displayName"
                  component="div"
                  className="text-[12px] text-red-500"
                />
              </div>

              <div className="grid">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="border border-[#aaa] px-[16px] py-[8px]"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-[12px] text-red-500"
                />
              </div>

              <div className="grid">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="border border-[#aaa] px-[16px] py-[8px]"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-[12px] text-red-500"
                />
              </div>

              <button
                type="submit"
                className="bg-green-200 py-[12px] px-[12px] mt-[24px] "
              >
                Sign Up
              </button>
            </Form>
          </Formik>
        </div>
        <p className="mt-[16px]">
          Alredy have an account?{" "}
          <Link href="/sign-in" className="text-purple-600">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
