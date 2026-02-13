export interface FontT {
  id: string;
  name: string;
  value: string;
  preview: string;
}

export type ViewT = "LIST" | "SETTINGS" | "EMPTY";

export interface UserPreferencesT {
  defaultFont: string;
  fontSize: "Small" | "Medium" | "Large";
  autoApply: boolean;
  rememberPerSite: boolean;
}
