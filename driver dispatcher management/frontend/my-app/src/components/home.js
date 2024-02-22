import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './subcomponents/header';
import Footer from './subcomponents/footer';
import Table from './subcomponents/table';

export default function Home() {
    const navigate = useNavigate(); // Hook to get access to the navigate function

    // This function will be called when the button is clicked
    const handleClick = () => {
        navigate('/createDriver'); // Navigate programmatically
    };

    return (
        <div>
            <Header />
            <button type="button" className="btn btn-primary" onClick={handleClick}>
                Create Driver
            </button>
            <Table />
            <Footer />
        </div>
    );
}
