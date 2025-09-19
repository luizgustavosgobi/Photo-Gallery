'use client';

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

import 'dayjs/locale/pt-br'

import starIcon from '../../../assets/star.svg';
import xIcon from '../../../assets/x.svg';
import leftArrowIcon from '../../../assets/left-arrow.svg';
import rightArrowIcon from '../../../assets/right-arrow.svg';

type PhotoProperties = {
    id: string;
    description: string;
    URL: string;
    ratings: {
        likes: number;
    }
    photoMetadata: {
        createdAt: string;
    }
    navigation: {
        nextPhoto: string | null,
        previousPhoto: string | null
    }
}

export default function PhotoPage() {
    const [photo, setPhoto] = useState<PhotoProperties | null>(null);
    const [loading, setLoading] = useState(true);

    const imageRef = useRef<HTMLImageElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    const params = useParams();
    const photoId = params.photoId as string;

    async function getPhoto(photoId: string) {
        try {
            const response = await fetch(`/api/photos/${photoId}`);
            const data = await response.json();
            setPhoto(data);
        } catch (error) {
            console.error('Error fetching photo:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (photoId) {
            getPhoto(photoId);
        }
    }, [photoId]);

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (descriptionRef.current) {
                    descriptionRef.current.style.maxWidth = `${entry.contentRect.width}px`;
                }
            }
        });

        if (photo && imageRef.current && descriptionRef.current) {
            observer.observe(imageRef.current);
        }

        return () => observer.disconnect();
    }, [photo]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!photo) {
        return <div>Foto não encontrada</div>;
    }

    return (
        <div className="h-[100vh] md:flex md:flex-col md:items-center">
            <div className="p-2 md:fixed md:left-6 md:top-5">
                <div className="w-fit">
                    <Link href="/">
                        <Image src={xIcon} alt="" className="w-fit md:w-[7vh]" width={28} height={28} />
                    </Link>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center md:relative md:h-full">
                <Image
                    ref={imageRef}
                    src={photo.URL}
                    alt=""
                    className="object-contain max-w-[100vw] max-h-[50vh] md:max-h-[70vh]"
                    width={800}
                    height={600}
                />

                <div className="flex w-full justify-between px-5">
                    {photo.navigation.previousPhoto && (
                        <div className="md:fixed left-5 md:top-1/2 md:transform md:-translate-y-1/2 md:left-6">
                            <Link href={`/media/${photo.navigation.previousPhoto}`}>
                                <Image src={leftArrowIcon} alt="" className="w-8 h-8 md:w-12 md:h-12" width={48} height={48} />
                            </Link>
                        </div>
                    )}

                    {photo.navigation.nextPhoto && (
                        <div className="md:fixed md:top-1/2 md:transform md:-translate-y-1/2 md:right-6">
                            <Link href={`/media/${photo.navigation.nextPhoto}`}>
                                <Image src={rightArrowIcon} alt="" className="w-8 h-8 md:w-12 md:h-12" width={48} height={48} />
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex p-2 md:fixed md:bottom-2 md:left-1/2 md:transform md:-translate-x-1/2">
                    <div className="bg-[#262627] rounded-lg p-2 md:rounded-xl md:p-4 md:flex md:items-center md:gap-6">
                        <div className="flex items-center gap-2 md:gap-4">
                            <Image src={starIcon} alt="" className="w-4 h-4 md:w-6 md:h-6" width={24} height={24} />
                            <span className="text-white md:text-lg">{photo.ratings.likes}</span>
                        </div>
                        <div className="md:w-[1px] md:bg-[#DDDDDD] md:h-6" />
                        <p
                            ref={descriptionRef}
                            className="text-white text-sm md:text-base max-w-[80vw] md:max-w-none break-words"
                        >
                            {photo.description}
                        </p>
                        <div className="md:w-[1px] md:bg-[#DDDDDD] md:h-6" />
                        <span className="text-white text-xs md:text-sm">
                            {dayjs(photo.photoMetadata.createdAt).locale('pt-br').format('D [de] MMMM [de] YYYY')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
