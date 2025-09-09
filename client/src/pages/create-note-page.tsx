import CreateNoteForm from "../components/create-note-form";

const CreateNotePage = () => {
  return (
    <div className="flex flex-col min-h-svh">
      <header className="p-4 lg:px-8 border-b">
        <span className="text-2xl font-semibold">Create Note</span>
      </header>
      <main className="p-4 lg:px-8 flex-1 max-w-4xl mx-auto w-full">
        <CreateNoteForm />
      </main>
    </div>
  );
};

export default CreateNotePage;
