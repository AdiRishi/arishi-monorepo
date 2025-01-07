import { Button } from '@arishi/ui/components/button';
import { Textarea } from '@arishi/ui/components/textarea';
import { useState } from 'react';
import { Route } from './/+types/json-formatter';

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Json Formatter Utility' },
    { name: 'description', content: 'A minimalistic local only json formatter' },
  ];
};

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input) as Record<string, unknown>;
      setOutput(JSON.stringify(parsed, null, 4));
      setError('');
    } catch (e) {
      console.error(e);
      setError('Invalid JSON input');
      setOutput('');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="p-8">
          <h1 className="mb-6 text-3xl font-semibold text-gray-800">JSON Formatter</h1>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your JSON here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-48 w-full rounded-md border border-gray-200 bg-gray-50 p-4 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={formatJSON} className="w-full">
              Format JSON
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {output && (
              <pre className="overflow-x-auto rounded-md bg-gray-50 p-4">
                <code className="font-mono text-sm text-gray-800">{output}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
