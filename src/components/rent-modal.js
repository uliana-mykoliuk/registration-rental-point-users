import { ErrorMessage, Field, Form, Formik } from "formik";
import CustomModal from "./custom-modal";
import Input from "./input";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { getCategoriesFromFirebase } from "../utils/firebase/firebase";
import moment from "moment/moment";
import { useRouter } from "next/router";

const validationSchema = Yup.object().shape({
  userId: Yup.string().required("Field is required"),
  daysAmount: Yup.number().required("Field is required"),
});

const RentModal = ({ isOpen, onClose, submitFunc, product }) => {
  const router = useRouter();
  const categoryId = router.query.id;
  const [updateData, setUpdateData] = useState(true);
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    const usersArray = await getCategoriesFromFirebase("custommers");
    setUsers(usersArray);
    setUpdateData(false);
  };

  useEffect(() => {
    if (updateData) {
      fetchData();
    }
  }, [updateData]);

  return (
    <CustomModal
      title={"Rent Product"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Formik
        initialValues={{
          userId: "",
          startDay: moment().format("DD-MM-YYYY 00:00:00"),
          productId: product?.id,
          price: product?.price,
          daysAmount: "",
          currentDaysAmount: "",
          endDay: "",
          status: "ACTIVE",
          categoryId: categoryId,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          const data = {
            ...values,
            userName: users.filter((user) => user.id === values.userId)[0].name,
            income: 0,
            expectedIncome: values.price * values.daysAmount,
          };
          console.log("val", data);
          submitFunc(data);
          setSubmitting(false);
        }}
      >
        {({ values, errors, setFieldValue }) => {
          console.log(errors);
          const handleSelectChange = (event) => {
            const selectedUserId = event.target.value;
            setFieldValue("userId", selectedUserId, false);
          };
          return (
            <Form className="grid gap-y-[12px] mt-[20px]">
              <label htmlFor="userId">Custommer</label>
              <select
                name="userId"
                onChange={handleSelectChange}
                className="border border-[#aaa] px-[16px] py-[8px]"
              >
                <option value="" hidden>
                  Select a user
                </option>
                {users.map((user) => {
                  return (
                    <option value={user.id}>
                      {user.id} {user.name}
                    </option>
                  );
                })}
              </select>
              <ErrorMessage
                name="userId"
                component="div"
                className="text-[12px] text-red-500"
              />
              <Input label="Days Amount" name="daysAmount" type="number" />
              <button
                type="submit"
                className="bg-green-200 py-[12px] px-[12px] mt-[20px]"
              >
                Add Item
              </button>
            </Form>
          );
        }}
      </Formik>
    </CustomModal>
  );
};

export default RentModal;
