import React, {useEffect, useState} from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
            window.location.href = '/dashboard';
        }

    }, [])

    const validateForm = () => {
        if (!username.trim() || !password.trim()) {
            alert('Please enter both username and password');
            return false;
        }
        return true;
    };
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return
        }

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    credentials: password,
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const {token} = data;

            localStorage.setItem('token', token);
            window.location.href = '/dashboard'

        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed')
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <h2 className="mb-4">Rizz API Login page</h2>
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="credentials" className="form-label">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="credentials"
                                    name="credentials"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
