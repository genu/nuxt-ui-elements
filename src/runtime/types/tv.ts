import type { TV } from "tailwind-variants";

export type ComponentConfig<T extends Record<string, any>> = {
  variants: T extends { variants: infer V }
    ? {
        [K in keyof V]: V[K] extends Record<string, any> ? keyof V[K] : never;
      }
    : never;
  slots: T extends { slots: infer S }
    ? {
        [K in keyof S]: any;
      }
    : never;
};

export type { TV };
