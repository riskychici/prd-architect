import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faBookOpen, faMoon, faSun, faRobot, faWandMagicSparkles,
  faFileExport, faLayerGroup, faCircleQuestion, faKeyboard, faLightbulb,
  faEye, faPalette, faSave, faTag, faHeart, faEnvelope, faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { useThemeStore } from '../../store/useThemeStore';

const APP_VERSION = '3.5';

function Card(props) {
  return <div className={'bg-card border border-line rounded-xl p-4 md:p-5 space-y-3 ' + (props.className || '')}>{props.children}</div>;
}
function H3(props) {
  return <h3 className="text-sm font-bold text-ink flex items-center gap-2"><FontAwesomeIcon icon={props.icon} className="text-accent text-xs" />{props.children}</h3>;
}
function P(props) {
  return <p className="text-xs md:text-sm text-mut leading-relaxed">{props.children}</p>;
}
function Kbd(props) {
  return <kbd className="px-1.5 py-0.5 rounded border border-line bg-field text-[11px] font-mono text-ink">{props.children}</kbd>;
}
function Tip(props) {
  return (
    <div className="p-3 rounded-lg border border-accent/30 bg-accent/10 text-xs text-ink leading-relaxed">
      <strong className="text-accent">Tips: </strong>{props.children}
    </div>
  );
}
function Step(props) {
  return (
    <div className="flex gap-3">
      <span className="w-6 h-6 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center shrink-0">{props.n}</span>
      <div className="min-w-0">
        <p className="text-xs md:text-sm font-semibold text-ink">{props.title}</p>
        <p className="text-xs text-mut leading-relaxed mt-0.5">{props.children}</p>
      </div>
    </div>
  );
}
function Faq(props) {
  return (
    <div className="bg-card border border-line rounded-xl p-4 space-y-1.5">
      <p className="text-xs md:text-sm font-semibold text-ink flex gap-2 items-start"><FontAwesomeIcon icon={faCircleQuestion} className="text-accent mt-0.5" />{props.q}</p>
      <p className="text-xs text-mut leading-relaxed pl-6">{props.children}</p>
    </div>
  );
}
function PageHeader(props) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-10 h-10 rounded-xl bg-accent/15 text-accent border border-accent/30 flex items-center justify-center shrink-0">
        <FontAwesomeIcon icon={props.icon} />
      </span>
      <div>
        <h2 className="text-base md:text-lg font-bold text-ink">{props.title}</h2>
        <p className="text-[11px] md:text-xs text-mut">{props.desc}</p>
      </div>
    </div>
  );
}

function PagePengenalan() {
  return (
    <div>
      <PageHeader icon={faBookOpen} title="Pengenalan" desc="Apa itu PRD Architect dan kenapa berguna" />
      <div className="space-y-4">
        <P>
          PRD Architect adalah aplikasi web untuk menyusun dokumen spesifikasi produk
          (Product Requirement Document, disingkat PRD) secara terstruktur. Kamu mengisi formulir
          di panel Editor, dan panel Preview menyusun dokumen rapi secara langsung, siap diekspor
          ke PDF ukuran A4.
        </P>
        <Card>
          <H3 icon={faLightbulb}>Yang kamu dapatkan</H3>
          <ul className="list-disc pl-5 text-xs md:text-sm text-mut space-y-1.5 leading-relaxed">
            <li>Dua mode kerja: Simple untuk proyek kecil, dan Enterprise untuk dokumentasi lengkap.</li>
            <li>Simpan otomatis ke perangkatmu, plus riwayat Undo/Redo sampai 50 langkah.</li>
            <li>Empat bantuan AI: Analisis PRD, Perhalus Teks, Saran Sampul, dan Generate Schema.</li>
            <li>Ekspor file backup, salin Markdown, dan cetak/PDF dengan layout A4 korporat.</li>
          </ul>
        </Card>
        <Card>
          <H3 icon={faSave}>Privasi data</H3>
          <P>
            Seluruh isi dokumen tersimpan hanya di browser kamu (di perangkatmu sendiri), tidak
            dikirim ke server aplikasi. Teks dokumen hanya dikirim ke layanan AI saat kamu menekan
            tombol AI. Gunakan ekspor file backup untuk memindahkan dokumen ke perangkat lain.
          </P>
        </Card>
      </div>
    </div>
  );
}

