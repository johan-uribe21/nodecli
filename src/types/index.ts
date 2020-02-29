export interface BasicAuthInterface {
  username: string;
  password: string;
  on2Fa(): string | Promise<string>;
  token: { scopes: string[]; note: string };
}

export interface Questions {
  name: string;
  type: string;
  message: string;
  default?: string | null;
  validate?(value: string): boolean | string;
  choices?: string[];
}

export interface RepoDetails {
  name: string,
  description: string,
  private: boolean,
}