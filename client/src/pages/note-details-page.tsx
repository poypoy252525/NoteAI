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
  Eye,
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
      <div className="flex flex-col min-h-svh bg-background">
        <main className="container max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Notes</span>
            </Button>
          </div>
        </main>
        <div className="flex items-center justify-center flex-1">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading note...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex flex-col min-h-svh bg-background">
        <main className="container max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Notes</span>
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
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Notes</span>
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit Note</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Note Title & Hero Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight break-words bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {note.title}
                </h1>

                {/* Enhanced Metadata Card */}
                <Card className="bg-card border">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Creation Date */}
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 border">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Created
                          </p>
                          <p className="text-sm font-semibold">
                            {format(new Date(note.createdAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>

                      {/* Last Updated */}
                      {note.updatedAt !== note.createdAt && (
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 border">
                          <div className="p-2 rounded-full bg-orange-500/10">
                            <Clock className="h-4 w-4 text-orange-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              Updated
                            </p>
                            <p className="text-sm font-semibold">
                              {formatDistanceToNow(new Date(note.updatedAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Category */}
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 border">
                        <div className="p-2 rounded-full bg-emerald-500/10">
                          <Tag className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Category
                          </p>
                          {note.category ? (
                            <Badge
                              variant="secondary"
                              className="text-sm font-semibold mt-1 bg-emerald-500/10 text-emerald-700 border-emerald-200"
                            >
                              {note.category}
                            </Badge>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              Uncategorized
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Note Summary */}
            {note.summary && (
              <Card className="bg-card border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 border rounded-lg p-4">
                    <p className="text-muted-foreground leading-relaxed break-words text-base">
                      {note.summary}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Note Content */}
            <Card className="bg-card border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-500/10">
                    <Eye className="h-5 w-5 text-blue-500" />
                  </div>
                  Content
                </CardTitle>
                <Separator className="mt-3" />
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 border rounded-lg p-6">
                  <div
                    className="note-content overflow-x-auto break-words prose prose-sm max-w-none dark:prose-invert"
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-20">
              <SimilarNotes noteId={note.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NoteDetailsPage;
