import Image from 'next/image';
import profilePicture from '../assets/profile.jpeg';

export default function Header() {
  return (
      <div className="flex gap-[1.5rem]">
          <Image 
            src={profilePicture} 
            alt="Profile Picture" 
            className="w-[6.5rem] h-[6.5rem] md:w-[8rem] md:h-[8rem] object-cover rounded-[50%]"
            width={128}
            height={128}
          />

          <div className="flex flex-col justify-evenly">
              <h1 className="text-[1.1rem] font-bold md:text-[1.8rem]">Luiz Gustavo Sgobi</h1>
              <h2 className="mb-3 text-sm">Só Se vive uma vez mesmo :0</h2>
          </div>
    </div>
  )
}
