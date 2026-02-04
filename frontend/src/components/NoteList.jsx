export default function NoteList({
  notes,
  selectedNoteId,
  onSelectNote,
  searchQuery,
  testId,
}) {
  // Filter notes based on search  fdfd
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleNoteClick = (noteId) => {
    onSelectNote(noteId);
  };

  return (
    <div
      className="w-64 bg-gray-100 border-r border-gray-200 overflow-y-auto"
      data-testid={testId}
    >
      {filteredNotes.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No notes found</div>
      ) : (
        <div>
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleNoteClick(note.id)}
              className={`p-4 border-b border-gray-300 cursor-pointer transition ${
                selectedNoteId === note.id
                  ? "bg-purple-100"
                  : "hover:bg-gray-200"
              }`}
            >
              <h3 className="font-semibold text-gray-900 truncate">
                {note.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
