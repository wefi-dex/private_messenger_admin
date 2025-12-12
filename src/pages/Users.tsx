import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  CalendarIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  EnvelopeIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { userApi, blockApi } from "../services/api";

interface User {
  id: string;
  username: string;
  phone: string;
  role: string;
  bio: string;
  avatar: string;
  alias: string;
  created_at: string;
  updated_at: string;
  banned: boolean;
  reports_count: number;
  blocks_count: number;
  email?: string;
  email_verified?: boolean;
  creator_approved?: boolean;
  creator_approval_date?: string;
  creator_approval_admin_id?: string;
  creator_approval_notes?: string;
}

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [emailFilter, setEmailFilter] = useState("all");
  const [creatorFilter, setCreatorFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [userToAction, setUserToAction] = useState<User | null>(null);

  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery("users", userApi.getAllUsers);

  const deleteUserMutation = useMutation(
    (userId: string) => userApi.deleteUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
        setShowDeleteModal(false);
        setSelectedUser(null);
      },
      onError: (error: any) => {
        alert(
          `Failed to delete user: ${
            error.response?.data?.message || error.message || "Unknown error"
          }`
        );
      },
    }
  );

  const banUserMutation = useMutation(
    (userId: string) => userApi.banUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
      onError: (error: any) => {
        alert(
          `Failed to ban user: ${
            error.response?.data?.message || error.message || "Unknown error"
          }`
        );
      },
    }
  );

  const unbanUserMutation = useMutation(
    (userId: string) => userApi.unbanUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
      onError: (error: any) => {
        alert(
          `Failed to unban user: ${
            error.response?.data?.message || error.message || "Unknown error"
          }`
        );
      },
    }
  );

  const blockUserMutation = useMutation(
    ({ blockerId, blockedId }: { blockerId: string; blockedId: string }) =>
      blockApi.blockUser(blockerId, blockedId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );

  // Safely handle the users data with better error handling
  let usersArray: User[] = [];

  if (users && users.data) {
    if (Array.isArray(users.data)) {
      usersArray = users.data;
    } else if (users.data.success && Array.isArray(users.data.data)) {
      usersArray = users.data.data;
    } else {
      usersArray = [];
    }
  }

  const filteredUsers = usersArray.filter((user: User) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      (user.phone &&
        user.phone?.toLowerCase().includes(searchTerm?.toLowerCase())) ||
      (user.alias &&
        user.alias?.toLowerCase().includes(searchTerm?.toLowerCase())) ||
      (user.email &&
        user.email?.toLowerCase().includes(searchTerm?.toLowerCase()));
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesEmail =
      emailFilter === "all" ||
      (emailFilter === "verified" && user.email_verified) ||
      (emailFilter === "unverified" && !user.email_verified);
    const matchesCreator =
      creatorFilter === "all" ||
      (creatorFilter === "approved" &&
        user.role === "creator" &&
        user.creator_approved) ||
      (creatorFilter === "pending" &&
        user.role === "creator" &&
        !user.creator_approved);
    return matchesSearch && matchesRole && matchesEmail && matchesCreator;
  });

  // Calculate statistics
  const totalUsers = usersArray.length;
  const activeUsers = usersArray.filter((user) => !user.banned).length;

  const verifiedUsers = usersArray.filter((user) => user.email_verified).length;

  const pendingCreators = usersArray.filter(
    (user) => user.role === "creator" && !user.creator_approved
  ).length;

  const stats = [
    {
      name: "Total Users",
      value: totalUsers,
      icon: UserGroupIcon,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      name: "Active Users",
      value: activeUsers,
      icon: CheckCircleIcon,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
    },
    {
      name: "Email Verified",
      value: verifiedUsers,
      icon: CheckBadgeIcon,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
    },
    {
      name: "Pending Hosts",
      value: pendingCreators,
      icon: ClockIcon,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
    },
  ];

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  const handleBanUser = (user: User) => {
    setUserToAction(user);
    setShowBanModal(true);
  };

  const handleUnbanUser = (user: User) => {
    setUserToAction(user);
    setShowUnbanModal(true);
  };

  const confirmBanUser = () => {
    if (userToAction) {
      banUserMutation.mutate(userToAction.id);
      setShowBanModal(false);
      setUserToAction(null);
    }
  };

  const confirmUnbanUser = () => {
    if (userToAction) {
      unbanUserMutation.mutate(userToAction.id);
      setShowUnbanModal(false);
      setUserToAction(null);
    }
  };

  const handleBlockUser = (userId: string) => {
    blockUserMutation.mutate({ blockerId: "admin", blockedId: userId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading users
        </h3>
        <p className="text-gray-500 mb-4">Please try again later.</p>
        <p className="text-sm text-gray-400">
          Error details:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!users || !users.data) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No data available
        </h3>
        <p className="text-gray-500">Unable to load users data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">
            Manage and monitor all users in your application
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 transition-colors duration-200">
            <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">Export</span>
          </button>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl shadow-sm hover:bg-primary-700 transition-colors duration-200">
            <PlusIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Add User</span>
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
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 sm:text-sm"
              placeholder="Search users by name, phone, email, or alias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 sm:text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="creator">Hosts</option>
              <option value="fan">Guests</option>
            </select>
          </div>

          {/* Email Verification Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CheckBadgeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 sm:text-sm"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
            >
              <option value="all">All Email Status</option>
              <option value="verified">Email Verified</option>
              <option value="unverified">Email Unverified</option>
            </select>
          </div>

          {/* Creator Approval Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ClockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 sm:text-sm"
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
            >
              <option value="all">All Hosts Status</option>
              <option value="approved">Approved Hosts</option>
              <option value="pending">Pending Hosts</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4">
          <button
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("all");
              setEmailFilter("all");
              setCreatorFilter("all");
            }}
            className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <UserIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-500">
              {usersArray.length === 0
                ? "No users in the system."
                : "No users match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredUsers.map((user: User) => (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* User Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {user.avatar ? (
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // Fallback to default icon if image fails to load
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center hidden">
                          <UserIcon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.username}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "creator"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                        {user.banned && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Banned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-3 mb-4">
                  {user.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="truncate">{user.email}</span>
                      {user.email_verified ? (
                        <CheckBadgeIcon
                          className="h-4 w-4 ml-1 text-green-500"
                          title="Email Verified"
                        />
                      ) : (
                        <XMarkIcon
                          className="h-4 w-4 ml-1 text-red-500"
                          title="Email Not Verified"
                        />
                      )}
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ShieldCheckIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>
                      {user.reports_count} reports, {user.blocks_count} blocks
                    </span>
                  </div>
                  {user.role === "creator" && (
                    <div className="flex items-center text-sm text-gray-600">
                      {user.creator_approved ? (
                        <CheckBadgeIcon className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <ClockIcon className="h-4 w-4 mr-2 text-orange-500" />
                      )}
                      <span
                        className={
                          user.creator_approved
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {user.creator_approved
                          ? "Approved Host"
                          : "Pending Approval"}
                      </span>
                    </div>
                  )}
                </div>

                {/* User Bio */}
                {user.bio && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {user.bio}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    {user.banned ? (
                      <button
                        onClick={() => handleUnbanUser(user)}
                        className="p-2 text-green-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="Unban User"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBanUser(user)}
                        className="p-2 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                        title="Ban User"
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleBlockUser(user.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Block User"
                    >
                      <ExclamationTriangleIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete User"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border w-96 shadow-xl rounded-2xl bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  User Details
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                  {selectedUser.avatar ? (
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.username}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          // Fallback to default icon if image fails to load
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove(
                            "hidden"
                          );
                        }}
                      />
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center hidden">
                        <UserIcon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                      <UserIcon className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedUser.username}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedUser.role === "creator"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {selectedUser.role}
                      </span>
                      {selectedUser.banned && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Banned
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Image Section */}
                {selectedUser.avatar && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                      Profile Image
                    </p>
                    <div className="flex justify-center">
                      <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                        <img
                          src={selectedUser.avatar}
                          alt={selectedUser.username}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center hidden">
                          <UserIcon className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {selectedUser.email && (
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                        Email
                      </p>
                      <div className="flex items-center mt-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {selectedUser.email}
                        </p>
                        {selectedUser.email_verified ? (
                          <CheckBadgeIcon
                            className="h-4 w-4 ml-1 text-green-500"
                            title="Email Verified"
                          />
                        ) : (
                          <XMarkIcon
                            className="h-4 w-4 ml-1 text-red-500"
                            title="Email Not Verified"
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {selectedUser.phone && (
                    <div className="p-3 bg-green-50 rounded-xl">
                      <p className="text-xs font-medium text-green-600 uppercase tracking-wide">
                        Phone
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {selectedUser.phone}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                      Reports
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {selectedUser.reports_count}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                      Blocks
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {selectedUser.blocks_count}
                    </p>
                  </div>
                </div>

                {selectedUser.role === "creator" && (
                  <div className="p-3 bg-yellow-50 rounded-xl">
                    <p className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
                      Host Status
                    </p>
                    <div className="flex items-center mt-1">
                      {selectedUser.creator_approved ? (
                        <>
                          <CheckBadgeIcon className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium text-green-600">
                            Approved
                          </span>
                        </>
                      ) : (
                        <>
                          <ClockIcon className="h-4 w-4 text-orange-500 mr-1" />
                          <span className="text-sm font-medium text-orange-600">
                            Pending Approval
                          </span>
                        </>
                      )}
                    </div>
                    {selectedUser.creator_approval_date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Approved:{" "}
                        {new Date(
                          selectedUser.creator_approval_date
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {selectedUser.creator_approval_notes && (
                      <p className="text-xs text-gray-500 mt-1">
                        Notes: {selectedUser.creator_approval_notes}
                      </p>
                    )}
                  </div>
                )}

                {selectedUser.bio && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Bio
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedUser.bio}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Joined
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Last Updated
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedUser.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border w-96 shadow-xl rounded-2xl bg-white">
            <div className="mt-3">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Delete User
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete user "{selectedUser.username}
                  "? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={deleteUserMutation.isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {deleteUserMutation.isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban Confirmation Modal */}
      {showBanModal && userToAction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border w-96 shadow-xl rounded-2xl bg-white">
            <div className="mt-3">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                  <XCircleIcon className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Ban User
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to ban user "{userToAction.username}"?
                  They will not be able to login.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowBanModal(false);
                    setUserToAction(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBanUser}
                  disabled={banUserMutation.isLoading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {banUserMutation.isLoading ? "Banning..." : "Ban User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unban Confirmation Modal */}
      {showUnbanModal && userToAction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border w-96 shadow-xl rounded-2xl bg-white">
            <div className="mt-3">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Unban User
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to unban user "{userToAction.username}"?
                  They will be able to login again.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowUnbanModal(false);
                    setUserToAction(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUnbanUser}
                  disabled={unbanUserMutation.isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {unbanUserMutation.isLoading ? "Unbanning..." : "Unban User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
