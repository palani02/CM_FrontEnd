import React, { useEffect, useState } from 'react';
import { FaUser, FaCheck, FaTimes, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const AdminUnenrollRequests = ({ setPendingCount }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8088/api/courses/unenroll-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
        const pendingRequestsCount = data.filter(request => request.status === 'PENDING').length;
        setPendingCount(pendingRequestsCount);
      } else {
        console.error('Failed to fetch unenrollment requests');
      }
    } catch (error) {
      console.error('Error fetching unenrollment requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      const res = await fetch(`http://localhost:8088/api/courses/approve-unenroll?requestId=${requestId}`, {
        method: 'POST'
      });
      if (res.ok) {
        alert('Unenrollment approved');
        fetchRequests();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to approve unenrollment');
      }
    } catch (error) {
      console.error('Error approving unenrollment:', error);
      alert('Error approving unenrollment');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const res = await fetch(`http://localhost:8088/api/courses/reject-unenroll?requestId=${requestId}`, {
        method: 'POST'
      });
      if (res.ok) {
        alert('Unenrollment rejected');
        fetchRequests();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to reject unenrollment');
      }
    } catch (error) {
      console.error('Error rejecting unenrollment:', error);
      alert('Error rejecting unenrollment');
    }
  };

  if (loading) return <div style={styles.loading}><FaSpinner className="spinner" /> Loading requests...</div>;
  if (!requests.length) return <div style={styles.noData}><FaExclamationTriangle /> No pending unenrollment requests</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}><FaUser />  Unenrollment Requests</h1>
      <p style={styles.subheading}>Manage user opt-outs with full control — built for enterprise scale</p>

      <div style={styles.cardContainer}>
        {requests.map(({ id, studentEmail, courseName, status }) => {
          const studentName = studentEmail.split('@')[0];

          return (
            <div key={id} style={styles.requestCard}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.studentName}><FaUser /> {studentName}</div>
                  <div style={styles.email}>{studentEmail}</div>
                </div>
                <span style={{
                  ...styles.statusChip,
                  backgroundColor:
                    status === 'PENDING' ? '#f59e0b' :
                    status === 'APPROVED' ? '#10b981' :
                    '#ef4444'
                }}>
                  {status.toLowerCase()}
                </span>
              </div>
              <div style={styles.cardBody}>
                <p><strong>Request ID:</strong> {id}</p>
              </div>
              <div style={styles.cardFooter}>
                <button style={styles.approveButton} onClick={() => handleApprove(id)}><FaCheck /> Approve</button>
                <button style={styles.rejectButton} onClick={() => handleReject(id)}><FaTimes /> Reject</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    background: 'linear-gradient(180deg, #0f0f0f, #1a1a1d)',
    minHeight: '100vh',
    fontFamily: '"Inter", sans-serif',
    color: '#e5e5e5',
    backdropFilter: 'blur(10px)',
  },
  heading: {
    fontSize: '48px',
    fontWeight: '900',
    marginBottom: '12px',
    color: '#ffffff',
    letterSpacing: '-0.02em',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subheading: {
    fontSize: '20px',
    color: '#a1a1aa',
    marginBottom: '48px',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: '1.6',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
    gap: '40px',
    justifyContent: 'center',
  },
  requestCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(12px)',
    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
    transform: 'scale(1)',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
  },
  studentName: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
  },
  email: {
    fontSize: '15px',
    color: '#c9c9d0',
  },
  statusChip: {
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#ffffff',
    borderRadius: '9999px',
    textTransform: 'capitalize',
    background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    boxShadow: '0 3px 8px rgba(59, 130, 246, 0.5)',
  },
  cardBody: {
    fontSize: '16px',
    color: '#d1d5db',
    marginBottom: '28px',
    lineHeight: '1.8',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '18px',
  },
  approveButton: {
    flex: 1,
    background: 'linear-gradient(135deg, #10b981, #34d399)',
    color: '#fff',
    border: 'none',
    padding: '14px 20px',
    borderRadius: '14px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)',
  },
  rejectButton: {
    flex: 1,
    background: 'linear-gradient(135deg, #ef4444, #f87171)',
    color: '#fff',
    border: 'none',
    padding: '14px 20px',
    borderRadius: '14px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)',
  },
  approveButtonHover: {
    background: 'linear-gradient(135deg, #059669, #10b981)',
    transform: 'scale(1.02)',
  },
  rejectButtonHover: {
    background: 'linear-gradient(135deg, #b91c1c, #ef4444)',
    transform: 'scale(1.02)',
  },
  loading: {
    fontSize: '20px',
    color: '#a1a1aa',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    fontSize: '20px',
    color: '#a1a1aa',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default AdminUnenrollRequests;
