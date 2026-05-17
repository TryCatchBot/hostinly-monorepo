'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText,
  Loader2,
  MapPin,
  MessageSquare,
  Edit2,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface Interview {
  id: string;
  hostId: string;
  candidateId: string;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  date: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  host: { 
    name: string; 
    email: string;
    avatar?: string;
    phone?: string;
    city?: string;
  };
  candidate: { 
    name: string; 
    email: string;
    avatar?: string;
    phone?: string;
    city?: string;
  };
}

export default function InterviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    const fetchInterviewDetail = async () => {
      if (!id) return;
      try {
        const token = localStorage.getItem('hostinly_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.success) {
          setInterview(result.data);
          if (result.data.date) {
            const d = new Date(result.data.date);
            setEditDate(d.toISOString().split('T')[0]);
            setEditTime(d.toTimeString().split(' ')[0].slice(0, 5));
          }
          setEditNotes(result.data.notes || '');
        } else {
          toast.error(result.error || 'Failed to load interview details');
        }
      } catch (error) {
        toast.error('Failed to load interview details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviewDetail();
  }, [id]);

  const updateStatus = async (status: string) => {
    if (!interview) return;
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/${interview.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const result = await response.json();
      if (result.success) {
        setInterview({ ...interview, status: status as any });
        toast.success(`Interview ${status.toLowerCase()} successfully`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateInterview = async () => {
    if (!interview || !editDate || !editTime) return;
    setIsUpdating(true);
    try {
      const combinedDateTime = new Date(`${editDate}T${editTime}`);
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/${interview.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          date: combinedDateTime.toISOString(),
          notes: editNotes
        })
      });
      const result = await response.json();
      if (result.success) {
        setInterview({ 
          ...interview, 
          date: combinedDateTime.toISOString(),
          notes: editNotes
        });
        setShowEditModal(false);
        toast.success('Interview updated successfully');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to update interview');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteInterview = async () => {
    if (!interview) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/${interview.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Interview deleted successfully');
        router.push('/dashboard/interviews');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to delete interview');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground animate-pulse">Loading interview details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!interview) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Interview Not Found</h2>
          <Button onClick={() => router.push('/dashboard/interviews')}>
            Back to Interviews
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const otherPerson = user?.id === interview.hostId ? interview.candidate : interview.host;
  const isHost = user?.id === interview.hostId;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity font-medium"
          >
            <ArrowLeft size={20} />
            Back to Interviews
          </button>
          
          <div className="flex items-center gap-3">
            {interview.status === 'PENDING' && !isHost && (
              <>
                <Button 
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold"
                  onClick={() => updateStatus('SCHEDULED')}
                >
                  {isUpdating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                  Accept Request
                </Button>
                <Button 
                  variant="destructive" 
                  disabled={isUpdating}
                  className="font-bold"
                  onClick={() => updateStatus('CANCELLED')}
                >
                  Reject
                </Button>
              </>
            )}
            
            {isHost && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="font-bold"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  className="font-bold"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              </div>
            )}

            {(interview.status === 'SCHEDULED' || (interview.status === 'PENDING' && isHost)) && !isHost && (
              <Button 
                variant="outline" 
                disabled={isUpdating}
                className="font-bold border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => updateStatus('CANCELLED')}
              >
                Cancel Interview
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-background border border-border rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-foreground">Interview Session</h1>
                  <p className="text-muted-foreground text-sm">Reference: {interview.id.split('-')[0].toUpperCase()}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  interview.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                  interview.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  interview.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {interview.status}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest">Date</p>
                      <p className="text-foreground font-semibold">
                        {new Date(interview.date).toLocaleDateString('en-GB', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest">Time</p>
                      <p className="text-foreground font-semibold">
                        {new Date(interview.date).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {interview.notes && (
                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <FileText size={18} className="text-primary" />
                    Notes
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-xl text-sm text-muted-foreground leading-relaxed">
                    {interview.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Participation Details */}
            <div className="bg-background border border-border rounded-2xl p-8 shadow-sm">
              <h3 className="font-bold text-foreground mb-6">Participants</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4 p-4 rounded-xl border border-border/50">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Property Owner</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                      {interview.host.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{interview.host.name}</p>
                      <p className="text-xs text-muted-foreground">Host</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-xl border border-border/50">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Candidate</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                      {interview.candidate.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{interview.candidate.name}</p>
                      <p className="text-xs text-muted-foreground">Co-Host Expert</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
                <User size={18} className="text-primary" />
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Name</p>
                  <p className="font-bold text-foreground">{otherPerson.name}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</p>
                  <a href={`mailto:${otherPerson.email}`} className="font-bold text-primary hover:underline flex items-center gap-2">
                    <Mail size={14} />
                    {otherPerson.email}
                  </a>
                </div>

                {otherPerson.phone && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Phone Number</p>
                    <a href={`tel:${otherPerson.phone}`} className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2">
                      <Phone size={14} />
                      {otherPerson.phone}
                    </a>
                  </div>
                )}

                {otherPerson.city && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Location</p>
                    <p className="font-bold text-foreground flex items-center gap-2">
                      <MapPin size={14} />
                      {otherPerson.city}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <Button className="w-full flex items-center justify-center gap-2 font-bold py-3 shadow-lg" style={{
                  background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                  color: '#ffffff',
                }}>
                  <MessageSquare size={18} />
                  Send Message
                </Button>
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Interview Tips</h4>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                  Ensure you have a stable internet connection if it's a video call.
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                  Review property details and services required beforehand.
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                  Be prepared to discuss experience and specific requirements.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-background rounded-2xl shadow-xl max-w-md w-full border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Edit Interview</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-muted-foreground uppercase mb-2">Select Date</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground uppercase mb-2">Select Time</label>
                <input
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground uppercase mb-2">Notes</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>
            <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
              <Button
                variant="outline"
                className="flex-1 font-bold"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 font-bold shadow-lg"
                disabled={!editDate || !editTime || isUpdating}
                onClick={handleUpdateInterview}
                style={{
                  background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                  color: '#ffffff',
                }}
              >
                {isUpdating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl p-8 max-w-sm w-full border border-border shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-destructive mb-4">
              <AlertTriangle size={28} />
              <h2 className="text-2xl font-bold">Delete Interview</h2>
            </div>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Are you sure you want to delete this interview session? This action cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="destructive"
                className="w-full py-3 font-bold text-lg shadow-lg"
                onClick={handleDeleteInterview}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Interview'}
              </Button>
              <Button
                variant="ghost"
                className="w-full py-3 font-semibold"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Go back
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
