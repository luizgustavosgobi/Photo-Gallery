'use client';

import ResponsivePhotoGrid from "./ResponsivePhotoGrid";
import { useState, useEffect } from "react";

type ResponseData = {
    hasRemaining: boolean,
    photos: PhotoData[]
}

type PhotoData = {
    id: string,
    URL: string
}

export default function Photos() {
    const [data, setData] = useState<ResponseData | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchPhotos = async (skip: number = 0, append: boolean = false) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/photos?skip=${skip}`);
            const newData = await response.json();
            
            if (append && data) {
                setData({
                    hasRemaining: newData.hasRemaining,
                    photos: [...data.photos, ...newData.photos]
                });
            } else {
                setData(newData);
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadInitialPhotos = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/photos?skip=0`);
                const newData = await response.json();
                setData(newData);
            } catch (error) {
                console.error('Error fetching photos:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadInitialPhotos();
    }, []);

    return (
        <>
            {data && <ResponsivePhotoGrid type={1} data={data.photos} redirectBaseURL={"/media"} />}
            {data?.hasRemaining &&
                <div className="w-full flex justify-center items-center mt-[4vh]">
                    <button 
                        onClick={() => fetchPhotos(data.photos?.length || 0, true)} 
                        className="bg-[#262727] p-4 rounded-2xl cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? 'Carregando...' : 'Carregar Mais'}
                    </button>
                </div>
            }
        </>
    )
}
