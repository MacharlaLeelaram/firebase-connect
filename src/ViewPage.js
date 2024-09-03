import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

function ViewPage() {
    const [contacts, setContacts] = useState([]);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    useEffect(() => {
        const fetchContacts = async () => {
            const querySnapshot = await getDocs(collection(db, 'contacts'));
            setContacts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchContacts();
    }, []);

    const handleEdit = (contact) => {
        setEditing(contact.id);
        setFormData({ name: contact.name, email: contact.email, message: contact.message });
    };

    const handleSave = async (id) => {
        const contactRef = doc(db, 'contacts', id);
        await updateDoc(contactRef, formData);
        setEditing(null);
        setFormData({ name: '', email: '', message: '' });
        // Refresh the list after update
        const querySnapshot = await getDocs(collection(db, 'contacts'));
        setContacts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleDelete = async (id) => {
        const contactRef = doc(db, 'contacts', id);
        await deleteDoc(contactRef);
        setContacts(contacts.filter(contact => contact.id !== id));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Contact List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.map(contact => (
                    <div key={contact.id} className="bg-white p-6 rounded-lg shadow-md">
                        {editing === contact.id ? (
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    rows="3"
                                ></textarea>
                                <button
                                    onClick={() => handleSave(contact.id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{contact.name}</h3>
                                <p className="text-gray-700 mb-2">{contact.email}</p>
                                <p className="text-gray-600 mb-4">{contact.message}</p>
                                <button
                                    onClick={() => handleEdit(contact)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(contact.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewPage;
