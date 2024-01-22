import React, { useState, useEffect } from 'react';

function Dashboard() {
    const [apiToken, setApiToken] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
            alert('Token not found. Please log in.');
            window.location.href = '/';
        }

        fetch('/api/getApiKey', {
            headers: {
                Authorization: storedToken,
            },
        })
            .then(response => response.json())
            .then(data => {
                setApiToken(data.token);
            })
            .catch(error => {
                console.error('Error fetching API token:', error);
                alert("User not authenticated, try signing out and signing in again")
            });
    }, []);

    const handleCopyToken = () => {
        navigator.clipboard.writeText(apiToken);
        alert('Token copied to clipboard!');
    };

    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1">App</span>
                    <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div className="container mt-4">
                <h2>Shiboni Dashboard lesgo</h2>

                <div className="card-deck mt-4">
                    {/* Card 1: Upload Image */}
                    <div className="card shadow">
                        <div className="card-body">
                            <h5 className="card-title">Upload Image</h5>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="imageUpload" className="form-label">Select Images</label>
                                    <input type="file" className="form-control" id="imageUpload" multiple />
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">Upload Images</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card shadow mt-2">
                        <div className="card-body">
                            <h5 className="card-title">API Token</h5>
                            {apiToken ? (
                                <div>
                                    <p>Your API Token:</p>
                                    <div className="input-group mb-3">
                                        <input type="text" className="form-control" value={apiToken} readOnly />
                                        <button className="btn btn-outline-secondary" type="button" onClick={handleCopyToken}>
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button type="button" className="btn btn-info" disabled>
                                    Generating Token...
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
