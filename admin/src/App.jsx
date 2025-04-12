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

        let imageData = null;
        let songFileData = null;

        // Read image file as base64
        if (image) {
            imageData = await readFileAsBase64(image);
        }

        // Read song file as base64
        if (songFile) {
            songFileData = await readFileAsBase64(songFile);
        }

        const payload = {
            title,
            singer,
            image: imageData,  // base64 encoded
            songFile: songFileData, // base64 encoded
        };

        console.log("Payload:", payload);

        try {
            const response = await axios.post('http://localhost:5000/api/songs', payload);

            setMessage(response.data.message);
            setTitle('');
            setSinger('');
            setImage(null);
            setSongFile(null);
            console.log("Song Added Successfully");
        } catch (error) {
            console.error('Error adding song:', error);
            setMessage('Error adding song');
        }
    };

    // Helper function to read a file as a base64 string
    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result); // base64 string
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(file); // Read as base64
        });
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