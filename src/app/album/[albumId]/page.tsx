'use client';

import ResponsivePhotoGrid from "../../../components/ResponsivePhotoGrid";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import leftArrowIcon from "../../../assets/left-arrow.svg";

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

    if (!data && !loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-white">
                Álbum não encontrado
            </div>
        );
    }

    return (
        <main className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 mb-8 group"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-all">
                        <Image 
                            src={leftArrowIcon} 
                            alt="Voltar" 
                            width={20} 
                            height={20} 
                            className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" 
                        />
                    </div>
                    <span className="text-sm font-medium tracking-wide uppercase opacity-70 group-hover:opacity-100">Voltar</span>
                </Link>

                {loading ? (
                    <div className="min-h-[50vh] flex items-center justify-center animate-fade-in-up">
                        <LoadingSpinner message="Carregando álbum..." size="lg" />
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12 animate-fade-in">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-linear-to-r from-pink-600 to-purple-600 rounded-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"></div>
                            <Image 
                                src={data?.bannerURL ?? ""} 
                                alt={data?.name ?? ""} 
                                className="relative w-32 h-32 md:w-48 md:h-48 object-cover rounded-xl"
                                width={768}
                                height={768}
                            />
                        </div>
                        
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400 mb-4" style={{fontFamily: "'Playfair Display', serif"}}>
                                {data?.name}
                            </h1>
                            <p className="text-gray-400 text-lg">
                                {data?.photos?.length || 0} fotos
                            </p>
                        </div>
                    </div>
                )}

                <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-8" />

                <div className="animate-fade-in-up">
                    {!loading && data?.photos && <ResponsivePhotoGrid data={data.photos} type={1} redirectBaseURL={`/album/${albumId}`} />}
                </div>
            </div>
        </main>
    )
}
