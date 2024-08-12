// UnitContext.tsx
import React, { createContext, useState, useContext } from 'react';

type Unit = 'g' | 'kg' | 'lbs';

interface UnitContextProps {
  unit: Unit;
  setUnit: (unit: Unit) => void;
}

const UnitContext = createContext<UnitContextProps | undefined>(undefined);

export const UnitProvider: React.FC = ({ children }) => {
  const [unit, setUnit] = useState<Unit>('g');

  return (
    <UnitContext.Provider value={{ unit, setUnit }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = (): UnitContextProps => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error('useUnit must be used within a UnitProvider');
  }
  return context;
};
