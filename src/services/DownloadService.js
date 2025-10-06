const DownloadRepo = require('../repos/DownloadRepo');
const InspectionReportRepo = require('../repos/InspectionReportRepo');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

class DownloadService {
  constructor() {
    this.downloadRepo = new DownloadRepo();
    this.inspectionReportRepo = new InspectionReportRepo();
  }

  async getAnswersCsv(userId) {
    const answers = await this.downloadRepo.getUserAnswersWithDetails(userId);
    const data = answers.map(a => ({
      section: a.Question.Section.name,
      question: a.Question.text,
      answer: a.answerText,
      isDraft: a.isDraft
    }));
    const parser = new Parser();
    return parser.parse(data);
  }

  async generateInspectionReportPdf(inspectionReportId) {
    // Fetch inspection report details
    const inspectionReport = await this.inspectionReportRepo.getInspectionReportById(inspectionReportId);
    const answers = await this.downloadRepo.getAnswersForInspectionReport(inspectionReportId);
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    // Table layout
    const startX = 50;
    let startY = 60;
    const colWidths = [50, 280, 180]; // S.no, Question, Answer
    const rowHeight = 40;
    // Inspection Report Title (bold, centered)
    doc.font('Helvetica-Bold').fontSize(18);
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    doc.text('Inspection Report', startX, startY, {
      width: pageWidth - (startX - doc.page.margins.left),
      align: 'center'
    });
    startY += 30;
    // Inspection Report Info (from DB)
    doc.font('Helvetica-Bold').fontSize(13).text(`Inspection Report ID: ${inspectionReportId}`, startX, startY);
    startY += 20;
    doc.font('Helvetica').fontSize(12).text(`Inspection Date: ${inspectionReport.inspectionDate ? new Date(inspectionReport.inspectionDate).toLocaleDateString() : ''}`, startX, startY);
    startY += 20;
    doc.font('Helvetica').fontSize(12).text(`Factory Registration Number: ${inspectionReport.factoryRegistrationNumber || ''}`, startX, startY);
    startY += 20;
    doc.font('Helvetica').fontSize(12).text(`Factory Name: ${inspectionReport.factoryName || ''}`, startX, startY);
    startY += 20;
    doc.font('Helvetica').fontSize(12).text(`Factory Address: ${inspectionReport.factoryAddress || ''}`, startX, startY);
    startY += 30;
    doc.fontSize(12);
    // Group answers by section
    const sectionMap = {};
    answers.forEach(a => {
      const sectionName = a.Question.Section ? a.Question.Section.name : 'Other';
      if (!sectionMap[sectionName]) sectionMap[sectionName] = [];
      sectionMap[sectionName].push(a);
    });
    let sectionIdx = 1;
    Object.entries(sectionMap).forEach(([sectionName, sectionAnswers]) => {
      if (sectionAnswers.length === 0) return;
      // Section header in bold
      doc.font('Helvetica-Bold').fontSize(14).text(sectionName, startX, startY);
      startY += 25;
      doc.font('Helvetica').fontSize(12);
      // Draw header row for this section
      ['S.no', 'Question', 'Yes/No/NA'].forEach((header, i) => {
        doc.rect(startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), startY, colWidths[i], rowHeight).stroke();
        doc.text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, startY + 10, {
          width: colWidths[i] - 10,
          align: 'left'
        });
      });
      startY += rowHeight;
      // Draw each answer row in this section
      sectionAnswers.forEach((a, idx) => {
        // S.no + Question + Answer row
        const qaRow = [String(idx + 1), a.Question.text, a.value];
        let maxLines = 1;
        qaRow.forEach((cell, i) => {
          const cellLines = doc.heightOfString(cell, {
            width: colWidths[i] - 10,
            align: 'left'
          }) / doc.currentLineHeight();
          maxLines = Math.max(maxLines, Math.ceil(cellLines));
        });
        const qaHeight = maxLines * doc.currentLineHeight() + 20;
        // Remarks row (if present)
        let remarksHeight = 0;
        if (a.notes && a.notes.trim()) {
          const remarksWidth = colWidths[0] + colWidths[1] + colWidths[2];
          const remarksLines = doc.heightOfString(a.notes, {
            width: remarksWidth - 10,
            align: 'left'
          }) / doc.currentLineHeight();
          remarksHeight = Math.ceil(remarksLines) * doc.currentLineHeight() + 20;
        }
        // If the question+answer row and remarks row (if present) won't fit, jump to next page
        if (startY + qaHeight + remarksHeight + 5 > doc.page.height - 50) {
          doc.addPage();
          startY = 50 + rowHeight;
        }
        // Draw question+answer row
        qaRow.forEach((cell, i) => {
          doc.rect(startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), startY, colWidths[i], qaHeight).stroke();
          doc.text(cell, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, startY + 10, {
            width: colWidths[i] - 10,
            align: 'left'
          });
        });
        startY += qaHeight;
        // Draw remarks row (if present)
        if (remarksHeight > 0) {
          const remarksWidth = colWidths[0] + colWidths[1] + colWidths[2];
          doc.rect(startX, startY, remarksWidth, remarksHeight).stroke();
          doc.text(a.notes, startX + 5, startY + 10, {
            width: remarksWidth - 10,
            align: 'left'
          });
          startY += remarksHeight + 5; // Add extra spacing after remarks
        }
      });
      sectionIdx++;
      startY += 10; // Extra space after section
    });
    doc.end();
    return doc;
  }
}

module.exports = DownloadService;
