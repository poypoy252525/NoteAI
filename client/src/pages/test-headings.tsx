const TestHeadings = () => {
  const sampleHTML = `
    <h1>This is heading one</h1>
    <h2>This is heading two</h2>
    <h3>This is heading three</h3>
    <h4>This is heading four</h4>
    <h5>This is heading five</h5>
    <h6>This is heading six</h6>
    <p>This is a paragraph</p>
  `;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Raw HTML:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
          {sampleHTML}
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">With Prose Classes (Same as Note Details):</h2>
        <div
          className="prose prose-lg prose-slate dark:prose-invert max-w-none 
            prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-2
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-2
            prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-2 prose-h3:mt-2
            prose-h4:text-lg prose-h4:font-semibold prose-h4:mb-2 prose-h4:mt-2
            prose-h5:text-base prose-h5:font-semibold prose-h5:mb-1 prose-h5:mt-1
            prose-h6:text-sm prose-h6:font-semibold prose-h6:mb-1 prose-h6:mt-1"
          dangerouslySetInnerHTML={{ __html: sampleHTML }}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Direct Classes:</h2>
        <div>
          <h1 className="text-3xl font-bold mb-4 mt-2">This is heading one</h1>
          <h2 className="text-2xl font-semibold mb-3 mt-2">This is heading two</h2>
          <h3 className="text-xl font-semibold mb-2 mt-2">This is heading three</h3>
          <h4 className="text-lg font-semibold mb-2 mt-2">This is heading four</h4>
          <h5 className="text-base font-semibold mb-1 mt-1">This is heading five</h5>
          <h6 className="text-sm font-semibold mb-1 mt-1">This is heading six</h6>
          <p>This is a paragraph</p>
        </div>
      </div>
    </div>
  );
};

export default TestHeadings;
