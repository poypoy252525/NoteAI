import CreateNoteForm from "../components/create-note-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateNotePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-svh">
      {/* Header with consistent styling */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft />
              </Button>
              <h1 className="text-2xl font-semibold">Create Note</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 lg:px-8 py-6">
        <CreateNoteForm />
      </main>
    </div>
  );
};

export default CreateNotePage;
