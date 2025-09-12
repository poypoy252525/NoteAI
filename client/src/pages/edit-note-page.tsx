import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/editor/rich-text-editor-wrapper";
import { api } from "@/services/axios-instance";
import { useAuth } from "@/stores/auth";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const editNoteSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters long"),
  content: z.string().trim().min(3, "Content must be at least 3 characters long"),
  category: z.string().optional(),
});

type EditNoteInput = z.infer<typeof editNoteSchema>;

interface NoteDto {
  id: string;
  title: string;
  content: string;
  category: string | null;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

const EditNotePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);

  const form = useForm<EditNoteInput>({
    resolver: zodResolver(editNoteSchema),
    defaultValues: { title: "", content: "", category: "General" },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      if (!id || !user?.userId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await api.get<NoteDto>(`/users/${user.userId}/notes/${id}`);
        const note = res.data;
        form.reset({
          title: note.title,
          content: note.content,
          category: note.category ?? "General",
        });
      } catch (e) {
        setError("Failed to load note");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.userId]);

  const onSubmit = async (data: EditNoteInput) => {
    if (!id || !user?.userId) return;
    try {
      setSaving(true);
      // Follow the same endpoint pattern used elsewhere
      await api.put(`/users/${user.userId}/notes/${id}`, data);
      toast.success("Note updated", { description: "Your changes have been saved" });
      navigate(`/notes/${id}`);
    } catch (e) {
      toast.error("Update failed", { description: "Could not update this note" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-svh bg-background">
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={`/notes/${id}`}>View Note</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-72 w-full rounded-lg" />
            <div className="flex gap-3 justify-end">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">{error}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/">Back to Notes</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border">
            <CardHeader>
              <CardTitle>Edit Note</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Update the title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Update your note content..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t">
                    <Button type="button" variant="outline" onClick={() => navigate(`/notes/${id}`)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving} className="min-w-[120px]">
                      {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default EditNotePage;


