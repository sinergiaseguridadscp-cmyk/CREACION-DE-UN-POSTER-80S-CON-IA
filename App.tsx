
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import LoadingState from './components/LoadingState';
import { generateMoviePoster } from './services/geminiService';
import { PosterState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<PosterState>({
    originalImage: null,
    generatedPoster: null,
    status: 'idle',
    errorMessage: null,
  });

  const [movieTitle, setMovieTitle] = useState("CON 50 TACOS ESTOY HECHO UN CHAVAL");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ 
          ...prev, 
          originalImage: reader.result as string,
          status: 'idle',
          errorMessage: null 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, status: 'loading', errorMessage: null }));

    try {
      const result = await generateMoviePoster(state.originalImage, movieTitle);
      setState(prev => ({ 
        ...prev, 
        generatedPoster: result, 
        status: 'success' 
      }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        errorMessage: err.message || "Error al generar el cartel. Por favor, inténtalo de nuevo." 
      }));
    }
  };

  const handleDownload = () => {
    if (state.generatedPoster) {
      const link = document.createElement('a');
      link.href = state.generatedPoster;
      link.download = '80s-movie-poster.png';
      link.click();
    }
  };

  const handleReset = () => {
    setState({
      originalImage: null,
      generatedPoster: null,
      status: 'idle',
      errorMessage: null,
    });
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <Header />

      <main className="max-w-6xl mx-auto space-y-8">
        {state.status === 'idle' && !state.originalImage && (
          <section className="flex flex-col items-center justify-center space-y-6 glass-panel p-12 rounded-2xl border-2 border-dashed border-white/20 hover:border-pink-500 transition-colors cursor-pointer group relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Sube tu foto de referencia</h2>
              <p className="text-gray-400">Hazte protagonista de una obra maestra perdida de los 80.</p>
            </div>
          </section>
        )}

        {state.originalImage && state.status !== 'success' && state.status !== 'loading' && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center glass-panel p-8 rounded-2xl">
            <div className="space-y-4">
              <h3 className="text-xl cinematic-text text-pink-500 font-bold uppercase tracking-widest text-center md:text-left">Foto de referencia</h3>
              <div className="aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-xl border-4 border-white/10 relative shadow-2xl">
                <img src={state.originalImage} alt="Referencia" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl cinematic-text text-cyan-400 font-bold uppercase tracking-widest mb-3">Título de la película</h3>
                <input
                  type="text"
                  value={movieTitle}
                  onChange={(e) => setMovieTitle(e.target.value)}
                  placeholder="Escribe el título aquí..."
                  className="w-full p-4 bg-black/60 border-2 border-white/20 focus:border-pink-500 rounded-lg text-lg font-bold italic outline-none transition-all cinematic-text text-white placeholder:text-gray-600"
                />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Generaremos un cartel pintado a mano con luces de neón, ruinas antiguas y una pose de acción épica basada en tu rostro. El título aparecerá en la parte inferior del cartel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleGenerate}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-pink-500/20 transform hover:-translate-y-1 cinematic-text uppercase tracking-widest"
                >
                  ¡Generar Cartel!
                </button>
                <button 
                  onClick={handleReset}
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                >
                  Cambiar Foto
                </button>
              </div>
            </div>
          </section>
        )}

        {state.status === 'loading' && (
          <div className="glass-panel rounded-2xl p-12">
            <LoadingState />
          </div>
        )}

        {state.status === 'success' && state.generatedPoster && (
          <section className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="max-w-xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src={state.generatedPoster} 
                  alt="Cartel Generado" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 poster-shimmer opacity-30 pointer-events-none"></div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={handleDownload}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg flex items-center gap-2 cinematic-text tracking-widest"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Descargar Póster
              </button>
              <button 
                onClick={handleReset}
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl transition-all cinematic-text tracking-widest"
              >
                Crear Otro
              </button>
            </div>
          </section>
        )}

        {state.status === 'error' && (
          <div className="glass-panel border-red-500/50 p-12 text-center rounded-2xl space-y-4">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-500">¡Oops! Algo salió mal</h2>
            <p className="text-gray-400 max-w-md mx-auto">{state.errorMessage}</p>
            <button 
              onClick={() => setState(prev => ({ ...prev, status: 'idle' }))}
              className="mt-4 px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all"
            >
              Reintentar
            </button>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 py-4 px-4 bg-black/80 backdrop-blur-md border-t border-white/5 text-center text-xs text-gray-500 cinematic-text uppercase tracking-widest">
        Inspirado en los pósters de Drew Struzan • Gemini AI Movie Art Engine
      </footer>
    </div>
  );
};

export default App;
