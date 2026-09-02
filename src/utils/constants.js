import { faServer, faDatabase, faCloud, faGlobe, faCodeBranch, faShieldHalved, faHardDrive, faPlug, faInfinity, faBolt, faEnvelopeOpenText, faChartLine, faChartColumn, faFlask, faRobot } from '@fortawesome/free-solid-svg-icons';
import { faHtml5 } from '@fortawesome/free-brands-svg-icons';

export const STORAGE_KEY = 'prdArchitectV4';
export const MAX_HISTORY = 50;
export const AUTOSAVE_DELAY = 800;

export const EXTRAS_DEFINITIONS = [
  { key: 'persona', label: 'Persona & KPI Sukses', icon: 'faUsers', color: 'indigo' },
  { key: 'branding', label: 'Branding & Design System', icon: 'faPalette', color: 'pink' },
  { key: 'roles', label: 'Role & Permission Matrix', icon: 'faUserShield', color: 'emerald' },
  { key: 'ac', label: 'Acceptance Criteria', icon: 'faClipboardCheck', color: 'amber' },
  { key: 'schema', label: 'Schema Data', icon: 'faTableList', color: 'cyan' },
  { key: 'nfr', label: 'NFR & Keamanan', icon: 'faShieldHalved', color: 'rose' },
];

const ICON_TONE = 'text-mut';

export const TECH_REQUIRED = [
  { key: 'techFrontend', label: 'Frontend', icon: faHtml5, color: ICON_TONE, ph: 'misal: React, Tailwind CSS' },
  { key: 'techBackend', label: 'Backend', icon: faServer, color: ICON_TONE, ph: 'misal: Node.js, Laravel' },
  { key: 'techDatabase', label: 'Database', icon: faDatabase, color: ICON_TONE, ph: 'misal: PostgreSQL, Redis' },
  { key: 'techInfra', label: 'Infrastructure & Cloud Hosting', icon: faCloud, color: ICON_TONE, ph: 'misal: Vercel, AWS, Docker' },
  { key: 'techDomain', label: 'Domain & DNS Management', icon: faGlobe, color: ICON_TONE, ph: 'misal: Niagahoster, Cloudflare DNS' },
  { key: 'techVcs', label: 'Version Control System', icon: faCodeBranch, color: ICON_TONE, ph: 'misal: GitHub, GitLab' },
];

export const TECH_OPTIONAL = [
  { key: 'techSecurity', label: 'Security & Authentication', icon: faShieldHalved, color: ICON_TONE, category: 'Esensial', ph: 'misal: OAuth 2.0, JWT, bcrypt' },
  { key: 'techStorage', label: 'Object Storage & CDN', icon: faHardDrive, color: ICON_TONE, category: 'Esensial', ph: 'misal: AWS S3 + CloudFront, Cloudflare R2' },
  { key: 'techThirdParty', label: 'Third-Party APIs / Integrations', icon: faPlug, color: ICON_TONE, category: 'Esensial', ph: 'misal: Midtrans, Firebase Auth' },
  { key: 'techAi', label: 'AI / LLM & Machine Learning', icon: faRobot, color: ICON_TONE, category: 'Lanjutan', ph: 'misal: OpenAI GPT-4, Gemini, LangChain, HuggingFace' },
  { key: 'techDevOps', label: 'CI/CD & DevOps', icon: faInfinity, color: ICON_TONE, category: 'Lanjutan', ph: 'misal: GitHub Actions, GitLab CI' },
  { key: 'techCaching', label: 'Caching Layer', icon: faBolt, color: ICON_TONE, category: 'Lanjutan', ph: 'misal: Redis, Memcached' },
  { key: 'techQueue', label: 'Message Brokers / Queueing', icon: faEnvelopeOpenText, color: ICON_TONE, category: 'Lanjutan', ph: 'misal: RabbitMQ, Kafka' },
  { key: 'techMonitoring', label: 'Monitoring, Logging, & Error Tracking', icon: faChartLine, color: ICON_TONE, category: 'Lanjutan', ph: 'misal: Sentry, Grafana' },
  { key: 'techAnalytics', label: 'Analytics & Data Pipeline', icon: faChartColumn, color: ICON_TONE, category: 'Lanjutan', ph: 'misal: Google Analytics, Metabase' },
  { key: 'techTesting', label: 'Testing / QA Automation', icon: faFlask, color: ICON_TONE, category: 'Lanjutan', ph: 'misal: Vitest, Playwright' },
];

