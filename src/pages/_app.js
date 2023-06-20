import React from "react";
import "../styles/index.scss";
import { UserProvider } from "../contexts/user-context";
import { ProductsProvider } from "../contexts/product-context";

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <ProductsProvider>
        <Component {...pageProps} />
      </ProductsProvider>
    </UserProvider>
  );
}
