import { useLocation } from "react-router-dom";
// import Navbar from "../components/Navbar";
const Layout = ({ children }) => {
  const location = useLocation();

  // Pages without Navbar (e.g., AuthPage)
//   const hideNavbar = ["/auth"].includes(location.pathname);

  return (
    <>
      {/* {!hideNavbar && <Navbar />} */}
      {children}
    </>
  );
};

export default Layout;