export const DATA_TYPES = [
  { category: 'Numerik Tepat', items: ['TINYINT','SMALLINT','MEDIUMINT','INT / INTEGER','BIGINT','DECIMAL / NUMERIC'] },
  { category: 'Numerik Perkiraan', items: ['FLOAT','DOUBLE','REAL'] },
  { category: 'String Karakter', items: ['CHAR','VARCHAR','TEXT','MEDIUMTEXT','LONGTEXT'] },
  { category: 'Temporal', items: ['DATE','TIME','DATETIME','TIMESTAMP','YEAR'] },
  { category: 'Logika', items: ['BOOLEAN','BIT','ENUM','SET'] },
  { category: 'Biner', items: ['BINARY','VARBINARY','BLOB'] },
  { category: 'Semi-Terstruktur', items: ['JSON','XML'] },
  { category: 'Sistem & Identitas', items: ['UUID / GUID','INET','MACADDR'] },
];

export const SECTION_NOTE_KEYS = [
  'problemGoal',
  'persona',
  'branding',
  'roles',
  'features',
  'ac',
  'techStack',
  'schema',
  'nfr',
  'outOfScope',
];

export const DEFAULT_SECTION_NOTES = SECTION_NOTE_KEYS.reduce(function (acc, key) {
  acc[key] = '';
  return acc;
}, {});

export const DEFAULT_SECTION_NOTES_ENABLED = SECTION_NOTE_KEYS.reduce(function (acc, key) {
  acc[key] = false;
  return acc;
}, {});

export const DEFAULT_SECTION_NOTES_IMPORTANT = SECTION_NOTE_KEYS.reduce(function (acc, key) {
  acc[key] = false;
  return acc;
}, {});

export const DEFAULT_FIELDS = {
  projectName:'',docVersion:'1.0',docStatus:'Draft',author:'',targetDate:'',targetDateFormat:'full',
  problemStatement:'',productGoal:'',userPersona:'',successMetrics:'',
  brandTypography:'',brandLayout:'',
  bpMobileOp:'≤',bpMobile:'',bpMobileUnit:'px',
  bpTabletOp:'≤',bpTablet:'',bpTabletUnit:'px',
  bpDesktopOp:'≥',bpDesktop:'',bpDesktopUnit:'px',
  userFlow:'',
  techFrontend:'',techBackend:'',techDatabase:'',techInfra:'',techDomain:'',techVcs:'',
  techSecurity:'',techStorage:'',techThirdParty:'',techAi:'',techDevOps:'',techCaching:'',
  techQueue:'',techMonitoring:'',techAnalytics:'',techTesting:'',
  dbSchema:'',
  nfrSpecs:'',nfrPerformance:'',nfrLocalization:'',nfrBrowser:'',figmaLink:'',riskMitigation:'',
  outOfScope:'',defOfDone:'',
  coverThemeAuto:true,coverPrimary:'#C9A961',coverAccent:'#AB883A',coverBg:'#15171C',
  coverKicker:'',coverFooterNote:'',coverShowFooter:true,
  coverSubtitle:'',
  sectionNotes: { ...DEFAULT_SECTION_NOTES },
  sectionNotesEnabled: { ...DEFAULT_SECTION_NOTES_ENABLED },
  sectionNotesImportant: { ...DEFAULT_SECTION_NOTES_IMPORTANT },
};

export const INITIAL_SIMPLE_EXTRAS = EXTRAS_DEFINITIONS.reduce(function (a, d) {
  const o = Object.assign({}, a);
  o[d.key] = false;
  return o;
}, {});
