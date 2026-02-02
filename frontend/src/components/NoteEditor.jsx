import { useState, useEffect } from "react";

export default function NoteEditor({ note, onDelete, onUpdate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
    }
  }, [note]);

  const handleDelete = () => {
    if (note) {
      onDelete(note.id);
    }
  };

  const handleSave = () => {
    if (!note) return;
    
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    onUpdate(note.id, {
      title: title.trim(),
      content: content.trim(),
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p>Select a note to view or create a new one</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 mr-4">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="text-3xl font-bold text-gray-900 w-full border-none outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
          />
          <div className="text-sm text-gray-500 mt-2">
            <p>Created: {formatDate(note.createdAt)}</p>
            <p>Last updated: {formatDate(note.updatedAt)}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          title="Delete note"
          aria-label="Delete"
          className="text-red-600 hover:text-red-800 transition"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col mb-4">
        <textarea
          id="body"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note..."
          className="flex-1 text-gray-700 whitespace-pre-wrap border-none outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 resize-none"
        />
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}
