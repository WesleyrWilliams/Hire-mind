import { SparklesIcon } from '@heroicons/react/24/outline';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div>
            <div className="logo">
              <SparklesIcon className="icon-lg" style={{ display: 'inline', marginRight: '0.5rem' }} />
              HireMind ✨
            </div>
            <div className="tagline">
              Craft job-winning resumes with AI.
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
