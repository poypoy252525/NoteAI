import { Link } from "react-router-dom";
import NoteCard from "./components/note-card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useEffect, useState } from "react";
import { api } from "./services/axios-instance";
import { useAuth } from "./stores/auth";
import LogoutDialog from "./components/logout-dialog";

interface Note {
  title: string;
  content: string;
  userId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  category: string | null;
  summary: string | null;
}

function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const user = useAuth((state) => state.user);

  useEffect(() => {
    api.get(`/users/${user?.userId}/notes`).then((response) => {
      setNotes(response.data);
    });
  }, [user?.userId]);

  return (
    <div className="flex flex-col min-h-svh">
      <header className="flex justify-between items-center p-4 lg:px-8 border-b">
        <span className="text-2xl font-semibold">Notes</span>
        <LogoutDialog />
      </header>
      <div className="px-4 lg:px-8 pb-4 flex flex-col flex-1 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 py-6">
          <Input placeholder="Search notes..." className="flex-1 max-w-md" />
          <Button asChild>
            <Link to="/notes/new">New Note</Link>
          </Button>
        </div>
        {notes && notes.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {notes.map((note, index) => (
              <Link to={`/notes/${note.id}`} key={index} className="transition-transform hover:scale-105">
                <NoteCard
                  title={note.title}
                  category={note.category || undefined}
                  summary={note.summary || "No summary"}
                  createdAt={note.createdAt}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground text-lg">No notes found</p>
              <Button asChild variant="outline">
                <Link to="/notes/new">Create your first note</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
