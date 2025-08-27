import React, { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon,
  MegaphoneIcon,
  CalendarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type:
    | "info"
    | "warning"
    | "success"
    | "error"
    | "update"
    | "maintenance"
    | "feature"
    | "security";
  priority: "low" | "medium" | "high" | "critical";
  status: "draft" | "published" | "archived";
  target_audience: "all" | "creators" | "fans" | "admins";
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  is_pinned: boolean;
  read_count: number;
}

const Announcements: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Mock data for now - will be replaced with actual API calls
  const mockAnnouncements: Announcement[] = [
    {
      id: "1",
      title: "System Maintenance Scheduled",
      content:
        "We will be performing scheduled maintenance on Sunday, December 15th from 2:00 AM to 6:00 AM EST. During this time, the platform will be temporarily unavailable.",
      type: "maintenance",
      priority: "high",
      status: "published",
      target_audience: "all",
      start_date: "2024-12-15T02:00:00Z",
      end_date: "2024-12-15T06:00:00Z",
      created_at: "2024-12-10T10:00:00Z",
      updated_at: "2024-12-10T10:00:00Z",
      created_by: "admin",
      is_pinned: true,
      read_count: 1250,
    },
    {
      id: "2",
      title: "New Feature: Enhanced Messaging",
      content:
        "We're excited to announce our new enhanced messaging feature! Now you can send voice messages, create group chats, and use emoji reactions.",
      type: "feature",
      priority: "medium",
      status: "published",
      target_audience: "all",
      start_date: "2024-12-12T00:00:00Z",
      created_at: "2024-12-12T09:00:00Z",
      updated_at: "2024-12-12T09:00:00Z",
      created_by: "admin",
      is_pinned: false,
      read_count: 890,
    },
    {
      id: "3",
      title: "Security Update Required",
      content:
        "Important: Please update your password to ensure account security. We recommend using a strong password with at least 8 characters.",
      type: "security",
      priority: "critical",
      status: "published",
      target_audience: "all",
      start_date: "2024-12-11T00:00:00Z",
      created_at: "2024-12-11T14:30:00Z",
      updated_at: "2024-12-11T14:30:00Z",
      created_by: "admin",
      is_pinned: true,
      read_count: 2100,
    },
    {
      id: "4",
      title: "Creator Guidelines Updated",
      content:
        "We've updated our creator guidelines to ensure a better experience for everyone. Please review the new guidelines in your creator dashboard.",
      type: "info",
      priority: "medium",
      status: "published",
      target_audience: "creators",
      start_date: "2024-12-10T00:00:00Z",
      created_at: "2024-12-10T11:15:00Z",
      updated_at: "2024-12-10T11:15:00Z",
      created_by: "admin",
      is_pinned: false,
      read_count: 450,
    },
    {
      id: "5",
      title: "Holiday Schedule Notice",
      content:
        "Our support team will have reduced hours during the holiday season. Response times may be longer than usual.",
      type: "warning",
      priority: "low",
      status: "published",
      target_audience: "all",
      start_date: "2024-12-20T00:00:00Z",
      end_date: "2025-01-05T00:00:00Z",
      created_at: "2024-12-09T16:45:00Z",
      updated_at: "2024-12-09T16:45:00Z",
      created_by: "admin",
      is_pinned: false,
      read_count: 320,
    },
  ];

  const [announcements, setAnnouncements] =
    useState<Announcement[]>(mockAnnouncements);

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === "all" || announcement.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || announcement.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || announcement.priority === priorityFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return InformationCircleIcon;
      case "warning":
        return ExclamationTriangleIcon;
      case "success":
        return CheckCircleIcon;
      case "error":
        return XCircleIcon;
      case "update":
        return BellIcon;
      case "maintenance":
        return ExclamationTriangleIcon;
      case "feature":
        return BellIcon;
      case "security":
        return XCircleIcon;
      default:
        return MegaphoneIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "update":
        return "bg-purple-100 text-purple-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "feature":
        return "bg-indigo-100 text-indigo-800";
      case "security":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateAnnouncement = (formData: any) => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: "admin",
      read_count: 0,
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setShowCreateModal(false);
  };

  const handleUpdateAnnouncement = (formData: any) => {
    if (selectedAnnouncement) {
      const updatedAnnouncements = announcements.map((announcement) =>
        announcement.id === selectedAnnouncement.id
          ? {
              ...announcement,
              ...formData,
              updated_at: new Date().toISOString(),
            }
          : announcement
      );
      setAnnouncements(updatedAnnouncements);
      setShowEditModal(false);
      setSelectedAnnouncement(null);
    }
  };

  const handleDeleteAnnouncement = () => {
    if (selectedAnnouncement) {
      const updatedAnnouncements = announcements.filter(
        (announcement) => announcement.id !== selectedAnnouncement.id
      );
      setAnnouncements(updatedAnnouncements);
      setShowDeleteModal(false);
      setSelectedAnnouncement(null);
    }
  };

  const handleTogglePin = (id: string) => {
    const updatedAnnouncements = announcements.map((announcement) =>
      announcement.id === id
        ? { ...announcement, is_pinned: !announcement.is_pinned }
        : announcement
    );
    setAnnouncements(updatedAnnouncements);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Announcements
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage system announcements and notifications
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Announcement
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="info">Information</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="update">Update</option>
                <option value="maintenance">Maintenance</option>
                <option value="feature">Feature</option>
                <option value="security">Security</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="relative">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                }}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <MegaphoneIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No announcements found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {announcements.length === 0
                ? "No announcements in the system."
                : "No announcements match your search criteria."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredAnnouncements.map((announcement) => {
              const TypeIcon = getTypeIcon(announcement.type);
              return (
                <li key={announcement.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <TypeIcon className="h-6 w-6 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900">
                                {announcement.title}
                              </p>
                              {announcement.is_pinned && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Pinned
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                                  announcement.type
                                )}`}
                              >
                                {announcement.type}
                              </span>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                                  announcement.priority
                                )}`}
                              >
                                {announcement.priority}
                              </span>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  announcement.status
                                )}`}
                              >
                                {announcement.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {announcement.content}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                            <span className="flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {new Date(
                                announcement.start_date
                              ).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <UserIcon className="h-3 w-3 mr-1" />
                              {announcement.target_audience}
                            </span>
                            <span className="flex items-center">
                              <EyeIcon className="h-3 w-3 mr-1" />
                              {announcement.read_count} reads
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedAnnouncement(announcement);
                            setShowViewModal(true);
                          }}
                          className="text-gray-400 hover:text-gray-500"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleTogglePin(announcement.id)}
                          className={`${
                            announcement.is_pinned
                              ? "text-yellow-400 hover:text-yellow-500"
                              : "text-gray-400 hover:text-gray-500"
                          }`}
                          title={announcement.is_pinned ? "Unpin" : "Pin"}
                        >
                          <BellIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAnnouncement(announcement);
                            setShowEditModal(true);
                          }}
                          className="text-blue-400 hover:text-blue-500"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAnnouncement(announcement);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-400 hover:text-red-500"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Create Announcement Modal */}
      <CreateAnnouncementModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateAnnouncement}
      />

      {/* Edit Announcement Modal */}
      {selectedAnnouncement && (
        <EditAnnouncementModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAnnouncement(null);
          }}
          onSubmit={handleUpdateAnnouncement}
          announcement={selectedAnnouncement}
        />
      )}

      {/* View Announcement Modal */}
      {selectedAnnouncement && (
        <ViewAnnouncementModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedAnnouncement(null);
          }}
          announcement={selectedAnnouncement}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedAnnouncement && (
        <DeleteAnnouncementModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedAnnouncement(null);
          }}
          onConfirm={handleDeleteAnnouncement}
          announcement={selectedAnnouncement}
        />
      )}
    </div>
  );
};

// Modal Components
interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info" as Announcement["type"],
    priority: "medium" as Announcement["priority"],
    status: "draft" as Announcement["status"],
    target_audience: "all" as Announcement["target_audience"],
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    is_pinned: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Create New Announcement
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                required
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as Announcement["type"],
                    })
                  }
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                  <option value="update">Update</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="feature">Feature</option>
                  <option value="security">Security</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as Announcement["priority"],
                    })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Announcement["status"],
                    })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Audience
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.target_audience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      target_audience: e.target
                        .value as Announcement["target_audience"],
                    })
                  }
                >
                  <option value="all">All Users</option>
                  <option value="creators">Hosts Only</option>
                  <option value="fans">Guests Only</option>
                  <option value="admins">Admins Only</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_pinned"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.is_pinned}
                onChange={(e) =>
                  setFormData({ ...formData, is_pinned: e.target.checked })
                }
              />
              <label
                htmlFor="is_pinned"
                className="ml-2 block text-sm text-gray-900"
              >
                Pin this announcement
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface EditAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  announcement: Announcement;
}

const EditAnnouncementModal: React.FC<EditAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  announcement,
}) => {
  const [formData, setFormData] = useState({
    title: announcement.title,
    content: announcement.content,
    type: announcement.type,
    priority: announcement.priority,
    status: announcement.status,
    target_audience: announcement.target_audience,
    start_date: announcement.start_date.split("T")[0],
    end_date: announcement.end_date?.split("T")[0] || "",
    is_pinned: announcement.is_pinned,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Edit Announcement
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                required
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as Announcement["type"],
                    })
                  }
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                  <option value="update">Update</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="feature">Feature</option>
                  <option value="security">Security</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as Announcement["priority"],
                    })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Announcement["status"],
                    })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Audience
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.target_audience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      target_audience: e.target
                        .value as Announcement["target_audience"],
                    })
                  }
                >
                  <option value="all">All Users</option>
                  <option value="creators">Hosts Only</option>
                  <option value="fans">Guests Only</option>
                  <option value="admins">Admins Only</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_pinned_edit"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.is_pinned}
                onChange={(e) =>
                  setFormData({ ...formData, is_pinned: e.target.checked })
                }
              />
              <label
                htmlFor="is_pinned_edit"
                className="ml-2 block text-sm text-gray-900"
              >
                Pin this announcement
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface ViewAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: Announcement;
}

const ViewAnnouncementModal: React.FC<ViewAnnouncementModalProps> = ({
  isOpen,
  onClose,
  announcement,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Announcement Details
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <p className="mt-1 text-sm text-gray-900">{announcement.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {announcement.content}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {announcement.type}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {announcement.priority}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {announcement.status}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Audience
                </label>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {announcement.target_audience}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(announcement.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {announcement.end_date
                    ? new Date(announcement.end_date).toLocaleDateString()
                    : "No end date"}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Read Count
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {announcement.read_count}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Created
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(announcement.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DeleteAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  announcement: Announcement;
}

const DeleteAnnouncementModal: React.FC<DeleteAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  announcement,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Delete Announcement
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to delete "{announcement.title}"? This action
            cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
