import * as Lucide from 'lucide-react';

// Tabel alias: nama Font Awesome -> kandidat nama Lucide.
const ALIAS = {
  Envelope: ['Mail', 'Inbox'],
  EnvelopeOpen: ['MailOpen', 'Mail'],
  EnvelopeOpenText: ['MailOpen', 'Mail', 'Inbox'],
  FileContract: ['FileText', 'FileSignature', 'FilePenLine', 'File'],
  FileExport: ['FileDown', 'FileOutput', 'Download'],
  FileImport: ['FileUp', 'FileInput', 'Upload'],
  FileLines: ['FileText', 'File'],
  FileAlt: ['FileText'],
  FloppyDisk: ['Save', 'HardDrive'],
  Save: ['Save'],
  PenToSquare: ['SquarePen', 'PenSquare', 'PenLine', 'Pen'],
  Edit: ['SquarePen', 'PenSquare', 'PenLine', 'Pen'],
  Pen: ['Pen', 'PenLine'],
  Pencil: ['Pencil', 'PenLine'],
  EyeDropper: ['Pipette', 'Droplet'],
  TableList: ['Table2', 'Table', 'List'],
  ListCheck: ['ListChecks', 'ListCheck', 'List'],
  ClipboardCheck: ['ClipboardCheck', 'ClipboardList', 'Clipboard'],
  UserShield: ['ShieldCheck', 'UserCheck', 'Shield'],
  ShieldHalved: ['ShieldHalf', 'Shield', 'ShieldCheck'],
  CircleInfo: ['Info', 'CircleHelp', 'HelpCircle'],
  InfoCircle: ['Info', 'CircleHelp'],
  CircleQuestion: ['CircleHelp', 'HelpCircle'],
  QuestionCircle: ['CircleHelp', 'HelpCircle'],
  CircleCheck: ['CircleCheck', 'CheckCircle', 'CheckCircle2'],
  CheckCircle: ['CircleCheck', 'CheckCircle'],
  CircleExclamation: ['CircleAlert', 'AlertCircle', 'TriangleAlert'],
  ExclamationCircle: ['CircleAlert', 'AlertCircle'],
  CircleXmark: ['CircleX', 'XCircle'],
  TimesCircle: ['CircleX', 'XCircle'],
  Xmark: ['X'],
  Times: ['X'],
  WandMagicSparkles: ['WandSparkles', 'Wand', 'Sparkles'],
  Magic: ['Wand', 'Sparkles'],
  Spinner: ['LoaderCircle', 'Loader2', 'Loader'],
  Robot: ['Bot'],
  Bullseye: ['Target', 'Crosshair'],
  LayerGroup: ['Layers', 'Layers2', 'Layers3'],
  CodeBranch: ['GitBranch', 'GitFork', 'Code'],
  ChartLine: ['ChartLine', 'LineChart', 'TrendingUp'],
  LineChart: ['ChartLine', 'LineChart', 'TrendingUp'],
  ChartColumn: ['ChartColumn', 'BarChart3', 'BarChart'],
  BarChart: ['ChartColumn', 'BarChart3', 'BarChart'],
  Flask: ['FlaskConical', 'FlaskRound', 'TestTube'],
  Vial: ['TestTube', 'FlaskConical'],
  Bolt: ['Zap'],
  Plug: ['Plug', 'PlugZap', 'Cable'],
  HardDrive: ['HardDrive', 'Database'],
  Print: ['Printer'],
  RotateLeft: ['RotateCcw', 'Undo2', 'Undo'],
  RotateRight: ['RotateCw', 'Redo2', 'Redo'],
  Gear: ['Settings', 'Cog'],
  Cog: ['Settings', 'Cog'],
  MagnifyingGlass: ['Search'],
  House: ['House', 'Home'],
  Home: ['House', 'Home'],
  Ellipsis: ['Ellipsis', 'MoreHorizontal'],
  EllipsisVertical: ['EllipsisVertical', 'MoreVertical'],
  Qrcode: ['QrCode'],
  Tags: ['Tags', 'Tag'],
  Users: ['Users', 'UsersRound'],
  User: ['User', 'UserRound'],
  Building: ['Building2', 'Building'],
  PuzzlePiece: ['Puzzle'],
  Trash: ['Trash2', 'Trash'],
  TrashAlt: ['Trash2'],
  Eye: ['Eye'],
  EyeSlash: ['EyeOff'],
  Html5: ['Code', 'CodeXml', 'Globe'],
  Github: ['Github'],
  Moon: ['Moon', 'MoonStar'],
  Sun: ['Sun', 'SunMedium'],
  Lightbulb: ['Lightbulb'],
  BookOpen: ['BookOpen', 'BookOpenText'],
  Keyboard: ['Keyboard'],
  Heart: ['Heart'],
  Download: ['Download'],
  Upload: ['Upload'],
  Ban: ['Ban'],
  Database: ['Database'],
  Server: ['Server'],
  Cloud: ['Cloud'],
  Globe: ['Globe', 'Earth'],
  Infinity: ['Infinity'],
  Copy: ['Copy'],
  Check: ['Check'],
  Minus: ['Minus'],
  Plus: ['Plus'],
  ArrowDown: ['ArrowDown'],
  ArrowUp: ['ArrowUp'],
  ArrowLeft: ['ArrowLeft'],
  ArrowRight: ['ArrowRight'],
  ChevronDown: ['ChevronDown'],
  ChevronUp: ['ChevronUp'],
  ChevronLeft: ['ChevronLeft'],
  ChevronRight: ['ChevronRight'],
  Lock: ['Lock'],
  Tag: ['Tag'],
  Palette: ['Palette'],
};

