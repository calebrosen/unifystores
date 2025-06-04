import { createContext, useState } from 'react';

export const PDFPathContext = createContext();

export const PathProvider = ({ children }) => {
  const [docPath, setDocPath] = useState('');

  return (
    <PDFPathContext.Provider value={{ docPath, setDocPath }}>
      {children}
    </PDFPathContext.Provider>
  );
};
