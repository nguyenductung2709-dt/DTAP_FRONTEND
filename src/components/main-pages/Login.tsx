import { useForm } from "react-hook-form";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import authenticationService from "../../services/authentication"; // keep it as register
import { Link } from "react-router-dom";

const formSchema = z.object({
  username: z.string().min(1, {message: "Username is required"}).max(50),
  password: z.string().min(1, {message: "Password is required"}).min(8, {message: "Password must be at least 8 characters."}),
});

interface LoginProps {
  darkTheme: boolean;
}

const Login: React.FC<LoginProps> = ({ darkTheme }) => {
  const {register, handleSubmit, reset, formState:{errors} } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await authenticationService.login({
        username: data.username,
        password: data.password,
      });
      const token = response.token;
      alert("Login successful!");
      localStorage.setItem("authToken", token);
      localStorage.setItem("username", data.username);
      authenticationService.setToken(token);
      reset();
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className={`${darkTheme ? 'bg-primary_dark text-white' : 'bg-white text-black'} flex items-center justify-center min-h-screen w-screen`}>
      <div className="flex flex-col gap-4 w-11/12 max-w-sm p-4 md:p-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-4 md:gap-18">
          <h2 className="font-primary text-3xl md:text-5xl font-bold">Log in</h2>
          <a href="/signup" className="text-sm text-gray-400 font-mono underline-offset-4 hover:text-gray-400 hover:underline">
            create a new account
          </a>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username Field */}
          <div className="flex items-center border-2 border-black-100 rounded-xl px-4 md:px-6 py-3 md:py-4">
            <input
              type="text"
              id="username"
              className="w-full bg-transparent outline-none placeholder:font-mono text-sm md:text-base"
              placeholder="Username"
              {...register("username")}
            />
            {errors.username && <p className="font-mono text-xs md:text-sm" style={{ color: "red" }}>{errors.username.message}</p>}
          </div>

          {/* Password Field */}
          <div className="flex items-center border-2 border-black-100 rounded-xl px-4 md:px-6 py-3 md:py-4">
            <input
              type="password"
              id="password"
              className="w-full bg-transparent outline-none placeholder:font-mono text-sm md:text-base"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && <p className="font-mono text-xs md:text-sm" style={{ color: "red" }}>{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
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
            Log in
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-4">
          <Link
            to="/forgot-password"
            className="text-xs md:text-sm text-blue-500 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
