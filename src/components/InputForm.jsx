import { useState } from 'react';
import { 
  UserIcon, 
  BriefcaseIcon, 
  CodeBracketIcon, 
  AcademicCapIcon,
  DocumentTextIcon,
  SpeakerWaveIcon 
} from '@heroicons/react/24/outline';

function InputForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    skills: '',
    experienceLevel: '',
    jobDescription: '',
    tone: 'Formal'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (type) => {
    onSubmit({ ...formData, type });
  };

  const isFormValid = formData.name && formData.jobTitle && formData.skills && formData.tone;

  return (
    <div className="card input-card">
      <div className="form-group">
        <h2 className="output-title mb-6">Create Your Professional Content</h2>
      </div>

      <div className="form-group">
        <label htmlFor="name" className="form-label">
          <UserIcon className="icon" />
          <span>Full Name</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="jobTitle" className="form-label">
          <BriefcaseIcon className="icon" />
          <span>Job Title</span>
        </label>
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          required
          className="form-input"
          placeholder="e.g., Software Engineer, Marketing Manager"
        />
      </div>

      <div className="form-group">
        <label htmlFor="skills" className="form-label">
          <CodeBracketIcon className="icon" />
          <span>Skills & Expertise</span>
        </label>
        <textarea
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          required
          className="form-textarea"
          placeholder="JavaScript, React, Python, Project Management, Leadership..."
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="experienceLevel" className="form-label">
          <AcademicCapIcon className="icon" />
          <span>Experience Level</span>
        </label>
        <select
          id="experienceLevel"
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Select experience level</option>
          <option value="Entry Level">Entry Level (0-2 years)</option>
          <option value="Mid Level">Mid Level (3-5 years)</option>
          <option value="Senior Level">Senior Level (6-10 years)</option>
          <option value="Executive Level">Executive Level (10+ years)</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="jobDescription" className="form-label">
          <DocumentTextIcon className="icon" />
          <span>Job Description (Optional)</span>
        </label>
        <textarea
          id="jobDescription"
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          className="form-textarea"
          placeholder="Paste the job description here to personalize your content..."
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="tone" className="form-label">
          <SpeakerWaveIcon className="icon" />
          <span>Personalize Tone</span>
        </label>
        <select
          id="tone"
          name="tone"
          value={formData.tone}
          onChange={handleChange}
          className="form-select"
        >
          <option value="Formal">Formal</option>
          <option value="Friendly">Friendly</option>
          <option value="Confident">Confident</option>
          <option value="Minimalist">Minimalist</option>
        </select>
      </div>

      <div className="btn-group">
        <button 
          type="button"
          onClick={() => handleSubmit('resume')}
          disabled={isLoading || !isFormValid}
          className="btn btn-primary btn-full"
        >
          {isLoading ? (
            <>
              <div className="spinner" style={{ width: '1rem', height: '1rem', margin: 0 }}></div>
              <span>Generating...</span>
            </>
          ) : (
            <span>Generate Resume</span>
          )}
        </button>
        
        <button 
          type="button"
          onClick={() => handleSubmit('cover-letter')}
          disabled={isLoading || !isFormValid}
          className="btn btn-secondary btn-full"
        >
          {isLoading ? (
            <>
              <div className="spinner" style={{ width: '1rem', height: '1rem', margin: 0 }}></div>
              <span>Generating...</span>
            </>
          ) : (
            <span>Generate Cover Letter</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default InputForm;