function PageMulaiCepat() {
  return (
    <div>
      <PageHeader icon={faLightbulb} title="Mulai Cepat" desc="Enam langkah dari kosong sampai dokumen jadi" />
      <div className="space-y-4">
        <Card className="space-y-4">
          <Step n="1" title="Lihat contoh dulu (opsional)">Klik Muat Contoh di header untuk mengisi form dengan studi kasus Instagram. Cara tercepat memahami semua fitur.</Step>
          <Step n="2" title="Isi identitas proyek">Section 1: nama proyek, penulis, versi dokumen, status, dan target rilis.</Step>
          <Step n="3" title="Tulis masalah dan tujuan">Section 2: latar belakang masalah dan tujuan produk. Tekan tombol tongkat (wand) untuk merapikan teks kasarmu.</Step>
          <Step n="4" title="Daftarkan fitur utama">Section 3: tambah fitur, isi deskripsi, dan atur prioritas High, Medium, atau Low.</Step>
          <Step n="5" title="Lengkapi tech stack">Section 4: isi frontend (tampilan), backend (server), dan database. Stack tambahan bisa ditambah lewat tombol Tambah Stack Lanjutan.</Step>
          <Step n="6" title="Ekspor dokumen">Cek preview di kanan (desktop) atau tab Preview (mobile), lalu gunakan tombol Ekspor PDF, JSON, atau Salin Markdown.</Step>
        </Card>
        <Tip>Klik tombol Dokumentasi di header kapan saja untuk membuka halaman ini.</Tip>
      </div>
    </div>
  );
}

function PageAntarmuka() {
  return (
    <div>
      <PageHeader icon={faEye} title="Antarmuka" desc="Mengenal bagian-bagian layar" />
      <div className="space-y-4">
        <Card><H3 icon={faBookOpen}>Header</H3><P>Berisi pemindah mode Simple/Enterprise, tombol Undo/Redo, tombol tema terang/gelap, tombol Dokumentasi, Muat Contoh, dan Reset. Ada juga indikator "Tersimpan" yang menunjukkan waktu simpan otomatis terakhir.</P></Card>
        <Card><H3 icon={faWandMagicSparkles}>Panel Editor</H3><P>Formulir tersusun urut sesuai struktur dokumen. Ikon tongkat di samping kolom adalah tombol Perhalus Teks berbasis AI. Section yang belum diaktifkan tidak akan muncul di mode Simple.</P></Card>
        <Card><H3 icon={faEye}>Panel Preview</H3><P>Di layar lebar berada di sebelah kanan. Menampilkan sampul gelap dan dokumen putih ukuran A4. Warna judul dan aksen dokumen otomatis mengikuti palette branding.</P></Card>
        <Card><H3 icon={faRobot}>Tampilan mobile</H3><P>Gunakan tab bar di bawah untuk pindah antara Editor dan Preview, atau geser (swipe) kiri/kanan. Tombol melayang di pojok membantu scroll ke atas/bawah.</P></Card>
      </div>
    </div>
  );
}

function PageMode() {
  return (
    <div>
      <PageHeader icon={faLayerGroup} title="Mode Simple & Enterprise" desc="Pilih kedalaman dokumen yang kamu butuhkan" />
      <div className="space-y-4">
        <Card><H3 icon={faLightbulb}>Mode Simple</H3><P>Berisi section inti: informasi proyek, masalah dan tujuan, fitur utama, user flow, tech stack, serta batasan dan Definition of Done. Cocok untuk proyek kecil dan versi awal produk.</P></Card>
        <Card><H3 icon={faLayerGroup}>Mode Enterprise</H3><P>Menambah modul lengkap: Persona & KPI, Branding & Design System, Role & Permission Matrix, Acceptance Criteria per modul, Schema Data, serta kebutuhan non-teknis plus analisis risiko.</P></Card>
        <Card><H3 icon={faCircleQuestion}>Section Opsional</H3><P>Di mode Simple, kartu "Section Opsional (Tambahan)" memungkinkan kamu mengaktifkan modul Enterprise satu per satu tanpa harus pindah mode penuh.</P></Card>
      </div>
    </div>
  );
}

