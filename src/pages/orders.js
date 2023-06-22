import { useEffect, useState } from "react";
import Layout from "../components/layout";
import {
  calculateTotalExpectedIncome,
  calculateTotalIncome,
  deleteOrderById,
  editOrderById,
  editProducRentStatustById,
  getCategoriesFromFirebase,
  removeProductFromUserCollection,
} from "../utils/firebase/firebase";
import StopIco from "../assets/disable.svg";
import DeleteIco from "../assets/delete.svg";
import Image from "next/image";
import moment from "moment";

const OrdersTable = ({
  orders,
  itemsPerPage,
  handleStopOrder,
  handleDeleteOrder,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <table className="border border-[#aaa]">
        <thead>
          <tr>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              User
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              ProductID
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Start Date
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Expected Day Ammount
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Current Day Ammount
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              End Date
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Status
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Rent per Day
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Expected Income
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Income
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems?.map((order) => (
            <tr key={order.id}>
              <td className="border border-[#aaa] p-[15px]">
                {order.userId} {order.userName}
              </td>
              <td className="border border-[#aaa] p-[15px]">
                {order.productId}
              </td>
              <td className="border border-[#aaa] p-[15px]">
                {order.startDay}
              </td>
              <td className="border border-[#aaa] p-[15px]">
                {order.daysAmount}
              </td>
              <td className="border border-[#aaa] p-[15px]">
                {order?.currentDaysAmount
                  ? order?.currentDaysAmount
                  : moment().diff(
                      moment(order.startDay, "DD-MM-YYYY hh:mm:ss"),
                      "days"
                    ) + 1}
              </td>
              <td className="border border-[#aaa] p-[15px]">
                {order?.endDay || "-"}
              </td>
              <td className="border border-[#aaa] p-[15px]">{order?.status}</td>
              <td className="border border-[#aaa] p-[15px]">{order?.price}</td>
              <td className="border border-[#aaa] p-[15px]">
                {order?.expectedIncome}
              </td>
              <td className="border border-[#aaa] p-[15px]">
                {order?.income || 0}
              </td>
              <td className="border border-[#aaa] p-[15px]">
                <div className="flex gap-[20px]">
                  <button
                    onClick={() => handleStopOrder(order)}
                    className="bg-green-300 w-[32px] h-[32px] text-[24px] flex items-center justify-center leading-[24px]"
                  >
                    <Image src={StopIco} alt="delete" width={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order)}
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

const Orders = () => {
  const itemsPerPage = 5;
  const [orders, setOrders] = useState([]);
  const [updateData, setUpdateData] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(null);
  const [income, setTotalIncome] = useState(0);
  const [expectedIncome, setTotalExpectedIncome] = useState(0);

  useEffect(() => {
    if (orders) {
      if (searchValue) {
        setFilteredOrders(
          orders
            .filter((orders) =>
              orders.userName.toLowerCase().includes(searchValue.toLowerCase())
            )
            .sort((a, b) => b?.createDate?.seconds - a?.createDate?.seconds)
        );
      } else {
        setFilteredOrders(
          orders.sort((a, b) => b?.createDate?.seconds - a?.createDate?.seconds)
        );
      }
    }
  }, [searchValue, orders]);

  const fetchData = async () => {
    const ordersArr = await getCategoriesFromFirebase("orders");
    const totalIncome = await calculateTotalIncome();
    const totaExpectedIncome = await calculateTotalExpectedIncome();
    setTotalIncome(totalIncome);
    setTotalExpectedIncome(totaExpectedIncome);
    setOrders(ordersArr);
    setUpdateData(false);
  };

  useEffect(() => {
    if (updateData) {
      fetchData();
    }
  }, [updateData]);

  console.log(orders);

  const handleStopOrder = async (order) => {
    const data = {
      ...order,
      endDay: moment().format("DD-MM-YYYY hh:mm:ss"),
      currentDaysAmount:
        moment().diff(moment(order.startDay, "DD-MM-YYYY hh:mm:ss"), "days") +
        1,
      income:
        (moment().diff(moment(order.startDay, "DD-MM-YYYY hh:mm:ss"), "days") +
          1) *
        order.price,
      status: "CLOSED",
    };
    await editProducRentStatustById(order.categoryId, order.productId, false);
    await removeProductFromUserCollection(order.userId, order.productId);
    await editOrderById(order.id, data);
    setUpdateData(true);
  };

  const handleDeleteOrder = async (order) => {
    try {
      await editProducRentStatustById(order.categoryId, order.productId, false);
      await removeProductFromUserCollection(order.userId, order.productId);
      await deleteOrderById(order.id);
      setUpdateData(true); // Notify the parent component of the deleted product
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };
  return (
    <Layout title={"Orders"}>
      <div className="grid grid-cols-2 gap-[30px] mb-[30px]">
        <div className="bg-white shadow-xl grid items-center justify-items-center py-[30px] border-[5px] border-purple-300 text-[28px]">
          Expected Income {expectedIncome}
        </div>
        <div className="bg-white shadow-xl grid items-center justify-items-center py-[30px] border-[5px] border-purple-300 text-[28px]">
          Total Income {income}
        </div>
      </div>
      <div className="flex items-center justify-between mb-[50px]">
        <input
          name="search"
          placeholder="Search orders by username"
          onChange={(event) => {
            setSearchValue(event.target.value);
          }}
          className="border border-[#aaa] px-[16px] py-[8px]"
        />
      </div>
      {filteredOrders && filteredOrders.length > 0 ? (
        <OrdersTable
          orders={orders}
          itemsPerPage={itemsPerPage}
          handleStopOrder={handleStopOrder}
          handleDeleteOrder={handleDeleteOrder}
        />
      ) : (
        <h2 className="text-center text-[24px]">No orders found...</h2>
      )}
    </Layout>
  );
};

export default Orders;
