/// <reference types="vite/client" />

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare global {
  interface Window {
    puter?: {
      ai: {
        txt2speech: (
          text: string,
          options?: {
            provider?: string;
            model?: string;
            voice?: string;
            language?: string;
            engine?: string;
          }
        ) => Promise<HTMLAudioElement>;
      };
    };
  }
}

