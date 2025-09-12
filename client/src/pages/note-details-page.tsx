import { NoteMetadataCard } from "@/components/metadata/note-metadata-card";
import { SimilarNotes } from "@/components/similar-notes";
import { DeleteNoteDialog } from "@/components/delete-note-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/services/axios-instance";
import { useAuth } from "@/stores/auth";
import { ArrowLeft, Edit, Eye, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
      <main className="flex-1 container max-w-7xl mx-auto px-2 sm:px-4 py-4">
        {/* Header Section */}
        <div className="mb-4 flex items-center justify-between">
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
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to={`/notes/${note.id}/edit`}>
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Note</span>
              </Link>
            </Button>
            <DeleteNoteDialog onDelete={handleDelete} noteTitle={note.title} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Note Title & Hero Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight break-words bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                  {note.title}
                </h1>

                {/* Enhanced Metadata Card */}
                <Card className="bg-card border">
                  <CardContent className="p-3 sm:p-6">
                    <NoteMetadataCard
                      createdAt={note.createdAt}
                      updatedAt={note.updatedAt}
                      category={note.category}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Note Summary */}
            {note.summary && (
              <Card className="bg-card border">
                <CardHeader className="pb-3 px-3 sm:px-6">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <div className="bg-muted border rounded-lg p-3 sm:p-4">
                    <p className="text-muted-foreground leading-relaxed break-words text-base">
                      {note.summary}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Note Content */}
            <Card className="bg-card border">
              <CardHeader className="pb-4 px-3 sm:px-6">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  Content
                </CardTitle>
                <Separator className="mt-3" />
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="bg-muted border rounded-lg p-3 sm:p-6">
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
