export interface MergedFingerprint {
  request_id: string;
  fingerprint: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
  device_type: string;
  platform: string;
  time_zone: string;
  user_agent: string;
  color_depth: string;
  color_gamut: string;
  bar_visibility: string; // JSON string
  browser_feature_support: string; // JSON string
  flag: string;
}