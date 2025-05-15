import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChartNoAxesColumn,
  Flag,
  Layers,
  LifeBuoy,
  LogOut,
  Search,
  Settings,
  SquareCheckBig,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import Ic_logo from "../assets/images/Ic_logo.svg";
import { clearCredentials } from "../store/slice/auth.slice";
import Modal from "./common/modal";
import Button from "./common/button";
import toast from "react-hot-toast";

export const Sidebar = () => {
  const location = useLocation();
  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: ChartNoAxesColumn },
    {
      to: "/consignment",
      label: "Consignment",
      icon: Layers,
      startWith: "/consignment-details",
    },
    { to: "/delivery", label: "Delivery", icon: SquareCheckBig },
    { to: "/reporting", label: "Reporting", icon: Flag },
    { to: "/users", label: "Users", icon: Users },
    { to: "/support", label: "Support", icon: LifeBuoy },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const NavLink = ({ to, label, icon: Icon, startWith }: any) => {
    const isActive =
      location.pathname.startsWith(startWith) || location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 py-2 px-3 rounded-[6px] ${
          isActive ? "bg-lightPurple" : ""
        }`}
        onClick={() => setIsOpen(false)}
      >
        <Icon
          className={`${
            location.pathname === to ? "text-purple" : "text-gray"
          }`}
        />
        <span
          className={`font-medium text-base ${
            location.pathname === to ? "text-purple" : "text-black"
          }`}
        >
          {label}
        </span>
      </Link>
    );
  };

  const handleConfirmPopup = () => {
    const table = document.getElementById("table_div");
    const datePicker = document.getElementById("date_range_picker");

    if (showConfirm) {
      setShowConfirm(false);
      table?.classList.remove("table-hidden");
      datePicker?.classList.remove("table-hidden");
    } else {
      setShowConfirm(true);
      datePicker?.classList.add("table-hidden");
      table?.classList.add("table-hidden");
    }
  };

  return (
    <>
      <div className="lg:hidden p-2.5 lg:p-4 flex items-center gap-2.5 border-b border-gray2">
        <button onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </button>
        <Link to={"/dashboard"}>
          <img src={Ic_logo} alt="logo" className="h-5 sm:h-6 md:h-7" />
        </Link>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 lg:w-full bg-white z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:translate-x-0 lg:static lg:block`}
      >
        <div className="border-r border-gray2 w-full h-full py-8 px-4 flex flex-col justify-between relative">
          <button
            onClick={toggleSidebar}
            className="absolute top-6 right-4 lg:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div>
            <Link to={"/dashboard"}>
              <img src={Ic_logo} alt="logo" />
            </Link>

            {/* Search */}
            <div className="my-6 relative border border-gray rounded-lg py-[10px] px-[14px] flex items-center gap-2">
              <Search className="text-gray w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                className="focus-within:outline-none w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              {navLinks.slice(0, 5).map((link) => (
                <NavLink key={link.to} {...link} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              {navLinks.slice(5).map((link) => (
                <NavLink key={link.to} {...link} />
              ))}
            </div>
            <div className="border-t border-gray2"></div>

            {/* User Info */}
            <div
              className="flex items-center gap-1 px-3 rounded-[6px] cursor-pointer"
              onClick={handleConfirmPopup}
            >
              <div className="flex items-center gap-3 truncate">
                <div className="w-8 h-8">
                  <div className="w-8 h-8 rounded-full border text-sm flex items-center justify-center border-gray text-gray">
                    {userDetails?.name?.[0]}
                  </div>
                </div>
                <div className="truncate">
                  <div className="text-darkBlack text-sm font-medium">
                    {userDetails?.name}
                  </div>
                  <p className="text-gray text-sm truncate">
                    {userDetails?.email}
                  </p>
                </div>
              </div>
              <div className="h-5 w-5">
                <LogOut className="text-gray h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <Modal onClose={handleConfirmPopup} isOpen={true}>
          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
            style={{
              zIndex: 99999999,
            }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-bold">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-center mt-5 w-full gap-5 items-center">
                <div onClick={handleConfirmPopup}>
                  <Button
                    text="Cancel"
                    className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  />
                </div>
                <div
                  onClick={() => {
                    dispatch(clearCredentials());
                    navigate("/login");
                    toast.success("Log out successfully!!", {
                      position: "top-right",
                    });
                  }}
                >
                  <Button
                    text="Confirm"
                    className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
