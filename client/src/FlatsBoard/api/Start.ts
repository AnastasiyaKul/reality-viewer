import axios from 'axios';
import { useEffect } from 'react';

export default function Start() {
    useEffect(() => {
        axios.get('http://localhost:5000/start')
            .then(() => {
                console.log('Started');
            })
    }, []);
};
