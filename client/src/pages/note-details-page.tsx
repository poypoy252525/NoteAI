import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2, Calendar, Tag } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { api } from "@/services/axios-instance";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

const NoteDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/notes/${id}`);
        setNote(response.data);
      } catch (err) {
        setError("Failed to load note");
        console.error("Error fetching note:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!note || !window.confirm("Are you sure you want to delete this note?")) return;
    
    try {
      await api.delete(`/notes/${note.id}`);
      navigate("/");
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-svh">
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex flex-col min-h-svh">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground text-lg">{error || "Note not found"}</p>
            <Button asChild variant="outline">
              <Link to="/">Back to Notes</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-svh">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold truncate max-w-md">{note.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Note Title - Mobile */}
          <div className="sm:hidden">
            <h1 className="text-2xl font-bold leading-tight">{note.title}</h1>
          </div>

          {/* Note Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Created {format(new Date(note.createdAt), "PPP")}</span>
                  <span className="text-xs">
                    ({formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })})
                  </span>
                </div>
                {note.category && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md">
                      {note.category}
                    </span>
                  </div>
                )}
              </div>
              {note.updatedAt !== note.createdAt && (
                <p className="text-xs text-muted-foreground">
                  Last updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </p>
              )}
            </CardHeader>
          </Card>

          {/* Note Summary */}
          {note.summary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{note.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Note Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NoteDetailsPage;
