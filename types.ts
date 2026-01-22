
export interface PosterState {
  originalImage: string | null;
  generatedPoster: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string | null;
}

export interface GenerationParams {
  title: string;
  image: string; // base64
}
