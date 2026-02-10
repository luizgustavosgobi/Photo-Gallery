"use client";

import { DefaultApiMessage, useQuery } from "@/hooks/useQuery";
import { useState, useRef, useEffect } from "react";

import PhotoCreationFormAdminPage from "@/components/admin/PhotoCreationForm";
import PhotosManagement from "@/components/admin/PhotosManagement";

type Tab = "add" | "manage";

export default function PhotosAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("add");

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
        Gerenciar Fotos
      </h1>

      <div className="mb-6 bg-[#1a1a1a] border border-white/10 rounded-2xl p-2 inline-flex gap-2">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            activeTab === "add"
              ? "bg-white text-black shadow-lg"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Adicionar Foto
          </div>
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            activeTab === "manage"
              ? "bg-white text-black shadow-lg"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            Visualizar e Editar
          </div>
        </button>
      </div>

      <div className={activeTab === "add" ? "block" : "hidden"}>
        <PhotoCreationFormAdminPage />
      </div>
      <div className={activeTab === "manage" ? "block" : "hidden"}>
        <PhotosManagement />
      </div>
    </div>
  );
}
