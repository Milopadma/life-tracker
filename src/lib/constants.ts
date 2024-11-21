import { type ReactNode } from "react";

export type LifeEvent = {
  age: number;
  name: string;
  multiplier: number;
  duration: number;
};

export type LifeStatistic = {
  label: string;
  value: number;
  format: "currency" | "percent" | "number";
  description: string;
  icon: ReactNode;
};

export const LIFE_EVENTS: LifeEvent[] = [
  { age: 22, name: "College", multiplier: 1.5, duration: 4 },
  { age: 28, name: "Marriage", multiplier: 2, duration: 1 },
  { age: 30, name: "First Child", multiplier: 1.8, duration: 18 },
  { age: 33, name: "Second Child", multiplier: 1.5, duration: 18 },
  { age: 45, name: "Children College", multiplier: 2, duration: 4 },
  { age: 65, name: "Retirement", multiplier: 1.3, duration: 20 },
];

export type ChartConfig = {
  yearly: {
    label: string;
    color: string;
  };
}; 