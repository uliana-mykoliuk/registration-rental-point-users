import Navigation from "./navigation";

const Layout = ({ title, children }) => {
  return (
    <>
      <Navigation />
      <div className="pt-[56px] px-[50px] min-h-screen grid justify-items-center">
        <div className="container pb-[50px] flex flex-col w-full">
          <h1 className="text-center text-purple-500 text-[48px] mb-[20px] mt-[20px]">{title}</h1>
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
