import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Start(): boolean {
    const [isStarted, setIsStarted] = useState<boolean>(false);

    useEffect(() => {
        axios.get('http://localhost:5000/start')
            .then(() => {
                setIsStarted(true);
            })
    }, []);

    return isStarted;
};
