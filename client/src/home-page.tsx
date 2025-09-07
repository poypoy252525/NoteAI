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
      <header className="flex justify-between p-4">
        <span className="text-2xl font-semibold">Notes</span>
        <LogoutDialog />
      </header>
      <div className="px-4 pb-4 flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <Input placeholder="Search..." />
          <Button asChild>
            <Link to="/notes/new">New Note</Link>
          </Button>
        </div>
        {notes && notes.length ? (
          <div className="py-4 grid grid-cols-1 gap-4">
            {notes.map((note, index) => (
              <Link to={`/notes/${note.id}`} key={index}>
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
            <p className="text-muted-foreground">No Notes record.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
