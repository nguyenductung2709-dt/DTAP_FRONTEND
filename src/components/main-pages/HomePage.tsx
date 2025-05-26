import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC<{ darkTheme: boolean }> = ({ darkTheme }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen w-screen px-4 ${
        darkTheme ? "bg-primary_dark text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-5xl py-16">
        {/* Left: Text */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-6">
          <h1 className="font-primary text-4xl md:text-6xl font-bold mb-2">
            Welcome to <span className="text-blue-500">Muscle Tracker</span>
          </h1>
          <p className="font-mono text-lg md:text-2xl text-gray-400 max-w-xl">
            Track your muscle activity, monitor your progress, and optimize your workouts with real-time EMG data. 
            <br />
            <span className="text-blue-400">Empower your fitness journey with science.</span>
          </p>
          <div className="flex gap-4 mt-6">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-lg font-mono font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-base md:text-lg shadow"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className={`px-6 py-3 rounded-lg font-mono font-semibold border-2 ${
                darkTheme
                  ? "border-white text-white hover:bg-gray-700"
                  : "border-black text-black hover:bg-gray-200"
              } transition-all text-base md:text-lg`}
            >
              Log In
            </Link>
          </div>
        </div>
        {/* Right: Image */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/product.png"
            alt="Muscle Tracker Product"
            className="w-full max-w-xs md:max-w-md rounded-xl shadow-lg border border-gray-300"
            style={{ background: darkTheme ? "#252525" : "#fff" }}
          />
        </div>
      </div>
      <footer className="mt-12 text-center text-xs md:text-sm text-gray-400 font-mono">
        &copy; {new Date().getFullYear()} Muscle Tracker Team. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
