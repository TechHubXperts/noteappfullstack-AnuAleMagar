import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import AddNoteModal from "./components/AddNoteModal";

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notes from API on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        console.log("Fetching notes");
        const response = await fetch("http://localhost:3000/api/Notes");
        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }
        const data = await response.json();
        setNotes(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError(err.message);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null;

  const handleAddNote = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      const response = await fetch("http://localhost:3000/api/Notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setIsAddModalOpen(false);
      setSelectedNoteId(newNote.id);
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Failed to save note");
    }
  };

  const handleUpdateNote = async (noteId, noteData) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/Notes/${noteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const updatedNote = await response.json();
      setNotes(
        notes.map((note) => (note.id === noteId ? updatedNote : note)),
      );
    } catch (err) {
      console.error("Error updating note:", err);
      alert("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/Notes/${noteId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes(notes.filter((note) => note.id !== noteId));
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
      }
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete note");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        onAddNote={handleAddNote}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />
      <NoteList
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        searchQuery={searchQuery}
        testId="note-list"
      />
      <NoteEditor note={selectedNote} onDelete={handleDeleteNote} onUpdate={handleUpdateNote} />
      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNote}
      />
    </div>
  );
}

export default App;
