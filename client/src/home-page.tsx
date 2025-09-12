import { Skeleton } from "@/components/ui/skeleton";
import { getHtmlPreview } from "@/utils/html-utils";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NoteCard from "./components/note-card";
import { Button } from "./components/ui/button";
import { api } from "./services/axios-instance";
import { useAuth } from "./stores/auth";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const user = useAuth((state) => state.user);

  useEffect(() => {
    if (!user?.userId) {
      setNotes([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    api
      .get(`/users/${user?.userId}/notes`)
      .then((response) => {
        setNotes(response.data);
      })
      .catch(() => {
        setNotes([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user?.userId]);

  return (
    <div className="flex flex-col min-h-svh">
      <div className="px-4 lg:px-8 pb-4 pt-6 flex flex-col flex-1 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-2">Notes</h1>
        <div className="flex items-center gap-2 py-6">
          {/* <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Quick search..."
              className="pl-10 cursor-pointer"
              readOnly
              onClick={() => window.location.href = '/search'}
            />
          </div> */}
          <Button
            asChild
            variant="outline"
            className="flex-1 justify-start lg:flex-none lg:min-w-[350px]"
          >
            <Link to="/search">
              <Search />
              AI Search
            </Link>
          </Button>
          <Button>
            <Plus />
            <Link to="/notes/new">Create Note</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : notes && notes.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {notes.map((note, index) => (
              <Link
                to={`/notes/${note.id}`}
                key={index}
                className="transition-transform hover:scale-[1.015] h-full"
              >
                <NoteCard
                  title={note.title}
                  category={note.category || undefined}
                  summary={note.summary || getHtmlPreview(note.content)}
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
