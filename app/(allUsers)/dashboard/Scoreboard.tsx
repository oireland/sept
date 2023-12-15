"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
          className="hidden"
          axisLine={false}
          tickLine={false}
          type="category"
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          axisLine={false}
          type="number"
          width={10}
        />
        <Tooltip />
        <Bar dataKey="points" radius={[4, 4, 0, 0]}>
          {data.map(({ teamColour }, index) => (
            <Cell key={index} fill={teamColour} />
          ))}
        </Bar>
        <Legend
          content={() => {
            return (
              <ul className="grid grid-cols-2 sm:flex w-full justify-evenly">
                {data.map(({ teamColour, teamName }) => (
                  <li key={teamName}>
                    <div className="flex space-x-2 items-center">
                      <div
                        className="h-3 w-3 sm:h-4 sm:w-4 lg:w-6 lg:h-6 xl:w-7 xl:h-7 rounded-sm border"
                        style={{ backgroundColor: teamColour }}
                      ></div>
                      <span className="text-xs sm:text-sm lg:text-base xl:text-lg">
                        {teamName}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
