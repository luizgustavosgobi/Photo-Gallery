'use client';

import React from "react";

type NavLineProps = {
    currentTab: number
    setCurrentTab: React.Dispatch<React.SetStateAction<number>>
}

export default function NavLine(props: NavLineProps) {
    return (
        <div className="my-12">
            <div className="flex justify-center gap-12 border-b border-white/10 pb-2">
                <button 
                    className={`text-lg tracking-wide transition-all duration-300 pb-1 -mb-2 border-b-2 ${
                        props.currentTab === 1 
                        ? "text-white border-purple-500 font-medium scale-110" 
                        : "text-gray-500 border-transparent hover:text-gray-300"
                    }`} 
                    onClick={() => {props.setCurrentTab(1); sessionStorage.setItem("currentHomeTab", "1")}} 
                >
                    FOTOS
                </button>
                <button 
                    className={`text-lg tracking-wide transition-all duration-300 pb-1 -mb-2 border-b-2 ${
                        props.currentTab === 2 
                        ? "text-white border-purple-500 font-medium scale-110" 
                        : "text-gray-500 border-transparent hover:text-gray-300"
                    }`} 
                    onClick={() => {props.setCurrentTab(2); sessionStorage.setItem("currentHomeTab", "2")}} 
                >
                    ÁLBUNS
                </button>
            </div>
        </div>
    )
}
