import { Fragment, useContext } from "react";

import { UserContext } from "../contexts/user-context";

import { signOutUser } from "../utils/firebase/firebase";
import Link from "next/link";

const Navigation = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const signOutHandler = async () => {
    await signOutUser();
    setCurrentUser(null);
  };

  return (
    <Fragment>
      <div className="bg-gray-900 py-[12px] px-[24px] text-white flex items-center justify-end fixed top-0 w-full z-[1]">
        <div className="flex items-center gap-x-[30px]">
          {currentUser ? (
            <>
              <Link className="nav-link text-white hidden" href="/">
                HOME
              </Link>
              <Link className="nav-link text-white" href="/products">
                PRODUCTS
              </Link>
              <Link className="nav-link text-white" href="/customers">
                CUSTOMERS
              </Link>
              <Link className="nav-link text-white" href="/orders">
                ORDERS
              </Link>
              <span className="nav-link" onClick={signOutHandler}>
                SIGN OUT
              </span>
            </>
          ) : (
            <Link className="nav-link text-white" href="/sign-in">
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Navigation;
