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
        <Link href={`${props.redirectBaseURL}/${props.photo.id}`} className="flex flex-col bg-[#262727] p-1 rounded-sm items-center">
            <Image
                src={props.photo.URL} 
                alt=""  
                className="object-cover w-fit"
                width={300}
                height={300}
            />
        </Link>
    )
}
