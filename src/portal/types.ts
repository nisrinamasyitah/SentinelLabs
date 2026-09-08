export type Severity = "Critical" | "High" | "Medium" | "Low" | "Info";

export type FindingStatus = "open" | "verifying" | "fixed";

export type Stage = "Recon" | "Scan" | "Exploit" | "Report" | "Retest";

export const STAGES: Stage[] = ["Recon", "Scan", "Exploit", "Report", "Retest"];

export interface Finding {
  id: string;
  engagementId: string;
  title: string;
  severity: Severity;
  cvss: number;
  asset: string;
  status: FindingStatus;
  discoveredOn: string;
}

export interface ClientProfile {
  id: string;
  email: string;
  name: string;
  contactName: string;
  createdAt: string;
}

export interface Engagement {
  id: string;
  clientId: string;
  name: string;
  target: string;
  stage: Stage;
  liveRunPending: boolean;
  startedOn: string;
  findings: Finding[];
  client: ClientProfile;
}
