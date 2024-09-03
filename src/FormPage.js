import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

function FormPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        image: null,
    });

    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({
                ...formData,
                image: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setUploading(true);

        let imageUrl = '';
        if (formData.image) {
            try {
                const storage = getStorage();
                const storageRef = ref(storage, `images/${formData.image.name}`);
                await uploadBytes(storageRef, formData.image);
                imageUrl = await getDownloadURL(storageRef);
            } catch (error) {
                console.error('Error uploading image: ', error);
                alert('Error uploading image. Please try again.');
                setUploading(false);
                return;
            }
        }

        try {
            const docRef = await addDoc(collection(db, 'contacts'), {
                name: formData.name,
                email: formData.email,
                message: formData.message,
                imageUrl: imageUrl, // Save image URL
                timestamp: new Date(), // Optional: Add a timestamp
            });
            console.log('Document written with ID: ', docRef.id);
            alert('Message sent successfully!');
            setFormData({ name: '', email: '', message: '', image: null }); // Reset form after submission
        } catch (e) {
            console.error('Error adding document: ', e);
            alert('Error sending message. Please try again.');
        }

        setUploading(false);
    };

    const handleViewData = () => {
        navigate('/view');
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Your Name"
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Your Email"
                            required
                        />
                    </div>

                    {/* Message Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Your Message"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    {/* Image Upload Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="image">Upload Image</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className={`w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${uploading && 'opacity-50 cursor-not-allowed'}`}
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading...' : 'Send Message'}
                        </button>
                    </div>
                </form>

                {/* View Data Button */}
                <div className="mt-4">
                    <button
                        onClick={handleViewData}
                        className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:bg-green-600"
                    >
                        View Data
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FormPage;

