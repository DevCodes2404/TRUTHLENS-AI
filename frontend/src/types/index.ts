// ─────────────────────────────────────────────
//  Core application types for TRUTHLENS AI
// ─────────────────────────────────────────────

export type MediaType = 'image' | 'video';
export type ScanStatus = 'pending' | 'processing' | 'complete' | 'failed' | 'unavailable';
export type AuthenticityLabel = 'authentic' | 'ai_generated' | 'manipulated' | 'inconclusive' | 'unknown';
export type Theme = 'light' | 'dark' | 'system';

// ── Scan / History ────────────────────────────
export interface ScanRecord {
  id: string;
  filename: string;
  fileSize: number;    // bytes
  mediaType: MediaType;
  status: ScanStatus;
  label: AuthenticityLabel;
  createdAt: string;   // ISO 8601
  duration?: number;   // ms
  thumbnailUrl?: string;
}

// ── File Upload ───────────────────────────────
export interface UploadedFile {
  file: File;
  previewUrl: string;
  id: string;
}

export type UploadState = 'idle' | 'validating' | 'uploading' | 'ready' | 'error';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// ── API Responses ─────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'down';
  version: string;
  timestamp: string;
  services: {
    database: 'connected' | 'disconnected' | 'pending';
    inference: 'available' | 'unavailable' | 'pending';
  };
}

// ── Dashboard ─────────────────────────────────
export interface DashboardStats {
  totalScans: number;
  authenticCount: number;
  aiGeneratedCount: number;
  flaggedCount: number;
  weeklyActivity: WeeklyDataPoint[];
}

export interface WeeklyDataPoint {
  day: string;
  scans: number;
  flagged: number;
}

// ── Intelligence Center ───────────────────────
export interface ThreatInsight {
  id: string;
  title: string;
  category: 'deepfake' | 'gan' | 'diffusion' | 'face-swap' | 'voice' | 'general';
  summary: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  publishedAt: string;
  tags: string[];
}

// ── Research Lab ──────────────────────────────
export interface ModelVersion {
  version: string;
  status: 'planned' | 'in_training' | 'evaluation' | 'released';
  architecture: string;
  parameters?: string;
  accuracy?: number;
  notes: string;
}

export interface DatasetInfo {
  name: string;
  description: string;
  status: 'planned' | 'collecting' | 'ready';
  size?: string;
}

// ── Reports ───────────────────────────────────
export interface Report {
  id: string;
  title: string;
  createdAt: string;
  scanId?: string;
  format: 'pdf' | 'json' | 'csv';
  status: 'ready' | 'generating' | 'pending';
}

// ── Settings ──────────────────────────────────
export interface UserSettings {
  theme: Theme;
  notifications: {
    scanComplete: boolean;
    weeklyDigest: boolean;
    systemAlerts: boolean;
  };
  privacy: {
    retainFiles: boolean;
    retentionDays: number;
    anonymousMode: boolean;
  };
  appearance: {
    compactMode: boolean;
    sidebarCollapsed: boolean;
  };
}

// ── Toast ─────────────────────────────────────
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

// ── Navigation ────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: string | number;
}

