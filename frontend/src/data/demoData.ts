// ─────────────────────────────────────────────
//  Demonstration data for TRUTHLENS AI
//  All data is clearly labelled as DEMO data.
//  None of these represent real AI predictions.
// ─────────────────────────────────────────────

import type { ScanRecord, DashboardStats, ThreatInsight, ModelVersion, DatasetInfo, Report } from '@/types';

// ── Dashboard Demo Stats ──────────────────────
export const DEMO_STATS: DashboardStats = {
  totalScans: 0,
  authenticCount: 0,
  aiGeneratedCount: 0,
  flaggedCount: 0,
  weeklyActivity: [
    { day: 'Mon', scans: 0, flagged: 0 },
    { day: 'Tue', scans: 0, flagged: 0 },
    { day: 'Wed', scans: 0, flagged: 0 },
    { day: 'Thu', scans: 0, flagged: 0 },
    { day: 'Fri', scans: 0, flagged: 0 },
    { day: 'Sat', scans: 0, flagged: 0 },
    { day: 'Sun', scans: 0, flagged: 0 },
  ],
};

// ── Sample Scan History (Demo) ────────────────
export const DEMO_SCAN_HISTORY: ScanRecord[] = [];

// ── Intelligence Insights (Static Educational Content) ──
export const INTELLIGENCE_INSIGHTS: ThreatInsight[] = [
  {
    id: '1',
    title: 'GAN-Based Deepfake Generation',
    category: 'gan',
    summary:
      'Generative Adversarial Networks (GANs) remain the most widely used architecture for synthetic face generation. Models such as StyleGAN3 can produce photorealistic faces with no real-world equivalents. Detection relies on subtle artifact analysis in high-frequency pixel domains.',
    severity: 'high',
    publishedAt: '2024-11-01',
    tags: ['GAN', 'StyleGAN', 'Face Synthesis', 'Artifact Analysis'],
  },
  {
    id: '2',
    title: 'Diffusion Model Imagery',
    category: 'diffusion',
    summary:
      'Latent diffusion models (Stable Diffusion, DALL-E, Midjourney) generate images by iteratively denoising from Gaussian noise. These images often lack the characteristic GAN artifacts but may show inconsistencies in lighting physics and semantic coherence.',
    severity: 'high',
    publishedAt: '2024-10-15',
    tags: ['Diffusion', 'Stable Diffusion', 'Latent Space', 'Detection Challenge'],
  },
  {
    id: '3',
    title: 'Face Swap Technology',
    category: 'face-swap',
    summary:
      'FaceSwap and DeepFaceLab tools allow replacing one person\'s face with another in video content. Telltale signs include boundary artifacts around the face region, unnatural blinking patterns, and inconsistent skin texture.',
    severity: 'critical',
    publishedAt: '2024-09-20',
    tags: ['FaceSwap', 'Video Manipulation', 'Identity Fraud'],
  },
  {
    id: '4',
    title: 'EXIF Metadata Forensics',
    category: 'general',
    summary:
      'AI-generated images typically lack authentic EXIF metadata. Absence of camera model, GPS data, and timestamp inconsistencies can serve as preliminary authenticity signals. However, metadata can be forged, so it should be used in conjunction with pixel-level analysis.',
    severity: 'medium',
    publishedAt: '2024-08-30',
    tags: ['EXIF', 'Metadata', 'Forensics', 'Image Authentication'],
  },
  {
    id: '5',
    title: 'Neural Codec Language Models for Voice',
    category: 'voice',
    summary:
      'Voice cloning technology has advanced to the point where only a few seconds of audio are required to create convincing synthetic speech. This poses significant risks in social engineering and disinformation campaigns.',
    severity: 'critical',
    publishedAt: '2024-07-10',
    tags: ['Voice Cloning', 'Audio Deepfake', 'Social Engineering'],
  },
  {
    id: '6',
    title: 'C2PA and Content Authenticity Initiative',
    category: 'general',
    summary:
      'The Coalition for Content Provenance and Authenticity (C2PA) is developing open standards for attaching cryptographically signed provenance data to media files. This provides a verifiable chain of custody for digital content from creation to distribution.',
    severity: 'low',
    publishedAt: '2024-06-01',
    tags: ['C2PA', 'Provenance', 'Cryptography', 'Standards'],
  },
];

// ── Research Lab: Model Versions (Demo) ──────
export const MODEL_VERSIONS: ModelVersion[] = [
  {
    version: 'v0.1-alpha',
    status: 'planned',
    architecture: 'EfficientNet-B4 + Custom Classification Head',
    parameters: '~19M',
    notes:
      'Initial architecture design. Training pipeline under development. Dataset curation in progress.',
  },
];

// ── Research Lab: Datasets (Demo) ────────────
export const DATASETS: DatasetInfo[] = [
  {
    name: 'FaceForensics++',
    description:
      'Large-scale video dataset containing manipulated face videos using multiple manipulation methods. Will serve as primary training data.',
    status: 'planned',
  },
  {
    name: 'DFDC (DeepFake Detection Challenge)',
    description:
      'Facebook AI Research dataset with over 100,000 video clips. Includes diverse subjects and manipulation techniques.',
    status: 'planned',
  },
  {
    name: 'Celeb-DF',
    description:
      'High-quality deepfake video dataset featuring celebrity faces. Useful for evaluating model generalization.',
    status: 'planned',
  },
];

// ── Reports (Demo - Empty State) ─────────────
export const DEMO_REPORTS: Report[] = [];

// ── Detection Engine Status ───────────────────
export const ENGINE_STATUS = {
  imageDetection: 'pending' as const,
  videoDetection: 'coming_soon' as const,
  metadataAnalysis: 'pending' as const,
  apiEndpoint: 'healthy' as const,
};

