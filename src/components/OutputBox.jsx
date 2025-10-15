import { ClipboardDocumentIcon, ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

function OutputBox({ content, onCopy, isLoading, contentType }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      onCopy && onCopy();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    
    const fileName = contentType === 'resume' 
      ? 'resume.txt' 
      : contentType === 'cover-letter' 
        ? 'cover-letter.txt' 
        : 'document.txt';
    
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading) {
    return (
      <div className="card output-card">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Generating your professional content...</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            This may take a few moments
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card output-card">
      <div className="output-container">
        <div className="output-header">
          <h3 className="output-title">
            {contentType === 'resume' ? 'Generated Resume' : 
             contentType === 'cover-letter' ? 'Generated Cover Letter' : 
             'AI Generated Content'}
          </h3>
          
          {content && (
            <div className="btn-group">
              <button
                onClick={handleCopy}
                className="btn btn-secondary"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <CheckIcon className="icon" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="icon" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleDownload}
                className="btn btn-secondary"
                title="Download as .txt file"
              >
                <ArrowDownTrayIcon className="icon" />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>

        {content ? (
          <div className="output-content">
            {content}
          </div>
        ) : (
          <div className="output-empty">
            <DocumentTextIcon className="output-empty-icon" />
            <p>Your AI-generated content will appear here</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Fill out the form and click "Generate Resume" or "Generate Cover Letter" to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputBox;