function PageFiturAi() {
  return (
    <div>
      <PageHeader icon={faRobot} title="Fitur AI" desc="Empat bantuan AI dan cara pakainya" />
      <div className="space-y-4">
        <Card><H3 icon={faRobot}>Analisis PRD</H3><P>Berada di kartu paling atas editor. Jika PRD masih kosong, tulis dulu deskripsi singkat aplikasi yang ingin dibuat. Hasil mengalir seperti mengetik. Tombol Terapkan ke Form mengisi form secara otomatis dari draf AI.</P></Card>
        <Card><H3 icon={faWandMagicSparkles}>Perhalus Teks (tombol tongkat)</H3><P>Ada di samping kolom teks. Mengirim teks plus nama kolom sebagai konteks, sehingga hasil sesuai tujuan kolom. Setelah berhasil, tombol terkunci sampai teks kamu ubah lagi.</P></Card>
        <Card><H3 icon={faPalette}>Saran Sampul</H3><P>Di section Sampul & Footer Dokumen. Merangkum Tujuan Utama Produk menjadi satu kalimat subtitle sampul. Hasilnya tetap bisa kamu edit manual.</P></Card>
        <Card><H3 icon={faSave}>Generate Schema dari User Flow</H3><P>Di section Schema Data (Enterprise). Membaca user flow lalu menyusun tabel database lengkap dengan tipe data dan relasi. Semua hasil tetap bisa diedit manual.</P></Card>
      </div>
    </div>
  );
}

function PageSampul() {
  return (
    <div>
      <PageHeader icon={faPalette} title="Sampul & Branding" desc="Mengatur warna dan teks sampul" />
      <div className="space-y-4">
        <Card><H3 icon={faPalette}>Mode warna otomatis</H3><P>Warna sampul diracik dari palette di section Branding & Design System. Warna yang kurang serasi disaring otomatis. Jika tidak ada warna layak, dipakai warna emas sebagai cadangan yang aman.</P></Card>
        <Card><H3 icon={faWandMagicSparkles}>Mode manual</H3><P>Matikan saklar otomatis, lalu atur sendiri Warna Utama, Warna Aksen, dan Latar Sampul. Field lain: Kicker (teks kecil di atas judul), Catatan Footer, dan saklar tampil footer.</P></Card>
      </div>
    </div>
  );
}

function PageData() {
  return (
    <div>
      <PageHeader icon={faSave} title="Simpan, Riwayat & Data" desc="Simpan otomatis, riwayat, dan backup" />
      <div className="space-y-4">
        <Card><H3 icon={faSave}>Simpan otomatis</H3><P>Dokumen tersimpan otomatis sekitar 0,8 detik setelah kamu berhenti mengetik. Header menampilkan "Tersimpan" beserta jamnya. Data tersimpan di penyimpanan browser di perangkatmu.</P></Card>
        <Card><H3 icon={faKeyboard}>Undo/Redo</H3><P>Sampai 50 langkah riwayat. Gunakan tombol di header atau pintasan keyboard. Riwayat menyimpan perubahan isi form, bukan perubahan mode.</P></Card>
        <Card><H3 icon={faFileExport}>Backup & berbagi</H3><P>Tombol JSON mengunduh file backup berisi seluruh dokumen. Tombol Impor memulihkannya kembali. Ini cara terbaik untuk backup dan berbagi dokumen dengan rekan tim.</P></Card>
        <Card><H3 icon={faCircleQuestion}>Reset</H3><P>Tombol Reset mengosongkan seluruh form. Jika salah tekan, langsung tekan Undo untuk mengembalikan isi dokumen.</P></Card>
      </div>
    </div>
  );
}

