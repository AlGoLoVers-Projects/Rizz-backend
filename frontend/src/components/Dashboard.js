import React from 'react';

function Dashboard() {
    // Your logout function
    const handleLogout = () => {
        // Implement your logout logic here
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
                {/* Add your dashboard content */}
            </div>
        </div>
    );
}

export default Dashboard;
