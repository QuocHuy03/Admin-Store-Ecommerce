import React, { useContext } from "react";
import SideBar from "./SideBar";
import { AppContext } from "../context/AppContextProvider";
import Header from "./Header";

export default function Layout({ children }) {
  const { isOpen, setIsOpen } = useContext(AppContext);
  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative">
        <Header/>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={handleToggleSidebar}
        ></div>
      )}
      <SideBar />
      <div className=" p-4 sm:ml-64">{children}</div>
    </div>
  );
}
