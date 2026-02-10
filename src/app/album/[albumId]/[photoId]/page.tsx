"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import "dayjs/locale/pt-br";

import starIcon from "../../../../assets/star.svg";
import xIcon from "../../../../assets/x.svg";
import leftArrowIcon from "../../../../assets/left-arrow.svg";
import rightArrowIcon from "../../../../assets/right-arrow.svg";

type PhotoProperties = {
  id: string;
  description: string;
  URL: string;
  ratings: {
    likes: number;
  };
  photoMetadata: {
    createdAt: string;
  };
  navigation: {
    nextPhoto: string | null;
    previousPhoto: string | null;
  };
};

export default function PhotoPage() {
  const [expanded, setExpanded] = useState(false);
  const [photo, setPhoto] = useState<PhotoProperties | null>(null);
  const [loading, setLoading] = useState(true);

  const imageRef = useRef<HTMLImageElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const params = useParams();
  const photoId = params.photoId as string;
  const albumId = params.albumId as string;

  async function getPhoto(photoId: string) {
    try {
      const response = await fetch(`/api/albums/${albumId}/${photoId}`);
      const data = await response.json();
      setPhoto(data);
    } catch (error) {
      console.error("Error fetching photo:", error);
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
    const observer = new ResizeObserver((entries) => {
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
    return (
      <LoadingSpinner
        message="Carregando foto..."
        size="lg"
        className="min-h-screen flex items-center justify-center animate-fade-in-up"
      />
    );
  }

  if (!photo) {
    return <div>Foto não encontrada</div>;
  }

  return (
    <div className="min-h-screen flex flex-col md:justify-center relative">
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 group"
        >
          <Image
            src={xIcon}
            alt="Close"
            className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity"
            width={24}
            height={24}
          />
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full p-4 md:p-0">
        <div className="relative w-full h-full flex items-center justify-center">
          {loading ? (
            <div className="min-h-[70vh] flex items-center justify-center w-full">
              <LoadingSpinner message="Carregando foto..." size="lg" />
            </div>
          ) : (
            <Image
              ref={imageRef}
              src={photo!.URL}
              alt={photo!.description || "Photo"}
              className="object-contain max-w-full max-h-[80vh] shadow-2xl"
              width={1920}
              height={1280}
              sizes="100vw"
              priority
            />
          )}
        </div>

        {!loading && photo && (
          <>
            {/* Navigation Arrows */}
            {photo.navigation.previousPhoto && (
              <Link
                href={`/album/${albumId}/${photo.navigation.previousPhoto}`}
                className="fixed left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-sm transition-all duration-300 group"
              >
                <Image
                  src={leftArrowIcon}
                  alt="Previous"
                  className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity"
                  width={32}
                  height={32}
                />
              </Link>
            )}

            {photo.navigation.nextPhoto && (
              <Link
                href={`/album/${albumId}/${photo.navigation.nextPhoto}`}
                className="fixed right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-sm transition-all duration-300 group"
              >
                <Image
                  src={rightArrowIcon}
                  alt="Next"
                  className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity"
                  width={32}
                  height={32}
                />
              </Link>
            )}

            {/* Info Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 max-w-[90vw] w-auto animate-fade-in-up">
              <div className="glass-panel rounded-2xl p-4 md:px-8 md:py-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 text-sm md:text-base">
                <span className="text-gray-400 whitespace-nowrap text-xs uppercase tracking-wider">
                  {dayjs(photo.photoMetadata.createdAt)
                    .locale("pt-br")
                    .format("D MMM YYYY")}
                </span>

                <div className="hidden md:block w-px h-6 bg-white/10" />

                <div className="flex-1">
                  <p
                    ref={descriptionRef}
                    className={`text-white text-sm md:text-base leading-snug ${
                      expanded ? "" : "max-h-12 overflow-hidden"
                    }`}
                  >
                    {photo.description || "Sem descrição"}
                  </p>

                  {photo.description.length > 100 && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="mt-2 text-xs text-gray-300 hover:text-white transition-colors"
                    >
                      {expanded ? "Ver menos" : "Ver mais"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
