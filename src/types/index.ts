// Core System Types
export interface SystemConfig {
  environment: 'development' | 'staging' | 'production';
  features: FeatureFlags;
  integrations: IntegrationConfig;
  security: SecurityConfig;
  performance: PerformanceConfig;
  ai: AIConfig;
  compliance: ComplianceConfig;
}

export interface FeatureFlags {
  aiAssistant: boolean;
  realTimeSync: boolean;
  advancedAnalytics: boolean;
  blockchainVerification: boolean;
  biometricAuth: boolean;
  voiceCommands: boolean;
  predictiveAnalytics: boolean;
  autoWorkflows: boolean;
  multiTenant: boolean;
  federatedSearch: boolean;
}

export interface IntegrationConfig {
  citation: CitationSystemConfig;
  towing: TowingSystemConfig;
  payment: PaymentSystemConfig;
  gis: GISSystemConfig;
  communication: CommunicationConfig;
  analytics: AnalyticsConfig;
  document: DocumentConfig;
  identity: IdentityConfig;
  blockchain: BlockchainConfig;
  iot: IoTConfig;
}

export interface AIConfig {
  enabled: boolean;
  provider: 'openai' | 'anthropic' | 'azure' | 'local';
  models: {
    chat: string;
    vision: string;
    embedding: string;
    classification: string;
  };
  features: {
    smartRouting: boolean;
    predictiveAnalytics: boolean;
    naturalLanguageQuery: boolean;
    documentAnalysis: boolean;
    anomalyDetection: boolean;
    autoTagging: boolean;
  };
}

export interface SecurityConfig {
  encryption: {
    level: 'standard' | 'enhanced' | 'quantum-ready';
    algorithm: string;
    keyRotation: number;
  };
  authentication: {
    methods: AuthMethod[];
    mfa: boolean;
    biometric: boolean;
    sso: SSOConfig;
  };
  audit: {
    enabled: boolean;
    retention: number;
    realTime: boolean;
    blockchain: boolean;
  };
  privacy: {
    gdprCompliant: boolean;
    dataMinimization: boolean;
    rightToErasure: boolean;
    consentManagement: boolean;
  };
}

export interface ComplianceConfig {
  standards: ComplianceStandard[];
  auditing: {
    automated: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    reports: boolean;
  };
  dataGovernance: {
    classification: boolean;
    retention: RetentionPolicy[];
    encryption: boolean;
    anonymization: boolean;
  };
}

// Integration Types
export interface BaseIntegration {
  id: string;
  name: string;
  type: IntegrationType;
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  config: Record<string, any>;
  healthCheck: HealthCheckConfig;
  fallback?: FallbackConfig;
  rateLimit: RateLimitConfig;
  cache: CacheConfig;
  monitoring: MonitoringConfig;
}

export interface APIIntegration extends BaseIntegration {
  endpoint: string;
  authentication: AuthConfig;
  headers: Record<string, string>;
  timeout: number;
  retryPolicy: RetryPolicy;
  transformation: DataTransformation;
}

export interface WebhookIntegration extends BaseIntegration {
  url: string;
  events: string[];
  security: WebhookSecurity;
  delivery: DeliveryConfig;
}

export interface DatabaseIntegration extends BaseIntegration {
  connectionString: string;
  pool: PoolConfig;
  migrations: MigrationConfig;
  backup: BackupConfig;
}

// AI & ML Types
export interface AIAssistant {
  id: string;
  name: string;
  capabilities: AICapability[];
  context: AIContext;
  personality: AIPersonality;
  knowledge: KnowledgeBase;
}

export interface PredictiveModel {
  id: string;
  type: 'classification' | 'regression' | 'clustering' | 'anomaly';
  algorithm: string;
  accuracy: number;
  lastTrained: Date;
  features: ModelFeature[];
  predictions: Prediction[];
}

// Workflow & Automation Types
export interface Workflow {
  id: string;
  name: string;
  description: string;
  triggers: WorkflowTrigger[];
  steps: WorkflowStep[];
  conditions: WorkflowCondition[];
  schedule?: CronSchedule;
  status: WorkflowStatus;
  metrics: WorkflowMetrics;
}

