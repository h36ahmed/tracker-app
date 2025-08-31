import { Project, Update, User } from "@prisma/client";

export type { Project, Update, User };

export type Vertical = "CRYPTO" | "APP" | "COMMERCE";

export interface ProjectWithUpdates extends Project {
  updates: Update[];
}

export interface ProjectWithLatestUpdate extends Project {
  updates: Update[];
  latestUpdate?: Update;
}

export type HealthStatus = "GREEN" | "YELLOW" | "RED";

export interface ProjectHealth extends ProjectWithLatestUpdate {
  healthStatus: HealthStatus;
  daysSinceLastUpdate: number;
}

export interface SlackEvent {
  type: string;
  event: {
    type: string;
    channel: string;
    user: string;
    text: string;
    ts: string;
  };
}

export interface SlackMessage {
  channel: string;
  user: string;
  text: string;
  timestamp: string;
}
