import CreateNoteForm from "../components/create-note-form";

const CreateNotePage = () => {
  return (
    <main>
      <header className="p-4">
        <span className="text-2xl font-semibold">Create Note</span>
      </header>
      <main className="p-4">
        <CreateNoteForm />
      </main>
      <footer className="p-4"></footer>
    </main>
  );
};

export default CreateNotePage;
