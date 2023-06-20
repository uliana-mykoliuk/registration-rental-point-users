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
      <div className="bg-gray-900 py-[12px] px-[24px] text-white flex items-center justify-end fixed top-0 w-full">
        <div className="flex items-center gap-x-[30px]">
          <Link className="nav-link text-white" href="/">
            HOME
          </Link>
          <Link className="nav-link text-white" href="/rental-store">
            PRODUCTS
          </Link>
          <Link className="nav-link text-white" href="/rental-store">
            USERS
          </Link>
          <Link className="nav-link text-white" href="/rental-store">
            RENT
          </Link>
          {currentUser ? (
            <span className="nav-link" onClick={signOutHandler}>
              SIGN OUT
            </span>
          ) : (
            <Link className="nav-link text-white" href="/auth">
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Navigation;
