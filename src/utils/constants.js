import { faServer, faDatabase, faCloud, faGlobe, faCodeBranch, faShieldHalved, faHardDrive, faPlug, faInfinity, faBolt, faEnvelopeOpenText, faChartLine, faChartColumn, faFlask } from '@fortawesome/free-solid-svg-icons';
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

export const TECH_REQUIRED = [
  { key: 'techFrontend', label: 'Frontend', icon: faHtml5, color: 'text-orange-400', ph: 'misal: React, Tailwind CSS' },
  { key: 'techBackend', label: 'Backend', icon: faServer, color: 'text-emerald-400', ph: 'misal: Node.js, Laravel' },
  { key: 'techDatabase', label: 'Database', icon: faDatabase, color: 'text-blue-400', ph: 'misal: PostgreSQL, Redis' },
  { key: 'techInfra', label: 'Infrastructure & Cloud Hosting', icon: faCloud, color: 'text-purple-400', ph: 'misal: Vercel, AWS, Docker' },
  { key: 'techDomain', label: 'Domain & DNS Management', icon: faGlobe, color: 'text-cyan-400', ph: 'misal: Niagahoster, Cloudflare DNS' },
  { key: 'techVcs', label: 'Version Control System', icon: faCodeBranch, color: 'text-slate-400', ph: 'misal: GitHub, GitLab' },
];

export const TECH_OPTIONAL = [
  { key: 'techSecurity', label: 'Security & Authentication', icon: faShieldHalved, color: 'text-rose-400', category: 'Esensial', ph: 'misal: OAuth 2.0, JWT, bcrypt' },
  { key: 'techStorage', label: 'Object Storage & CDN', icon: faHardDrive, color: 'text-cyan-400', category: 'Esensial', ph: 'misal: AWS S3 + CloudFront, Cloudflare R2' },
  { key: 'techThirdParty', label: 'Third-Party APIs / Integrations', icon: faPlug, color: 'text-amber-400', category: 'Esensial', ph: 'misal: Midtrans, Firebase Auth' },
  { key: 'techDevOps', label: 'CI/CD & DevOps', icon: faInfinity, color: 'text-purple-400', category: 'Lanjutan', ph: 'misal: GitHub Actions, GitLab CI' },
  { key: 'techCaching', label: 'Caching Layer', icon: faBolt, color: 'text-yellow-400', category: 'Lanjutan', ph: 'misal: Redis, Memcached' },
  { key: 'techQueue', label: 'Message Brokers / Queueing', icon: faEnvelopeOpenText, color: 'text-emerald-400', category: 'Lanjutan', ph: 'misal: RabbitMQ, Kafka' },
  { key: 'techMonitoring', label: 'Monitoring, Logging, & Error Tracking', icon: faChartLine, color: 'text-blue-400', category: 'Lanjutan', ph: 'misal: Sentry, Grafana' },
  { key: 'techAnalytics', label: 'Analytics & Data Pipeline', icon: faChartColumn, color: 'text-indigo-400', category: 'Lanjutan', ph: 'misal: Google Analytics, Metabase' },
  { key: 'techTesting', label: 'Testing / QA Automation', icon: faFlask, color: 'text-lime-400', category: 'Lanjutan', ph: 'misal: Vitest, Playwright' },
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

export const DEFAULT_FIELDS = {
  projectName:'',docVersion:'v1.0',author:'',targetDate:'',targetDateFormat:'full',
  problemStatement:'',productGoal:'',userPersona:'',successMetrics:'',
  brandTypography:'',brandLayout:'',
  bpMobileOp:'\u2264',bpMobile:'',bpMobileUnit:'px',
  bpTabletOp:'\u2264',bpTablet:'',bpTabletUnit:'px',
  bpDesktopOp:'\u2265',bpDesktop:'',bpDesktopUnit:'px',
  userFlow:'',
  techFrontend:'',techBackend:'',techDatabase:'',techInfra:'',techDomain:'',techVcs:'',
  techSecurity:'',techStorage:'',techThirdParty:'',techDevOps:'',techCaching:'',
  techQueue:'',techMonitoring:'',techAnalytics:'',techTesting:'',
  dbSchema:'',
  nfrSpecs:'',nfrPerformance:'',nfrLocalization:'',nfrBrowser:'',figmaLink:'',riskMitigation:'',
  outOfScope:'',defOfDone:'',
};

export const INITIAL_SIMPLE_EXTRAS = EXTRAS_DEFINITIONS.reduce(function (a, d) { const o = Object.assign({}, a); o[d.key] = false; return o; }, {});
