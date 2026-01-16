import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PLATINA_MEMBERS } from '../constants';
import { Member } from '../types';
import { parseExcelSheet, parseCSV } from '../services/excelService';
import { findMemberMatches, cleanDataWithAI, SmartMatch } from '../services/geminiService';
import { Search, Users, X, Upload, Download, RefreshCw, Sparkles, Loader2, Link as LinkIcon, ArrowRightLeft } from 'lucide-react';

const WhatsAppIcon = ({ className = "text-white" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const Dashboard: React.FC = () => {
  // Requirement: Default to loaded chapter roster
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

  // --- Handlers ---

  // --- Handlers ---

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Get raw text from Excel (needs a helper or just use existing parseCSV if simple, but we want raw text)
      // For now, let's use the existing excelService to just dump text if possible, 
      // OR simplier: We can only support CSV for AI cleaning easily, OR we read the excel to a crude string.
      // Let's assume we can use the existing parseExcelSheet to get a 'base' then clean it, 
      // OR better, we update this flow to use the AI cleaner on the JSON output of the excel parser.

      const initialParse = await parseExcelSheet(file);
      // Convert to string for the AI to "clean" and re-structure properly if it was messy
      const rawTextForAI = JSON.stringify(initialParse);

      const cleanedMembers = await cleanDataWithAI(rawTextForAI);

      if (cleanedMembers.length === 0) {
        setUploadError("AI could not verify member data. Ensure the sheet matches official members.");
      } else {
        // ENRICHMENT: Map against known categories
        const enrichedMembers = enrichMembersWithCategories(cleanedMembers);
        setMembers(enrichedMembers);
        setSelectedMemberName('');
        setAiMatches([]);
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

    // Extract Sheet ID from URL
    const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      setUploadError("Invalid Google Sheet URL. Please use a standard URL.");
      return;
    }

    const sheetId = match[1];
    // Construct CSV Export URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch sheet. Make sure it is 'Published to Web'.");
      }
      const csvText = await response.text();

      // AI CLEANING
      const cleanedMembers = await cleanDataWithAI(csvText);

      if (cleanedMembers.length === 0) {
        setUploadError("AI could not identify valid members. Ensure the sheet matches official roster.");
      } else {
        // ENRICHMENT
        const enrichedMembers = enrichMembersWithCategories(cleanedMembers);
        setMembers(enrichedMembers);
        setSelectedMemberName('');
        setAiMatches([]);
        setShowUrlInput(false);
        setSheetUrl('');
      }
    } catch (err) {
      console.error(err);
      setUploadError("Could not sync with AI. Check sheet permissions.");
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to enrich AI-cleaned members with hardcoded Category data (Simulating URL fetch)
  const enrichMembersWithCategories = (aiMembers: Member[]): Member[] => {
    // We import the lookup map from constants (need to export MEMBER_ROSTER_DETAILS or similar logic)
    // Since we don't have direct access to internal map of constants.ts easily without refactoring it,
    // we can use the PLATINA_MEMBERS as a reference source since it's already loaded there.

    // 1. FILTER: Only keep members who exist in our verified PLATINA_MEMBERS list.
    // This removes "fake data" or bad rows from the AI output.
    const validMembers = aiMembers.filter(m => {
      return PLATINA_MEMBERS.some(
        pm => pm.name.toLowerCase().trim() === m.name.toLowerCase().trim() ||
          pm.name.toLowerCase().includes(m.name.toLowerCase())
      );
    });

    // 2. ENRICH: Add their static details
    return validMembers.map(m => {
      // Find matching member in our "Database" (PLATINA_MEMBERS constant)
      const knownMember = PLATINA_MEMBERS.find(
        pm => pm.name.toLowerCase().trim() === m.name.toLowerCase().trim() ||
          pm.name.toLowerCase().includes(m.name.toLowerCase())
      );

      // Should be found because we filtered above, but safe check
      return {
        ...m,
        company: knownMember?.company || 'BNI Member',
        specialty: knownMember?.specialty || 'General Member',
        phoneNumber: knownMember?.phoneNumber || ''
      };
    });
  };

  // --- Helper for WhatsApp (Specific Match) ---
  const getWhatsAppUrl = (matchName: string, give?: string, ask?: string) => {
    const matchedMember = members.find(m => m.name === matchName);
    const phoneNumber = matchedMember?.phoneNumber;

    if (!phoneNumber) return '#'; // Or handle UI disable

    const firstName = matchName.split(' ')[0];
    const myName = selectedMemberName || 'a fellow member';

    // Simplified message if specific give/ask aren't displayed/provided
    let message = `Hi ${firstName},\n\nThis is ${myName} from BNI Platina.\nI noticed on the app that we might be a good match for business.\n\nI wish to grow my business! How can you help me?`;

    if (give && ask) {
      message = `Hi ${firstName},\n\nThis is ${myName} from BNI Platina.\nI noticed on the app that you can provide: "${give}"\nWhich matches my ask for: "${ask}"\n\nI wish to grow my business! How can you help me?`;
    }

    return `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
  };

  // --- Helper for WhatsApp (General Contact) ---
  const getContactWhatsAppUrl = (targetMember: Member) => {
    const phoneNumber = targetMember.phoneNumber;

    if (!phoneNumber) return '#';

    const firstName = targetMember.name.split(' ')[0];
    const myName = selectedMemberName || 'a fellow member';

    const message = `Hi ${firstName},\n\nThis is ${myName} from BNI Platina.\nI found your profile on our chapter connect app and would like to connect.\n\nI wish to grow my business! How can you help me?`;

    return `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
  };

  // --- AI Matching Effect ---
  const selectedMemberData = useMemo(() =>
    members.find(m => m.name === selectedMemberName),
    [members, selectedMemberName]
  );

  useEffect(() => {
    let active = true;

    const runMatching = async () => {
      if (!selectedMemberData) {
        setAiMatches([]);
        return;
      }

      setIsMatching(true);
      setAiMatches([]); // Clear previous to show loading state clearly

      try {
        // Call Gemini Service
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

    // Debounce
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-6">
          {uploadError && (
            <span className="text-sm text-red-600 font-medium mr-auto bg-red-50 px-3 py-1 rounded-full border border-red-100">
              {uploadError}
            </span>
          )}



          {/* Google Sheet Sync Button */}
          <div className="relative">
            <button
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              <LinkIcon size={16} />
              Sync Google Sheet
            </button>

            {showUrlInput && (
              <div className="absolute top-full right-0 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200 w-80 z-20">
                <p className="text-xs text-gray-500 mb-2">Paste URL of a sheet <b>Published to Web</b></p>
                <input
                  type="text"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/..."
                  className="w-full text-sm border border-gray-300 rounded p-2 mb-2"
                />
                <button
                  onClick={handleSheetSync}
                  disabled={isUploading || !sheetUrl}
                  className="w-full bg-green-600 text-white text-xs font-bold py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {isUploading ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>
            )}
          </div>

          {/* Manual File Upload */}
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
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-slate-700 rounded-lg text-sm font-medium transition-colors border border-gray-200 shadow-sm"
          >
            {isUploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            Upload Sheet
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Ask & Give Connection Matcher</h1>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
            <Sparkles size={16} className="text-bni-gold" />
            <span>Powered by <a href="https://agentspanel.com" target="_blank" className="hover:underline text-bni-red">AgentsPanel</a> with Google Search Grounding.</span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setViewMode('findMatches')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'findMatches'
                ? 'bg-bni-red text-white'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Find Matches
            </button>
            <button
              onClick={() => setViewMode('browseAll')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'browseAll'
                ? 'bg-bni-red text-white'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Browse All Members
            </button>
          </div>
        </div>

        {viewMode === 'findMatches' ? (
          <>
            {/* Member Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Name
              </label>
              <div className="relative">
                <select
                  value={selectedMemberName}
                  onChange={(e) => setSelectedMemberName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bni-red focus:border-transparent appearance-none bg-white text-lg"
                >
                  <option value="">Choose a member...</option>
                  {members.map(member => (
                    <option key={member.id} value={member.name}>
                      {member.name} {member.company && member.company !== 'BNI Member' ? ` - ${member.company}` : ''} {member.specialty && member.specialty !== 'General Member' ? `(${member.specialty})` : ''}
                    </option>
                  ))}
                </select>
                <Users className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Selected Member Info */}
            {selectedMemberData && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                  <img src={selectedMemberData.avatar} alt="" className="w-16 h-16 rounded-full border-2 border-bni-red/20" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedMemberData.name}</h2>
                    <p className="text-sm text-gray-500">{selectedMemberData.company}</p>
                    <p className="text-xs text-gray-400">{selectedMemberData.specialty}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                      Your Gives
                    </h3>
                    <div className="space-y-2">
                      {selectedMemberData.gives.length > 0 ? (
                        selectedMemberData.gives.map((give, idx) => (
                          <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm text-gray-700">{give}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No gives listed</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                      Your Asks
                    </h3>
                    <div className="space-y-2">
                      {selectedMemberData.asks.length > 0 ? (
                        selectedMemberData.asks.map((ask, idx) => (
                          <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-gray-700">{ask}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No asks listed</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Matches */}
            {selectedMemberName && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-fade-in min-h-[200px]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Smart Connections ({aiMatches.length})
                  </h2>
                  {isMatching && (
                    <div className="flex items-center gap-2 text-bni-red bg-red-50 px-3 py-1 rounded-full animate-pulse">
                      <Sparkles size={16} />
                      <span className="text-sm font-medium">A.I is verifying matches...</span>
                    </div>
                  )}
                </div>

                {isMatching && aiMatches.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 size={40} className="text-bni-red animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Analyzing {members.length} members with Google Search...</p>
                    <p className="text-gray-400 text-sm mt-1">Verifying industries and company details for accuracy.</p>
                  </div>
                ) : aiMatches.length > 0 ? (
                  <div className="space-y-4">
                    {aiMatches.map((match, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white relative overflow-hidden group">

                        <div className="flex items-center gap-4 relative z-10">
                          <div className="flex-1">
                            {/* Member Name Prominent */}
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="font-bold text-2xl text-gray-900">
                                {match.member}
                              </h3>
                              {/* Score Secondary */}
                              <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                <span>{match.score}% Match</span>
                              </div>
                            </div>

                            {/* AI Reason */}
                            <div className="mb-4 bg-slate-50 border-l-4 border-bni-gold p-4 rounded-r-md">
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={14} className="text-bni-gold" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">AI Insight</span>
                              </div>
                              <p className="text-base text-gray-800 leading-relaxed">"{match.reason}"</p>
                            </div>

                            {/* Specific Match Details - Added back by request */}
                            <div className="mb-5 bg-gray-50 rounded-lg border border-gray-100 p-4">
                              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                <div className="flex-1">
                                  <span className="text-xs font-bold text-green-700 uppercase block mb-1">They Can Provide</span>
                                  <p className="text-sm font-semibold text-gray-900 bg-green-50/50 p-2 rounded border border-green-100">
                                    {match.give}
                                  </p>
                                </div>
                                <div className="hidden md:flex text-gray-400">
                                  <ArrowRightLeft size={16} />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-bold text-blue-700 uppercase block mb-1">Matches Your Ask</span>
                                  <p className="text-sm font-semibold text-gray-900 bg-blue-50/50 p-2 rounded border border-blue-100">
                                    {match.matchingAsk}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* WhatsApp Button */}
                            {members.find(m => m.name === match.member)?.phoneNumber ? (
                              <a
                                href={getWhatsAppUrl(match.member, match.give, match.matchingAsk)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg font-bold transition-colors shadow-sm w-full md:w-auto justify-center"
                              >
                                <WhatsAppIcon />
                                <span>Connect on WhatsApp</span>
                              </a>
                            ) : (
                              <button disabled className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-500 rounded-lg font-bold shadow-sm w-full md:w-auto justify-center cursor-not-allowed">
                                <span>No Contact Info</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No strong matches found.</p>
                    <p className="text-gray-400 text-sm mt-1">We couldn't verify a strong connection using Google Search data.</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bni-red focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-3.5"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* All Members Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt="" className="w-10 h-10 rounded-full" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                        <p className="text-xs text-gray-500">{member.company}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-4 flex-grow">
                    <div>
                      <h4 className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">Gives ({member.gives.length})</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                        {member.gives.length > 0 ? (
                          member.gives.map((give, idx) => (
                            <p key={idx} className="text-xs text-gray-600 bg-green-50 rounded px-2 py-1 border border-green-100">
                              {give}
                            </p>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400 italic">None listed</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">Asks ({member.asks.length})</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                        {member.asks.length > 0 ? (
                          member.asks.map((ask, idx) => (
                            <p key={idx} className="text-xs text-gray-600 bg-blue-50 rounded px-2 py-1 border border-blue-100">
                              {ask}
                            </p>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400 italic">None listed</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    {member.phoneNumber ? (
                      <a
                        href={getContactWhatsAppUrl(member)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-lg font-bold transition-all shadow-sm text-sm group"
                      >
                        <WhatsAppIcon className="text-[#25D366] group-hover:text-white transition-colors" />
                        <span>Contact on WhatsApp</span>
                      </a>
                    ) : (
                      <button disabled className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 border border-gray-200 rounded-lg text-sm font-medium cursor-not-allowed">
                        <span>No Contact Info</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;