'use client';
export const dynamic = "force-dynamic";

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  History,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface Interview {
  id: string;
  hostId: string;
  candidateId: string;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  date: string | null;
  notes: string | null;
  createdAt: string;
  host: { name: string; email: string; userType: string };
  candidate: { name: string; email: string; userType: string };
}

export default function InterviewsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('hostinly_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.success) {
          setInterviews(result.data);
        }
      } catch (error) {
        toast.error('Failed to load interviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock size={12} /> Scheduled</span>;
      case 'COMPLETED':
        return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 size={12} /> Completed</span>;
      case 'CANCELLED':
        return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertCircle size={12} /> Pending</span>;
    }
  };

  const upcomingInterviews = interviews.filter(i => i.status === 'SCHEDULED' || i.status === 'PENDING');
  const pastInterviews = interviews.filter(i => i.status === 'COMPLETED' || i.status === 'CANCELLED');

  const updateInterviewStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const result = await response.json();
      if (result.success) {
        toast.success(`Interview ${status.toLowerCase()} successfully`);
        setInterviews(prev => prev.map(i => i.id === id ? { ...i, status: status as any } : i));
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error('Failed to update interview: ' + error.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Interviews</h1>
          <p className="text-muted-foreground">Manage your upcoming and past interview sessions.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Upcoming Interviews */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Calendar className="text-primary" size={20} />
                <h2>Upcoming Interviews</h2>
              </div>
              
              {upcomingInterviews.length === 0 ? (
                <div className="bg-muted/30 border border-dashed border-border rounded-xl p-12 text-center">
                  <p className="text-muted-foreground">No upcoming interviews found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingInterviews.map((interview) => (
                    <div key={interview.id} className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {(user?.id === interview.hostId ? interview.candidate.name : interview.host.name).charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {user?.id === interview.hostId ? interview.candidate.name : interview.host.name}
                            </h3>
                            <p className="text-xs text-muted-foreground capitalize">
                              {user?.id === interview.hostId ? interview.candidate.userType : 'Property Owner'}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(interview.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-xl border border-border/50">
                          <Calendar size={14} className="text-primary" />
                          <span className="text-xs font-bold text-foreground">
                            {interview.date ? new Date(interview.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'TBD'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-xl border border-border/50">
                          <Clock size={14} className="text-primary" />
                          <span className="text-xs font-bold text-foreground">
                            {interview.date ? new Date(interview.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {interview.status === 'PENDING' && user?.id !== interview.hostId && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white font-bold"
                              onClick={() => updateInterviewStatus(interview.id, 'SCHEDULED')}
                            >
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="font-bold"
                              onClick={() => updateInterviewStatus(interview.id, 'CANCELLED')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {interview.status === 'SCHEDULED' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="font-bold border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => updateInterviewStatus(interview.id, 'CANCELLED')}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="font-bold" onClick={() => router.push(`/dashboard/interviews/${interview.id}`)}>View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* History */}
            <section className="space-y-4 pt-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <History className="text-muted-foreground" size={20} />
                <h2>Interview History</h2>
              </div>

              {pastInterviews.length === 0 ? (
                <div className="bg-muted/30 border border-dashed border-border rounded-xl p-12 text-center">
                  <p className="text-muted-foreground">No interview history available.</p>
                </div>
              ) : (
                <div className="bg-background border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                      <tr>
                        <th className="px-6 py-4">Participant</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {pastInterviews.map((interview) => (
                        <tr key={interview.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-foreground">
                              {user?.id === interview.hostId ? interview.candidate.name : interview.host.name}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {user?.id === interview.hostId ? interview.candidate.userType : 'Property Owner'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {interview.date ? new Date(interview.date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(interview.status)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-primary hover:underline font-medium">View Notes</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
