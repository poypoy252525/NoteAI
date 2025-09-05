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
import { Textarea } from "./ui/textarea";
import { api } from "@/services/axios-instance";
import { useAuth } from "@/stores/auth";

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

  const onSubmit = async (data: z.infer<typeof createNoteSchema>) => {
    try {
      const response = await api.post(`/users/${user?.userId}/notes`, data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your title" {...field} />
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
                  <Textarea
                    placeholder="Enter your content"
                    rows={20}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end py-4">
          <Button type="submit">Create Note</Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateNoteForm;
