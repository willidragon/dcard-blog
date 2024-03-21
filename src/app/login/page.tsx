import type { NextPage } from "next";

const LoginPage: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Login to Dcard Issue Blog{" "}
        </h2>

        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border border-gray-300 rounded-md w-full py-2 px-3"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border border-gray-300 rounded-md w-full py-2 px-3"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md w-full"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="#" className="text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
