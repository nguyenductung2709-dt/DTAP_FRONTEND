import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authenticationService from "../../services/authentication";

interface ForgotPasswordProps {
  darkTheme: boolean;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ darkTheme }) => {
  const [username, setUsername] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [modalData, setModalData] = useState<{ title: string; message: string } | null>(null);
  const navigate = useNavigate();

  const handleValidateToken = async () => {
    try {
      const response = await authenticationService.validateToken({
        username,
        token,
      });
      if (response.message === "Token is valid") {
        setIsTokenValid(true);
        setModalData({
          title: "Token Validated",
          message: "Your token is valid. You can now reset your password.",
        });
      } else {
        setIsTokenValid(false);
        setModalData({
          title: "Invalid Token",
          message: "The token you entered is invalid. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setIsTokenValid(false);
      setModalData({
        title: "Error",
        message: "An error occurred while validating the token. Please try again.",
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await authenticationService.recoverPassword(username);
      setNewPassword(response.password);
      setModalData({
        title: "Password Reset Successful",
        message: `Your password has been reset successfully. Your new password is: ${response.password}`,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      setModalData({
        title: "Error",
        message: "Failed to reset password. Please try again.",
      });
    }
  };

  const closeModal = () => {
    if (modalData?.title === "Password Reset Successful") {
      navigate("/login"); // Redirect to login after closing the second modal
    }
    setModalData(null);
  };

  return (
    <div
      className={`${darkTheme ? "bg-primary_dark text-white" : "bg-white text-black"} flex items-center justify-center min-h-screen w-screen`}
    >
      <div className="flex flex-col gap-4 w-11/12 max-w-sm p-4 md:p-0">
        <h2 className="font-primary text-3xl md:text-5xl font-bold mb-4 text-center">Forgot Password</h2>
        <p className="text-xs md:text-sm text-gray-500 mb-6 text-center">
          Enter your username and the recovery token you received during registration. If the token is valid, you can reset your password.
        </p>

        {isTokenValid === null || isTokenValid === false ? (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleValidateToken();
              }}
              className="space-y-4"
            >
              {/* Username Field */}
              <div className="flex items-center border-2 border-black-100 rounded-xl px-4 md:px-6 py-3 md:py-4">
                <input
                  type="text"
                  id="username"
                  className="w-full bg-transparent outline-none placeholder:font-mono text-sm md:text-base"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Token Field */}
              <div className="flex items-center border-2 border-black-100 rounded-xl px-4 md:px-6 py-3 md:py-4">
                <input
                  type="text"
                  id="token"
                  className="w-full bg-transparent outline-none placeholder:font-mono text-sm md:text-base"
                  placeholder="Recovery Token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </div>

              {/* Validate Token Button */}
              <button
                type="submit"
                className={`font-semibold w-full text-sm md:text-base ${darkTheme ? "text-white bg-primary_dark hover:border-gray-500 focus:outline-gray-500" : "text-black bg-white hover:border-gray-700 focus:outline-gray-700"}`}
                style={{
                  borderRadius: "14px",
                  border: `2px solid ${darkTheme ? "white" : "black"}`,
                  padding: "0.6em 1.2em",
                  fontWeight: 500,
                  fontFamily: '"Geist Mono", monospace',
                  cursor: "pointer",
                  transition: "border-color 0.25s, outline-color 0.25s, background-color 0.25s",
                }}
              >
                Validate Token
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-xs md:text-sm text-gray-500 mb-6 text-center">
              Your token is valid. Click the button below to reset your password.
            </p>
            <button
              onClick={handleResetPassword}
              className={`font-semibold w-full text-sm md:text-base ${darkTheme ? "text-white bg-primary_dark hover:border-gray-500 focus:outline-gray-500" : "text-black bg-white hover:border-gray-700 focus:outline-gray-700"}`}
              style={{
                borderRadius: "14px",
                border: `2px solid ${darkTheme ? "white" : "black"}`,
                padding: "0.6em 1.2em",
                fontWeight: 500,
                fontFamily: '"Geist Mono", monospace',
                cursor: "pointer",
                transition: "border-color 0.25s, outline-color 0.25s, background-color 0.25s",
              }}
            >
              Reset Password
            </button>
          </>
        )}

        {/* Back to Login Link */}
        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-xs md:text-sm text-blue-500 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`p-4 md:p-6 rounded-lg shadow-lg ${darkTheme ? "bg-gray-800 text-white" : "bg-white text-black"} w-11/12 max-w-md`}>
            <h3 className="text-lg md:text-xl font-bold mb-4">{modalData.title}</h3>
            <p className="text-sm md:text-base mb-4">{modalData.message}</p>
            <button
              onClick={closeModal}
              className="px-3 md:px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;