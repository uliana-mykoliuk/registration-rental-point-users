import { useEffect, useState } from "react";
import Layout from "../components/layout";
import {
  getCategoriesFromFirebase,
  getProductsByCategory,
  pushDataToFirebase,
} from "../utils/firebase/firebase";
import AddUserModal from "../components/add-user-modal";
import EditIco from "../assets/edit.svg";
import DeleteIco from "../assets/delete.svg";
import Image from "next/image";

const UsersTable = ({
  users,
  itemsPerPage,
  handleEditProduct,
  handleDeleteProduct,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const [editModal, setEditModal] = useState({ open: false, id: null });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <AddUserModal
        product={editModal.product}
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, product: null })}
        submitFunc={async (values) => {
          await handleEditProduct(editModal.product.id, values);
          setEditModal({ open: false, product: null });
        }}
      />
      <table className="border border-[#aaa]">
        <thead>
          <tr>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Name
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Email
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Phone
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Product Ids
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((user) => (
            <tr key={user.id}>
              <td className="border border-[#aaa] p-[15px]">{user.name}</td>
              <td className="border border-[#aaa] p-[15px]">{user.email}</td>
              <td className="border border-[#aaa] p-[15px]">{user.phone}</td>
              <td className="border border-[#aaa] p-[15px]">
                {user.products.map((item) => (
                  <div>{item}</div>
                ))}
              </td>
              <td className="border border-[#aaa] p-[15px]">
                <div className="flex gap-[20px]">
                  <button
                    onClick={() => setEditModal({ open: true, product: user })}
                    className="bg-green-300 w-[32px] h-[32px] text-[24px] flex items-center justify-center leading-[24px]"
                  >
                    <Image src={EditIco} alt="delete" width={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(user.id)}
                    className="bg-green-300 w-[32px] h-[32px] text-[24px] flex items-center justify-center leading-[24px]"
                  >
                    <Image src={DeleteIco} alt="delete" width={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-[20px] ml-[auto] mt-[30px]">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="bg-green-300 w-[32px] h-[32px] text-[24px] leading-[24px] flex items-center justify-center rotate-180"
        >
          <span>&rsaquo;</span>
        </button>

        <div className="flex gap-[12px]">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              disabled={currentPage === index + 1}
              className={currentPage === index + 1 && "text-purple-500"}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="bg-green-300 w-[32px] h-[32px] text-[24px] flex items-center justify-center leading-[24px]"
        >
          <span>&rsaquo;</span>
        </button>
      </div>
    </>
  );
};

const Users = () => {
  const itemsPerPage = 5;
  const [users, setUsers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState();
  const [updateData, setUpdateData] = useState(true);

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

  console.log(users);

  const onAddUser = async (values) => {
    const res = await pushDataToFirebase("custommers", values);
    setUpdateData(true);
    setIsModalOpen(false);
  };

  // const handleEditProduct = async (id, product) => {
  //   await editProductById(categoryId, id, product);
  //   setUpdateData(true);
  // };

  // const handleDeleteProduct = async (id) => {
  //   try {
  //     await deleteProductById(categoryId, id);
  //     setUpdateData(true); // Notify the parent component of the deleted product
  //   } catch (error) {
  //     console.error("Error deleting product:", error);
  //   }
  // };
  return (
    <Layout>
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submitFunc={onAddUser}
      />
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="bg-purple-500 py-[8px] px-[12px] self-end mb-[50px]"
      >
        Add User
      </button>

      <UsersTable
        users={users}
        itemsPerPage={itemsPerPage}
        // handleEditProduct={handleEditProduct}
        // handleDeleteProduct={handleDeleteProduct}
      />
    </Layout>
  );
};

export default Users;
