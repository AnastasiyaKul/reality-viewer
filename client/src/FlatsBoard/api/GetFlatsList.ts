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

export default function GetFlatsList(page: number, isStarted: boolean): IFlatsListResponse {
    const [data, setData] = useState<IFlatsListResponse>({ flats: [], hasMore: false });

    useEffect(() => {
        isStarted && axios.get('http://localhost:5000/flats_list', {
            params: { page }
        })
            .then(res => {
                setData(res.data);
            })
    }, [page, isStarted])

    return data;
};
