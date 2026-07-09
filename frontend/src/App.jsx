function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center">
        <h1 className="text-3xl font-extrabold text-blue-400 mb-2">
          DoctorVerify India
        </h1>
        <p className="text-slate-400 mb-6 text-sm">
          Frontend architecture initialized successfully with Tailwind CSS.
        </p>
        <div className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg transition duration-200 cursor-pointer shadow-md shadow-blue-500/20">
          Environment Ready
        </div>
      </div>
    </div>
  )
}

export default App