export interface WorkflowStep {
  id: string;
  type: 'action' | 'condition' | 'loop' | 'parallel' | 'human';
  config: StepConfig;
  dependencies: string[];
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

// Real-time & Event Types
export interface EventStream {
  id: string;
  source: string;
  type: EventType;
  data: any;
  timestamp: Date;
  metadata: EventMetadata;
  correlation: CorrelationData;
}

export interface RealtimeChannel {
  id: string;
  name: string;
  subscribers: Subscriber[];
  filters: EventFilter[];
  security: ChannelSecurity;
  persistence: PersistenceConfig;
}

// Analytics & Reporting Types
export interface AnalyticsEvent {
  id: string;
  type: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  context: AnalyticsContext;
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: Widget[];
  layout: DashboardLayout;
  permissions: Permission[];
  refresh: RefreshConfig;
  export: ExportConfig;
}

export interface Widget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'map' | 'ai-insight';
  title: string;
  config: WidgetConfig;
  dataSource: DataSource;
  filters: Filter[];
  realTime: boolean;
}

// Multi-tenant Types
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  config: TenantConfig;
  features: FeatureFlags;
  limits: ResourceLimits;
  billing: BillingConfig;
  customization: CustomizationConfig;
}

export interface TenantConfig {
  branding: BrandingConfig;
  integrations: IntegrationConfig;
  security: SecurityConfig;
  workflows: Workflow[];
  users: TenantUser[];
}

// Blockchain & Verification Types
export interface BlockchainRecord {
  id: string;
  hash: string;
  previousHash: string;
  timestamp: Date;
  data: any;
  signature: string;
  verified: boolean;
  network: BlockchainNetwork;
}

export interface SmartContract {
  id: string;
  address: string;
  abi: any[];
  network: BlockchainNetwork;
  functions: ContractFunction[];
  events: ContractEvent[];
}

// IoT & Device Types
export interface IoTDevice {
  id: string;
  type: DeviceType;
  location: GeoLocation;
  status: DeviceStatus;
  sensors: Sensor[];
  connectivity: ConnectivityInfo;
  firmware: FirmwareInfo;
  security: DeviceSecurity;
}

export interface Sensor {
  id: string;
  type: SensorType;
  unit: string;
  range: [number, number];
  accuracy: number;
  lastReading: SensorReading;
  calibration: CalibrationInfo;
}

// Utility Types
export type IntegrationType = 
  | 'api' 
  | 'webhook' 
  | 'database' 
  | 'file' 
  | 'message-queue' 
  | 'blockchain' 
  | 'iot' 
  | 'ai-service';

export type AuthMethod = 
  | 'password' 
  | 'biometric' 
  | 'smart-card' 
  | 'certificate' 
  | 'oauth' 
  | 'saml' 
  | 'ldap';

export type ComplianceStandard = 
  | 'SOC2' 
  | 'ISO27001' 
  | 'HIPAA' 
  | 'GDPR' 
  | 'CCPA' 
  | 'PCI-DSS' 
  | 'FISMA' 
  | 'NIST';

export type EventType = 
  | 'user-action' 
  | 'system-event' 
  | 'integration-event' 
  | 'ai-prediction' 
  | 'workflow-trigger' 
  | 'security-alert' 
  | 'performance-metric';

export type DeviceType = 
  | 'camera' 
  | 'sensor' 
  | 'beacon' 
  | 'scanner' 
  | 'display' 
  | 'printer' 
  | 'gateway' 
  | 'vehicle-unit';

export type SensorType = 
  | 'temperature' 
  | 'humidity' 
  | 'pressure' 
  | 'motion' 
  | 'proximity' 
  | 'gps' 
  | 'accelerometer' 
  | 'camera' 
  | 'microphone';

// Additional supporting interfaces would be defined here...
export interface HealthCheckConfig {
  interval: number;
  timeout: number;
  retries: number;
  endpoint?: string;
}

export interface RateLimitConfig {
  requests: number;
  window: number;
  burst?: number;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  strategy: 'lru' | 'fifo' | 'lfu';
  maxSize: number;
}

export interface MonitoringConfig {
  metrics: boolean;
  logs: boolean;
  traces: boolean;
  alerts: AlertConfig[];
}

export interface AlertConfig {
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
}