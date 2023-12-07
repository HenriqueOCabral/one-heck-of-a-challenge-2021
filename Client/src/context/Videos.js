import React, { createContext, useContext, useState } from 'react';

const VideosContext = createContext();

export default function VideoProvider({ children }) {
  const [item, setItem] = useState();
  return <VideosContext.Provider value={{ item, setItem }}>{children}</VideosContext.Provider>;
}

export function useVideoContext() {
  const context = useContext(VideosContext);

  const { item, setItem } = context;

  return { item, setItem };
}
