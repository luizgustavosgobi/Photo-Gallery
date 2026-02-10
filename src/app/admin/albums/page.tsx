"use client";

import { useState } from "react";

import AlbumsManagement from "@/components/admin/AlbumsManagement";
import AlbumCreationForm from "@/components/admin/AlbumCreationForm";

type Tab = "add" | "manage";

export default function AlbumsAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("add");

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
        Gerenciar Álbuns
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
            Criar Álbum
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
                d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
              />
            </svg>
            Visualizar e Editar
          </div>
        </button>
      </div>

      <div className={activeTab === "add" ? "block" : "hidden"}>
        <AlbumCreationForm />
      </div>
      <div className={activeTab === "manage" ? "block" : "hidden"}>
        <AlbumsManagement />
      </div>
    </div>
  );
}
