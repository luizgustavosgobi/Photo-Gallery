'use client'

import NavLine from '../components/NavLine';
import {useEffect, useState} from 'react';
import Photos from '../components/Photos';
import Albums from '../components/Albums';

export default function HomeClient() {
  const [currentTab, setCurrentTab] = useState<number>(1);

  useEffect(() => {
    setCurrentTab(Number(sessionStorage.getItem('currentHomeTab')) || 1);
  }, []);

  return (
    <>
      <NavLine currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="animate-fade-in-up">
        <div className={currentTab === 1 ? 'block' : 'hidden'}>
          <Photos />
        </div>
        <div className={currentTab === 2 ? 'block' : 'hidden'}>
          <Albums />
        </div>
      </div>
    </>
  );
}
