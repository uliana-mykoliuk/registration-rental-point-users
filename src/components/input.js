import { ErrorMessage, Field } from "formik";

const Input = ({ name, type = "text", label }) => {
  return (
    <div className="grid">
      <label htmlFor={name}>{label}</label>
      {type === "textarea" ? (
        <Field
          as="textarea"
          name={name}
          className="border border-[#aaa] px-[16px] py-[8px]"
        />
      ) : (
        <Field
          type={type}
          name={name}
          className="border border-[#aaa] px-[16px] py-[8px]"
        />
      )}

      <ErrorMessage
        name={name}
        component="div"
        className="text-[12px] text-red-500"
      />
    </div>
  );
};

export default Input;
