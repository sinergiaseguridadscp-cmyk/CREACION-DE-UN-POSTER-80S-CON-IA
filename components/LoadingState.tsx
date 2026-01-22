
import React from 'react';

const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = React.useState(0);
  const messages = [
    "Pintando con pinceladas de Drew Struzan...",
    "Añadiendo luces de neón cyberpunk...",
    "Excavando ruinas antiguas...",
    "Cargando combustible en el Halcón Milenario...",
    "Ajustando las gafas del protagonista...",
    "Dibujando el arma futurista...",
    "Mezclando magentas y dorados épicos..."
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-cyan-400 border-b-transparent animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
        <div className="absolute inset-4 rounded-full border-4 border-yellow-400 border-l-transparent animate-spin [animation-duration:3s]"></div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold cinematic-text text-white animate-pulse">
          {messages[messageIndex]}
        </h3>
        <p className="text-gray-400 text-sm mt-2">La magia cinematográfica lleva unos segundos...</p>
      </div>
    </div>
  );
};

export default LoadingState;
