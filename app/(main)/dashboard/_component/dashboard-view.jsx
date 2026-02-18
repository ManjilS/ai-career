"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  BriefcaseIcon,
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  Target,
  Users,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const DashboardView = ({ insights }) => {
  const [activeTab, setActiveTab] = useState("overview");

  /* ---------------- Salary Chart Data ---------------- */
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  /* ---------------- Market Trend (Static demo) ---------------- */
  const marketTrendData = [
    { month: "Jan", demand: 65, salary: 85 },
    { month: "Feb", demand: 70, salary: 88 },
    { month: "Mar", demand: 75, salary: 90 },
    { month: "Apr", demand: 80, salary: 92 },
    { month: "May", demand: 85, salary: 94 },
    { month: "Jun", demand: 90, salary: 96 },
  ];

  /* ---------------- Helpers ---------------- */
  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-gradient-to-r from-emerald-500 to-green-400";
      case "medium":
        return "bg-gradient-to-r from-amber-500 to-yellow-400";
      case "low":
        return "bg-gradient-to-r from-rose-500 to-pink-400";
      default:
        return "bg-gray-300";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-emerald-500" };
      case "neutral":
        return { icon: BarChart3, color: "text-amber-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-rose-500" };
      default:
        return { icon: BarChart3, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "MMM dd, yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
        <h1 className="text-3xl font-bold">Market Intelligence Dashboard</h1>
        <p className="mt-2 text-indigo-100">
          AI-driven insights for {insights.industry}
        </p>
        <Badge className="mt-3 bg-white/20 text-white">
          <Calendar className="mr-2 h-3 w-3" />
          Updated {lastUpdatedDate}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-sm">Market Outlook</CardTitle>
            <OutlookIcon className={`h-5 w-5 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{insights.marketOutlook}</p>
            <p className="text-xs text-gray-500 mt-1">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-sm">Industry Growth</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{insights.growthRate.toFixed(1)}%</p>
            <Progress
              value={insights.growthRate}
              className="mt-4 h-2 bg-emerald-100 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-emerald-500"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-sm">Demand Level</CardTitle>
            <Users className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{insights.demandLevel}</p>
            <div className={`mt-3 h-2 rounded-full ${getDemandLevelColor(insights.demandLevel)}`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-sm">Market Stability</CardTitle>
            <Sparkles className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{insights.marketStabilityScore}/10</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="salaries">Salaries</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Salary Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Salary Ranges</CardTitle>
                <CardDescription>In thousands</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(v) => `$${v}K`} />
                    <Bar dataKey="min" fill="#93c5fd" />
                    <Bar dataKey="median" fill="#3b82f6" />
                    <Bar dataKey="max" fill="#1d4ed8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-violet-500" />
                  Top In-Demand Skills
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {insights.topSkills.map((item, index) => (
                    <div
                      key={item.skill}
                      className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-violet-100 text-violet-600 flex items-center justify-center font-medium group-hover:bg-violet-200">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-black">
                          {item.skill}
                        </span>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700">
                        +{item.demandGrowth}%
                      </Badge>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" size="sm" className="w-full mt-4">
                  View all skills
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Salaries */}
        <TabsContent value="salaries">
          <Card>
            <CardHeader>
              <CardTitle>Market Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="demand" stroke="#f59e0b" />
                  <Line type="monotone" dataKey="salary" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Skills</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Stats */}
      <div className="text-gray-500 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Active Opportunities" value={insights.activeOpportunities.toLocaleString()} icon={BriefcaseIcon} />
        <Stat label="Avg. Time to Hire" value={`${insights.avgTimeToHire} days`} icon={Calendar} />
        <Stat label="Market Stability" value={`${insights.marketStabilityScore}/10`} icon={Sparkles} />
      </div>
    </div>
  );
};

/* ---------------- Small Stat Component ---------------- */
const Stat = ({ label, value, icon: Icon }) => (
  <div className="p-4 rounded-xl bg-white border shadow-sm flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
    <div className="p-2 rounded-lg bg-gray-100">
      <Icon className="h-5 w-5 text-gray-600" />
    </div>
  </div>
);

export default DashboardView;
