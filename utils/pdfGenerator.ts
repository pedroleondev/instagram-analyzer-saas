import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { InstagramProfile } from '../types';
import { translateNiche } from './translations';

// Extend jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => void;
  lastAutoTable: {
    finalY: number;
  };
}

/**
 * Limpa o texto removendo emojis e caracteres não suportados pela fonte padrão do PDF.
 * Mantém ASCII + Latin-1 Supplement (Acentos pt-BR).
 */
const cleanText = (text: string): string => {
  if (!text) return '';
  // Remove tudo que NÃO for:
  // - ASCII (0-127)
  // - Latin-1 Supplement (160-255) -> Acentos, símbolos comuns
  // - Quebras de linha (\n, \r)
  return text.replace(/[^\x00-\x7F\xA0-\xFF\n\r]/g, '')
             .replace(/\s+/g, ' ') // Normaliza espaços extras
             .trim();
};

export const generateAnalysisPDF = (profiles: InstagramProfile[], filename: string) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4'
  }) as jsPDFWithAutoTable;

  // --- Header ---
  const primaryColor = [30, 41, 59]; // slate-800
  const accentColor = [37, 99, 235]; // blue-600
  const secondaryColor = [100, 116, 139]; // slate-500

  // Title
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Análise de Leads', 40, 50);

  // Subtitle / Date
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont('helvetica', 'normal');
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 40, 68);

  // --- Metrics Summary ---
  const activeCount = profiles.filter(p => p.hasPostedRecently).length;
  const verifiedCount = profiles.filter(p => p.isVerified).length;
  const totalFollowers = profiles.reduce((acc, p) => acc + p.followersCount, 0);
  const avgFollowers = profiles.length > 0 ? Math.round(totalFollowers / profiles.length) : 0;

  const startYMetrics = 90;

  // Helper to draw metric box
  const drawMetric = (label: string, value: string, x: number, color: [number, number, number] = [30, 41, 59]) => {
    doc.setFontSize(9);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(label.toUpperCase(), x, startYMetrics);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(value, x, startYMetrics + 15);
  };

  drawMetric('Total de Leads', profiles.length.toString(), 40);
  drawMetric('Perfis Ativos (30d)', activeCount.toString(), 140, [22, 163, 74]); // Green
  drawMetric('Verificados', verifiedCount.toString(), 250, [37, 99, 235]); // Blue
  drawMetric('Média Seguidores', avgFollowers.toLocaleString('pt-BR'), 340);

  // Line separator
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(1);
  doc.line(40, startYMetrics + 30, 800, startYMetrics + 30);

  // --- Table Content ---
  const tableData = profiles.map(p => {
    // Format Name & User
    const nameUser = `${cleanText(p.fullName)}\n@${cleanText(p.username)}`;

    // Format Details (Niche + Verified)
    const verifiedStatus = p.isVerified ? '[V] Verificado' : '';
    const niche = cleanText(translateNiche(p.niche) || 'Geral');
    const details = verifiedStatus ? `${niche}\n${verifiedStatus}` : niche;

    // Format Metrics
    const followers = `${p.followersCount.toLocaleString('pt-BR')} seg.`;
    const activity = p.hasPostedRecently ? '[+] Ativo' : '[-] Inativo';
    const lastPost = p.lastPostDate ? `\nUltimo: ${new Date(p.lastPostDate).toLocaleDateString('pt-BR')}` : '';
    const metrics = `${followers}\n${activity}${lastPost}`;

    // Format Bio
    const bio = cleanText(p.biography || '-');

    // Link
    const link = p.url;

    return [nameUser, details, metrics, bio, link];
  });

  doc.autoTable({
    startY: startYMetrics + 50,
    head: [['Perfil', 'Nicho & Status', 'Métricas', 'Biografia', 'Link']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 9,
      font: 'helvetica',
      cellPadding: 8,
      overflow: 'linebreak',
      textColor: [51, 65, 85], // slate-700
      lineColor: [226, 232, 240], // slate-200
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [30, 41, 59], // slate-800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'left',
      cellPadding: 8,
    },
    columnStyles: {
      0: { cellWidth: 120, fontStyle: 'bold' }, // Perfil
      1: { cellWidth: 100 },                    // Nicho & Status
      2: { cellWidth: 90 },                     // Métricas
      3: { cellWidth: 'auto' },                 // Biografia (Takes remaining space)
      4: { cellWidth: 100, fontSize: 8, textColor: [37, 99, 235] } // Link
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // slate-50
    },
    didDrawCell: (data: any) => {
      // Add link to the last column
      if (data.section === 'body' && data.column.index === 4) {
        const url = data.cell.raw;
        if (url && typeof url === 'string' && url.startsWith('http')) {
          doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url });
        }
      }
    },
    margin: { top: 40, right: 40, bottom: 40, left: 40 },
    rowPageBreak: 'avoid', // Avoid cutting rows in half
  });

  // Footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 20,
      { align: 'center' }
    );
  }

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
};
