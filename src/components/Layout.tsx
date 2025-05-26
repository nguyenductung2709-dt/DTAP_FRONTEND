import { Outlet } from "react-router-dom";
import { FaMoon, FaSun } from 'react-icons/fa';
import UserDropdown from "./common-components/UserDropdown";
import Muscle_Black from "../assets/muscle_logo_black.png"
import Muscle_White from "../assets/muscle_logo_white.png"
import { Link } from "react-router-dom";

interface LayoutProps {
  handleMode: () => void;
  darkTheme: boolean;
}
const Layout: React.FC<LayoutProps> = ({ handleMode, darkTheme }) => {
  return (
    <>
      <nav>
        <div className={`${darkTheme ? 'text-white' : 'text-black'} flex items-center justify-center fixed top-0 left-0 z-30 w-full py-6 bg-transparent`}>
          <div className="flex items-center justify-between mx-auto w-11/12 md:w-5/6 gap-4 md:gap-16">
            {/* Left side */}
            <p className="text-sm md:text-base">
              <Link to="/dashboard">
                <img
                  src={darkTheme ? Muscle_White : Muscle_Black}
                  alt="Logo"
                  className="w-10 h-10 md:w-12 md:h-12"
                />
              </Link>
            </p>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center justify-between gap-4 md:gap-8 text-sm md:text-base">
                <a href="/devices"><p className="font-mono">Devices</p></a> 
                <a href="/dashboard"><p className="font-mono">Dashboard</p></a>
              </div>

              {/* Right side */}
              <div className="flex items-center justify-between gap-4 md:gap-8">
                <label className="swap swap-rotate">
                  <span
                    onClick={handleMode}
                    className={`transition-transform transform duration-500 ease-in-out ${
                      darkTheme ? 'rotate-0 text-yellow-400' : 'rotate-180 text-blue-600'
                    }`}
                  >
                    {darkTheme ? (
                      <FaMoon size="1.5em" className="top-navigation-icon" />
                    ) : (
                      <FaSun size="1.5em" className="top-navigation-icon" />
                    )}
                  </span>
                </label>
                <UserDropdown />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Layout;
