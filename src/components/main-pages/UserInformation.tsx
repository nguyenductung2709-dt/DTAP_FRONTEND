import React from "react";
import { useUser } from "../../context/UserContext";

interface UserInformationProps {
  darkTheme: boolean;
}

const UserInformation: React.FC<UserInformationProps> = ({ darkTheme }) => {
  const { user } = useUser();

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen w-screen ${
        darkTheme ? "bg-primary_dark text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-3xl md:text-5xl font-bold font-primary mb-8 text-center">User Information</h1>
      <div
        className={`p-4 md:p-6 rounded-lg shadow-md w-11/12 md:w-3/4 max-w-lg font-mono ${
          darkTheme ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-300"
        }`}
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">
          Welcome, {String(user.username) || "Guest"}!
        </h2>
        <div>
          <h3 className="text-base md:text-lg font-medium mb-2">Account Details:</h3>
          <p className="text-sm md:text-base">Username: {user.username || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInformation;