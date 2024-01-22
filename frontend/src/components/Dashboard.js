import React from 'react';

function Dashboard() {
    // Your logout function
    const handleLogout = () => {
        window.location.href = '/auth/logout';
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
                <h2>Dashboard Page</h2>

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

                    {/* Card 2: Generate API Token */}
                    <div className="card shadow mt-2">
                        <div className="card-body">
                            <h5 className="card-title">Generate API Token</h5>
                            <button type="button" className="btn btn-info" onClick={() => {
                                window.location.href = '/api/getApiKey'
                            }}>Generate Token</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
