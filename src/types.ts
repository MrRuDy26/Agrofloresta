export interface FormData {
  biome: string;
  region: string;
  focus: string;
  areaSize: string;
}

export interface ConsortiumLayer {
  stratum: string;
  plants: string[];
}

export interface PlanResult {
  consortium: ConsortiumLayer[];
  image_prompt: string;
  sales_hook: string;
  technical_secrets: string[];
}
