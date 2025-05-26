import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import authenticationService from "../../services/authentication"; // keep it as register

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }).max(50),
});

interface SignupProps {
  darkTheme: boolean;
}

const Signup: React.FC<SignupProps> = ({ darkTheme }) => {
  const { register: formRegister, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const [modalData, setModalData] = useState<{
    password: string;
    tokens: string[];
  } | null>(null);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await authenticationService.register({
        username: data.username,
      });

      const { password, tokens } = response;

      // Set modal data
      setModalData({ password, tokens });

      reset();
    } catch (error: any) {
      console.error("Signup error:", error);

      let errorMessage = "An unexpected error occurred. Please try again later.";
      if (error?.response?.data?.error === "Validation error") {
        errorMessage = "Username already exists.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      alert(errorMessage);
    }
  };

  const closeModal = () => {
    setModalData(null);
    window.location.href = "/login";
  };

  return (
    <div className={`${darkTheme ? 'bg-primary_dark text-white' : 'bg-white text-black'} flex items-center justify-center min-h-screen w-screen`}>
      <div className="flex flex-col gap-4 w-11/12 max-w-sm p-4 md:p-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-4 md:gap-20">
          <h2 className="font-primary text-3xl md:text-5xl font-bold">Register</h2>
          <a href="/login" className="text-sm text-gray-400 font-mono underline-offset-4 hover:underline">
            back to log in
          </a>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <div className="flex items-center border-2 border-black-100 rounded-xl px-4 md:px-6 py-3 md:py-4">
              <input
                type="text"
                id="username"
                className="w-full bg-transparent outline-none placeholder:font-mono text-sm md:text-base"
                placeholder="Username"
                {...formRegister("username")}
              />
            </div>
            {errors.username && <p className="font-mono text-xs md:text-sm text-red-500">{errors.username.message}</p>}
          </div>

          <button
            type="submit"
            className={`font-semibold w-full text-sm md:text-base ${darkTheme ? 'text-white bg-primary_dark hover:border-gray-500 focus:outline-gray-500' : 'text-black bg-white hover:border-gray-700 focus:outline-gray-700'}`}
            style={{
              borderRadius: '14px',
              border: `2px solid ${darkTheme ? 'white' : 'black'}`,
              padding: '0.6em 1.2em',
              fontWeight: 500,
              fontFamily: '"Geist Mono", monospace',
              cursor: 'pointer',
              transition: 'border-color 0.25s, outline-color 0.25s, background-color 0.25s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = darkTheme ? '#666666' : '#333333';
              e.currentTarget.style.backgroundColor = darkTheme ? 'inherit' : '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = darkTheme ? 'white' : 'black';
              e.currentTarget.style.backgroundColor = darkTheme ? 'inherit' : 'white';
            }}
            onFocus={(e) => e.currentTarget.style.outline = `4px auto ${darkTheme ? '#666666' : '-webkit-focus-ring-color'}`}
            onBlur={(e) => e.currentTarget.style.outline = 'none'}
          >
            Register
          </button>
        </form>
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`p-4 md:p-6 rounded-lg shadow-lg ${darkTheme ? 'bg-gray-800 text-white' : 'bg-white text-black'} w-11/12 max-w-md`}>
            <h3 className="text-lg md:text-xl font-bold mb-4">Signup Successful!</h3>
            <p className="text-sm md:text-base mb-4">Please save the following information in a safe place:</p>
            <div className="mb-4">
              <p className="text-sm md:text-base"><strong>Password:</strong> {modalData.password}</p>
              <p className="text-sm md:text-base mt-2"><strong>Tokens:</strong></p>
              <ul className="list-disc list-inside text-sm md:text-base">
                {modalData.tokens.map((token, index) => (
                  <li key={index}>Token {index + 1}: {token}</li>
                ))}
              </ul>
            </div>
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

export default Signup;