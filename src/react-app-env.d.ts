/// <reference types="react-scripts" />

interface Window {
  ethereum: any;
}

declare module '*.less' {
  const resource: { [key: string]: string };
  export = resource;
}
