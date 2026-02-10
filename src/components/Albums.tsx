'use client';

import { useQuery } from "@/hooks/useQuery";
import ResponsivePhotoGrid from "./ResponsivePhotoGrid";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useState, useEffect } from "react";

type AlbumData = {
    id: string,
    name: string,
    bannerId: string,
    bannerURL: string,
}

export default function Albums() {
    const [allAlbums, setAllAlbums] = useState<AlbumData[] | null>(null);
    const { data, loading, error, fetch } = useQuery<AlbumData[]>({ 
        url: `/api/albums?skip=0`,
        method: 'GET',
    });

    useEffect(() => {
        fetch();
    }, []);

    useEffect(() => {
        if (!data) return;

        if (!allAlbums) return setAllAlbums(data);

        const currentIds = new Set(allAlbums.map(a => a.id));
        const newUniquePhotos = data.filter(a => !currentIds.has(a.id));

        if (newUniquePhotos.length === 0) return setAllAlbums(data);

        setAllAlbums([...allAlbums, ...data])
        
    }, [data]);

    const fetchMoreAlbums = () => {
        const currentLength = allAlbums?.length || 0;
        fetch({ url: `/api/photos?skip=${currentLength}` });
    };

    const isEmpty = !loading && (!allAlbums || allAlbums.length === 0);
    if (loading && !allAlbums) {
        return <LoadingSpinner message="Carregando álbuns..." size="md" className="min-h-[50vh] flex items-center justify-center animate-fade-in-up" />;
    }

    return (
        <>
            {data && data.length > 0 && (
                <ResponsivePhotoGrid type={2} data={data} redirectBaseURL={"/album"} />
            )}

            {isEmpty && (
                <div className="w-full flex flex-col justify-center items-center mt-20 text-center opacity-60">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                    <p className="text-lg font-medium">Nenhum álbum encontrado.</p>
                    <p className="text-sm mt-1">Tente novamente mais tarde.</p>
                </div>
            )}

            {loading && <LoadingSpinner message="Carregando álbuns..." size="md" />}
        </>
    )
}