import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "./ui/form";
import { Input } from "./ui/input";
import { api } from "@/services/axios-instance";
import { useAuth } from "@/stores/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "./editor/rich-text-editor-wrapper";

const createNoteSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters long"),
  content: z
    .string()
    .trim()
    .min(3, "Content must be at least 3 characters long"),
  category: z.string().optional(),
});

const CreateNoteForm = () => {
  const form = useForm<z.infer<typeof createNoteSchema>>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "General",
    },
  });
  const user = useAuth((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof createNoteSchema>) => {
    try {
      setLoading(true);
      await api.post(`/users/${user?.userId}/notes`, data);
      form.reset();
      navigate("/");
      toast.success("Note created", {
        description: "Your note has been created successfully",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "An error occurred while creating your note",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a descriptive title for your note"
                      className="text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Category
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Work, Personal, Ideas"
                      className="text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Content
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write your note content here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              className="sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="sm:order-2 min-w-[120px]"
            >
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Create Note
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateNoteForm;
