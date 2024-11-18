"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type LifeEvent = {
  age: number;
  name: string;
  multiplier: number;
  duration: number;
};

const LIFE_EVENTS: LifeEvent[] = [
  { age: 22, name: "College", multiplier: 1.5, duration: 4 },
  { age: 28, name: "Marriage", multiplier: 2, duration: 1 },
  { age: 30, name: "First Child", multiplier: 1.8, duration: 18 },
  { age: 33, name: "Second Child", multiplier: 1.5, duration: 18 },
  { age: 45, name: "Children College", multiplier: 2, duration: 4 },
  { age: 65, name: "Retirement", multiplier: 1.3, duration: 20 },
];

type ChartConfig = {
  yearly: {
    label: string;
    color: string;
  };
};

export default function Home() {
  const [monthlySpending, setMonthlySpending] = useState<number>(0);
  const [currentAge, setCurrentAge] = useState<number>(25);

  const calculateLifetimeSpending = (monthly: number, startAge: number) => {
    const yearlyBase = monthly * 12;
    const lifeExpectancy = 85;

    return Array.from({ length: lifeExpectancy - startAge }, (_, index) => {
      const currentYear = startAge + index;
      let yearlyAmount = yearlyBase;
      let eventName = "";

      // check for overlapping life events
      LIFE_EVENTS.forEach((event) => {
        if (
          currentYear >= event.age &&
          currentYear < event.age + event.duration
        ) {
          yearlyAmount *= event.multiplier;
          eventName = event.name;
        }
      });

      return {
        year: `Age ${currentYear}`,
        amount: Math.round(yearlyAmount),
        fill: `hsl(${220 + index * 2} 70% 50%)`,
        event: eventName,
      };
    });
  };

  const chartConfig: ChartConfig = {
    yearly: {
      label: "Yearly Spending",
      color: "hsl(var(--chart-1))",
    },
  };

  const spendingData =
    monthlySpending > 0
      ? calculateLifetimeSpending(monthlySpending, currentAge)
      : [];
  const totalLifetimeSpending = spendingData.reduce(
    (acc, year) => acc + year.amount,
    0
  );

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-950 p-8 font-sans">
      <main className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Lifetracker</h1>
        <p className="text-center text-neutral-600">
          Visualize your lifetime spending including major life events
        </p>

        <div className="flex flex-col items-center gap-8">
          <div className="w-full max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Age
              </label>
              <input
                type="number"
                min="18"
                max="80"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your current age"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Monthly Spending ($)
              </label>
              <input
                type="number"
                value={monthlySpending}
                onChange={(e) => setMonthlySpending(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your monthly spending"
              />
            </div>
          </div>

          {monthlySpending > 0 && (
            <>
              <div className="text-center">
                <p className="text-lg font-medium">
                  Estimated Lifetime Spending
                </p>
                <p className="text-2xl font-bold">
                  ${totalLifetimeSpending.toLocaleString()}
                </p>
              </div>
              <div className="w-full overflow-x-auto">
                <ChartContainer
                  config={chartConfig}
                  className="h-[400px] min-w-[800px]"
                >
                  <BarChart
                    data={spendingData}
                    margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                  >
                    <CartesianGrid vertical={false} opacity={0.2} />
                    <XAxis
                      dataKey="year"
                      tickLine={false}
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 shadow-lg rounded-lg border">
                              <p className="font-medium">{data.year}</p>
                              <p className="text-sm">
                                ${data.amount.toLocaleString()}
                              </p>
                              {data.event && (
                                <p className="text-sm text-blue-600">
                                  {data.event}
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
