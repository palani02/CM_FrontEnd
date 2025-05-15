import React, { useEffect, useState } from 'react';

const AdminUnenrollRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8088/api/courses/unenroll-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
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

  if (loading) return <div style={styles.loading}>✨ Loading requests...</div>;
  if (!requests.length) return <div style={styles.noData}>No pending unenrollment requests 🚫</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📋 Unenrollment Requests Dashboard</h2>
      <div style={styles.cardContainer}>
        {requests.map(({ id, studentEmail, courseId, status }, index) => (
          <div key={id} style={styles.requestCard}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>Request #{id}</div>
              <div style={{
                ...styles.statusChip,
                backgroundColor:
                  status === 'PENDING' ? '#facc15' :
                  status === 'APPROVED' ? '#4ade80' :
                  '#f87171'
              }}>
                {status}
              </div>
            </div>
            <div style={styles.cardBody}>
              <div><strong>Student Email:</strong> {studentEmail}</div>
              <div><strong>Course ID:</strong> #{courseId}</div>
              
            </div>
            <div style={styles.cardFooter}>
              <button style={styles.approveButton} onClick={() => handleApprove(id)}>✅ Approve</button>
              <button style={styles.rejectButton} onClick={() => handleReject(id)}>❌ Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '"Segoe UI", Roboto, sans-serif',
    padding: '40px',
    background: 'linear-gradient(to right, #fdfbfb, #ebedee)',
    minHeight: '100vh',
    color: '#111',
    animation: 'fadeIn 0.6s ease-in-out'
  },
  heading: {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '25px',
    textShadow: '1px 1px 2px #ccc'
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    paddingTop: '20px'
  },
  requestCard: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)'
    }
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
  },
  statusChip: {
    color: '#fff',
    fontWeight: '500',
    fontSize: '12px',
    padding: '5px 12px',
    borderRadius: '999px',
    textTransform: 'capitalize',
    transition: '0.3s',
  },
  cardBody: {
    marginBottom: '20px',
    fontSize: '14px',
    color: '#555',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  approveButton: {
    background: '#10b981',
    border: 'none',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.2s',
  },
  rejectButton: {
    background: '#ef4444',
    border: 'none',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.2s',
  },
  loading: {
    fontSize: '20px',
    fontWeight: 500,
    textAlign: 'center',
    paddingTop: '100px',
    color: '#6b7280'
  },
  noData: {
    fontSize: '20px',
    textAlign: 'center',
    marginTop: '100px',
    color: '#9ca3af',
    fontStyle: 'italic'
  }
};

export default AdminUnenrollRequests;
