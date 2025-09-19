'use client';

import ResponsivePhotoGrid from "./ResponsivePhotoGrid";
import { useState, useEffect } from "react";

type AlbumData = {
    id: string,
    name: string,
    bannerId: string,
    bannerURL: string,
}

export default function Albums() {
    const [data, setData] = useState<AlbumData[] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAlbums = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/albums');
                const albumsData = await response.json();
                setData(albumsData);
            } catch (error) {
                console.error('Error fetching albums:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAlbums();
    }, []);

    return (
        <>
            {data && <ResponsivePhotoGrid type={2} data={data} redirectBaseURL={"/album"} />}
            {loading && <div>Carregando álbuns...</div>}
        </>
    )
}
