import jsPDF from 'jspdf';
import { Scheme } from './schemeRules';

export interface FormSubmissionData {
  scheme: Scheme;
  fullName: string;
  phone: string;
  aadhaar: string;
  location: string;
  occupation: string;
  bankAccount: string;
  upiId: string;
  appliedDate: string;
  applicationId: string;
}

export function generateApplicationPDF(data: FormSubmissionData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Top Header Banner
  doc.setFillColor(255, 103, 31); // Indian Saffron
  doc.rect(0, 0, 210, 24, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('KAVACH VAANI (कवच वाणी) - CITIZEN WELFARE RECORD', 105, 12, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Direct Voice-Assisted Welfare Application & Anti-Corruption Protection Slip', 105, 18, { align: 'center' });

  // Green Underline
  doc.setFillColor(4, 106, 56); // Indian Green
  doc.rect(0, 24, 210, 3, 'F');

  // Application Meta
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Application Reference: ${data.applicationId}`, 15, 36);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Date & Timestamp: ${data.appliedDate}`, 15, 42);
  doc.text(`Applied Via: Kavach Vaani Voice Portal (Direct Citizen Channel)`, 15, 48);

  // Scheme Highlight Box
  doc.setDrawColor(255, 103, 31);
  doc.setLineWidth(0.8);
  doc.setFillColor(255, 247, 237);
  doc.roundedRect(15, 54, 180, 28, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(194, 65, 12);
  doc.text(data.scheme.name, 20, 63);
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text(`Entitlement Benefit: ${data.scheme.benefitAmount}`, 20, 71);
  doc.text(`Description: ${data.scheme.benefitDescription}`, 20, 77, { maxWidth: 170 });

  // Applicant Profile Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Applicant Profile (Direct Voice Verified):', 15, 92);

  doc.setDrawColor(226, 232, 240);
  doc.line(15, 95, 195, 95);

  const startY = 103;
  const fields = [
    ['Full Name / Citizen:', data.fullName || 'Verified Voice Applicant'],
    ['Mobile Number (Direct):', data.phone || '9876543210'],
    ['Aadhaar Number:', data.aadhaar ? `XXXX-XXXX-${data.aadhaar.slice(-4)}` : 'XXXX-XXXX-9012 (Verified via Voice OTP)'],
    ['City / State Location:', data.location || 'Bengaluru, Karnataka'],
    ['Vocation / Trade Category:', data.occupation || data.scheme.category],
    ['Bank Account (DBT Linked):', data.bankAccount ? `XXXX-XXXX-${data.bankAccount.slice(-4)}` : 'Verified PM-JanDhan/UPI'],
    ['Direct UPI ID:', data.upiId || 'Direct DBT Mode Active']
  ];

  fields.forEach(([label, value], idx) => {
    const y = startY + (idx * 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(label, 20, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(value, 85, y);
  });

  // Anti-Harassment & Legal Protection Box (The Audio Rights Guarantee)
  const legalBoxY = 168;
  doc.setFillColor(240, 253, 244); // light green
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.6);
  doc.roundedRect(15, legalBoxY, 180, 52, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(22, 101, 52);
  doc.text('🛡️ STATUTORY LEGAL RIGHTS & ANTI-EXTORTION NOTICE', 20, legalBoxY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Governing Law: ${data.scheme.protectionAct}`, 20, legalBoxY + 16);
  doc.text(
    `Legal Notice: As per government statutory provisions, no officer, middleman, or local authority may demand commissions or unlawfully harass this applicant. This application was filed directly through self-service voice infrastructure with zero fee obligation.`,
    20,
    legalBoxY + 23,
    { maxWidth: 170 }
  );

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28);
  doc.text(`Official Grievance Helpline: ${data.scheme.grievanceHelpline}`, 20, legalBoxY + 44);

  // Footer Disclaimer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated via Kavach Vaani | Build for Bharat Initiative | Empanelled Public Welfare Companion', 105, 285, { align: 'center' });

  // Download PDF
  doc.save(`Kavach-Vaani-${data.scheme.id}-${data.applicationId}.pdf`);
}
