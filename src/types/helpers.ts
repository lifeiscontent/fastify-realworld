export type Optionalize<
  T extends Record<string, unknown>,
  K extends keyof T,
> = {
  [P in K]?: T[P];
} & Omit<T, K>;
