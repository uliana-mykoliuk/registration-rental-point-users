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
      <div className="bg-gray-900 py-[16px] px-[24px] text-white flex items-center justify-end">
        <Link className="logo-container" href="/"></Link>
        <div className="flex gap-x-[30px]">
          <Link className="nav-link text-white" href="/">
            HOME
          </Link>

          {currentUser ? (
            <span className="nav-link" onClick={signOutHandler}>
              {" "}
              SIGN OUT{" "}
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
