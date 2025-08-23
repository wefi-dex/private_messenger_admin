import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  FlagIcon,
  Bars3Icon,
  XMarkIcon,
  SpeakerWaveIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ChevronDownIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    description: "Overview and analytics",
  },
  {
    name: "Users",
    href: "/users",
    icon: UsersIcon,
    description: "Manage user accounts",
  },
  {
    name: "Creator Approvals",
    href: "/creator-approvals",
    icon: CheckCircleIcon,
    description: "Review creator applications",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FlagIcon,
    description: "Review user reports",
  },
  {
    name: "Announcements",
    href: "/announcement",
    icon: SpeakerWaveIcon,
    description: "Create announcements",
  },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-80 flex-col bg-gradient-to-b from-white to-gray-50 shadow-2xl">
          {/* Mobile Sidebar Header */}
          <div className="flex h-20 items-center justify-between px-6 bg-gradient-to-r from-primary-600 to-primary-700">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white bg-opacity-20 backdrop-blur-sm">
                <ShieldCheckIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-white">AdminPanel</h1>
                <p className="text-xs text-primary-100">Management Console</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-white hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                      : "text-gray-700 hover:bg-white hover:shadow-md hover:shadow-gray-200/50"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-primary-600"
                    }`}
                  />
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div
                      className={`text-xs ${
                        isActive ? "text-primary-100" : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Mobile User Section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center px-4 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-white">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                <UserCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={logout}
                className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-xl">
          {/* Desktop Sidebar Header */}
          <div className="flex h-20 items-center px-6 bg-gradient-to-r from-primary-600 to-primary-700">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">AdminPanel</h1>
                <p className="text-sm text-primary-100">Management Console</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex-1 space-y-3 px-4 py-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl shadow-primary-500/30"
                      : "text-gray-700 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50"
                  }`}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 ${
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-primary-600"
                    }`}
                  />
                  <div>
                    <div className="font-semibold text-base">{item.name}</div>
                    <div
                      className={`text-xs ${
                        isActive ? "text-primary-100" : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-6 shadow-sm sm:gap-x-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden rounded-xl hover:bg-gray-100 transition-all duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />

            {/* Top Bar Actions */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-x-3 rounded-2xl bg-gradient-to-r from-gray-50 to-white px-4 py-2 hover:shadow-md transition-all duration-200"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                    <UserCircleIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.username}
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.username}
                      </p>
                      <p className="text-xs text-gray-500">admin@example.com</p>
                    </div>
                    <div className="py-1">
                      <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                        <UserCircleIcon className="mr-3 h-4 w-4" />
                        Profile Settings
                      </button>
                      <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                        <Cog6ToothIcon className="mr-3 h-4 w-4" />
                        Preferences
                      </button>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={logout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>

      {/* Backdrop for user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
