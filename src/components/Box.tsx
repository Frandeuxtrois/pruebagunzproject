
import React from 'react';

interface BoxProps {
  title: string;
  children: React.ReactNode;
  titleClassName?: string;
  contentClassName?: string;
}

const Box: React.FC<BoxProps> = ({ title, children, titleClassName = '', contentClassName = '' }) => {
  return (
    <div className="bg-[#d7d7d7] border border-[#b7b7b7] rounded-lg shadow-md w-full">
      <div className={`bg-gradient-to-b from-[#e8e8e8] to-[#c8c8c8] border-b border-[#b7b7b7] px-2.5 py-1.5 font-bold text-[#555] text-xs rounded-t-lg ${titleClassName}`}>
        {title}
      </div>
      <div className={`p-2.5 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Box;
