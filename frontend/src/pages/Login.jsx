import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setCurrentRole, currentRole }) => {
  const [role, setRole] = useState('doctor');
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setMessage('Please enter both email and password.');
      return;
    }

    const normalizedRole = role === 'doctor' ? 'doctor' : 'user';
    setCurrentRole(normalizedRole);
    setMessage(`${normalizedRole === 'doctor' ? 'Doctor' : 'User'} login successful.`);

    if (normalizedRole === 'doctor') {
      navigate('/doctors');
    } else {
      navigate('/support');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-slate-950/40">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in as a doctor or a patient user.</p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-medium ${role === 'doctor' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            onClick={() => setRole('doctor')}
          >
            Doctor
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-medium ${role === 'user' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            onClick={() => setRole('user')}
          >
            User
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <button className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white" type="submit">
            Sign in as {role === 'doctor' ? 'Doctor' : 'User'}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}

        <p className="mt-4 text-center text-sm text-slate-500">
          Current session: {currentRole || 'Not signed in'}
        </p>
      </div>
    </div>
  );
};

export default Login;
