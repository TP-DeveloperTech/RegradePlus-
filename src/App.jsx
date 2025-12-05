import React, { useState, useEffect } from 'react';
import { dataService } from './services/dataService';
import { exportService } from './services/exportService';
import { authService } from './services/authService';
import Header from './components/Header';
import ImageViewer from './components/ImageViewer';
import PopupNotification from './components/PopupNotification';
import { ConfirmLogoutDialog } from './components/ConfirmDialog';
import LoginPage from './pages/LoginPage';
import SubmitWorkPage from './pages/SubmitWorkPage';
import HistoryPage from './pages/HistoryPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import LoadingSpinner from './components/LoadingSpinner';
import './index.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('login');
  const [previousPage, setPreviousPage] = useState(null);
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [viewImage, setViewImage] = useState(null);
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data and set up real-time listeners
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [usersData, submissionsData] = await Promise.all([
          dataService.getUsers(),
          dataService.getSubmissions()
        ]);
        setUsers(usersData);
        setSubmissions(submissionsData);
      } catch (error) {
        console.error('Error loading data:', error);
        showPopup('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up real-time listener for submissions
    const unsubscribe = dataService.subscribeToSubmissions((updatedSubmissions) => {
      setSubmissions(updatedSubmissions);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Restore user session on page load
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Check localStorage for saved user
        const savedUser = localStorage.getItem('currentUser');
        const savedPage = localStorage.getItem('currentPage');

        if (savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          if (savedPage) {
            setPage(savedPage);
          } else {
            setPage(user.isAdmin ? 'admin' : 'submit');
          }
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentPage');
      }
    };

    restoreSession();

    // Listen to Firebase Auth state changes
    const unsubscribeAuth = authService.onAuthStateChange(async (authUser) => {
      if (authUser) {
        // User is signed in via Firebase Auth
        try {
          const user = await dataService.getUserByEmail(authUser.email);
          if (user) {
            setCurrentUser(user);
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Check if there's a saved page, otherwise use default
            const savedPage = localStorage.getItem('currentPage');
            if (!savedPage) {
              const targetPage = user.isAdmin ? 'admin' : 'submit';
              setPage(targetPage);
              localStorage.setItem('currentPage', targetPage);
            }
          }
        } catch (error) {
          console.error('Error loading user from Firestore:', error);
        }
      }
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup(prev => ({ ...prev, show: false })), 3000);
  };

  const handleLogin = async (email, password, isAdminLogin = false) => {
    try {
      // Try to sign in with Firebase Auth
      // Normalize email to lowercase
      const normalizedEmail = email.toLowerCase().trim();
      const authUser = await authService.loginWithEmail(normalizedEmail, password);

      // Get user data from Firestore
      let user = await dataService.getUserByEmail(normalizedEmail);

      if (!user) {
        // If user doesn't exist in Firestore, create from Auth data
        user = {
          email: normalizedEmail,
          name: authUser.name || email.split('@')[0],
          password: password, // Store for backward compatibility
          isAdmin: false
        };
        await dataService.saveUser(user);
        const updatedUsers = [...users, user];
        setUsers(updatedUsers);
      }

      // Check for Admin Login restriction
      if (isAdminLogin && !user.isAdmin) {
        showPopup('บัญชีนี้ไม่มีสิทธิ์เข้าถึงส่วน Admin', 'error');
        // Optional: Sign out immediately if we don't want them logged in at all
        await authService.signOutUser();
        return;
      }

      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      const targetPage = user.isAdmin ? 'admin' : 'submit';
      setPage(targetPage);
      localStorage.setItem('currentPage', targetPage);
      showPopup('เข้าสู่ระบบสำเร็จ');
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to local authentication for backward compatibility
      const normalizedEmailFallback = email.toLowerCase().trim();
      const user = users.find(u => u.email.toLowerCase() === normalizedEmailFallback && u.password === password);
      if (user) {
        // Check for Admin Login restriction (Fallback)
        if (isAdminLogin && !user.isAdmin) {
          showPopup('บัญชีนี้ไม่มีสิทธิ์เข้าถึงส่วน Admin', 'error');
          return;
        }
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        const targetPage = user.isAdmin ? 'admin' : 'submit';
        setPage(targetPage);
        localStorage.setItem('currentPage', targetPage);
        showPopup('เข้าสู่ระบบสำเร็จ');
      } else {
        showPopup('อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'error');
      }
    }
  };

  const handleRegister = async (formData) => {
    try {
      const normalizedRegEmail = formData.email.toLowerCase().trim();
      if (users.some(u => u.email.toLowerCase() === normalizedRegEmail)) {
        showPopup('อีเมลนี้มีผู้ใช้งานแล้ว', 'error');
        return;
      }
      const normalizedAdminCode = formData.adminCode ? formData.adminCode.trim() : '';
      if (normalizedAdminCode && normalizedAdminCode !== 'ADMIN_TAWEETHAPISEK') {
        showPopup('รหัส Admin ไม่ถูกต้อง', 'error');
        return;
      }

      // Register with Firebase Auth
      const authUser = await authService.registerWithEmail(
        normalizedRegEmail, formData.password, formData.name
      );

      // Save to Firestore
      const newUser = {
        ...formData, email: normalizedRegEmail, isAdmin: !!normalizedAdminCode,
        uid: authUser.uid
      };
      await dataService.saveUser(newUser);
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      const targetPage = newUser.isAdmin ? 'admin' : 'submit';
      setPage(targetPage);
      localStorage.setItem('currentPage', targetPage);
      showPopup('สมัครสมาชิกสำเร็จ');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        showPopup('อีเมลนี้มีผู้ใช้งานแล้วใน Firebase Authentication', 'error');
      } else {
        showPopup('เกิดข้อผิดพลาดในการสมัครสมาชิก', 'error');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const googleUser = await authService.signInWithGoogle();

      // Check if user exists in Firestore
      let user = await dataService.getUserByEmail(googleUser.email);

      if (!user) {
        // Auto-register new Google user
        user = {
          email: googleUser.email,
          name: googleUser.name,
          photoURL: googleUser.photoURL,
          isAdmin: false,
          password: '', // Google users don't need password
          uid: googleUser.uid
        };
        await dataService.saveUser(user);
        const updatedUsers = [...users, user];
        setUsers(updatedUsers);
      } else {
        // Update existing user with Google data
        user = { ...user, photoURL: googleUser.photoURL, uid: googleUser.uid };
        await dataService.saveUser(user);
        const updatedUsers = users.map(u => u.email === user.email ? user : u);
        setUsers(updatedUsers);
      }

      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      const targetPage = user.isAdmin ? 'admin' : 'submit';
      setPage(targetPage);
      localStorage.setItem('currentPage', targetPage);
      showPopup('เข้าสู่ระบบด้วย Google สำเร็จ');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      showPopup('เข้าสู่ระบบด้วย Google ไม่สำเร็จ', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setCurrentUser(null);
    setPage('login');
    setConfirmLogout(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentPage');
  };

  const handleSubmitWork = async (data) => {
    try {
      const newSubmission = {
        id: Date.now().toString(),
        ...data,
        userEmail: currentUser?.email,
        status: 'ยังไม่ตรวจ',
        gradingStatus: null,
        gradingComment: '',
        submittedAt: new Date().toISOString(),
        isDeleted: false,
        isPermanentlyDeleted: false,
        adminNote: ''
      };
      await dataService.addSubmission(newSubmission);
      showPopup('ส่งงานสำเร็จ');
      const newPage = 'history';
      setPage(newPage);
      localStorage.setItem('currentPage', newPage);
    } catch (error) {
      console.error('Submit work error:', error);
      showPopup('เกิดข้อผิดพลาดในการส่งงาน', 'error');
    }
  };

  const updateSubmissionStatus = async (id, status) => {
    try {
      const updates = {
        status,
        completedAt: status === 'ตรวจแล้ว' ? new Date().toISOString() : null
      };
      await dataService.updateSubmission(id, updates);
      showPopup('อัปเดตสถานะสำเร็จ');
    } catch (error) {
      console.error('Update status error:', error);
      showPopup('เกิดข้อผิดพลาดในการอัปเดตสถานะ', 'error');
    }
  };

  const handleUpdateSubmission = async (id, updatedData) => {
    try {
      await dataService.updateSubmission(id, updatedData);
      showPopup('อัปเดตข้อมูลสำเร็จ');
    } catch (error) {
      console.error('Update submission error:', error);
      showPopup('เกิดข้อผิดพลาดในการอัปเดตข้อมูล', 'error');
    }
  };

  const handleUpdateNote = async (id, note) => {
    try {
      await dataService.updateSubmission(id, { adminNote: note });
      showPopup('บันทึกหมายเหตุสำเร็จ');
    } catch (error) {
      console.error('Update note error:', error);
      showPopup('เกิดข้อผิดพลาดในการบันทึกหมายเหตุ', 'error');
    }
  };

  const handleUpdateGrading = async (id, gradingStatus, gradingComment) => {
    try {
      await dataService.updateSubmission(id, { gradingStatus, gradingComment });
      showPopup('บันทึกผลการตรวจสำเร็จ');
    } catch (error) {
      console.error('Update grading error:', error);
      showPopup('เกิดข้อผิดพลาดในการบันทึกผลการตรวจ', 'error');
    }
  };



  const deleteSubmission = async (id) => {
    try {
      await dataService.deleteSubmission(id);
      showPopup('ย้ายไปถังขยะแล้ว');
    } catch (error) {
      console.error('Delete submission error:', error);
      showPopup('เกิดข้อผิดพลาดในการลบ', 'error');
    }
  };

  const restoreSubmission = async (id) => {
    try {
      await dataService.restoreSubmission(id);
      showPopup('กู้คืนงานสำเร็จ');
    } catch (error) {
      console.error('Restore submission error:', error);
      showPopup('เกิดข้อผิดพลาดในการกู้คืน', 'error');
    }
  };

  const permanentDeleteSubmission = async (id) => {
    try {
      await dataService.permanentDeleteSubmission(id);
      showPopup('ลบงานถาวรแล้ว');
    } catch (error) {
      console.error('Permanent delete error:', error);
      showPopup('เกิดข้อผิดพลาดในการลบถาวร', 'error');
    }
  };

  // Profile Management
  const handleUpdateProfile = async (profileData) => {
    try {
      const updatedUser = { ...currentUser, ...profileData };
      await dataService.saveUser(updatedUser);
      const updatedUsers = users.map(u => u.email === currentUser.email ? updatedUser : u);
      setUsers(updatedUsers);
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      showPopup('อัปเดตโปรไฟล์สำเร็จ');
    } catch (error) {
      console.error('Update profile error:', error);
      showPopup('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์', 'error');
    }
  };

  const handleChangePassword = async (oldPassword, newPassword) => {
    try {
      if (currentUser.password !== oldPassword) {
        showPopup('รหัสผ่านเดิมไม่ถูกต้อง', 'error');
        return;
      }
      const updatedUser = { ...currentUser, password: newPassword };
      await dataService.saveUser(updatedUser);
      const updatedUsers = users.map(u => u.email === currentUser.email ? updatedUser : u);
      setUsers(updatedUsers);
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      showPopup('เปลี่ยนรหัสผ่านสำเร็จ');
    } catch (error) {
      console.error('Change password error:', error);
      showPopup('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน', 'error');
    }
  };

  // Export Handler (Admin only)
  const handleExport = (data, filename, format) => {
    try {
      if (format === 'excel') {
        exportService.exportToExcel(data, filename);
      } else if (format === 'csv') {
        exportService.exportToCSV(data, filename);
      }
      showPopup(`ดาวน์โหลด ${format === 'excel' ? 'Excel' : 'CSV'} สำเร็จ`);
    } catch (error) {
      showPopup('เกิดข้อผิดพลาดในการดาวน์โหลด', 'error');
      console.error('Export error:', error);
    }
  };

  const handleNavigateToProfile = () => {
    setPreviousPage(page);
    const newPage = 'profile';
    setPage(newPage);
    localStorage.setItem('currentPage', newPage);
  };

  const handleNavigateHome = () => {
    if (currentUser) {
      const targetPage = currentUser.isAdmin ? 'admin' : 'submit';
      setPage(targetPage);
      localStorage.setItem('currentPage', targetPage);
    } else {
      setPage('login');
    }
  };

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner />
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header
        currentUser={currentUser}
        onNavigateToProfile={handleNavigateToProfile}
        onNavigateHome={handleNavigateHome}
      />
      <ImageViewer image={viewImage} onClose={() => setViewImage(null)} />
      <PopupNotification popup={popup} onClose={() => setPopup({ ...popup, show: false })} />
      <ConfirmLogoutDialog show={confirmLogout} onConfirm={handleLogout} onCancel={() => setConfirmLogout(false)} />

      {!currentUser && page === 'login' && <LoginPage onLogin={handleLogin} onRegister={handleRegister} onGoogleSignIn={handleGoogleSignIn} onNavigateToAdminLogin={() => setPage('admin-login')} />}

      {!currentUser && page === 'admin-login' && (
        <AdminLoginPage
          onLogin={handleLogin}
          onRegister={handleRegister}
          onNavigateToLogin={() => setPage('login')}
        />
      )}

      {currentUser && !currentUser.isAdmin && page === 'submit' && (
        <SubmitWorkPage
          onSubmit={handleSubmitWork}
          onNavigate={(newPage) => {
            setPage(newPage);
            localStorage.setItem('currentPage', newPage);
          }}
          currentUser={currentUser}
          onLogout={() => setConfirmLogout(true)}
        />
      )}

      {currentUser && !currentUser.isAdmin && page === 'history' && (
        <HistoryPage
          submissions={submissions.filter(s => s.userEmail === currentUser.email || s.studentName === currentUser.name)}
          onNavigate={(newPage) => {
            setPage(newPage);
            localStorage.setItem('currentPage', newPage);
          }}
          onLogout={() => setConfirmLogout(true)}
          onViewImage={setViewImage}
        />
      )}

      {currentUser && currentUser.isAdmin && page === 'admin' && (
        <AdminPage
          submissions={submissions}
          onLogout={() => setConfirmLogout(true)}
          onUpdateStatus={updateSubmissionStatus}
          onUpdateSubmission={handleUpdateSubmission}
          onUpdateNote={handleUpdateNote}
          onUpdateGrading={handleUpdateGrading}
          onDelete={deleteSubmission}
          onRestore={restoreSubmission}
          onPermanentDelete={permanentDeleteSubmission}
          onViewImage={setViewImage}
          onExport={handleExport}
        />
      )}

      {currentUser && page === 'profile' && (
        <ProfilePage
          user={currentUser}
          onUpdate={handleUpdateProfile}
          onChangePassword={handleChangePassword}
          onNavigate={(newPage) => {
            setPage(newPage);
            localStorage.setItem('currentPage', newPage);
          }}
          previousPage={previousPage}
        />
      )}
    </div>
  );
};

export default App;