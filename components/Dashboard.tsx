import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PLATINA_MEMBERS } from '../constants';
import { Member } from '../types';
import { parseExcelSheet, parseCSV } from '../services/excelService';
import { findMemberMatches, cleanDataWithAI, SmartMatch } from '../services/geminiService';
import { Search, Users, X, Upload, Download, RefreshCw, Sparkles, Loader2, Link as LinkIcon, ArrowRightLeft, CheckCircle, Zap, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

import * as XLSX from 'xlsx';

const WhatsAppIcon = ({ className = "text-white" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const getWhatsAppUrl = (members: Member[], selectedMemberName: string, matchName: string, give?: string, ask?: string) => {
  const matchedMember = members.find(m => m.name === matchName);
  const phoneNumber = matchedMember?.phoneNumber;

  if (!phoneNumber) return '#';

  const firstName = matchName.split(' ')[0];
  const myName = selectedMemberName || 'a fellow member';

  let message = `Hi ${firstName},\n\nThis is ${myName} from BNI Platina.\nI noticed on the app that we might be a good match for business.\n\nI wish to grow my business! How can you help me?`;

  if (give && ask) {
    message = `Hi ${firstName},\n\nThis is ${myName} from BNI Platina.\nI noticed on the app that you can provide: "${give}"\nWhich matches my ask for: "${ask}"\n\nI wish to grow my business! How can you help me?`;
  }

  return `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
};

const getContactWhatsAppUrl = (targetMember: Member, selectedMemberName: string) => {
  const phoneNumber = targetMember.phoneNumber;

  if (!phoneNumber) return '#';

  const firstName = targetMember.name.split(' ')[0];
  const myName = selectedMemberName || 'a fellow member';

  const message = `Hi ${firstName},\n\nThis is ${myName} from BNI Platina.\nI found your profile on our chapter connect app and would like to connect.\n\nI wish to grow my business! How can you help me?`;

  return `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
};

// --- Member Card Component with Accordion ---
const MemberCard: React.FC<{ member: Member; selectedMemberName: string }> = ({ member, selectedMemberName }) => {
  const [isGivesExpanded, setIsGivesExpanded] = useState(false);
  const [isAsksExpanded, setIsAsksExpanded] = useState(false);

  const displayedGives = isGivesExpanded ? member.gives : member.gives.slice(0, 2);
  const displayedAsks = isAsksExpanded ? member.asks : member.asks.slice(0, 2);

  return (
    <div className="bg-white border-2 border-black shadow-comic flex flex-col h-full hover:-translate-y-1 transition-transform">
      <div className="p-4 border-b-2 border-black bg-gray-50 flex justify-between items-start">
        <span className="text-xs font-black uppercase bg-black text-white px-2 py-1">
          {member.chapterRole || 'MEMBER'}
        </span>
      </div>

      <div className="p-6 flex-grow">
        <div className="flex items-center gap-4 mb-4">
          <img src={member.avatar} alt="" className="w-16 h-16 border-2 border-black" />
          <div>
            <h3 className="text-xl font-black uppercase leading-tight">{member.name}</h3>
            <p className="text-xs font-bold text-gray-500 uppercase">{member.company}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-black uppercase mb-1 bg-green-200 inline-block px-1 border border-black">Gives</h4>
            <div className="text-sm font-bold">
              {member.gives.length === 0 ? (
                <p className="text-gray-400 italic">None listed</p>
              ) : (
                <>
                  <p>{displayedGives.join(', ')}{!isGivesExpanded && member.gives.length > 2 && '...'}</p>
                  {member.gives.length > 2 && (
                    <button
                      onClick={() => setIsGivesExpanded(!isGivesExpanded)}
                      className="flex items-center gap-1 text-xs text-blue-600 mt-1 hover:underline font-bold uppercase"
                    >
                      {isGivesExpanded ? (
                        <>Show Less <ChevronUp size={12} /></>
                      ) : (
                        <>View All ({member.gives.length}) <ChevronDown size={12} /></>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase mb-1 bg-blue-200 inline-block px-1 border border-black">Asks</h4>
            <div className="text-sm font-bold">
              {member.asks.length === 0 ? (
                <p className="text-gray-400 italic">None listed</p>
              ) : (
                <>
                  <p>{displayedAsks.join(', ')}{!isAsksExpanded && member.asks.length > 2 && '...'}</p>
                  {member.asks.length > 2 && (
                    <button
                      onClick={() => setIsAsksExpanded(!isAsksExpanded)}
                      className="flex items-center gap-1 text-xs text-blue-600 mt-1 hover:underline font-bold uppercase"
                    >
                      {isAsksExpanded ? (
                        <>Show Less <ChevronUp size={12} /></>
                      ) : (
                        <>View All ({member.asks.length}) <ChevronDown size={12} /></>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t-2 border-black bg-gray-50">
        {member.phoneNumber ? (
          <a
            href={getContactWhatsAppUrl(member, selectedMemberName)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-white border-2 border-black py-2 font-bold uppercase text-sm hover:bg-green-400 transition-colors"
          >
            <WhatsAppIcon className="text-black" />
            <span>WhatsApp</span>
          </a>
        ) : (
          <button disabled className="w-full bg-gray-200 text-gray-400 border-2 border-gray-300 py-2 font-bold uppercase text-sm cursor-not-allowed">
            No Contact
          </button>
        )}
      </div>
    </div>
  );
};

// --- Custom Member Select with Comic Initials ---
const MemberSelect = ({ members, selectedMemberName, onSelect }: { members: Member[]; selectedMemberName: string; onSelect: (name: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedMember = members.find(m => m.name === selectedMemberName);

  // Helper for abstract comic pattern backgrounds
  const patterns = [
    'radial-gradient(circle at 0% 0%, #CF2030 10%, transparent 11%), radial-gradient(circle at 100% 100%, #CF2030 10%, transparent 11%), repeating-linear-gradient(45deg, #FFD700 0, #FFD700 2px, transparent 2px, transparent 10px)',
    'repeating-linear-gradient(-45deg, #00BCD4 0, #00BCD4 1px, transparent 1px, transparent 8px), radial-gradient(circle at 50% 50%, #000 5%, transparent 6%)',
    'conic-gradient(from 0deg at 50% 50%, #CF2030 0deg 90deg, #FFD700 90deg 180deg, #00BCD4 180deg 270deg, #000 270deg 360deg)',
    'repeating-radial-gradient(circle at 50% 50%, #FFD700 0, #FFD700 4px, transparent 4px, transparent 12px)',
    'linear-gradient(90deg, #CF2030 50%, #000 50%)'
  ];

  const getInitialBox = (name: string, index: number) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const pattern = patterns[index % patterns.length];

    return (
      <div className="w-10 h-10 border-2 border-black flex items-center justify-center relative overflow-hidden flex-shrink-0" style={{ background: pattern }}>
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
        <span className="text-black font-black text-lg relative z-10 drop-shadow-[1px_1px_0px_white]">{initials}</span>
      </div>
    );
  };

  const getMemberInfo = (member: Member) => {
    return (
      <div className="flex flex-col overflow-hidden">
        <span className="font-black text-lg uppercase leading-tight truncate">{member.name}</span>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">
          {member.company} • {member.specialty}
        </span>
      </div>
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[72px] flex items-center gap-4 px-4 border-4 border-black bg-white focus:outline-none hover:shadow-comic transition-all overflow-hidden"
      >
        {selectedMember ? (
          <>
            {getInitialBox(selectedMember.name, members.indexOf(selectedMember))}
            {getMemberInfo(selectedMember)}
          </>
        ) : (
          <span className="text-xl font-bold uppercase text-gray-400">SELECT YOUR OFFICIAL PROFILE...</span>
        )}
        <div className="ml-auto flex-shrink-0">
          <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={24} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full max-h-80 overflow-y-auto bg-white border-4 border-black z-50 shadow-comic animate-in slide-in-from-top-2">
          {members.map((member, index) => (
            <button
              key={member.id}
              onClick={() => {
                onSelect(member.name);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 border-b-2 border-gray-100 hover:bg-yellow-50 transition-colors text-left last:border-b-0 overflow-hidden"
            >
              {getInitialBox(member.name, index)}
              {getMemberInfo(member)}
              {selectedMemberName === member.name && (
                <CheckCircle className="ml-auto text-green-500 flex-shrink-0" size={20} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(PLATINA_MEMBERS);
  const [selectedMemberName, setSelectedMemberName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'findMatches' | 'browseAll'>('findMatches');

  // Sheet Sync State
  const [sheetUrl, setSheetUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Matching State
  const [aiMatches, setAiMatches] = useState<SmartMatch[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  // Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const selectedMemberData = useMemo(() =>
    members.find(m => m.name === selectedMemberName),
    [members, selectedMemberName]
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const initialParse = await parseExcelSheet(file);
      const rawTextForAI = JSON.stringify(initialParse);
      const cleanedMembers = await cleanDataWithAI(rawTextForAI);

      if (cleanedMembers.length === 0) {
        setUploadError("AI could not verify member data. Ensure the sheet matches official members.");
      } else {
        const enrichedMembers = enrichMembersWithCategories(cleanedMembers);
        setMembers(enrichedMembers);
        setSelectedMemberName('');
        setAiMatches([]);
        setUploadSuccess("Operation Completed Successfully!");
        setTimeout(() => setUploadSuccess(null), 5000);
      }
    } catch (err) {
      console.error(err);
      setUploadError("Failed to process file with AI.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSheetSync = async () => {
    if (!sheetUrl) return;

    const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      setUploadError("Invalid Google Sheet URL. Please use a standard URL.");
      return;
    }

    const sheetId = match[1];
    const xlsxUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const response = await fetch(xlsxUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch sheet. Make sure it is 'Published to Web'.");
      }

      const buffer = await response.arrayBuffer();
      const workbook = XLSX.read(buffer);

      // Combine all sheets into a single text/json blob for the AI
      const allSheetsData: any[] = [];
      workbook.SheetNames.forEach(name => {
        const sheet = workbook.Sheets[name];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        allSheetsData.push({ sheetName: name, data: jsonData });
      });

      const combinedRawText = JSON.stringify(allSheetsData);
      const cleanedMembers = await cleanDataWithAI(combinedRawText);

      if (cleanedMembers.length === 0) {
        setUploadError("AI could not identify valid members. Ensure the sheet matches official roster.");
      } else {
        const enrichedMembers = enrichMembersWithCategories(cleanedMembers);
        setMembers(enrichedMembers);
        setSelectedMemberName('');
        setAiMatches([]);
        setShowUrlInput(false);
        setSheetUrl('');
        setUploadSuccess("Operation Completed Successfully!");
        setTimeout(() => setUploadSuccess(null), 5000);
      }
    } catch (err) {
      console.error(err);
      setUploadError("Could not sync with AI. Check sheet permissions.");
    } finally {
      setIsUploading(false);
    }
  };

  const enrichMembersWithCategories = (aiMembers: Member[]): Member[] => {
    const validMembers = aiMembers.filter(m => {
      return PLATINA_MEMBERS.some(
        pm => pm.name.toLowerCase().trim() === m.name.toLowerCase().trim() ||
          pm.name.toLowerCase().includes(m.name.toLowerCase())
      );
    });

    return validMembers.map(m => {
      const knownMember = PLATINA_MEMBERS.find(
        pm => pm.name.toLowerCase().trim() === m.name.toLowerCase().trim() ||
          pm.name.toLowerCase().includes(m.name.toLowerCase())
      );

      return {
        ...m,
        company: knownMember?.company || 'BNI Member',
        specialty: knownMember?.specialty || 'General Member',
        phoneNumber: knownMember?.phoneNumber || '',
        chapterRole: knownMember?.chapterRole || 'Member'
      };
    });
  };

  useEffect(() => {
    let active = true;

    const runMatching = async () => {
      if (!selectedMemberData) {
        setAiMatches([]);
        return;
      }

      setIsMatching(true);
      setAiMatches([]);

      try {
        const results = await findMemberMatches(selectedMemberData, members);
        if (active) {
          setAiMatches(results);
        }
      } catch (e) {
        console.error("Matching failed", e);
      } finally {
        if (active) setIsMatching(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (selectedMemberName) runMatching();
    }, 600);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [selectedMemberData, members]);

  const filteredMembers = useMemo(() => {
    return members
      .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [members, searchTerm]);

  return (
    <div className="min-h-screen bg-yellow-50 p-6 font-monda">
      <div className="max-w-7xl mx-auto">

        {/* Top Controls Pane */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white border-comic shadow-comic p-4 mb-8 rounded-none">
          <div className="flex items-center gap-4">
            {uploadError && (
              <span className="text-sm text-white font-bold bg-red-600 px-3 py-1 border-2 border-black flex items-center gap-2">
                <X size={14} />
                {uploadError}
              </span>
            )}

            {uploadSuccess && (
              <span className="text-sm text-black font-bold bg-green-400 px-3 py-1 border-2 border-black flex items-center gap-2">
                <CheckCircle size={14} />
                {uploadSuccess}
              </span>
            )}

            {isUploading && (
              <span className="text-sm text-black font-bold bg-blue-300 px-3 py-1 border-2 border-black flex items-center gap-2 animate-pulse">
                <Loader2 size={14} className="animate-spin" />
                Processing Sheet...
              </span>
            )}
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <button
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black border-2 border-black font-bold hover:bg-green-400 hover:shadow-comic transition-all"
              >
                <LinkIcon size={16} />
                Sync Sheet
              </button>

              {showUrlInput && (
                <div className="absolute top-full right-0 mt-2 p-4 bg-white border-comic shadow-comic w-80 z-20">
                  <p className="text-xs font-bold mb-2 uppercase">Google Sheet URL</p>
                  <input
                    type="text"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/..."
                    className="w-full text-sm border-2 border-black p-2 mb-2 font-mono"
                  />
                  <button
                    onClick={handleSheetSync}
                    disabled={isUploading || !sheetUrl}
                    className="w-full bg-black text-white text-xs font-bold py-2 hover:bg-gray-800 disabled:opacity-50"
                  >
                    SYNC NOW
                  </button>
                </div>
              )}
            </div>

            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="hidden"
              ref={fileInputRef}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black border-2 border-black font-bold hover:bg-gray-100 hover:shadow-comic transition-all"
            >
              {isUploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              Upload Excel
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-black mb-2 uppercase tracking-tight" style={{ textShadow: '4px 4px 0px #CF2030' }}>
            Ask & Give
          </h1>
          <p className="text-xl font-bold bg-black text-white inline-block px-4 py-1 transform -rotate-2">
            SUPERCHARGED CONNECTION MATCHER
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm font-bold">
            <Sparkles size={16} className="text-black" />
            <span>Powered by <a href="https://agentspanel.com" target="_blank" className="hover:underline text-bni-red">AgentsPanel</a></span>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setViewMode('findMatches')}
            className={`px-6 py-3 border-2 border-black font-bold uppercase tracking-wider transition-all transform hover:-translate-y-1 hover:shadow-comic ${viewMode === 'findMatches'
              ? 'bg-bni-red text-white shadow-comic'
              : 'bg-white text-black'
              }`}
          >
            <Zap size={18} className="inline mr-2 mb-1" />
            Find Matches
          </button>

          <button
            onClick={() => setViewMode('browseAll')}
            className={`px-6 py-3 border-2 border-black font-bold uppercase tracking-wider transition-all transform hover:-translate-y-1 hover:shadow-comic ${viewMode === 'browseAll'
              ? 'bg-cyan-400 text-black shadow-comic'
              : 'bg-white text-black'
              }`}
          >
            <Users size={18} className="inline mr-2 mb-1" />
            Roster
          </button>
        </div>

        {viewMode === 'findMatches' && (
          <>
            {/* Member Selection */}
            <div className="bg-white border-2 border-black shadow-comic p-6 mb-8">
              <label className="block text-lg font-black uppercase mb-4">
                WHO ARE YOU?
              </label>
              <MemberSelect
                members={members}
                selectedMemberName={selectedMemberName}
                onSelect={(name) => setSelectedMemberName(name)}
              />
            </div>

            {selectedMemberData && (
              <div className="bg-white border-2 border-black shadow-comic p-8 mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <img src={selectedMemberData.avatar} alt="" className="w-32 h-32 rounded-none border-4 border-black object-cover bg-gray-200" />

                  <div className="flex-1 w-full text-center md:text-left">
                    <h2 className="text-4xl font-black uppercase mb-1">{selectedMemberData.name}</h2>
                    <p className="text-xl font-bold text-gray-600 italic mb-6">"{selectedMemberData.company}"</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-green-50 border-2 border-black p-4 relative">
                        <div className="absolute -top-3 left-4 bg-green-500 text-black border-2 border-black px-3 py-1 font-bold text-xs uppercase">
                          Gives
                        </div>
                        <ul className="mt-2 space-y-1 text-sm font-bold text-left">
                          {selectedMemberData.gives.map((give, idx) => (
                            <li key={idx}>★ {give}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-blue-50 border-2 border-black p-4 relative">
                        <div className="absolute -top-3 left-4 bg-blue-500 text-black border-2 border-black px-3 py-1 font-bold text-xs uppercase">
                          Asks
                        </div>
                        <ul className="mt-2 space-y-1 text-sm font-bold text-left">
                          {selectedMemberData.asks.map((ask, idx) => (
                            <li key={idx}>➤ {ask}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedMemberName && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-4xl font-black uppercase italic bg-white inline-block px-4 border-2 border-black shadow-comic-sm">
                    Potential Matches
                  </h2>
                  {isMatching && (
                    <span className="bg-bni-red text-white px-3 py-1 font-bold animate-pulse border-2 border-black">
                      SCANNING...
                    </span>
                  )}
                </div>

                {isMatching && aiMatches.length === 0 ? (
                  <div className="bg-white border-2 border-black p-12 text-center">
                    <Loader2 size={48} className="animate-spin mx-auto mb-4" />
                    <p className="text-2xl font-bold uppercase">Consulting The Oracle...</p>
                  </div>
                ) : aiMatches.length > 0 ? (
                  <div className="grid gap-8">
                    {aiMatches.map((match, idx) => (
                      <div key={idx} className="bg-white border-4 border-black shadow-comic group hover:-translate-y-1 transition-transform relative">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center z-10 shadow-comic-sm transform rotate-12">
                          <div className="text-center leading-none">
                            <span className="block text-2xl font-black">{match.score}%</span>
                            <span className="block text-[10px] font-bold">MATCH</span>
                          </div>
                        </div>

                        <div className="p-6 md:p-8">
                          <div className="flex flex-col md:flex-row gap-6 mb-6 border-b-2 border-dashed border-gray-300 pb-6">
                            <div className="flex-1">
                              <h3 className="text-3xl font-black uppercase">{match.member}</h3>
                              <div className="mt-4 bg-gray-100 border-l-8 border-black p-4 font-mono text-sm text-left">
                                <p className="font-bold mb-1 uppercase text-gray-500">Intel:</p>
                                "{match.reason}"
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-1 w-full bg-green-100 border-2 border-black p-3 text-center">
                              <span className="block text-xs font-bold uppercase mb-1">They Have</span>
                              <span className="font-bold text-lg">{match.give}</span>
                            </div>
                            <ArrowRightLeft size={32} className="hidden md:block" />
                            <div className="flex-1 w-full bg-blue-100 border-2 border-black p-3 text-center">
                              <span className="block text-xs font-bold uppercase mb-1">You Need</span>
                              <span className="font-bold text-lg">{match.matchingAsk}</span>
                            </div>
                          </div>

                          <div className="mt-8">
                            {members.find(m => m.name === match.member)?.phoneNumber ? (
                              <a
                                href={getWhatsAppUrl(members, selectedMemberName, match.member, match.give, match.matchingAsk)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-[#25D366] text-white border-2 border-black py-4 font-black uppercase text-xl shadow-comic hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                              >
                                INITIATE CONTACT
                              </a>
                            ) : (
                              <button disabled className="block w-full bg-gray-300 text-gray-500 border-2 border-gray-500 py-4 font-bold uppercase cursor-not-allowed">
                                COMMUNICATION OFFLINE
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border-2 border-black p-8 text-center">
                    <p className="text-xl font-bold">NO ALIGNMENTS DETECTED.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {viewMode === 'browseAll' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-black shadow-comic p-4 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6" />
                <input
                  type="text"
                  placeholder="SEARCH ROSTER..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-black font-bold focus:bg-gray-50 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  selectedMemberName={selectedMemberName}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;