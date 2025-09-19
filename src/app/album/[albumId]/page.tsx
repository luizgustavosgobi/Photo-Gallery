'use client';

import ResponsivePhotoGrid from "../../../components/ResponsivePhotoGrid";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

type PhotoData = {
    id: string,
    URL: string
}

type AlbumData = {
    name: string,
    bannerId: string,
    bannerURL: string,
    photos: PhotoData[]
}

export default function AlbumPage() {
    const params = useParams();
    const albumId = params.albumId as string;
    const [data, setData] = useState<AlbumData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlbum = async () => {
            if (!albumId) return;
            
            try {
                const response = await fetch(`/api/albums/${albumId}`);
                const albumData = await response.json();
                setData(albumData);
            } catch (error) {
                console.error('Error fetching album:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbum();
    }, [albumId]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!data) {
        return <div>Álbum não encontrado</div>;
    }

    return (
        <div className="m-4 md:mx-[10vw] md:my-[8vh]">
            <div className="flex w-full">
                <Image 
                    src={data.bannerURL} 
                    alt="" 
                    className="w-[6.5rem] h-[6.5rem] md:w-[8.5rem] md:h-[8.5rem] object-cover rounded-xl"
                    width={136}
                    height={136}
                />
                <div className="w-[calc(100%-6.5rem)] flex justify-center items-center">
                    <span className="text-6xl md:text-8xl" style={{fontFamily: "Parisienne"}} >{data.name}</span>
                </div>
            </div>

            <div className="h-[1px] bg-[#DDDDDD] my-[1rem] md:mb-[1.5rem]" />

            {data.photos && <ResponsivePhotoGrid data={data.photos} type={1} redirectBaseURL={`/album/${albumId}`} />}
        </div>
    )
}
