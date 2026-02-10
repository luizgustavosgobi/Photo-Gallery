import Link from "next/link";
import Image from "next/image";

type AlbumProps = {
    redirectBaseUrl: string
    album: AlbumData
}

type AlbumData = {
    id: string
    name: string
    bannerURL: string
}

export default function Album(props: AlbumProps) {
    return (
        <Link 
            href={`${props.redirectBaseUrl}/${props.album.id}`} 
            className="group relative flex flex-col overflow-hidden rounded-xl bg-[#1a1a1a] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/20 border border-white/5"
        >
            <div className="aspect-square w-full overflow-hidden">
                <Image 
                    src={props.album.bannerURL} 
                    alt={props.album.name ?? ""}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width={400}
                    height={400}
                />
            </div>
            
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                <span className="block text-2xl font-medium text-white drop-shadow-md" style={{fontFamily: "'Playfair Display', serif"}}>
                    {props.album.name}
                </span>
                <div className="h-1 w-0 bg-purple-500 transition-all duration-300 group-hover:w-full mt-2" />
            </div>
        </Link>
    )
}