const WARNED = {};

function candidatesFor(base) {
  const list = [];
  const add = function (c) { if (c && list.indexOf(c) === -1) list.push(c); };
  (ALIAS[base] || []).forEach(add);
  add(base);
  return list;
}

function resolveIcon(icon) {
  let bases = [];
  if (typeof icon === 'string') bases = [icon];
  else if (icon && Array.isArray(icon.l)) bases = icon.l;
  else if (icon && typeof icon.n === 'string') bases = [icon.n];
  else if (icon && typeof icon.iconName === 'string') bases = [icon.iconName];
  else if (icon && typeof icon.name === 'string') bases = [icon.name];

  for (let i = 0; i < bases.length; i++) {
    const cands = candidatesFor(bases[i]);
    for (let j = 0; j < cands.length; j++) {
      if (Lucide[cands[j]]) return Lucide[cands[j]];
    }
  }

  const key = bases[0] || 'unknown';
  if (!WARNED[key]) {
    WARNED[key] = true;
    console.warn('[Icon Shim] TIDAK DITEMUKAN: ' + key + ' (dicoba: ' + bases.join(', ') + ')');
  }
  return Lucide.Circle || Lucide.CircleDot || Lucide.Box;
}

// Ukuran default Lucide: 14px dengan strokeWidth 1.5 agar icon tipis,
// elegan, dan tidak "chunky". Ukuran asli font-awesome (1em) dipertahankan
// lewat currentColor dan inline-block agar mengikuti ukuran teks parent.
const DEFAULT_SIZE = 14;
const DEFAULT_STROKE = 1.5;

export function FontAwesomeIcon(props) {
  const icon = props.icon;
  const className = props.className || '';
  const ariaHidden = props['aria-hidden'];
  const Comp = resolveIcon(icon);

  // Izinkan override size via props.size jika perlu (untuk kasus khusus).
  // Jika tidak, pakai DEFAULT_SIZE. strokeWidth mengikuti DEFAULT_STROKE
  // tapi bisa di-override lewat props.strokeWidth.
  const size = props.size || DEFAULT_SIZE;
  const strokeWidth = props.strokeWidth || DEFAULT_STROKE;

  return (
    <Comp
      size={size}
      strokeWidth={strokeWidth}
      className={'inline-block align-middle ' + className}
      aria-hidden={ariaHidden}
    />
  );
}

export default { FontAwesomeIcon: FontAwesomeIcon };
