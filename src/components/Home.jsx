import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => (
    <div className="wrapper">
        <h2>In order to use the application pls
            <Link to="/signin"> Login </Link> or
            <Link to="/signup">Register</Link>
        </h2>
    </div>
);

export default Home;
