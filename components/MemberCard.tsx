import React from 'react';
import { Member } from '../types';
import { Briefcase, User, ArrowUpRight, ArrowDownLeft, Mail } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onClick?: () => void;
  highlightMatch?: {
    reason: string;
    matchedItem: string;
    score: number;
    type: 'ASK' | 'GIVE'; // Did we match on their Ask or their Give?
  };
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onClick, highlightMatch }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md cursor-pointer ${highlightMatch ? 'ring-2 ring-bni-red ring-offset-2' : ''}`}
    >
      <div className="flex items-start gap-4">
        <img 
          src={member.avatar} 
          alt={member.name} 
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
        />
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-800">{member.name}</h3>
          <p className="text-sm text-bni-red font-medium">{member.company}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <Briefcase size={12} />
            <span>{member.industry}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <User size={12} />
            <span>{member.specialty}</span>
          </div>
        </div>
      </div>

      {/* Match Highlight Section */}
      {highlightMatch && (
        <div className="mt-4 bg-red-50 p-3 rounded-lg border border-red-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-bni-red uppercase tracking-wider">
              {highlightMatch.type === 'GIVE' ? 'Found a Giver!' : 'Found a Taker!'}
            </span>
            <span className="text-xs font-bold text-green-600">{highlightMatch.score}% Match</span>
          </div>
          <p className="text-sm text-gray-800 font-medium">"{highlightMatch.matchedItem}"</p>
          <p className="text-xs text-gray-600 mt-1 italic">{highlightMatch.reason}</p>
        </div>
      )}

      {/* Standard Lists (Hidden if matched, or shown partially) */}
      {!highlightMatch && (
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
              <ArrowUpRight size={12} />
              <span>Top Ask</span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-1">{member.asks[0]}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
              <ArrowDownLeft size={12} />
              <span>Top Give</span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-1">{member.gives[0]}</p>
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
         <span className="text-xs text-gray-400">View Profile</span>
         <button className="text-gray-400 hover:text-bni-red transition-colors">
            <Mail size={16} />
         </button>
      </div>
    </div>
  );
};

export default MemberCard;
