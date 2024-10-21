import axios from 'axios';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    function handleSubmit(event) {
        event.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL}/node/auth/login`, { username, password })
            .then(res => {
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
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
            .catch(err => console.log(err));
    }

    return (
        <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '90vh' }}>
            <div className='p-3 bg-white w-25 rounded'>
                <form onSubmit={handleSubmit}>
                    <h2 className='centeredh2'>
                        For IT Team Use ONLY
                    </h2>
                    <div className='mb-3'>
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" placeholder="Enter your username" className='form-control' onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="Enter your password" className='form-control' onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className='btn btn-success w-100'>Login</button>
                </form>
                {isLoggedIn && <Navigate to="../dashboard" replace={true} />}
            </div>
        </div>
    );
}

export default Login;
