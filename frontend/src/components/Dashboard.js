import React, { useState, useEffect } from 'react';

function Dashboard() {
    const [apiToken, setApiToken] = useState(null);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);

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

        // Fetch image URLs from the authenticated route
        fetch('/api/getImages', {
            headers: {
                Authorization: storedToken,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch images');
                }
                return response.json();
            })
            .then(data => {
                setImages(data.images);
            })
            .catch(err => {
                console.error('Error fetching images:', err);
                setError('Error fetching images. Please try again.');
            });
    }, []);

    const handleCopyToken = () => {
        navigator.clipboard.writeText(apiToken);
        alert('Token copied to clipboard!');
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('imageUpload');
        const files = fileInput.files;

        // Use storedToken from localStorage
        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
            alert('API token not available. Please try again.');
            return;
        }

        const formData = new FormData();

        // Append each file individually
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        try {
            const response = await fetch('/api/uploadImage', {
                method: 'POST',
                headers: {
                    Authorization: storedToken, // Use storedToken
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            const result = await response.json();
            alert('Images uploaded successfully:', result);
        } catch (error) {
            console.error('Image upload error:', error);
            alert('Error uploading images. Please try again.');
        }
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
                            <form onSubmit={handleImageUpload}>
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

                    {/* Card 2: API Token */}
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

                    {/* Card 3: Image Grid */}
                    <div className="card mt-2">
                        <div className="card-body">
                            <h5 className="card-title">Image Grid</h5>
                            {error ? (
                                <div>Error: {error}</div>
                            ) : (
                                <div className="row row-cols-2 row-cols-md-4 g-4">
                                    {images.map(imageUrl => (
                                        <div className="col" key={imageUrl}>
                                            <img src={imageUrl} className="img-thumbnail" alt="Image" />
                                            {imageUrl}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
