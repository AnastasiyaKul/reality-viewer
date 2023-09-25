import axios from 'axios';
import { useState, useEffect } from 'react';

export interface IFlatDescription {
    url: string,
    image: string,
    title: string,
}

export interface IFlatsListResponse {
    flats: IFlatDescription[],
    hasMore: boolean,
}

export default function GetFlatsList(page: number): IFlatsListResponse {
    const [data, setData] = useState<IFlatsListResponse>({ flats: [], hasMore: false });

    useEffect(() => {
        axios.get('http://localhost:5000/flats_list', {
            params: { page }
        })
            .then(res => {
                setData(res.data);
            })
    }, [page])

    return data;
};
