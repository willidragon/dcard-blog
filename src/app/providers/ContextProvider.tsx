import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ITokenContext {
  githubToken: string;
  setGithubToken: (value: string) => void;
}

const TokenContext = createContext<ITokenContext | undefined>(undefined);

export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [githubToken, setGithubToken] = useState<string>("");

  return (
    <TokenContext.Provider value={{ githubToken, setGithubToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenStatus = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokenStatus must be used within a TokenProvider');
  }
  return context;
};