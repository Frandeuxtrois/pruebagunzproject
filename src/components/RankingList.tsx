
import React from 'react';

interface RankingListProps {
  items: string[];
}

const RankingList: React.FC<RankingListProps> = ({ items }) => {
  return (
    <ol className="list-decimal list-inside text-[#555] pl-1">
      {items.map((item, index) => (
        <li 
          key={index} 
          className="py-1 border-b border-[#ccc] last:border-b-0"
        >
          {item}
        </li>
      ))}
    </ol>
  );
};

export default RankingList;
