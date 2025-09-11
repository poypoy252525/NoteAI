import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Tag,
  Clock,
  FileText,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { api } from "@/services/axios-instance";
import { useAuth } from "@/stores/auth";
import { SimilarNotes } from "@/components/similar-notes";
import { toast } from "sonner";

interface Note {
  title: string;
  content: string;
  userId: string;
  summary: string | null;
  category: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
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
        const { userId } = useAuth.getState().user!;
        const response = await api.get<Note>(`/users/${userId}/notes/${id}`);
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
    if (!note) return;

    const { userId } = useAuth.getState().user!;

    try {
      await api.delete(`/users/${userId}/notes/${note.id}`, {});
      toast.success("Note deleted successfully");
      navigate("/");
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error("Failed to delete note");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-svh">
        <main className="container max-w-6xl mx-auto px-4 py-6 w-full">
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>
        </main>
        <div className="flex items-center justify-center flex-1">
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading note...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex flex-col min-h-svh">
        <main className="container max-w-6xl mx-auto px-4 py-6 w-full">
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>
        </main>
        <div className="flex items-center justify-center flex-1">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground text-lg">
              {error || "Note not found"}
            </p>
            <Button asChild variant="outline">
              <Link to="/">Back to Notes</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-svh bg-background">
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your note and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Note Title - Mobile */}
            <div className="sm:hidden">
              <h1 className="text-3xl font-bold leading-tight break-words">
                {note.title}
              </h1>
            </div>

            {/* Note Metadata */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(note.createdAt), "MMM dd, yyyy")}
                    </Badge>
                    {note.category && (
                      <Badge variant="outline" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {note.category}
                      </Badge>
                    )}
                    {note.updatedAt !== note.createdAt && (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Updated{" "}
                        {formatDistanceToNow(new Date(note.updatedAt), {
                          addSuffix: true,
                        })}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Note Summary */}
            {note.summary && (
              <Card className="shadow-sm border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed break-words">
                    {note.summary}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Note Content */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Content</CardTitle>
                <Separator className="mt-2" />
              </CardHeader>
              <CardContent>
                <div
                  className="note-content max-w-none overflow-x-auto break-words"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Similar Notes */}
            <div className="sticky top-18">
              <SimilarNotes noteId={note.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NoteDetailsPage;
