import { useState } from "react";

function Register({ setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    const res = await fetch("http://localhost:4000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      setPage("chat");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-96">
        <h2 className="text-white text-2xl mb-5 text-center">Register</h2>

        <input
          className="w-full p-3 mb-3 rounded bg-gray-700 text-white"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-3 rounded bg-gray-700 text-white"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={registerUser}
          className="w-full bg-blue-600 p-3 rounded text-white"
        >
          Register
        </button>

        <button
          className="text-center text-white w-full"
          onClick={() => setPage("login")}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Register;
