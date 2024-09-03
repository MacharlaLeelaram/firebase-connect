// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormPage from './FormPage';
import ViewPage from './ViewPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<FormPage />} />
                <Route path="/view" element={<ViewPage />} />
            </Routes>
        </Router>
    );
}

export default App;