function PageEkspor() {
  return (
    <div>
      <PageHeader icon={faFileExport} title="Ekspor & Cetak" desc="Membawa dokumen keluar dari aplikasi" />
      <div className="space-y-4">
        <Card><H3 icon={faFileExport}>Ekspor PDF / Cetak</H3><P>Membuka dialog cetak browser dengan layout A4. Sampul selalu menjadi halaman pertama. Pilih tujuan "Save as PDF" untuk menyimpan file PDF.</P></Card>
        <Card><H3 icon={faSave}>JSON</H3><P>File backup khusus aplikasi ini, berisi seluruh dokumen, bisa diimpor kembali kapan saja lewat tombol Impor.</P></Card>
        <Card><H3 icon={faBookOpen}>Salin Markdown</H3><P>Menyalin dokumen sebagai teks berformat Markdown, siap ditempel ke Notion, GitHub, atau Jira.</P></Card>
      </div>
    </div>
  );
}

function PagePintasan() {
  return (
    <div>
      <PageHeader icon={faKeyboard} title="Pintasan" desc="Kombinasi tombol dan gestur" />
      <div className="space-y-4">
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs md:text-sm"><span className="text-mut">Undo</span><span><Kbd>Ctrl</Kbd> + <Kbd>Z</Kbd></span></div>
          <div className="flex items-center justify-between text-xs md:text-sm"><span className="text-mut">Redo</span><span><Kbd>Ctrl</Kbd> + <Kbd>Y</Kbd> atau <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>Z</Kbd></span></div>
          <div className="flex items-center justify-between text-xs md:text-sm"><span className="text-mut">Pindah Editor/Preview (mobile)</span><span className="text-ink font-semibold">Swipe kiri / kanan</span></div>
        </Card>
      </div>
    </div>
  );
}

