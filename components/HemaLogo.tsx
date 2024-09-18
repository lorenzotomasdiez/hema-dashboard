import React from 'react';
import Image from 'next/image';

const HemaLogo: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="animate-spin">
        <Image
          src="/hema-logo.jpg"
          alt="Hema Logo"
          width={100}
          height={100}
          className="rounded-full border border-white"
        />
      </div>
    </div>
  );
};

export default HemaLogo;