import { useState } from "react";

function Login({ setPage, onAuthSuccess }) { // onAuthSuccess add kiya
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      onAuthSuccess(data.token); // Ye function socket ko connect karega
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-96">
        <h2 className="text-white text-2xl mb-5 text-center">Login</h2>
        <input className="w-full p-3 mb-3 rounded bg-gray-700 text-white" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" className="w-full p-3 mb-3 rounded bg-gray-700 text-white" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="w-full bg-blue-600 p-3 rounded text-white mb-2">Login</button>
        <button className="text-center text-gray-400 w-full text-sm" onClick={() => setPage("register")}>Create an account</button>
      </div>
    </div>
  );
}
export default Login;