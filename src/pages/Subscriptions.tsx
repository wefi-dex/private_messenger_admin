import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration_days: number;
  features: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserSubscription {
  id: string;
  creator_id: string;
  subscriber_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date: string;
  payment_method: string;
  external_payment_id: string;
  created_at: string;
  updated_at: string;
  plan_name: string;
  plan_price: number;
  creator_username: string;
  creator_alias: string;
  subscriber_username: string;
  subscriber_alias: string;
}

export default function Subscriptions() {
  const { token } = useAuth();
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [userSubscriptions, setUserSubscriptions] = useState<
    UserSubscription[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"plans" | "subscriptions">(
    "plans"
  );
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    price: "",
    duration_days: "30",
    features: {},
  });
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load subscription plans
      const plansResponse = await api.get("/subscription-plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptionPlans(plansResponse.data.data || []);

      // Load user subscriptions (admin endpoint)
      const subscriptionsResponse = await api.get("/admin/subscriptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserSubscriptions(subscriptionsResponse.data.data || []);
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    try {
      await api.post("/admin/subscription-plans", newPlan, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewPlan({
        name: "",
        description: "",
        price: "",
        duration_days: "30",
        features: {},
      });
      loadData();
    } catch (error) {
      // Error handling
    }
  };

  const handleUpdatePlan = async (
    planId: string,
    updates: Partial<SubscriptionPlan>
  ) => {
    try {
      await api.put(`/admin/subscription-plans/${planId}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingPlan(null);
      loadData();
    } catch (error) {
      // Error handling
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await api.delete(`/admin/subscription-plans/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        loadData();
      } catch (error) {
        // Error handling
      }
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (window.confirm("Are you sure you want to cancel this subscription?")) {
      try {
        await api.put(
          `/admin/subscriptions/${subscriptionId}/cancel`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        loadData();
      } catch (error) {
        // Error handling
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "plans"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Subscription Plans ({subscriptionPlans.length})
        </button>
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "subscriptions"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          User Subscriptions ({userSubscriptions.length})
        </button>
      </div>

      {/* Subscription Plans Tab */}
      {activeTab === "plans" && (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Plan Name"
                value={newPlan.name}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, name: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={newPlan.description}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, description: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Price"
                value={newPlan.price}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, price: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Duration (days)"
                value={newPlan.duration_days}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, duration_days: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
              />
            </div>
            <button
              onClick={handleCreatePlan}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Plan
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Subscription Plans</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptionPlans.map((plan) => (
                    <tr key={plan.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {plan.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {plan.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${plan.price} {plan.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {plan.duration_days} days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            plan.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {plan.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setEditingPlan(plan)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User Subscriptions Tab */}
      {activeTab === "subscriptions" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">User Subscriptions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscriber
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userSubscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.creator_alias ||
                            subscription.creator_username}
                        </div>
                        <div className="text-sm text-gray-500">Creator</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.subscriber_alias ||
                            subscription.subscriber_username}
                        </div>
                        <div className="text-sm text-gray-500">Subscriber</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.plan_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${subscription.plan_price}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          subscription.status === "active"
                            ? "bg-green-100 text-green-800"
                            : subscription.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {subscription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(subscription.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {subscription.status === "active" && (
                        <button
                          onClick={() =>
                            handleCancelSubscription(subscription.id)
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Plan</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Plan Name"
                value={editingPlan.name}
                onChange={(e) =>
                  setEditingPlan({ ...editingPlan, name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={editingPlan.description}
                onChange={(e) =>
                  setEditingPlan({
                    ...editingPlan,
                    description: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Price"
                value={editingPlan.price}
                onChange={(e) =>
                  setEditingPlan({
                    ...editingPlan,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingPlan.is_active}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      is_active: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label>Active</label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdatePlan(editingPlan.id, editingPlan)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
