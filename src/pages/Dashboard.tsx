import React from "react";
import { useQuery } from "react-query";
import {
  UsersIcon,
  FlagIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CalendarIcon,
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BellIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { analyticsApi, creatorApi } from "../services/api";

const Dashboard: React.FC = () => {
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery("analytics", analyticsApi.getDashboardStats);
  const { data: pendingCreators, isLoading: creatorsLoading } = useQuery(
    "pendingCreators",
    creatorApi.getPendingCreators
  );

  // Process analytics data for charts
  const userGrowthData =
    analytics?.data?.data?.userGrowth?.map((item: any) => ({
      month: new Date(item.month).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      users: parseInt(item.new_users) || 0,
    })) || [];

  // Helper function to get colors for report types
  const getReportColor = (reason: string) => {
    const colors: { [key: string]: string } = {
      "harassment or bullying": "#ef4444",
      "inappropriate content": "#f59e0b",
      "spam or unwanted messages": "#8b5cf6",
      "fake account or impersonation": "#dc2626",
      "violence or threats": "#991b1b",
      other: "#6b7280",
      harassment: "#ef4444",
      bullying: "#ef4444",
      inappropriate: "#f59e0b",
      spam: "#8b5cf6",
      fake: "#dc2626",
      impersonation: "#dc2626",
      violence: "#991b1b",
      threats: "#991b1b",
    };
    return colors[reason.toLowerCase()] || "#6b7280";
  };

  // Helper function to format report reasons for display
  const formatReportReason = (reason: string) => {
    const reasonMap: { [key: string]: string } = {
      "harassment or bullying": "Harassment/Bullying",
      "inappropriate content": "Inappropriate Content",
      "spam or unwanted messages": "Spam/Messages",
      "fake account or impersonation": "Fake Account",
      "violence or threats": "Violence/Threats",
      other: "Other",
    };
    return reasonMap[reason.toLowerCase()] || reason;
  };

  const reportData =
    analytics?.data?.data?.reportTypes?.map((item: any) => ({
      name: formatReportReason(item.reason),
      value: parseInt(item.count) || 0,
      color: getReportColor(item.reason),
    })) || [];

  // Get real values from API or show 0 if not available
  const totalUsers = analytics?.data?.data?.totalUsers || 0;
  const pendingReports = analytics?.data?.data?.pendingReports || 0;
  const totalReports = analytics?.data?.data?.totalReports || 0;
  const bannedUsers = analytics?.data?.data?.bannedUsers || 0;
  const pendingCreatorsCount = pendingCreators?.data?.data?.length || 0;

  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      type: "user_registered",
      message: "New user registered: john_doe",
      time: "2 minutes ago",
      icon: UserGroupIcon,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      id: 2,
      type: "report_submitted",
      message: "New report submitted for review",
      time: "5 minutes ago",
      icon: FlagIcon,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      id: 3,
      type: "user_banned",
      message: "User account banned: spam_user",
      time: "10 minutes ago",
      icon: ExclamationTriangleIcon,
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
    {
      id: 4,
      type: "system_update",
      message: "System maintenance completed",
      time: "1 hour ago",
      icon: ShieldCheckIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
  ];

  const stats = [
    {
      name: "Total Users",
      value: totalUsers,
      icon: UsersIcon,
      change: "+12%",
      changeType: "positive",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      name: "Pending Creators",
      value: pendingCreatorsCount,
      icon: CheckCircleIcon,
      change: pendingCreatorsCount > 0 ? `+${pendingCreatorsCount}` : "0",
      changeType: pendingCreatorsCount > 0 ? "positive" : "negative",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
    },
    {
      name: "Active Reports",
      value: pendingReports,
      icon: FlagIcon,
      change: "+5%",
      changeType: "positive",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
    },
    {
      name: "Banned Users",
      value: bannedUsers,
      icon: ExclamationTriangleIcon,
      change: "+2%",
      changeType: "positive",
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-50 to-red-100",
    },
  ];

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading dashboard data
        </h3>
        <p className="text-gray-500 mb-4">Please try again later.</p>
        <p className="text-sm text-gray-400">
          Error details:{" "}
          {analyticsError instanceof Error
            ? analyticsError.message
            : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's what's happening with your application today.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 transition-colors duration-200">
            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">Today</span>
          </button>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl shadow-sm hover:bg-primary-700 transition-colors duration-200">
            <EyeIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">View Reports</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} rounded-full -translate-y-16 translate-x-16 opacity-20`}
            ></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient}`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div
                  className={`flex items-center text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.changeType === "positive" ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">User Growth</h3>
              <p className="text-sm text-gray-600">
                Monthly user registration trends
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">
                +12% this month
              </span>
            </div>
          </div>
          {userGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#userGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <UsersIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No user growth data
                </h3>
                <p className="text-gray-500">
                  User registration data will appear here.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Report Types Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Report Types</h3>
              <p className="text-sm text-gray-600">
                Distribution of report categories
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-purple-600">
                {totalReports} total
              </span>
            </div>
          </div>
          {reportData.length > 0 ? (
            <div className="flex items-center">
              <ResponsiveContainer width="60%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reportData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-40 ml-6 space-y-3">
                {reportData.map((item: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.value} reports
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <FlagIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No report data
                </h3>
                <p className="text-gray-500">
                  Report data will appear here when available.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-600">
                Latest system events and user actions
              </p>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <div className="flex items-center mt-1">
                    <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600">Common admin tasks</p>
          </div>
          <div className="space-y-4">
            <button className="w-full flex items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
              <UsersIcon className="h-5 w-5 mr-3" />
              <span className="font-medium">Manage Users</span>
            </button>
            <button className="w-full flex items-center p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105">
              <FlagIcon className="h-5 w-5 mr-3" />
              <span className="font-medium">Review Reports</span>
            </button>
            <button className="w-full flex items-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
              <BellIcon className="h-5 w-5 mr-3" />
              <span className="font-medium">Create Announcement</span>
            </button>
            <button className="w-full flex items-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105">
              <ChartBarIcon className="h-5 w-5 mr-3" />
              <span className="font-medium">View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
