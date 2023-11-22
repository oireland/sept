"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ScoreboardData = {
  teamName: string;
  points: number;
  teamColour: string;
}[];

export default function Scoreboard({ data }: { data: ScoreboardData }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="teamName"
          stroke="#888888"
          className="text-[8px] sm:text-sm md:text-base lg:text-lg"
          axisLine={false}
          tickLine={false}
          type="category"
        />
        <YAxis stroke="#888888" fontSize={12} axisLine={false} type="number" />
        <Tooltip />
        <Bar dataKey="points" fill="#004225" radius={[4, 4, 0, 0]}>
          {data.map(({ teamColour }, index) => (
            <Cell key={index} fill={teamColour} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
