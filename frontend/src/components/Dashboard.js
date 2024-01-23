import React, {useState, useEffect} from 'react';

function Dashboard() {
    const [apiToken, setApiToken] = useState(null);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);

    const [rizzInput, setRizzInput] = useState('');

    const handleRizzInputChange = (e) => {
        setRizzInput(e.target.value);
    };

    const handleExceptionCodes = (response, error) => {
        if (!response.ok) {
            const statusCode = response.status;
            if (statusCode === 401 || statusCode === 412) {
                handleUnauthenticatedException();
                return;
            }

            throw new Error(error);
        }
    }

    const handleUnauthenticatedException = () => {
        alert("You are not authenticated, please try signing in again")
        handleLogout()
    }

    const handleRizzSubmit = async (e) => {
        e.preventDefault();

        // Split the input string into an array of sentences using semicolon as a delimiter
        const sentences = rizzInput.split(';').map(sentence => sentence.trim());

        // Validate JSON format before submitting
        try {
            JSON.parse(JSON.stringify(sentences));
        } catch (error) {
            alert('Invalid JSON format. Please enter a valid list of sentences.');
            return;
        }

        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
            alert('API token not available. Please try again.');
            return;
        }

        try {
            const response = await fetch('/api/saveRizz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: storedToken,
                },
                body: JSON.stringify({ rizz: sentences }),
            });

            handleExceptionCodes(response, 'Failed to submit rizz data')

            alert('Rizz data submitted successfully');
            handleGetRizz();
        } catch (error) {
            console.error('Rizz data submission error:', error);
            alert('Error submitting Rizz data. Please try again.');
        }
    };


    const handleGetRizz = async () => {
        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
            alert('API token not available. Please try again.');
            return;
        }

        try {
            const response = await fetch('/api/getRizz', {
                headers: {
                    Authorization: storedToken,
                },
            });

            handleExceptionCodes(response, 'Failed to fetch rizz data')

            const result = await response.json();

            // Filter out empty strings and join the non-empty sentences with a semicolon and a space
            const semicolonSeparatedString = result.rizz.filter(sentence => sentence.trim() !== '').join('; ');

            setRizzInput(semicolonSeparatedString);
        } catch (error) {
            console.error('Error fetching Rizz data:', error);
            alert('Error fetching Rizz data. Please try again.');
        }
    };



    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const fetchImages = () => {
        const storedToken = localStorage.getItem('token');
        fetch('/api/getImages', {
            headers: {
                Authorization: storedToken,
            },
        })
            .then(response => {
                handleExceptionCodes(response, 'Failed to fetch images')
                return response.json();
            })
            .then(data => {
                setImages(data.images);
            })
            .catch(err => {
                console.error('Error fetching images:', err);
                setError('Error fetching images. Please try again.');
            });
    }

    useEffect(() => {
        handleGetRizz();
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
            .then(response => {
                handleExceptionCodes(response, 'Failed to fetch api key')
                return response.json()
            })
            .then(data => {
                setApiToken(data.token);
            })
            .catch(error => {
                console.error('Error fetching API token:', error);
                alert("User not authenticated, try signing out and signing in again")
            });

        // Fetch image data from the authenticated route
        fetchImages()

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
            handleExceptionCodes(response, 'Failed to upload images')
            // Clear the files from the input after uploading
            fileInput.value = '';

            alert('Images uploaded successfully');

            // Fetch updated image data after new files are uploaded
            fetchImages()
        } catch (error) {
            fileInput.value = '';
            console.error('Image upload error:', error);
            alert('Error uploading images. Please try again.');
        }
    };

    const handleDeleteImage = async (filename) => {
        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
            alert('API token not available. Please try again.');
            return;
        }

        try {
            const response = await fetch(`/api/deleteImage/${filename}`, {
                method: 'DELETE',
                headers: {
                    Authorization: storedToken,
                },
            });

            handleExceptionCodes(response, 'Failed to delete image')

            // Fetch updated image data after deletion
            fetchImages()
        } catch (error) {
            console.error('Image deletion error:', error);
            alert('Error deleting image. Please try again.');
        }
    };

    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1">Rizz API</span>
                    <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div className="container mt-4">
                <h2>Rizz Dashboard lesgo</h2>

                <div className="card-deck mt-4">
                    {/* Card 1: Upload Image */}
                    <div className="card shadow">
                        <div className="card-body">
                            <h5 className="card-title">Upload Image</h5>
                            <form onSubmit={handleImageUpload}>
                                <div className="mb-3">
                                    <label htmlFor="imageUpload" className="form-label">Select Images</label>
                                    <input type="file" className="form-control" id="imageUpload" multiple/>
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
                                        <input type="text" className="form-control" value={apiToken} readOnly/>
                                        <button className="btn btn-outline-secondary" type="button"
                                                onClick={handleCopyToken}>
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

                    <div className="card mt-2">
                        <div className="card-body">
                            <h5 className="card-title">Images</h5>
                            {images.length === 0 ? (
                                <>
                                    <div>No images found</div>
                                    {error}
                                </>
                            ) : (
                                <div className="row row-cols-2 row-cols-md-4 g-4">
                                    {images.map((image, index) => (
                                        <div className="col" key={index} style={{position: 'relative'}}>
                                            <img src={`data:image/jpeg;base64,${image.content}`}
                                                 className="img-thumbnail" alt={image.name}/>
                                            <p>{image.name}</p>

                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                style={{
                                                    position: 'absolute',
                                                    top: '5px',
                                                    right: '5px',
                                                    borderRadius: '50%',
                                                    width: '30px',
                                                    height: '30px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: '0',
                                                    fontSize: '18px',
                                                }}
                                                onClick={() => {
                                                    // Show confirmation dialog
                                                    if (window.confirm('Are you sure you want to delete this image?')) {
                                                        handleDeleteImage(image.filename);
                                                    }
                                                }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card mt-2">
                        <div className="card-body">
                            <h5 className="card-title">Rizz Data</h5>
                            <div className="mb-3">
                                <label htmlFor="rizzInput" className="form-label">Enter Rizz Data (Semicolon separated strings)</label>
                                <textarea
                                    className="form-control"
                                    id="rizzInput"
                                    rows="4"
                                    value={rizzInput}
                                    onChange={handleRizzInputChange}
                                />
                            </div>
                            <div className="d-grid gap-2">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleRizzSubmit}
                                >
                                    Submit Rizz Data
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;
