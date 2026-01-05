'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHidden(true);
    }, 2800); // Start transition slightly before timeout in client-layout

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`splash-screen ${isHidden ? 'hidden' : ''}`}>
        <div className="curtain-container">
            <div className="curtain curtain-left"></div>
            <div className="curtain curtain-right"></div>
        </div>
        <div className="splash-content">
            <div className="logo-container">
                <h1 className="logo-text">PROPLOOM</h1>
            </div>
            <p className="tagline">Defining Luxury Living</p>
            <svg className="house-animation" viewBox="0 0 200 100">
                <path
                    className="house-path"
                    d="M 10 100 L 10 40 L 100 10 L 190 40 L 190 100 L 10 100 Z M 70 100 L 70 60 L 130 60 L 130 100"
                />
            </svg>
        </div>
    </div>
  );
}
