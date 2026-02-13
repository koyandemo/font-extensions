
import React from 'react';
import { FileText } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-[#fffbeb]">
      <div className="w-32 h-32 bg-gradient-to-br from-[#fcd34d] to-[#d9a02d] rounded-full flex items-center justify-center mb-10 shadow-lg shadow-yellow-100">
        <FileText className="w-14 h-14 text-white" />
      </div>
      
      <h2 className="text-2xl font-black text-[#1e293b] mb-4">No Fonts Yet</h2>
      
      <p className="text-base text-center text-gray-500 leading-relaxed mb-12 max-w-[280px]">
        You haven't saved or purchased any fonts yet. Visit our website to explore and add fonts to your collection.
      </p>
      
      <button className="bg-[#d9a02d] hover:bg-[#c08d24] text-white px-12 py-4 rounded-[30px] font-bold shadow-md transition-all active:scale-95 text-lg">
        Browse Fonts
      </button>
    </div>
  );
};

export default EmptyState;
