import { Link, useLocation } from "react-router-dom";
import Ic_logo from "../assets/images/Ic_logo.svg";
import {
  ChartNoAxesColumn,
  //   Flag,
  Search,
  //   SquareCheckBig,
  //   Users,
} from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();

  return (
    <>
      <div className="border-r border-gray2 w-full h-full py-8 px-4 flex flex-col justify-between">
        <div>
          <Link to={"/dashboard"}>
            <img src={Ic_logo} alt="logo" />
          </Link>
          <div className="my-6 relative border border-gray rounded-lg py-[10px] px-[14px] flex items-center gap-2">
            <Search className="text-gray w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              className="focus-within:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Link
              to={"/dashboard"}
              className={`flex items-center gap-3 py-2 px-3 rounded-[6px] ${
                location.pathname === "/dashboard" ? "bg-lightPurple" : ""
              }`}
            >
              <ChartNoAxesColumn
                className={`${
                  location.pathname === "/dashboard"
                    ? "text-purple"
                    : "text-gray"
                }`}
              />
              <span
                className={`font-medium text-base ${
                  location.pathname === "/dashboard"
                    ? "text-purple"
                    : "text-black"
                }`}
              >
                Dashboard
              </span>
            </Link>
            {/* <Link
              to={"/dashboard"}
              className={`flex items-center gap-3 py-2 px-3 rounded-[6px] ${
                location.pathname === "/dashboard" ? "bg-lightPurple" : ""
              }`}
            >
              <ChartNoAxesColumn
                className={`${
                  location.pathname === "/dashboard"
                    ? "text-purple"
                    : "text-gray"
                }`}
              />
              <span
                className={`font-medium text-base ${
                  location.pathname === "/dashboard"
                    ? "text-purple"
                    : "text-black"
                }`}
              >
                Consignment
              </span>
            </Link>
            <Link
              to={"/dashboard"}
              className={`flex items-center gap-3 py-2 px-3 rounded-[6px] ${
                location.pathname === "/dashboard" ? "bg-lightPurple" : ""
              }`}
            >
              <SquareCheckBig
                className={`${
                  location.pathname === "/dashboard"
                    ? "text-purple"
                    : "text-gray"
                }`}
              />
              <span
                className={`font-medium text-base ${
                  location.pathname === "/dashboard"
                    ? "text-purple"
                    : "text-black"
                }`}
              >
                Delivery
              </span>
            </Link>
            <Link
              to={"/dashboard"}
              className={`flex items-center gap-3 py-2 px-3 rounded-[6px] ${
                location.pathname === "/dashboard" ? "bg-lightPurple" : ""
              }`}
            >
              <Flag
                className={`${
                  location.pathname === "/dashboard"
                    ? "text-purple"
                    : "text-gray"
                }`}
              />
              <span
                className={`font-medium text-base ${
                  location.pathname === "/dashboard"
                    ? "text-purple"
                    : "text-black"
                }`}
              >
                Reporting
              </span>
            </Link>
            <Link
              to={"/dashboard"}
              className={`flex items-center gap-3 py-2 px-3 rounded-[6px] ${
                location.pathname === "/dashboard" ? "bg-lightPurple" : ""
              }`}
            >
              <Users
                className={`${
                  location.pathname === "/dashboard"
                    ? "text-purple"
                    : "text-gray"
                }`}
              />
              <span
                className={`font-medium text-base ${
                  location.pathname === "/dashboard"
                    ? "text-purple"
                    : "text-black"
                }`}
              >
                Users
              </span>
            </Link> */}
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};
