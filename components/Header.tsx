
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 px-4 text-center border-b border-white/10 glass-panel mb-8">
      <h1 className="text-4xl md:text-6xl retro-title mb-2 tracking-tighter">
        GENERA TU PÓSTER 80s
      </h1>
      <p className="text-cyan-400 font-bold uppercase tracking-widest text-sm md:text-base">
        Inspirado en Drew Struzan & el cine de culto
      </p>
    </header>
  );
};

export default Header;
