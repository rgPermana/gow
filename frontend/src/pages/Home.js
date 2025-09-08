import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import { fetchSpatialData } from '../services/api';

const Home = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchSpatialData().then(setData);
    }, []);

    return <Map data={data} />;
};

export default Home;
