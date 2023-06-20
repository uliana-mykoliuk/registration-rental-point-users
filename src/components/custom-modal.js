import Modal from "react-modal";

import CloseImage from "../assets/close.svg";
import Image from "next/image";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: "620px",
    maxHeight: "90%",
  },
};

const CustomModal = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
      <div className="flex items-center justify-between border-b border-[#aaa] pb-[16px] gap-x-[30px]">
        <h3 className="text-[24px] text-purple-500 font-light text-center">
          {title}
        </h3>
        <button type="button" onClick={onClose}>
          <Image src={CloseImage} alt="close" />
        </button>
      </div>
      <div>{children}</div>
    </Modal>
  );
};

export default CustomModal;
