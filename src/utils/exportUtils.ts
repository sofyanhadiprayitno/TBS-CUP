import { Match, RTContingent, Athlete, BudgetItem, ExpenseRecord, IncomeRecord } from '../types';

/**
 * Downloads a string as a CSV file with UTF-8 BOM for Microsoft Excel compatibility
 */
export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportMatchesToCSV(matches: Match[], sportsMap: Record<string, string>, contingentsMap: Record<string, string>) {
  const headers = ['ID Pertandingan', 'Cabang Olahraga', 'Babak / Fase', 'Jadwal', 'Lokasi', 'Tim A (RT)', 'Tim B (RT)', 'Skor Babak 1', 'Skor Babak 2', 'Skor Akhir', 'Status', 'Pemenang'];
  const rows = matches.map(m => [
    m.id,
    `"${sportsMap[m.sportId] || m.sportId}"`,
    `"${m.stage}"`,
    `"${m.scheduledTime}"`,
    `"${m.venue}"`,
    `"${contingentsMap[m.teamA.rtId] || m.teamA.label}"`,
    `"${contingentsMap[m.teamB.rtId] || m.teamB.label}"`,
    `"${m.round1.teamAScore} - ${m.round1.teamBScore}"`,
    `"${m.round2.teamAScore} - ${m.round2.teamBScore}"`,
    `"${m.totalScoreA} - ${m.totalScoreB}"`,
    `"${m.status}"`,
    `"${contingentsMap[m.winnerRtId || ''] || m.winnerRtId || '-'}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`Jadwal_dan_Skor_Turnamen_RT_${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

export function exportStandingsToCSV(contingents: RTContingent[]) {
  const headers = ['Peringkat', 'Kode RT', 'Nama Kontingen', 'Ketua RT', 'Medali Emas', 'Medali Perak', 'Medali Perunggu', 'Total Poin'];
  const sorted = [...contingents].sort((a, b) => b.points - a.points || b.gold - a.gold);
  const rows = sorted.map((c, idx) => [
    idx + 1,
    `"${c.code}"`,
    `"${c.name}"`,
    `"${c.ketuaRT}"`,
    c.gold,
    c.silver,
    c.bronze,
    c.points
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`Klasemen_Medali_RT_${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

export function exportAthletesToCSV(athletes: Athlete[], contingentsMap: Record<string, string>, sportsMap: Record<string, string>) {
  const headers = ['ID Atlet', 'Nama Lengkap', 'Kontingen RT', 'Cabang Olahraga', 'IGN / Nickname', 'ID Game', 'Peran', 'No HP', 'Status'];
  const rows = athletes.map(a => [
    a.id,
    `"${a.fullName}"`,
    `"${contingentsMap[a.rtId] || a.rtId}"`,
    `"${sportsMap[a.sportId] || a.sportId}"`,
    `"${a.nickname}"`,
    `"${a.inGameId}"`,
    `"${a.role}"`,
    `"${a.phone}"`,
    `"${a.status}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`Data_Atlet_Turnamen_RT_${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

export function exportFinancialsToCSV(
  budgets: BudgetItem[],
  expenses: ExpenseRecord[],
  incomes: IncomeRecord[]
) {
  let content = "LAPORAN KEUANGAN & ANGGARAN TURNAMEN ANTAR RT 2026\n";
  content += `Tanggal Cetak: ${new Date().toLocaleString('id-ID')}\n\n`;

  content += "1. RENCANA ANGGARAN BIAYA (RAB)\n";
  content += "Kategori,Keterangan,Plafon Anggaran (Rp),Prioritas\n";
  budgets.forEach(b => {
    content += `"${b.category}","${b.title}",${b.plannedAmount},"${b.priority}"\n`;
  });

  content += "\n2. REALISASI PENGELUARAN AKTUAL\n";
  content += "No Bukti,Tanggal,Kategori,Deskripsi,Jumlah (Rp),Dibayarkan Oleh,Diverifikasi Oleh\n";
  expenses.forEach(e => {
    content += `"${e.receiptNumber}","${e.date}","${e.category}","${e.description}",${e.amount},"${e.paidBy}","${e.verifiedBy}"\n`;
  });

  content += "\n3. PEMASUKAN DANA\n";
  content += "No Bukti,Tanggal,Sumber,Keterangan,Jumlah (Rp),Metode,Status\n";
  incomes.forEach(i => {
    content += `"${i.receiptNumber}","${i.date}","${i.source}","${i.sourceName}",${i.amount},"${i.paymentMethod}","${i.status}"\n`;
  });

  downloadCSV(`Laporan_Keuangan_Turnamen_RT_${new Date().toISOString().slice(0, 10)}.csv`, content);
}

/**
 * Generates an official printable PDF view with Kop Surat Panitia, Stamps & Signatures
 */
export function printOfficialReport(title: string, htmlContent: string) {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Pop-up terblokir. Harap izinkan pop-up untuk mencetak laporan PDF.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #1e293b;
          font-size: 12px;
          line-height: 1.5;
        }
        .header {
          text-align: center;
          border-bottom: 3px double #0f172a;
          padding-bottom: 12px;
          margin-bottom: 24px;
        }
        .header h1 {
          margin: 0;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .header h2 {
          margin: 4px 0;
          font-size: 14px;
          color: #4338ca;
        }
        .header p {
          margin: 2px 0;
          font-size: 10px;
          color: #64748b;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
        }
        .signatures {
          margin-top: 48px;
          display: flex;
          justify-content: space-between;
          page-break-inside: avoid;
        }
        .sig-box {
          text-align: center;
          width: 200px;
        }
        .sig-space {
          height: 60px;
        }
        .footer-note {
          margin-top: 30px;
          font-size: 9px;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
          padding-top: 8px;
          display: flex;
          justify-content: space-between;
        }
        @media print {
          body { margin: 20px; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div style="margin-bottom: 16px; text-align: right;">
        <button onclick="window.print()" style="padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
          🖨️ Cetak / Simpan sebagai PDF
        </button>
      </div>

      <div class="header">
        <h1>PANITIA PELAKSANA TURNAMEN OLAHRAGA & E-SPORTS</h1>
        <h2>PIALA KEMERDEKAAN ANTAR RUKUN TETANGGA (RT) TAHUN 2026</h2>
        <p>RUKUN WARGA (RW) 08 CEMPAKA INDAH · KOTA ADMINISTRASI</p>
        <p>Sekretariat: Balai Warga RW 08 · Email: panitia.turnamen.rt@gmail.com · WA: 0812-3456-7890</p>
      </div>

      <h3 style="text-align: center; margin-bottom: 20px; text-decoration: underline;">${title}</h3>

      ${htmlContent}

      <div class="signatures">
        <div class="sig-box">
          <p>Mengetahui,<br><strong>Ketua Panitia Pelaksana</strong></p>
          <div class="sig-space"></div>
          <p><u>Bpk. H. Bambang Sudiro</u><br>NIP/ID: PAN-RW08-01</p>
        </div>
        <div class="sig-box">
          <p>Diverifikasi Oleh,<br><strong>Bendahara Turnamen</strong></p>
          <div class="sig-space"></div>
          <p><u>Bpk. Ir. Joko Prasetyo</u><br>NIP/ID: BEN-RW08-02</p>
        </div>
      </div>

      <div class="footer-note">
        <span>Dokumen ini dihasilkan secara otomatis oleh RT E-Sports Championship System via Google Sheets Database.</span>
        <span>Tanggal Cetak: ${new Date().toLocaleString('id-ID')}</span>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
}
