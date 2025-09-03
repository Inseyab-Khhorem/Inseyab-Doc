import React, { useState } from 'react';
import { ExternalLink, Copy, CheckCircle, Globe, Settings } from 'lucide-react';

export function DeploymentGuide() {
  const [copied, setCopied] = useState(false);

  const envTemplate = `VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Globe className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Deploy to Netlify</h2>
      </div>

      <div className="space-y-6">
        <p className="text-gray-600">
          Follow these steps to deploy your Inseyab Doc app to Netlify:
        </p>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Connect to Netlify</h3>
              <p className="text-sm text-gray-600 mt-1">
                Push your code to GitHub, GitLab, or Bitbucket, then connect it to Netlify
              </p>
              <a
                href="https://app.netlify.com/start"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-2"
              >
                Open Netlify Deploy
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Configure Build Settings</h3>
              <div className="mt-2 bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700">Build command:</p>
                <code className="text-sm text-gray-900">npm run build</code>
                <p className="text-sm font-medium text-gray-700 mt-2">Publish directory:</p>
                <code className="text-sm text-gray-900">dist</code>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Add Environment Variables</h3>
              <p className="text-sm text-gray-600 mt-1">
                In Netlify dashboard, go to Site settings → Environment variables and add:
              </p>
              <div className="mt-2 relative">
                <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                  {envTemplate}
                </pre>
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-200 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              4
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Deploy</h3>
              <p className="text-sm text-gray-600 mt-1">
                Click "Deploy site" and Netlify will build and deploy your app automatically
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <Settings className="h-5 w-5 text-yellow-400 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Important Notes
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Make sure your Supabase project allows the Netlify domain in Auth settings</li>
                  <li>The netlify.toml file is already configured for proper routing</li>
                  <li>Environment variables must be set in Netlify dashboard, not in .env file</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}