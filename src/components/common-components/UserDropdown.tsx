import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import authenticationService from "../../services/authentication";

const UserDropdown: React.FC = () => {
  const { user, setUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (user) {
        if (user.token) {
          authenticationService.setToken(user.token);
        } else {
          console.error("User token is null, cannot set token.");
        }
      } else {
        console.error("User is null, cannot set token.");
      }
      await authenticationService.logout();
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      setIsOpen(false);
      setUser({ username: null, token: null }); // Clear user state
        window.location.href = "/"; // Redirect to login page after logout
    } catch (err) {
        console.error("Logout error:", err);
    }
  };

  return (
    <div className="relative">
      {/* User Icon and Username */}
      {user.token && (
        <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
          {user && user.username ? user.username.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg text-sm font-mono md:text-base">
          <a href="/user-information">
            <button
              className="block w-full px-3 md:px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              User Information
            </button>
          </a>
          <button
            onClick={handleLogout}
            className="block w-full px-3 md:px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;