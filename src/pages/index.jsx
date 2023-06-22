import { useEffect } from "react";
import Layout from "../components/layout";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/products"); // Navigates to '/products' when the component mounts
  }, []);
  return <Layout></Layout>;
};

export default Home;
