"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Sparkles, TrendingUp, Globe2, Clock } from "lucide-react";
import NumberFlow from "@number-flow/react";
import {
  LIFE_EVENTS,
  type LifeStatistic,
  type ChartConfig,
} from "@/lib/constants";

const LIFE_STATISTICS: LifeStatistic[] = [
  {
    label: "Global Average Spending",
    value: 1200000,
    format: "currency",
    description: "lifetime spending per person in developed countries",
    icon: <Globe2 className="w-5 h-5 text-emerald-500" />,
  },
  {
    label: "Inflation Impact",
    value: 2.5,
    format: "percent",
    description: "average yearly increase in living costs",
    icon: <TrendingUp className="w-5 h-5 text-orange-500" />,
  },
  {
    label: "Major Life Events",
    value: 10,
    format: "number",
    description: "significant financial milestones in an average lifetime",
    icon: <Sparkles className="w-5 h-5 text-purple-500" />,
  },
  {
    label: "Working Years",
    value: 40,
    format: "number",
    description: "average years of active income generation",
    icon: <Clock className="w-5 h-5 text-blue-500" />,
  },
];

export default function LifetrackerClient(): JSX.Element {
  const [monthlySpending, setMonthlySpending] = useState<number>(3000);
  const [currentAge, setCurrentAge] = useState<number>(25);
  const [animatedTotal, setAnimatedTotal] = useState<number>(0);
  const [animatedStats, setAnimatedStats] = useState<LifeStatistic[]>(
    LIFE_STATISTICS.map((stat: LifeStatistic) => ({ ...stat, value: 0 }))
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const spendingData =
        monthlySpending > 0
          ? calculateLifetimeSpending(monthlySpending, currentAge)
          : [];
      const total =
        spendingData.length > 0
          ? spendingData[spendingData.length - 1].amount
          : 0;
      setAnimatedTotal(total);
    }, 100);

    return () => clearTimeout(timer);
  }, [monthlySpending, currentAge]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats(LIFE_STATISTICS);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const calculateLifetimeSpending = (
    monthly: number,
    startAge: number
  ): Array<{
    year: string;
    amount: number;
    yearlySpend: number;
    fill: string;
    event: string;
    isLifeEvent: boolean;
  }> => {
    const yearlyBase = monthly * 12;
    const lifeExpectancy = 85;
    let cumulativeSpending = 0;

    return Array.from({ length: lifeExpectancy - startAge }, (_, index) => {
      const currentYear = startAge + index;
      let yearlyAmount = yearlyBase;
      let eventName = "";
      let isLifeEvent = false;

      LIFE_EVENTS.forEach((event) => {
        if (
          currentYear >= event.age &&
          currentYear < event.age + event.duration
        ) {
          yearlyAmount *= event.multiplier;
          eventName = event.name;
          isLifeEvent = true;
        }
      });

      cumulativeSpending += yearlyAmount;

      return {
        year: `Age ${currentYear}`,
        amount: Math.round(cumulativeSpending),
        yearlySpend: Math.round(yearlyAmount),
        fill: isLifeEvent
          ? `hsl(${220 + index * 2} 90% 45%)`
          : `hsl(${220 + index * 2} 70% 50%)`,
        event: eventName,
        isLifeEvent,
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

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-950 p-4 sm:p-8 font-roboto">
      <main className="max-w-6xl mx-auto space-y-12">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold font-space-grotesk tracking-tight">
            Lifetracker
          </h1>
          <p className="text-neutral-600 text-lg">
            Calculate your lifetime spending trajectory
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700">
                Current Age
              </label>
              <input
                type="number"
                min="18"
                max="80"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-colors"
                placeholder="Enter your current age"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700">
                Monthly Spending ($)
              </label>
              <input
                type="number"
                value={monthlySpending}
                onChange={(e) => setMonthlySpending(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-colors"
                placeholder="Enter your monthly spending"
              />
            </div>
          </div>

          {monthlySpending > 0 && (
            <>
              <div className="text-center space-y-1 bg-white p-6 rounded-xl shadow-sm w-full max-w-md border border-neutral-200">
                <p className="text-neutral-600 font-medium">
                  Estimated Lifetime Spending
                </p>
                <NumberFlow
                  value={animatedTotal}
                  format={{
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }}
                  className="text-3xl font-bold font-space-grotesk text-blue-600"
                  transformTiming={{ duration: 1500, easing: "ease-out" }}
                />
              </div>

              <div className="w-full overflow-hidden bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-neutral-200">
                <div className="relative w-full min-h-[400px]">
                  <ChartContainer
                    config={chartConfig}
                    className="absolute inset-0 h-full w-full"
                  >
                    <BarChart
                      data={spendingData}
                      margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                    >
                      <CartesianGrid vertical={false} opacity={0.1} />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fill: "#666", fontSize: 12 }}
                        interval={
                          typeof window !== "undefined" &&
                          window.innerWidth < 768
                            ? 4
                            : 1
                        }
                      />
                      <YAxis
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#666", fontSize: 12 }}
                        width={80}
                      />
                      {LIFE_EVENTS.map((event) => (
                        <ReferenceLine
                          key={event.age}
                          x={`Age ${event.age}`}
                          stroke="#3b82f6"
                          strokeDasharray="3 3"
                          label={{
                            value: event.name,
                            position: "top",
                            fill: "#3b82f6",
                            fontSize: 12,
                          }}
                        />
                      ))}
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 shadow-lg rounded-lg border">
                                <p className="font-space-grotesk font-medium text-lg">
                                  {data.year}
                                </p>
                                <div className="space-y-1 mt-2">
                                  <p className="text-sm text-neutral-600">
                                    Total spent:
                                    <span className="font-medium text-neutral-900 ml-1">
                                      ${data.amount.toLocaleString()}
                                    </span>
                                  </p>
                                  <p className="text-sm text-neutral-600">
                                    This year:
                                    <span
                                      className={`font-medium ml-1 ${
                                        data.isLifeEvent
                                          ? "text-blue-600"
                                          : "text-neutral-900"
                                      }`}
                                    >
                                      ${data.yearlySpend.toLocaleString()}
                                    </span>
                                  </p>
                                  {data.event && (
                                    <p className="text-sm font-medium text-blue-600 mt-2 bg-blue-50 px-2 py-1 rounded">
                                      🎯 {data.event}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="amount"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                        fill="url(#colorGradient)"
                      />
                      <defs>
                        <linearGradient
                          id="colorGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.2}
                          />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>

              <div className="w-full space-y-8 mt-12">
                <h2 className="text-2xl font-space-grotesk font-bold text-center">
                  Life in Numbers
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {animatedStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-neutral-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-neutral-50 p-2 rounded-lg">
                          {stat.icon}
                        </div>
                        <NumberFlow
                          value={stat.value}
                          format={
                            stat.format === "currency"
                              ? {
                                  style: "currency",
                                  currency: "USD",
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }
                              : stat.format === "percent"
                              ? {
                                  style: "percent",
                                  minimumFractionDigits: 1,
                                  maximumFractionDigits: 1,
                                }
                              : {
                                  style: "decimal",
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }
                          }
                          className="text-2xl font-space-grotesk font-bold text-neutral-900"
                          transformTiming={{
                            duration: 1500,
                            easing: "ease-out",
                          }}
                        />
                      </div>
                      <h3 className="font-medium text-neutral-900 mb-1">
                        {stat.label}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {stat.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm mt-8 border border-neutral-200">
                  <h3 className="text-xl font-space-grotesk font-bold mb-4">
                    Your Spending in Context
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <span className="text-neutral-600">
                        Monthly Income Needed for Retirement
                      </span>
                      <NumberFlow
                        value={Math.round(monthlySpending * 0.8)}
                        format={{
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }}
                        className="font-medium"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <span className="text-neutral-600">
                        Recommended Emergency Fund
                      </span>
                      <NumberFlow
                        value={monthlySpending * 6}
                        format={{
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }}
                        className="font-medium"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <span className="text-neutral-600">
                        Yearly Investment Target (20% of Income)
                      </span>
                      <NumberFlow
                        value={monthlySpending * 12 * 0.2}
                        format={{
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }}
                        className="font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-space-grotesk font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    Smart Money Tips
                  </h3>
                  <ul className="space-y-2 text-neutral-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      Consider inflation in your long-term planning (~2.5%
                      yearly)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      Build an emergency fund before major life events
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      Adjust spending habits during high-expense periods
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="mt-20 py-8 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-600 text-sm">
              © {new Date().getFullYear()} Milopadma.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/milopadma/lifetracker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
