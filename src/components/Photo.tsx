import Link from "next/link";
import Image from "next/image";

type PhotoProps = {
    redirectBaseURL: string
    photo: PhotoData
}

type PhotoData = {
    id: string,
    URL: string
}

export default function Photo(props: PhotoProps) {
    return (
        <Link 
            href={`${props.redirectBaseURL}/${props.photo.id}`} 
            className="group relative block overflow-hidden rounded-lg bg-[#1a1a1a] transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10"
        >
            <div className="aspect-3/4 w-full overflow-hidden">
                <Image
                    src={props.photo.URL} 
                    alt=""  
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    width={800}
                    height={1200}
                />
            </div>
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
        </Link>
    )
}
