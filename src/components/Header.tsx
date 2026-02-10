'use server'

import { getCachedProfile } from '@/lib/profileCache';
import Image from 'next/image';
import profilePicture from '../assets/profile.jpeg';
import HeaderHydrator from './HeaderHydrator';

export default async function Header() {
  const prof = await getCachedProfile();
  const description = prof.description ?? '"Só se vive uma vez mesmo :0"';
  const photoProxy = prof.photo ? `/api/profile/photo?key=${encodeURIComponent(prof.photo)}` : null;

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 py-8 animate-fade-in">
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-rose-400 via-fuchsia-500 to-indigo-500 rounded-full opacity-70 blur-md group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-gradient-xy"></div>
        <div className="absolute -inset-0.5 rounded-full bg-linear-to-r from-rose-400 via-fuchsia-500 to-indigo-500 animate-spin-slow opacity-80"></div>

        <img
          id="site-profile-img"
          src={photoProxy || profilePicture.src}
          alt="Profile Picture"
          className="relative w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-[#0f0f0f] shadow-2xl z-10"
        />
      </div>

      <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
        <h1 className="leading-normal text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
          Luiz Gustavo Sgobi
        </h1>
        <h2 id="site-profile-desc" className="text-lg md:text-xl text-gray-400 font-light italic">
          {description}
        </h2>
      </div>
      <HeaderHydrator />
    </div>
  );
}
