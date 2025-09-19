'use client';

import React from "react";

type NavLineProps = {
    currentTab: number
    setCurrentTab: React.Dispatch<React.SetStateAction<number>>
}

export default function NavLine(props: NavLineProps) {
    return (
        <div className="my-[1.5rem]">
            <div className="h-[1px] bg-[#DDDDDD] " />
            <div className="flex gap-[3rem] mt-2">
                <p className={`${props.currentTab === 1 ? "font-bold": ""} cursor-pointer`} onClick={() => {props.setCurrentTab(1); sessionStorage.setItem("currentHomeTab", "1")}} >Fotos</p>
                <p className={`${props.currentTab === 2 ? "font-bold": ""} cursor-pointer`} onClick={() => {props.setCurrentTab(2); sessionStorage.setItem("currentHomeTab", "2")}} >Albuns</p>
            </div>
        </div>
    )
}
