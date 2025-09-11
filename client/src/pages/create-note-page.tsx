import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CreateNoteForm from "@/components/create-note-form";

const CreateNotePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-svh bg-background">
      <main className="flex-1 container max-w-4xl mx-auto w-full px-4 py-6">
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
        <CreateNoteForm />
      </main>
    </div>
  );
};

export default CreateNotePage;
