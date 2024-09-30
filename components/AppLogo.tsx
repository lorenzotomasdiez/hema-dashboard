import React from 'react';
import Image from 'next/image';

const AppLogo: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="animate-spin w-28 h-28 bg-white rounded-full aspect-square flex justify-center items-center">
        <Image
          src="/app-logo.png"
          alt="Hema Logo"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
};

export default AppLogo;