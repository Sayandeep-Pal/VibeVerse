import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [title, setTitle] = useState('');
    const [singer, setSinger] = useState('');
    const [image, setImage] = useState(null);
    const [songFile, setSongFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('singer', singer);
        if (image) {
            formData.append('image', image);
        }
        if (songFile) {
            formData.append('songFile', songFile);
        }

        try {
            const response = await axios.post('http://localhost:5000/api/songs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important!
                },
            });

            if (response.status >= 200 && response.status < 300) {
                setMessage(response.data.message);
                setTitle('');
                setSinger('');
                setImage(null);
                setSongFile(null);
                console.log("Song Added Successfully");
            } else {
                console.error('API returned an error status:', response.status, response.data);
                setMessage(`Error adding song: Server returned status ${response.status}`);
            }
        } catch (error) {
            console.error('Error adding song:', error);
            setMessage('Error adding song: ' + (error.message || 'Unknown error'));
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSongChange = (e) => {
        setSongFile(e.target.files[0]);
    };

    return (
        <div>
            <h2>Add New Song</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Singer:</label>
                    <input
                        type="text"
                        value={singer}
                        onChange={(e) => setSinger(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Image:</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <div>
                    <label>Song File:</label>
                    <input type="file" accept="audio/*" onChange={handleSongChange} />
                </div>
                <button type="submit">Add Song</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default App;