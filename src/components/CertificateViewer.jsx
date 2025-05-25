"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Download, 
  ExternalLink, 
  Share2, 
  Maximize2, 
  Minimize2,
  Award,
  Calendar,
  User,
  CheckCircle,
  Copy,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";

const CertificateViewer = ({ 
  isOpen, 
  onClose, 
  certificateUrl, 
  courseName, 
  completionDate,
  userName,
  certificateId,
  showShareOptions = true,
  showUserInfo = true
}) => {
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const modalRef = useRef(null);
  const shareMenuRef = useRef(null);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setImageError(false);
      setImageLoaded(false);
    }
  }, [isOpen, certificateUrl]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (certificateUrl) {
      try {
        const response = await fetch(certificateUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${courseName.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate_${userName?.replace(/[^a-zA-Z0-9]/g, '_') || 'User'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        // Fallback to direct link
        window.open(certificateUrl, '_blank');
      }
    }
  };

  const handleOpenInNewTab = () => {
    if (certificateUrl) {
      window.open(certificateUrl, '_blank');
    }
  };

  const handleShare = (platform) => {
    const shareText = `I just completed "${courseName}" and earned my certificate! 🎓`;
    const shareUrl = certificateUrl;
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(certificateUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
    setShowShareMenu(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleImageLoad = () => {
    setLoading(false);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setImageError(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isFullscreen ? 'p-0' : 'p-4'
        }`}
        onClick={(e) => e.target === modalRef.current && onClose()}
      >
        <div 
          className={`bg-white rounded-lg shadow-2xl w-full transition-all duration-300 ${
            isFullscreen 
              ? 'h-full max-w-none rounded-none' 
              : 'max-w-6xl max-h-[95vh] lg:max-h-[90vh]'
          } overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Certificate of Completion
                </h3>
                <p className="text-blue-600 font-semibold">{courseName}</p>
                
                {showUserInfo && (
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    {userName && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{userName}</span>
                      </div>
                    )}
                    {completionDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(completionDate)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {showShareOptions && (
                <div className="relative" ref={shareMenuRef}>
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                    title="Share Certificate"
                  >
                    <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                  
                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48 z-10">
                      <button
                        onClick={handleCopyLink}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                      >
                        <Copy className="w-4 h-4" />
                        {copySuccess ? 'Copied!' : 'Copy Link'}
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                      >
                        <Linkedin className="w-4 h-4" />
                        Share on LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                      >
                        <Twitter className="w-4 h-4" />
                        Share on Twitter
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                      >
                        <Facebook className="w-4 h-4" />
                        Share on Facebook
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={handleDownload}
                className="p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                title="Download Certificate"
              >
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              
              <button
                onClick={handleOpenInNewTab}
                className="p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 group"
                title="Open in New Tab"
              >
                <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              
              <button
                onClick={toggleFullscreen}
                className="p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 group"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                ) : (
                  <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
              </button>
              
              <button
                onClick={onClose}
                className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                title="Close"
              >
                <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Certificate Content */}
          <div className={`bg-gray-50 relative overflow-hidden ${isFullscreen ? 'h-full' : 'h-96 lg:h-[500px]'}`}>
            {certificateUrl ? (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                {/* Loading State */}
                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                    <p className="text-gray-600 animate-pulse">Loading your certificate...</p>
                  </div>
                )}
                
                {/* Error State */}
                {imageError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                    <div className="p-6 bg-red-50 rounded-full mb-4">
                      <X className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-red-600 font-semibold mb-2">Failed to load certificate</p>
                    <p className="text-gray-600 text-sm mb-4">Please try again or download directly</p>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Download Instead
                    </button>
                  </div>
                )}
                
                {/* Certificate Image */}
                <img
                  src={certificateUrl}
                  alt="Certificate"
                  className={`max-w-full max-h-full object-contain rounded-lg shadow-lg transition-all duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    maxWidth: isFullscreen ? '95%' : '100%',
                    maxHeight: isFullscreen ? '95%' : '100%'
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                
                {/* Success indicator when loaded */}
                {imageLoaded && !imageError && (
                  <div className="absolute top-6 right-6 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2 animate-fade-in shadow-md">
                    <CheckCircle className="w-4 h-4" />
                    Verified Certificate
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="p-6 bg-gray-100 rounded-full mb-4">
                  <Award className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-lg font-semibold mb-2">No certificate available</p>
                <p className="text-sm">Complete the course to generate your certificate</p>
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t bg-gray-50">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {certificateId && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">ID:</span>
                  <code className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">{certificateId}</code>
                </div>
              )}
              <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
              <span className="text-xs">Generated by AI Learning Platform</span>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificateViewer;