export default function Sidebar({ onAddNote, onSearchChange, searchQuery }) {
  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };
//hello adding new comments here 
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple-600">NotesApp</h1>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <button
        onClick={onAddNote}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
        aria-label="Add"
      >
        Add
      </button>
    </div>
  );
}
