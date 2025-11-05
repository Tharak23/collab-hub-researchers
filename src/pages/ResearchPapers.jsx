import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Plus, Search, BookOpen, Star, Eye, Download, MessageSquare, User, X, Upload, FileText } from 'lucide-react';
import './ResearchPapers.css';

const ResearchPapers = () => {
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [newPaper, setNewPaper] = useState({
    title: '',
    abstract: '',
    authors: '',
    keywords: '',
    category: 'computer-science',
    file: null,
    fileName: ''
  });
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = () => {
    // Load GLOBAL papers (not user-specific)
    const storedPapers = localStorage.getItem('globalResearchPapers');
    if (storedPapers) {
      setPapers(JSON.parse(storedPapers));
    }
  };

  const savePapers = (papersToSave) => {
    localStorage.setItem('globalResearchPapers', JSON.stringify(papersToSave));
    setPapers(papersToSave);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPaper({
          ...newPaper,
          file: reader.result, // base64 string
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPaper = (e) => {
    e.preventDefault();
    
    const paperData = {
      id: `paper_${Date.now()}`,
      title: newPaper.title,
      abstract: newPaper.abstract,
      authors: newPaper.authors.split(',').map(a => a.trim()).filter(a => a) || [`${user?.firstName} ${user?.lastName}`],
      keywords: newPaper.keywords.split(',').map(k => k.trim()).filter(k => k),
      category: newPaper.category,
      uploadedBy: user?.id || '',
      uploadedByName: `${user?.firstName} ${user?.lastName}`,
      file: newPaper.file, // Store base64 file
      fileName: newPaper.fileName,
      reviews: [],
      views: 0,
      downloads: 0,
      createdAt: new Date().toISOString()
    };

    const updatedPapers = [...papers, paperData];
    savePapers(updatedPapers);

    setNewPaper({
      title: '',
      abstract: '',
      authors: '',
      keywords: '',
      category: 'computer-science',
      file: null,
      fileName: ''
    });
    setShowAddDialog(false);
  };

  const handleViewPaper = (paper) => {
    // Increment views
    const updatedPapers = papers.map(p => 
      p.id === paper.id ? { ...p, views: p.views + 1 } : p
    );
    savePapers(updatedPapers);
    
    const updatedPaper = updatedPapers.find(p => p.id === paper.id);
    setSelectedPaper(updatedPaper);
    setShowViewDialog(true);
  };

  const handleDownload = (paper) => {
    if (!paper.file) {
      alert('No file attached to this paper');
      return;
    }

    // Increment downloads
    const updatedPapers = papers.map(p => 
      p.id === paper.id ? { ...p, downloads: p.downloads + 1 } : p
    );
    savePapers(updatedPapers);

    // Download file
    const link = document.createElement('a');
    link.href = paper.file;
    link.download = paper.fileName || 'research-paper.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    
    const review = {
      id: `rev_${Date.now()}`,
      reviewerId: user?.id || '',
      reviewerName: `${user?.firstName} ${user?.lastName}`,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date().toISOString()
    };

    const updatedPapers = papers.map(paper => 
      paper.id === selectedPaper.id
        ? { ...paper, reviews: [...paper.reviews, review] }
        : paper
    );

    savePapers(updatedPapers);

    setNewReview({ rating: 5, comment: '' });
    setShowReviewDialog(false);
    
    const updatedPaper = updatedPapers.find(p => p.id === selectedPaper.id);
    setSelectedPaper(updatedPaper);
  };

  const averageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    return (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);
  };

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || paper.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="papers-page">
      <Navbar />
      <div className="papers-container">
        <div className="papers-header">
          <div>
            <h1>Research Papers</h1>
            <p>Browse, upload, and review academic research papers</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddDialog(true)}>
            <Plus size={18} />
            Add Paper
          </button>
        </div>

        <div className="papers-filters">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search papers by title, author, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="computer-science">Computer Science</option>
            <option value="environmental-science">Environmental Science</option>
            <option value="physics">Physics</option>
            <option value="biology">Biology</option>
            <option value="chemistry">Chemistry</option>
            <option value="mathematics">Mathematics</option>
            <option value="engineering">Engineering</option>
          </select>
        </div>

        <div className="papers-grid">
          {filteredPapers.map((paper) => (
            <div key={paper.id} className="paper-card" onClick={() => handleViewPaper(paper)}>
              <div className="paper-header">
                <span className={`badge badge-${paper.category}`}>
                  {paper.category.replace('-', ' ')}
                </span>
                {paper.reviews.length > 0 && (
                  <div className="paper-rating">
                    <Star size={16} fill="var(--warning)" color="var(--warning)" />
                    <span>{averageRating(paper.reviews)}</span>
                  </div>
                )}
              </div>
              {paper.fileName && (
                <div className="paper-file-badge">
                  <FileText size={14} />
                  <span>PDF</span>
                </div>
              )}
              <h3>{paper.title}</h3>
              <p className="paper-abstract">{paper.abstract}</p>
              <div className="paper-authors">
                <User size={14} />
                <span>{paper.authors.slice(0, 2).join(', ')}{paper.authors.length > 2 && ` +${paper.authors.length - 2}`}</span>
              </div>
              <div className="paper-uploaded-by">
                Uploaded by: {paper.uploadedByName}
              </div>
              <div className="paper-keywords">
                {paper.keywords.slice(0, 3).map((keyword, idx) => (
                  <span key={idx} className="keyword">{keyword}</span>
                ))}
                {paper.keywords.length > 3 && <span className="keyword">+{paper.keywords.length - 3}</span>}
              </div>
              <div className="paper-footer">
                <div className="paper-stat">
                  <Eye size={16} />
                  <span>{paper.views}</span>
                </div>
                <div className="paper-stat">
                  <Download size={16} />
                  <span>{paper.downloads}</span>
                </div>
                <div className="paper-stat">
                  <MessageSquare size={16} />
                  <span>{paper.reviews.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPapers.length === 0 && (
          <div className="empty-state">
            <BookOpen size={48} />
            <h3>No papers found</h3>
            <p>Add your first research paper to get started</p>
            <button className="btn btn-primary" onClick={() => setShowAddDialog(true)}>
              <Plus size={18} />
              Add Paper
            </button>
          </div>
        )}
      </div>

      {/* Add Paper Dialog */}
      {showAddDialog && (
        <div className="modal-overlay" onClick={() => setShowAddDialog(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Research Paper</h2>
              <button onClick={() => setShowAddDialog(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddPaper} className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newPaper.title}
                  onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Abstract *</label>
                <textarea
                  value={newPaper.abstract}
                  onChange={(e) => setNewPaper({ ...newPaper, abstract: e.target.value })}
                  rows="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>Upload PDF (Optional)</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    id="file-input"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    <Upload size={18} />
                    {newPaper.fileName || 'Choose File'}
                  </button>
                  {newPaper.fileName && (
                    <span className="file-name">{newPaper.fileName}</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Authors (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Dr. John Smith, Prof. Jane Doe"
                  value={newPaper.authors}
                  onChange={(e) => setNewPaper({ ...newPaper, authors: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Keywords (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Machine Learning, AI"
                  value={newPaper.keywords}
                  onChange={(e) => setNewPaper({ ...newPaper, keywords: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newPaper.category}
                  onChange={(e) => setNewPaper({ ...newPaper, category: e.target.value })}
                >
                  <option value="computer-science">Computer Science</option>
                  <option value="environmental-science">Environmental Science</option>
                  <option value="physics">Physics</option>
                  <option value="biology">Biology</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="engineering">Engineering</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Paper Dialog */}
      {showViewDialog && selectedPaper && (
        <div className="modal-overlay" onClick={() => setShowViewDialog(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedPaper.title}</h2>
              <button onClick={() => setShowViewDialog(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {selectedPaper.fileName && (
                <div className="paper-actions-bar">
                  <button className="btn btn-primary" onClick={() => handleDownload(selectedPaper)}>
                    <Download size={18} />
                    Download {selectedPaper.fileName}
                  </button>
                </div>
              )}
              <div className="paper-detail-section">
                <h4>Abstract</h4>
                <p>{selectedPaper.abstract}</p>
              </div>
              <div className="paper-detail-section">
                <h4>Authors</h4>
                <p>{selectedPaper.authors.join(', ')}</p>
              </div>
              <div className="paper-detail-section">
                <h4>Keywords</h4>
                <div className="paper-keywords">
                  {selectedPaper.keywords.map((keyword, idx) => (
                    <span key={idx} className="keyword">{keyword}</span>
                  ))}
                </div>
              </div>
              <div className="paper-detail-section">
                <h4>Reviews ({selectedPaper.reviews.length})</h4>
                {selectedPaper.reviews.length > 0 ? (
                  <div className="reviews-list">
                    {selectedPaper.reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <span className="review-author">{review.reviewerName}</span>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i < review.rating ? 'var(--warning)' : 'none'}
                                color={i < review.rating ? 'var(--warning)' : 'var(--gray-300)'}
                              />
                            ))}
                          </div>
                        </div>
                        <p>{review.comment}</p>
                        <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No reviews yet. Be the first to review!</p>
                )}
                <button 
                  className="btn btn-primary" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowViewDialog(false);
                    setShowReviewDialog(true);
                  }}
                  style={{ marginTop: '16px' }}
                >
                  <Star size={18} />
                  Add Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      {showReviewDialog && selectedPaper && (
        <div className="modal-overlay" onClick={() => setShowReviewDialog(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Review</h2>
              <button onClick={() => setShowReviewDialog(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddReview} className="modal-body">
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className={`rating-btn ${newReview.rating >= rating ? 'active' : ''}`}
                      onClick={() => setNewReview({ ...newReview, rating })}
                    >
                      <Star size={24} fill={newReview.rating >= rating ? 'var(--warning)' : 'none'} />
                      <span>{rating}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Comment *</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows="5"
                  placeholder="Share your thoughts on this paper..."
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReviewDialog(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchPapers;
