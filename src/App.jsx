import React, { useState, useEffect } from 'react';
import { dataService } from './services/dataService';
import { exportService } from './services/exportService';
import Header from './components/Header';
import ImageViewer from './components/ImageViewer';
import PopupNotification from './components/PopupNotification';
import { ConfirmLogoutDialog } from './components/ConfirmDialog';
import LoginPage from './pages/LoginPage';
import SubmitWorkPage from './pages/SubmitWorkPage';
import HistoryPage from './pages/HistoryPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import './index.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('login');
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [viewImage, setViewImage] = useState(null);
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    setUsers(dataService.getUsers());
    setSubmissions(dataService.getSubmissions());
  }, []);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup(prev => ({ ...prev, show: false })), 3000);
  };

  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setPage(user.isAdmin ? 'admin' : 'submit');
      showPopup('เข้าสู่ระบบสำเร็จ');
    } else {
      showPopup('อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'error');
    }
  };

  const handleRegister = (formData) => {
    if (users.some(u => u.email === formData.email)) {
      showPopup('อีเมลนี้มีผู้ใช้งานแล้ว', 'error');
      return;
    }
    if (formData.adminCode && formData.adminCode !== '1234') {
      showPopup('รหัส Admin ไม่ถูกต้อง', 'error');
      return;
    }
    const newUser = { ...formData, isAdmin: !!formData.adminCode };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    dataService.saveUsers(updatedUsers);
    setCurrentUser(newUser);
    setPage(newUser.isAdmin ? 'admin' : 'submit');
    showPopup('สมัครสมาชิกสำเร็จ');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('login');
    setConfirmLogout(false);
  };

  const handleSubmitWork = (data) => {
    const newSubmission = {
      id: Date.now().toString(),
      ...data,
      userEmail: currentUser?.email,
      status: 'ยังไม่ตรวจ',
      submittedAt: new Date().toISOString(),
      isDeleted: false,
      isPermanentlyDeleted: false,
      adminNote: ''
    };
    const updated = [...submissions, newSubmission];
    setSubmissions(updated);
    dataService.saveSubmissions(updated);
    showPopup('ส่งงานสำเร็จ');
    setPage('history');
  };

  const updateSubmissionStatus = (id, status) => {
    const updated = submissions.map(s => s.id === id ? { ...s, status, completedAt: status === 'ตรวจแล้ว' ? new Date().toISOString() : s.completedAt } : s);
    setSubmissions(updated);
    dataService.saveSubmissions(updated);
    showPopup('อัปเดตสถานะสำเร็จ');
  };

  const handleUpdateSubmission = (id, updatedData) => {
    const updated = submissions.map(s => s.id === id ? { ...s, ...updatedData } : s);
    setSubmissions(updated);
    dataService.saveSubmissions(updated);
    showPopup('อัปเดตข้อมูลสำเร็จ');
  };

  const handleUpdateNote = (id, note) => {
    const updated = submissions.map(s => s.id === id ? { ...s, adminNote: note } : s);
    setSubmissions(updated);
    dataService.saveSubmissions(updated);
    showPopup('บันทึกหมายเหตุสำเร็จ');
  };

  const deleteSubmission = (id) => {
    const updated = submissions.map(s => s.id === id ? { ...s, isDeleted: true, deletedAt: new Date().toISOString() } : s);
    setSubmissions(updated);
    dataService.saveSubmissions(updated);
    showPopup('ย้ายไปถังขยะแล้ว');
  };

  const restoreSubmission = (id) => {
    const updated = submissions.map(s => s.id === id ? { ...s, isDeleted: false, status: 'รอตรวจ' } : s);
    setSubmissions(updated);
    dataService.saveSubmissions(updated);
    showPopup('กู้คืนงานสำเร็จ');
  };

  const permanentDeleteSubmission = (id) => {
    const updated = submissions.map(s => s.id === id ? { ...s, isPermanentlyDeleted: true } : s);
    setSubmissions(updated);
    dataService.saveSubmissions(updated);
    showPopup('ลบงานถาวรแล้ว');
  };

  // Profile Management
  const handleUpdateProfile = (profileData) => {
    const updatedUser = { ...currentUser, ...profileData };
    const updatedUsers = users.map(u => u.email === currentUser.email ? updatedUser : u);
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    dataService.saveUsers(updatedUsers);
    showPopup('อัปเดตโปรไฟล์สำเร็จ');
  };

  const handleChangePassword = (oldPassword, newPassword) => {
    if (currentUser.password !== oldPassword) {
      showPopup('รหัสผ่านเดิมไม่ถูกต้อง', 'error');
      return;
    }
    const updatedUser = { ...currentUser, password: newPassword };
    const updatedUsers = users.map(u => u.email === currentUser.email ? updatedUser : u);
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    dataService.saveUsers(updatedUsers);
    showPopup('เปลี่ยนรหัสผ่านสำเร็จ');
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

  return (
    <div className="app-container">
      <Header
        currentUser={currentUser}
        onNavigateToProfile={() => setPage('profile')}
      />
      <ImageViewer image={viewImage} onClose={() => setViewImage(null)} />
      <PopupNotification popup={popup} onClose={() => setPopup({ ...popup, show: false })} />
      <ConfirmLogoutDialog show={confirmLogout} onConfirm={handleLogout} onCancel={() => setConfirmLogout(false)} />

      {!currentUser && <LoginPage onLogin={handleLogin} onRegister={handleRegister} />}

      {currentUser && !currentUser.isAdmin && page === 'submit' && (
        <SubmitWorkPage
          onSubmit={handleSubmitWork}
          onNavigate={setPage}
          currentUser={currentUser}
          onLogout={() => setConfirmLogout(true)}
        />
      )}

      {currentUser && !currentUser.isAdmin && page === 'history' && (
        <HistoryPage
          submissions={submissions.filter(s => s.userEmail === currentUser.email || s.studentName === currentUser.name)}
          onNavigate={setPage}
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
          onNavigate={setPage}
        />
      )}
    </div>
  );
};

export default App;