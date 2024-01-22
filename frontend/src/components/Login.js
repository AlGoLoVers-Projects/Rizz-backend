import React, {useEffect} from 'react';

function Login() {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <h2 className="mb-4">Shiboni API Login page</h2>
                        <form action="/auth/login" method="post">
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">
                                    Username
                                </label>
                                <input type="text" className="form-control" id="username" name="username" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="credentials" className="form-label">
                                    Password
                                </label>
                                <input type="password" className="form-control" id="credentials" name="credentials" required />
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
