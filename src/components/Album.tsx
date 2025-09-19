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
        <Link href={`${props.redirectBaseUrl}/${props.album.id}`} className="flex flex-col bg-[#262727] rounded-md rounded-t-none items-center gap-1 p-1 pt-5 relative">
            <div className="flex gap-1 absolute top-1.5 right-1.5">
                <div className="bg-red-500 w-2 h-2 rounded-full" />
                <div className="bg-yellow-500 w-2 h-2 rounded-full" />
                <div className="bg-green-500 w-2 h-2 rounded-full" />
            </div>
            <Image 
                src={props.album.bannerURL} 
                alt=""
                className="h-[13rem] w-[13rem] md:h-[20rem] md:w-[20rem] object-cover"
                width={320}
                height={320}
            />
            <span className="text-3xl md:text-4xl bg-[#323434] p-2 rounded-sm w-full text-center rounded-t-none" style={{fontFamily: "Parisienne"}} >{props.album.name}</span>
        </Link>
    )
}
