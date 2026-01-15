import * as XLSX from 'xlsx';
import { Member, Industry } from '../types';

/**
 * Parses a BNI Ask/Give Excel sheet.
 * Expected format:
 * Row 1: Merged Headers (Give / Ask)
 * Row 2: Sub Headers (S.No, Member Name, Person Name, Designation, Company, Person, Designation, Company)
 * Row 3+: Data
 */
export const parseExcelSheet = async (file: File): Promise<Member[]> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  return processWorkbook(workbook);
};

/**
 * Parses a CSV string (from Google Sheets export).
 */
export const parseCSV = async (csvText: string): Promise<Member[]> => {
    const workbook = XLSX.read(csvText, { type: 'string' });
    return processWorkbook(workbook);
}

const processWorkbook = (workbook: XLSX.WorkBook): Member[] => {
  const membersMap = new Map<string, Member>();

  // Iterate through all sheets (tabs) which represent different dates
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    // header: 1 results in array of arrays
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    
    // Check if row 2 exists and has enough columns to be valid
    if (rows.length < 3) return;

    // Start parsing from index 2 (Row 3)
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      // Index 1: Member Name (Column B)
      const name = row[1];
      if (!name || typeof name !== 'string' || name.trim() === '') continue;

      const memberId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Initialize member if not exists
      if (!membersMap.has(memberId)) {
        membersMap.set(memberId, {
          id: memberId,
          name: name.trim(),
          company: 'BNI Member', // Default as sheet doesn't have member company column
          industry: Industry.GENERAL,
          specialty: 'General Member',
          asks: [],
          gives: [],
          // Generate a deterministic avatar based on name
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
          email: '',
          phoneNumber: ''
        });
      }

      const member = membersMap.get(memberId)!;

      // GIVE Columns: C(2), D(3), E(4) -> Person, Designation, Company
      const givePerson = row[2];
      const giveDesig = row[3];
      const giveComp = row[4];
      const giveStr = formatItem(givePerson, giveDesig, giveComp);
      if (giveStr && !member.gives.includes(giveStr)) {
        member.gives.push(giveStr);
      }
      
      // ASK Columns: F(5), G(6), H(7) -> Person, Designation, Company
      const askPerson = row[5];
      const askDesig = row[6];
      const askComp = row[7];
      const askStr = formatItem(askPerson, askDesig, askComp);
      if (askStr && !member.asks.includes(askStr)) {
        member.asks.push(askStr);
      }
    }
  });

  return Array.from(membersMap.values());
};

// Helper to format the columns into a readable string
const formatItem = (person: any, designation: any, company: any): string => {
  const parts = [];
  if (person && typeof person === 'string' && person.trim()) parts.push(person.trim());
  if (designation && typeof designation === 'string' && designation.trim()) parts.push(designation.trim());
  if (company && typeof company === 'string' && company.trim()) parts.push(`at ${company.trim()}`);
  
  return parts.join(', ');
}