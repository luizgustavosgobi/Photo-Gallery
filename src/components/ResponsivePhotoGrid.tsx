import {useEffect, useState} from "react";
import Album from "./Album";
import Photo from "./Photo";

type PhotoData = {
    id: string,
    URL: string
}

type AlbumData = {
    id: string
    name: string
    bannerURL: string
}

type ResponsivePhotoGridProps = {
    data: (PhotoData | AlbumData)[],
    type: number,
    redirectBaseURL: string
}

export default function ResponsivePhotoGrid(props: ResponsivePhotoGridProps) {
    const [columns, setColumns] = useState<number>(4);

    function distributePhotos(data: (PhotoData | AlbumData)[], columns: number) {
        const distributedPhotos = Array.from({ length: columns }, (): (PhotoData | AlbumData)[] => []);

        data.forEach((item, index) => {
            distributedPhotos[index%columns].push(item)
        })

        return distributedPhotos
    }

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 768) {
                setColumns(2);
            } else {
                setColumns(4);
            }
        }

        // Set initial value
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const distributedData = distributePhotos(props.data, columns);

    return (
        <>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${props.type === 2 && "md:grid-cols-5"}`}>
                {distributedData.map((data, index) => ( 
                    <div key={index} className="flex flex-col gap-3 w-full h-fit">
                        {data.map((item) => (
                            <div key={item.id}>
                                {props.type === 1 ?
                                    <Photo photo={item as PhotoData} redirectBaseURL={props.redirectBaseURL} />
                                    :
                                    <Album album={item as AlbumData} redirectBaseUrl={props.redirectBaseURL} />
                                }
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}
