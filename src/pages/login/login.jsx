import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import FullWidthButton from "../../components/buttons/FullWidthButton.jsx";
import MediumInputFW from "../../components/inputs/MediumInputFW.jsx";

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
      <div className="p-5 bg-slate-700 w-45 rounded shadow-xl border-2 border-cyan-700 border-opacity-10">
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
            <MediumInputFW
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              placeholder="Enter your username"
              type="text"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="text-neutral-200 block text-3xl"
            >
              Password
            </label>
            <MediumInputFW
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              placeholder="Enter your password"
              type="password"
            />
          </div>
          <FullWidthButton
            action={""}
            text={"Login"}
            type={"submit"}
          ></FullWidthButton>
        </form>
        {isLoggedIn && <Navigate to="../dashboard" replace={true} />}
      </div>
    </div>
  );
}

export default Login;
