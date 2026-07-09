const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form className="space-y-4">
          <input className="w-full border px-3 py-2 rounded" placeholder="Email" />
          <input className="w-full border px-3 py-2 rounded" placeholder="Password" type="password" />
          <button className="w-full bg-blue-600 text-white py-2 rounded">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
