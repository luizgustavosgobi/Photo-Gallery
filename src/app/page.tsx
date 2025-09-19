'use client';

import Header from "../components/Header";
import NavLine from "../components/NavLine";
import {useEffect, useState} from "react";
import Photos from "../components/Photos";
import Albums from "../components/Albums";

export default function Home() {
    const [currentTab, setCurrentTab] = useState<number>(1);

    useEffect(() => {
        setCurrentTab(Number(sessionStorage.getItem("currentHomeTab")) || 1)
    }, []);

    return (
        <div className="mx-[3vw] md:mx-[10vw] my-[5vh] md:my-[8vh]">
            <Header />
            <NavLine currentTab={currentTab} setCurrentTab={setCurrentTab} />
            {currentTab === 1 ? <Photos /> : <Albums />}
        </div>
    )
}
