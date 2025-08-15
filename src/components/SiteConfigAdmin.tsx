import React, { useState } from "react";
import { useSiteConfig } from "../hooks/useSiteConfig";

export const SiteConfigAdmin: React.FC = () => {
  const { configs, loading, error, setConfig, deleteConfig } =
    useSiteConfig();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    key: "",
    value: "",
    description: "",
    isPublic: false,
  });

  const handleEdit = (config: any) => {
    setEditingKey(config.key);
    setEditForm({
      key: config.key,
      value: JSON.stringify(config.value, null, 2),
      description: config.description || "",
      isPublic: config.isPublic,
    });
  };

  const handleSave = async () => {
    try {
      const parsedValue = JSON.parse(editForm.value);
      const success = await setConfig(
        editForm.key,
        parsedValue,
        editForm.description,
        editForm.isPublic
      );

      if (success) {
        setEditingKey(null);
        setEditForm({ key: "", value: "", description: "", isPublic: false });
      }
    } catch (err) {
      alert("Invalid JSON value");
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditForm({ key: "", value: "", description: "", isPublic: false });
  };

  const handleDelete = async (key: string) => {
    if (
      window.confirm(`Are you sure you want to delete configuration "${key}"?`)
    ) {
      await deleteConfig(key);
    }
  };

  if (loading) {
    return <div className="p-4">Loading configurations...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Site Configuration Management</h2>

      <div className="space-y-4">
        {configs.map((config) => (
          <div
            key={config.key}
            className="border rounded-lg p-4 bg-white dark:bg-gray-800"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{config.key}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(config)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(config.key)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            {config.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {config.description}
              </p>
            )}

            <div className="flex items-center space-x-4 mb-2">
              <span className="text-sm text-gray-500">
                Public: {config.isPublic ? "Yes" : "No"}
              </span>
              <span className="text-sm text-gray-500">
                Updated: {new Date(config.updatedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(config.value, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              Edit Configuration: {editingKey}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Key</label>
                <input
                  type="text"
                  value={editForm.key}
                  onChange={(e) =>
                    setEditForm({ ...editForm, key: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Value (JSON)
                </label>
                <textarea
                  value={editForm.value}
                  onChange={(e) =>
                    setEditForm({ ...editForm, value: e.target.value })
                  }
                  className="w-full p-2 border rounded h-32 font-mono text-sm dark:bg-gray-700 dark:border-gray-600"
                  placeholder='{"example": "value"}'
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={editForm.isPublic}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isPublic: e.target.checked })
                  }
                  className="mr-2"
                />
                <label htmlFor="isPublic">Public (visible to all users)</label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
