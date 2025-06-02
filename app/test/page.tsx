'use client';

import { useState } from 'react';

export default function TestPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testVideo = async () => {
    if (!url) return;
    
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Network error', details: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">YouTube Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              YouTube URL:
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <button
            onClick={testVideo}
            disabled={loading || !url}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Video'}
          </button>
          
          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-2">Result:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 