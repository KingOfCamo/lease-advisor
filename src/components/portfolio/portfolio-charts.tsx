"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#1e3a5f", "#334e68", "#486581", "#627d98", "#829ab1"];

interface PortfolioChartsProps {
  leaseScoreData: Array<{ name: string; score: number; rent: number }>;
  reviewData: Array<{ name: string; value: number }>;
  expiryData: Array<{ name: string; expiry: string; rent: number }>;
  valueAddData: Array<{ lease: string; title: string; impact: number }>;
}

export function PortfolioCharts({
  leaseScoreData,
  reviewData,
  valueAddData,
}: PortfolioChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Score Distribution */}
      {leaseScoreData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lease Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={leaseScoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Review Mechanism Breakdown */}
      {reviewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rent Review Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={reviewData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {reviewData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Value-Add Waterfall */}
      {valueAddData.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Value-Add Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={valueAddData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="title"
                  width={200}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="impact" fill="#16a34a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
