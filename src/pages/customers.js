import { useEffect, useState } from "react";
import Layout from "../components/layout";
import {
  deleteCustomerById,
  editCustomerById,
  getCategoriesFromFirebase,
  getProductsByCategory,
  pushDataToFirebase,
} from "../utils/firebase/firebase";
import AddUserModal from "../components/add-user-modal";
import EditIco from "../assets/edit.svg";
import DeleteIco from "../assets/delete.svg";
import Image from "next/image";
import Input from "../components/input";

const UsersTable = ({
  users,
  itemsPerPage,
  handleEditСustomer,
  handleDeleteCustomer,
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
        user={editModal.product}
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, product: null })}
        submitFunc={async (values) => {
          await handleEditСustomer(editModal.product.id, values);
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
                {user?.products && user?.products.length > 0
                  ? user.products.map((item) => <div>{item}</div>)
                  : "No products in rent"}
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
                    onClick={() => handleDeleteCustomer(user.id)}
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
  const [users, setUsers] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState();
  const [updateData, setUpdateData] = useState(true);

  useEffect(() => {
    if (users) {
      if (searchValue) {
        setFilteredUsers(
          users
            .filter((user) =>
              user.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .sort((a, b) => b?.createDate?.seconds - a?.createDate?.seconds)
        );
      } else {
        setFilteredUsers(
          users.sort((a, b) => b?.createDate?.seconds - a?.createDate?.seconds)
        );
      }
    }
  }, [searchValue, users]);

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

  const onAddUser = async (values) => {
    await pushDataToFirebase("custommers", values);
    setUpdateData(true);
    setIsModalOpen(false);
  };

  const handleEditСustomer = async (id, customer) => {
    await editCustomerById(id, customer);
    setUpdateData(true);
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomerById(id);
      setUpdateData(true); // Notify the parent component of the deleted product
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Layout title="Customers">
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submitFunc={onAddUser}
      />
      <div className="flex items-center justify-between mb-[50px]">
        <input
          name="search"
          placeholder="Search custommer"
          onChange={(event) => {
            setSearchValue(event.target.value);
          }}
          className="border border-[#aaa] px-[16px] py-[8px]"
        />
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-500 py-[8px] px-[12px] self-end"
        >
          Add User
        </button>
      </div>
      {filteredUsers && (
        <UsersTable
          users={filteredUsers}
          itemsPerPage={itemsPerPage}
          handleEditСustomer={handleEditСustomer}
          handleDeleteCustomer={handleDeleteCustomer}
        />
      )}
    </Layout>
  );
};

export default Users;
