/// <reference types="react-scripts" />

declare module 'react' {
  export = React;
  export as namespace React;
  namespace React {
    interface StrictMode {
      children?: React.ReactNode;
    }
  }
}

declare module 'react-dom/client' {
  import { ReactNode } from 'react';
  export function createRoot(container: Element | null): {
    render(children: ReactNode): void;
  };
} 