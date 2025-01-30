import axios from "axios";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleLogin(event) {
    event.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}/node/auth/login`, {
        username,
        password,
      })
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          setIsLoggedIn(true);
          console.log("Login successful");
        } else {
          console.log("Login failed");
          Swal.fire({
            title: "Login failed",
            text: "Either your login is incorrect, the node went down, or the database is down.",
            icon: "error",
          });
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div className="p-5 bg-slate-700 w-45 rounded">
        <form onSubmit={handleLogin}>
          <h2 className="centered text-6xl p-3 text-neutral-200 font-bold">
            For IT Team Use ONLY
          </h2>
          <div className="mt-5 mb-4">
            <label
              htmlFor="username"
              className="text-neutral-200 block text-3xl"
            >
              Username
            </label>
            <input
              type="text"
              className="w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-3xl"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="text-neutral-200 block text-3xl"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              class="w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-3xl"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-3xl font-semibold py-2.5 mb-2 transition hover:scale-105 w-100">
            Login
          </button>
        </form>
        {isLoggedIn && <Navigate to="../dashboard" replace={true} />}
      </div>
    </div>
  );
}

export default Login;
