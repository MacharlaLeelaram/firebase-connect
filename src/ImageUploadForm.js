import React, { useState } from 'react';
import { storage, db } from './firebase'; // Import Firebase storage and Firestore
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

function ImageUploadForm() {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytes(storageRef, image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error function
                console.log(error);
            },
            () => {
                // Complete function
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setUrl(url);
                    saveImageUrl(url); // Save the image URL to Firestore
                });
            }
        );
    };

    const saveImageUrl = async (url) => {
        try {
            await addDoc(collection(db, 'images'), {
                imageUrl: url,
                timestamp: new Date(),
            });
            alert('Image uploaded and URL saved successfully!');
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Error saving image URL. Please try again.');
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Upload Image</h2>
                <input type="file" onChange={handleImageChange} />
                <button onClick={handleUpload} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                    Upload
                </button>
                <br />
                <progress value={progress} max="100" className="w-full mt-4"></progress>
                <br />
                {url && (
                    <img src={url} alt="Uploaded" className="mt-4" />
                )}
            </div>
        </div>
    );
}

export default ImageUploadForm;
