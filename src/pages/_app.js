import React from "react";
import "../styles/index.scss";
import { UserProvider } from "../contexts/user-context";

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
