import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import AddProductModal from "../../components/add-product-modal";
import {
  addProductToCategory,
  deleteProductById,
  editProducRentStatustById,
  editProductById,
  getProductsByCategory,
  pushDataToFirebase,
  pushProductToUserCollection,
} from "../../utils/firebase/firebase";
import EditIco from "../../assets/edit.svg";
import DeleteIco from "../../assets/delete.svg";
import Image from "next/image";
import RentModal from "../../components/rent-modal";

const ProductTable = ({
  products,
  itemsPerPage,
  handleEditProduct,
  handleDeleteProduct,
  handleRentProduct,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const [editModal, setEditModal] = useState({ open: false, product: null });
  const [rentModal, setRentModal] = useState({ open: false, product: null });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <RentModal
        product={rentModal.product}
        isOpen={rentModal.open}
        onClose={() => setRentModal({ open: false, product: null })}
        submitFunc={async (values) => {
          handleRentProduct(rentModal.product.id, values);
          console.log("rent", values);
          setRentModal({ open: false, product: null });
        }}
      />
      <AddProductModal
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
              Title
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Description
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Price
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Image
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              In rent
            </th>
            <th className="border border-[#aaa] p-[15px] bg-purple-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((product) => (
            <tr key={product.id}>
              <td className="border border-[#aaa] p-[15px]">{product.title}</td>
              <td className="border border-[#aaa] p-[15px]">
                {product.description}
              </td>
              <td className="border border-[#aaa] p-[15px]">{product.price}</td>
              <td className="border border-[#aaa] p-[15px]">
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ maxWidth: "100px" }}
                />
              </td>

              <td className="border border-[#aaa] p-[15px]">
                {product?.rented ? "Yes" : "No"}
              </td>
              <td className="border border-[#aaa] p-[15px]">
                <div className="flex gap-[20px]">
                  <button
                    type="button"
                    disabled={product.rented}
                    onClick={() =>
                      setRentModal({ open: true, product: product })
                    }
                    className="bg-green-300 px-[10px] h-[32px] text-[24px] flex items-center justify-center leading-[24px] disabled:bg-[#aaa]"
                  >
                    Rent
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditModal({ open: true, product: product })
                    }
                    className="bg-green-300 w-[32px] h-[32px] text-[24px] flex items-center justify-center leading-[24px]"
                  >
                    <Image src={EditIco} alt="delete" width={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product.id)}
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

const ProductsPage = () => {
  const router = useRouter();
  const categoryId = router.query.id;

  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState();
  const [updateData, setUpdateData] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(null);

  useEffect(() => {
    if (products) {
      if (searchValue) {
        setFilteredProducts(
          products
            .filter((products) =>
              products.title.toLowerCase().includes(searchValue.toLowerCase())
            )
            .sort((a, b) => b?.createDate?.seconds - a?.createDate?.seconds)
        );
      } else {
        setFilteredProducts(
          products.sort(
            (a, b) => b?.createDate?.seconds - a?.createDate?.seconds
          )
        );
      }
    }
  }, [searchValue, products]);

  const fetchData = async () => {
    const productsArray = await getProductsByCategory(categoryId);
    setProducts(productsArray);
    setUpdateData(false);
  };

  useEffect(() => {
    if (categoryId) {
      if (updateData) {
        fetchData();
      }
    }
  }, [updateData, categoryId]);

  const onAddProduct = async (values) => {
    await addProductToCategory(categoryId, values);
    setUpdateData(true);
    setIsModalOpen(false);
  };

  const handleEditProduct = async (id, product) => {
    await editProductById(categoryId, id, product);
    setUpdateData(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProductById(categoryId, id);
      setUpdateData(true); // Notify the parent component of the deleted product
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleRentProduct = async (id, values) => {
    await editProducRentStatustById(categoryId, id, true);
    await pushProductToUserCollection(values.userId, id);
    await pushDataToFirebase("orders", values);
    setUpdateData(true);
  };

  return (
    <Layout title="Products">
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submitFunc={onAddProduct}
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
          Add Product
        </button>
      </div>

      {filteredProducts && (
        <ProductTable
          products={filteredProducts}
          itemsPerPage={itemsPerPage}
          handleEditProduct={handleEditProduct}
          handleDeleteProduct={handleDeleteProduct}
          handleRentProduct={handleRentProduct}
        />
      )}
    </Layout>
  );
};

export default ProductsPage;