function PageVersi() {
  return (
    <div>
      <PageHeader icon={faTag} title="Versi Aplikasi" desc="Informasi rilis PRD Architect" />
      <div className="space-y-4">
        <Card><H3 icon={faTag}>Versi saat ini: {APP_VERSION}</H3><P>PRD Architect versi {APP_VERSION} adalah rilis terbaru. Nomor versi tidak lagi ditampilkan di header agar tampilan lebih bersih; informasi versi dipusatkan di halaman ini dan di footer dokumentasi.</P></Card>
        <Card>
          <H3 icon={faLightbulb}>Yang baru di {APP_VERSION}</H3>
          <ul className="list-disc pl-5 text-xs md:text-sm text-mut space-y-1.5 leading-relaxed">
            <li>Nama aplikasi disederhanakan menjadi PRD Architect.</li>
            <li>Halaman dokumentasi dengan navigasi per kategori.</li>
            <li>Halaman Support Developer dengan QRIS dan tombol download.</li>
            <li>Logo konsisten di favicon, header aplikasi, dan header dokumentasi.</li>
            <li>Perbaikan scroll dan kestabilan layout pada halaman dokumentasi.</li>
          </ul>
        </Card>
        <Card>
          <H3 icon={faHeart}>Dikembangkan oleh</H3>
          <div className="flex items-center gap-3">
            <span className="bg-accent p-1 rounded-lg shrink-0">
              <img src="/logo-riskychici.svg" alt="Logo Risky Chici" className="w-6 h-6" />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Risky Chici</p>
              <p className="text-[11px] text-mut">Pembuat & Pengembang PRD Architect</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function PageFaq() {
  return (
    <div>
      <PageHeader icon={faCircleQuestion} title="FAQ" desc="Jawaban untuk pertanyaan yang sering muncul" />
      <div className="space-y-4">
        <Faq q="Apakah data saya aman?">Ya. Data hanya tersimpan di browser kamu dan tidak dikirim ke server aplikasi. Teks hanya dikirim ke layanan AI saat kamu menekan tombol AI.</Faq>
        <Faq q="Kenapa Analisis PRD gagal?">Biasanya karena koneksi internet tidak stabil atau jatah harian AI sudah terpakai semua. Tunggu beberapa saat lalu coba lagi.</Faq>
        <Faq q="Kenapa tombol tongkat tidak bekerja?">Fitur tersebut memakai layanan AI. Pastikan koneksi internetmu stabil dan kunci API sudah terisi, lalu tunggu beberapa saat sebelum mencoba lagi.</Faq>
        <Faq q="Apakah hasil cetak sama dengan preview?">Isinya sama. Cetakan memakai layout A4 dan warna yang aman untuk print, dan sampul selalu menjadi halaman pertama.</Faq>
        <Faq q="Bagaimana memindahkan dokumen ke perangkat lain?">Tekan tombol JSON di perangkat lama, lalu tekan Impor di perangkat baru dan pilih file tersebut.</Faq>
      </div>
    </div>
  );
}

function PageSupport() {
  const [qrisError, setQrisError] = useState(false);
  return (
    <div>
      <PageHeader icon={faHeart} title="Support Developer" desc="Dukung pengembangan PRD Architect" />
      <div className="space-y-4">
        <Card>
          <P>Jika aplikasi ini membantu pekerjaanmu, kamu bisa mendukung pengembangan dengan scan QRIS di bawah. Berapapun nominalnya sangat berarti.</P>
          <div className="flex flex-col items-center gap-3 py-2">
            {qrisError ? (
              <div className="w-56 h-56 rounded-xl border border-line bg-field flex items-center justify-center text-center p-4">
                <p className="text-[11px] text-mut">Gambar QRIS belum terpasang. Letakkan file QRIS kamu di public/qris-riskychici.png</p>
              </div>
            ) : (
              <img
                src="/qris-riskychici.png"
                alt="QRIS Support Developer"
                onError={function () { setQrisError(true); }}
                className="w-56 h-auto rounded-xl border border-line bg-white p-2"
              />
            )}
            <p className="text-[11px] text-mut text-center">Scan pakai aplikasi e-wallet atau mobile banking favoritmu.</p>
            <a
              href="/qris-riskychici.png"
              download="qris-riskychici.png"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent2 text-white text-xs font-semibold transition border border-accent shadow-sm"
            >
              <FontAwesomeIcon icon={faDownload} className="text-[11px]" />
              Download QRIS
            </a>
          </div>
        </Card>
        <Card>
          <H3 icon={faEnvelope}>Kontak & Masukan</H3>
          <P>Punya ide fitur atau menemukan kejanggalan? Sampaikan masukanmu lewat halaman kontak atau repositori proyek. Masukan kecil sekalipun sangat membantu.</P>
        </Card>
        <Card>
          <H3 icon={faHeart}>Terima kasih</H3>
          <P>Dukunganmu dipakai untuk biaya hosting, kuota API, dan pengembangan fitur baru. Terima kasih sudah menjadi bagian dari perjalanan PRD Architect.</P>
        </Card>
      </div>
    </div>
  );
}

const PAGES = [
  { id: 'pengenalan', title: 'Pengenalan', icon: faBookOpen, Comp: PagePengenalan },
  { id: 'mulai-cepat', title: 'Mulai Cepat', icon: faLightbulb, Comp: PageMulaiCepat },
  { id: 'antarmuka', title: 'Antarmuka', icon: faEye, Comp: PageAntarmuka },
  { id: 'mode', title: 'Mode', icon: faLayerGroup, Comp: PageMode },
  { id: 'fitur-ai', title: 'Fitur AI', icon: faRobot, Comp: PageFiturAi },
  { id: 'sampul', title: 'Sampul', icon: faPalette, Comp: PageSampul },
  { id: 'data', title: 'Data', icon: faSave, Comp: PageData },
  { id: 'ekspor', title: 'Ekspor', icon: faFileExport, Comp: PageEkspor },
  { id: 'pintasan', title: 'Pintasan', icon: faKeyboard, Comp: PagePintasan },
  { id: 'versi', title: 'Versi', icon: faTag, Comp: PageVersi },
  { id: 'faq', title: 'FAQ', icon: faCircleQuestion, Comp: PageFaq },
  { id: 'support', title: 'Support Developer', icon: faHeart, Comp: PageSupport },
];

export default function DocsPage(props) {
  const onBack = props.onBack || function () { if (window.history.length > 1) window.history.back(); };
  const theme = useThemeStore(function (s) { return s.theme; });
  const setTheme = useThemeStore(function (s) { return s.setTheme; });
  const [pageId, setPageId] = useState('pengenalan');
  const mainRef = useRef(null);

  useEffect(function () {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [pageId]);

  const active = PAGES.find(function (p) { return p.id === pageId; }) || PAGES[0];
  const ActiveComp = active.Comp;

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-base text-ink">
      <header className="shrink-0 bg-panel border-b border-line">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 md:gap-3">
          <button
            onClick={onBack}
            title="Kembali ke aplikasi"
            aria-label="Kembali ke aplikasi"
            className="w-9 h-9 rounded-lg border border-line bg-field text-ink hover:bg-accent hover:text-white hover:border-accent transition shrink-0 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="bg-accent p-1 rounded-lg shrink-0">
            <img src="/logo-riskychici.svg" alt="Logo PRD Architect" className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold truncate">PRD Architect</h1>
            <p className="text-[11px] text-mut truncate">Dokumentasi & Panduan</p>
          </div>
          <button
            onClick={function () { setTheme(theme === 'dark' ? 'light' : 'dark'); }}
            title={theme === 'dark' ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
            className="ml-auto w-9 h-9 rounded-lg border border-line bg-field text-ink hover:bg-accent hover:text-white transition shrink-0 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
          </button>
        </div>
        <nav className="md:hidden flex gap-2 overflow-x-auto px-4 py-2 border-t border-line bg-panel">
          {PAGES.map(function (p) {
            const isAct = p.id === pageId;
            return (
              <button
                key={p.id}
                onClick={function () { setPageId(p.id); }}
                className={'text-[11px] font-semibold px-3 py-1.5 rounded-full border whitespace-nowrap transition ' + (isAct ? 'bg-accent text-white border-accent' : 'bg-field text-mut border-line')}
              >
                {p.title}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row max-w-6xl w-full mx-auto">
        <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-line overflow-y-auto p-3 space-y-1">
          {PAGES.map(function (p) {
            const isAct = p.id === pageId;
            return (
              <button
                key={p.id}
                onClick={function () { setPageId(p.id); }}
                className={'w-full text-left text-xs font-medium px-3 py-2 rounded-lg border transition flex items-center gap-2 ' + (isAct ? 'bg-accent/15 text-accent border-accent/30' : 'text-mut border-transparent hover:bg-field hover:text-ink')}
              >
                <FontAwesomeIcon icon={p.icon} className="w-3.5" />
                {p.title}
              </button>
            );
          })}
        </aside>

        <main
          ref={mainRef}
          className="flex-1 min-h-0 overflow-y-scroll"
          style={{ scrollbarGutter: 'stable' }}
        >
          <div className="max-w-3xl mx-auto px-4 py-6 md:px-8 md:py-10">
            <ActiveComp />
            <footer className="mt-10 border-t border-line pt-5 pb-2 text-center space-y-1.5">
              <div className="flex items-center justify-center gap-2">
                <span className="bg-accent p-0.5 rounded"><img src="/logo-riskychici.svg" alt="" className="w-4 h-4" /></span>
                <span className="text-[11px] font-semibold text-ink">PRD Architect · Versi {APP_VERSION}</span>
              </div>
              <p className="text-[11px] text-mut">© 2026 Risky Chici. All rights reserved.</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
