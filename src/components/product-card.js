import Link from "next/link";

const ProductCard = ({ id, title, image, handleEditCategory }) => {
  return (
    <div className="bg-white shadow-2xl border border-[#aaa]">
      <div className="relative">
        <img src={image} alt="" className="w-[100%] h-[200px]" />
        <h3 className="absolute w-full h-full bg-[rgba(0,0,0,0.5)] top-0 text-white text-[36px] flex items-center justify-center uppercase">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-2">
        <button
          onClick={handleEditCategory}
          type="button"
          className="bg-green-300 py-[12px] px-[12px] w-full text-center"
        >
          EDIT
        </button>
        <Link
          href={"/categories/" + id}
          className="bg-purple-300 py-[12px] px-[12px] w-full text-center"
        >
          GO TO PRODUCTS
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
