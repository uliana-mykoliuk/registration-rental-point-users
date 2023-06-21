import Navigation from "./navigation";

const Layout = ({ children }) => {
  return (
    <>
      <Navigation />
      <div className="pt-[56px] px-[50px] min-h-screen grid justify-items-center">
        <div className="container py-[50px] flex flex-col w-full">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
