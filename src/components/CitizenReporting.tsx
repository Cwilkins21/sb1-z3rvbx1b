import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, MapPin, Clock, Upload, X, CheckCircle, 
  AlertTriangle, FileText, Loader, Eye, Trash2, Plus
} from 'lucide-react';

interface ViolationReport {
  id: string;
  photos: File[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: Date;
  notes?: string;
  status: 'pending' | 'analyzing' | 'approved' | 'rejected' | 'duplicate';
  aiAnalysis?: {
    violationDetected: boolean;
    violationType?: string;
    confidence: number;
    reasoning: string;
    licensePlate?: string;
  };
}

interface CitizenReportingProps {
  onSubmitReport: (report: ViolationReport) => void;
}

export const CitizenReporting: React.FC<CitizenReportingProps> = ({
  onSubmitReport
}) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [recentReports, setRecentReports] = useState<ViolationReport[]>([]);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Get current location automatically
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)} - West Palm Beach, FL`
          });
        },
        (error) => {
          console.log('Location access denied');
          setCurrentLocation({
            lat: 26.7153,
            lng: -80.0533,
            address: 'Downtown West Palm Beach, FL'
          });
        }
      );
    }
  }, []);

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newPhotos = Array.from(files).filter(file => {
      return file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024; // 10MB limit
    });
    
    setPhotos(prev => [...prev, ...newPhotos].slice(0, 4)); // Max 4 photos
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (photos.length < 2) {
      alert('Please upload at least 2 photos showing different angles of the violation.');
      return;
    }

    if (!currentLocation) {
      alert('Location is required. Please enable location services.');
      return;
    }

    setIsSubmitting(true);
    setAnalysisStep('Checking for duplicates...');

    const report: ViolationReport = {
      id: crypto.randomUUID(),
      photos,
      location: currentLocation,
      timestamp: new Date(),
      notes: notes.trim() || undefined,
      status: 'analyzing'
    };

    // Step 1: Duplicate check
    setTimeout(() => {
      const isDuplicate = checkForDuplicate(report);
      
      if (isDuplicate) {
        report.status = 'duplicate';
        setRecentReports(prev => [report, ...prev.slice(0, 4)]);
        setIsSubmitting(false);
        setAnalysisStep('');
        resetForm();
        return;
      }

      // Step 2: AI Analysis
      setAnalysisStep('AI analyzing photos...');
      
      setTimeout(async () => {
        const aiAnalysis = await simulateAIAnalysis(photos);
        report.aiAnalysis = aiAnalysis;
        report.status = aiAnalysis.violationDetected ? 'approved' : 'rejected';
        
        setRecentReports(prev => [report, ...prev.slice(0, 4)]);
        onSubmitReport(report);
        
        setIsSubmitting(false);
        setAnalysisStep('');
        resetForm();
      }, 3000);
    }, 2000);
  };

  const checkForDuplicate = (report: ViolationReport): boolean => {
    // Simulate duplicate check - in production, check against database
    const recentTime = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
    
    return recentReports.some(existing => {
      const sameLocation = Math.abs(existing.location.lat - report.location.lat) < 0.001 &&
                          Math.abs(existing.location.lng - report.location.lng) < 0.001;
      const recentSubmission = existing.timestamp > recentTime;
      
      return sameLocation && recentSubmission;
    });
  };

  const simulateAIAnalysis = async (photos: File[]): Promise<ViolationReport['aiAnalysis']> => {
    // Simulate AI processing steps
    const steps = [
      'Detecting license plates...',
      'Analyzing parking signs...',
      'Checking curb markings...',
      'Measuring clearances...',
      'Finalizing analysis...'
    ];

    for (const step of steps) {
      setAnalysisStep(step);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    // Mock AI analysis results
    const violations = [
      'Fire hydrant blocking (15ft clearance required)',
      'Handicap space violation (no permit displayed)',
      'No parking zone violation',
      'Expired meter violation',
      'Loading zone violation (outside permitted hours)',
      'Crosswalk blocking',
      'Driveway blocking',
      'Red curb violation'
    ];
    
    const isViolation = Math.random() > 0.25; // 75% chance of detecting violation
    const licensePlates = ['ABC123FL', 'XYZ789FL', 'DEF456FL', 'GHI012FL'];
    
    return {
      violationDetected: isViolation,
      violationType: isViolation ? violations[Math.floor(Math.random() * violations.length)] : undefined,
      confidence: Math.random() * 0.25 + 0.75, // 75-100% confidence
      licensePlate: isViolation ? licensePlates[Math.floor(Math.random() * licensePlates.length)] : undefined,
      reasoning: isViolation 
        ? 'Vehicle clearly violates posted parking regulations. License plate visible and location confirmed via GPS coordinates.'
        : 'No clear parking violation detected in submitted photos. Vehicle appears to be legally parked within regulations.'
    };
  };

  const resetForm = () => {
    setPhotos([]);
    setNotes('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      case 'duplicate': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzing': return <Loader className="h-4 w-4 animate-spin" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      case 'duplicate': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusMessage = (report: ViolationReport) => {
    switch (report.status) {
      case 'approved':
        return 'Thank you for your report. The violation has been confirmed and forwarded to enforcement.';
      case 'rejected':
        return 'After analysis, no parking violation was detected for this submission.';
      case 'duplicate':
        return 'A report for this vehicle has already been submitted recently. Thank you for your diligence.';
      default:
        return 'Report is being processed...';
    }
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Camera className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Report Parking Violation</h2>
              <p className="text-sm text-gray-600">AI-powered violation detection system</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Quick Guidelines</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Upload 2-4 photos from different angles</li>
              <li>• Ensure license plate is clearly visible</li>
              <li>• Include parking signs or markings in photos</li>
              <li>• AI will analyze and determine if citation is warranted</li>
            </ul>
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Photos</h3>
          
          {/* Photo Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Violation photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowPreview(URL.createObjectURL(photo))}
                  className="absolute bottom-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
            
            {/* Add Photo Buttons */}
            {photos.length < 4 && (
              <>
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  <Camera className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Take Photo</span>
                </button>
                
                {photos.length < 3 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <Upload className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Upload Photo</span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handlePhotoUpload(e.target.files)}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handlePhotoUpload(e.target.files)}
            className="hidden"
          />

          {/* Photo Count */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{photos.length}/4 photos uploaded</span>
            {photos.length >= 2 && (
              <span className="text-green-600 font-medium">✓ Minimum requirement met</span>
            )}
          </div>
        </div>

        {/* Location & Time */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Time</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Current Location</p>
                <p className="text-sm text-gray-600">
                  {currentLocation?.address || 'Getting location...'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Timestamp</p>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes (Optional)</h3>
          
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the violation or add any additional context..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {notes.length}/500 characters
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <button
            onClick={handleSubmit}
            disabled={photos.length < 2 || isSubmitting || !currentLocation}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                {analysisStep || 'Processing...'}
              </>
            ) : (
              <>
                <Camera className="h-5 w-5 mr-2" />
                Submit Violation Report
              </>
            )}
          </button>
          
          {photos.length < 2 && (
            <p className="text-center text-sm text-red-600 mt-2">
              Please upload at least 2 photos to submit
            </p>
          )}
        </div>

        {/* Recent Reports */}
        {recentReports.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
            
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1 capitalize">{report.status}</span>
                        </span>
                        {report.aiAnalysis?.licensePlate && (
                          <span className="ml-2 text-sm font-mono text-gray-600">
                            {report.aiAnalysis.licensePlate}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {report.timestamp.toLocaleString()}
                      </p>
                      
                      {report.aiAnalysis?.violationType && (
                        <p className="text-sm font-medium text-red-600 mb-2">
                          {report.aiAnalysis.violationType}
                        </p>
                      )}
                      
                      <p className="text-sm text-gray-700">
                        {getStatusMessage(report)}
                      </p>
                      
                      {report.aiAnalysis && (
                        <div className="mt-2 text-xs text-gray-500">
                          Confidence: {(report.aiAnalysis.confidence * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        {report.photos.length} photos
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Photo Preview Modal */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setShowPreview(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={showPreview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <button
                  onClick={() => setShowPreview(null)}
                  className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};