import { useState, useCallback } from 'react';
import InputForm from './components/InputForm';
import OutputBox from './components/OutputBox';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [generatedContent, setGeneratedContent] = useState('');
  const [contentType, setContentType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const generateContent = useCallback(async (formData) => {
    setIsLoading(true);
    setGeneratedContent('');
    setContentType(formData.type);

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.content) {
        throw new Error('Invalid response format from server');
      }

      setGeneratedContent(data.content);
      showToast(
        `${formData.type === 'resume' ? 'Resume' : 'Cover letter'} generated successfully!`, 
        'success'
      );

      // Save to localStorage for temporary storage
      const savedContent = {
        content: data.content,
        type: formData.type,
        formData: formData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('hiremind_last_generated', JSON.stringify(savedContent));

    } catch (error) {
      console.error('Error generating content:', error);
      
      let errorMessage = 'Failed to generate content. Please try again.';
      
      if (error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your connection and try again.';
      } else if (error.message.includes('API key')) {
        errorMessage = 'API configuration error. Please contact support.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const handleCopy = useCallback(() => {
    showToast('Content copied to clipboard!', 'success');
  }, [showToast]);

  // Load last generated content on component mount
  useState(() => {
    try {
      const saved = localStorage.getItem('hiremind_last_generated');
      if (saved) {
        const parsedSaved = JSON.parse(saved);
        // Only load if it's from today
        const savedDate = new Date(parsedSaved.timestamp);
        const today = new Date();
        if (savedDate.toDateString() === today.toDateString()) {
          setGeneratedContent(parsedSaved.content);
          setContentType(parsedSaved.type);
        }
      }
    } catch (error) {
      console.error('Error loading saved content:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh' }}>
        <Header />
        
        <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="two-column-layout">
            {/* Left Column - Input Form */}
            <div>
              <InputForm onSubmit={generateContent} isLoading={isLoading} />
            </div>
            
            {/* Right Column - Output */}
            <div>
              <OutputBox 
                content={generatedContent}
                contentType={contentType}
                onCopy={handleCopy}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>
        
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
