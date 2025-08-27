import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { creatorApi } from "../services/api";

interface Creator {
  id: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  alias: string;
  created_at: string;
  updated_at: string;
  role: string;
  creator_approved: boolean;
  creator_approval_date: string | null;
  creator_approval_admin_id: string | null;
  creator_approval_notes: string | null;
}

const CreatorApprovals: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  useEffect(() => {
    fetchPendingCreators();
  }, []);

  const fetchPendingCreators = async () => {
    try {
      setLoading(true);
      const response = await creatorApi.getPendingCreators();
      setCreators(response.data.data || []);
      setError(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch pending creators"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (creator: Creator) => {
    try {
      setApprovingId(creator.id);
      await creatorApi.approveCreator(creator.id, true, notes);
      setNotes("");
      setShowNotesModal(false);
      setSelectedCreator(null);
      await fetchPendingCreators(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to approve Host");
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (creator: Creator) => {
    try {
      setRejectingId(creator.id);
      await creatorApi.approveCreator(creator.id, false, notes);
      setNotes("");
      setShowNotesModal(false);
      setSelectedCreator(null);
      await fetchPendingCreators(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reject host");
    } finally {
      setRejectingId(null);
    }
  };

  const openNotesModal = (creator: Creator, action: "approve" | "reject") => {
    setSelectedCreator(creator);
    setNotes("");
    setShowNotesModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Host Approvals</h1>
        <p className="text-gray-600 mt-2">
          Review and approve pending hosts applications
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {creators.length === 0 ? (
        <div className="text-center py-12">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No pending approvals
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            All hosts applications have been reviewed.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <div
              key={creator.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0">
                  {creator.avatar ? (
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={creator.avatar}
                      alt={creator.username}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {creator.username}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {creator.alias || "No alias"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  <span className="truncate">{creator.email}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>Applied {formatDate(creator.created_at)}</span>
                </div>

                {creator.bio && (
                  <div className="flex items-start text-sm text-gray-600">
                    <DocumentTextIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-3">{creator.bio}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openNotesModal(creator, "approve")}
                  disabled={
                    approvingId === creator.id || rejectingId === creator.id
                  }
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {approvingId === creator.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Approve
                    </>
                  )}
                </button>

                <button
                  onClick={() => openNotesModal(creator, "reject")}
                  disabled={
                    approvingId === creator.id || rejectingId === creator.id
                  }
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {rejectingId === creator.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedCreator && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedCreator.username} - Add Notes (Optional)
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this decision..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowNotesModal(false);
                    setSelectedCreator(null);
                    setNotes("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprove(selectedCreator)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedCreator)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorApprovals;
