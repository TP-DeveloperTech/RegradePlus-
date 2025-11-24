import React, { useState, useEffect } from 'react';
import { Search, LogOut, Upload, Eye, Edit2, Check, X, AlertCircle, CheckCircle, Trash2, ZoomIn, RotateCcw, Trash } from 'lucide-react';

// Admin Secret Code
const ADMIN_SECRET_CODE = 'ADMIN2025';

// Header Component
const Header = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    padding: '0 30px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <div style={{
        width: '35px',
        height: '35px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '20px'
      }}>R+</div>
      <div>
        <h1 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: '800',
          color: '#333',
          letterSpacing: '-0.5px'
        }}>RegradePlus+</h1>
        <span style={{
          fontSize: '12px',
          color: '#666',
          fontWeight: '500',
          display: 'block',
          marginTop: '-2px'
        }}>กลุ่มสาระการเรียนรู้วิทยาศาสตร์ & เทคโนโลยี</span>
      </div>
    </div>
  </div>
);

// Components defined outside App to prevent re-renders/state resets
const ImageViewer = ({ viewImage, onClose }) => {
  if (!viewImage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        cursor: 'pointer'
      }}
      onClick={onClose}
    >
      <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
        <img
          src={viewImage}
          alt="Full view"
          style={{
            maxWidth: '100%',
            maxHeight: '90vh',
            objectFit: 'contain',
            borderRadius: '8px'
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-40px',
            right: '0',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '35px',
            height: '35px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

const PopupNotification = ({ popup, onClose }) => {
  if (!popup.show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{
        backgroundColor: popup.type === 'success' ? '#4CAF50' : '#f44336',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        maxWidth: '500px'
      }}>
        {popup.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
        <div style={{ flex: 1, fontSize: '15px', fontWeight: '500' }}>{popup.message}</div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

const LoginPage = ({ handleLogin, handleRegister }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', adminCode: '' });
  const [showAdminCode, setShowAdminCode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      handleRegister(formData.email, formData.password, formData.name, formData.adminCode);
    } else {
      handleLogin(formData.email, formData.password);
    }
  };

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px 20px',
        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.8)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: '800', color: '#1a1a1a' }}>
              {isRegister ? 'สร้างบัญชีใหม่' : 'ยินดีต้อนรับกลับ'}
            </h2>
            <p style={{ margin: 0, color: '#666', fontSize: '15px' }}>
              {isRegister ? 'กรอกข้อมูลเพื่อเริ่มต้นใช้งาน' : 'เข้าสู่ระบบเพื่อจัดการงานแก้ของคุณ'}
            </p>
          </div>

          {/* Custom Tabs */}
          <div style={{
            display: 'flex',
            marginBottom: '30px',
            backgroundColor: '#f0f2f5',
            padding: '4px',
            borderRadius: '14px'
          }}>
            <button
              onClick={() => setIsRegister(false)}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: !isRegister ? 'white' : 'transparent',
                color: !isRegister ? '#1a1a1a' : '#666',
                boxShadow: !isRegister ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '15px'
              }}
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => setIsRegister(true)}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: isRegister ? 'white' : 'transparent',
                color: isRegister ? '#1a1a1a' : '#666',
                boxShadow: isRegister ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '15px'
              }}
            >
              สมัครสมาชิก
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div style={{ marginBottom: '20px', animation: 'fadeIn 0.3s ease-out' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="กรอกชื่อ-นามสกุล"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #eee',
                    borderRadius: '12px',
                    fontSize: '15px',
                    transition: 'all 0.2s',
                    backgroundColor: '#f9f9f9',
                    outline: 'none'
                  }}
                  className="input-field"
                />
              </div>
            )}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>อีเมลโรงเรียน</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@taweethapisek.ac.th"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #eee',
                  borderRadius: '12px',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  backgroundColor: '#f9f9f9',
                  outline: 'none'
                }}
                className="input-field"
              />
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>รหัสผ่าน</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #eee',
                  borderRadius: '12px',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  backgroundColor: '#f9f9f9',
                  outline: 'none'
                }}
                className="input-field"
              />
            </div>

            {isRegister && (
              <div style={{ marginBottom: '25px', animation: 'fadeIn 0.3s ease-out' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '10px', borderRadius: '8px', transition: 'background 0.2s' }} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showAdminCode}
                    onChange={(e) => setShowAdminCode(e.target.checked)}
                    style={{ marginRight: '10px', width: '18px', height: '18px', accentColor: '#4CAF50' }}
                  />
                  <span style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>ลงทะเบียนสำหรับ Admin</span>
                </label>

                {showAdminCode && (
                  <div style={{ marginTop: '15px', animation: 'slideDown 0.3s ease-out' }}>
                    <input
                      type="password"
                      value={formData.adminCode}
                      onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                      placeholder="กรอกรหัสลับ Admin"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #eee',
                        borderRadius: '12px',
                        fontSize: '15px',
                        backgroundColor: '#f9f9f9',
                        outline: 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 10px 20px rgba(76, 175, 80, 0.2)'
              }}
              className="submit-btn"
            >
              {isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const SubmitWorkPage = ({ handleSubmitWork, handleLogout, setPage, showPopup }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    grade: '',
    studentId: '',
    subjectCode: '',
    subjectName: '',
    type: 'ศูนย์',
    gradeYear: '',
    date: new Date().toISOString().split('T')[0],
    images: []
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    })).then(images => {
      setFormData({ ...formData, images: [...formData.images, ...images] });
    });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, idx) => idx !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      showPopup('กรุณาอัปโหลดรูปงานอย่างน้อย 1 รูป', 'error');
      return;
    }
    handleSubmitWork(formData);
    setFormData({
      studentName: '',
      grade: '',
      studentId: '',
      subjectCode: '',
      subjectName: '',
      type: 'ศูนย์',
      gradeYear: '',
      date: new Date().toISOString().split('T')[0],
      images: []
    });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>ส่งงานแก้</h2>
        <div>
          <button onClick={() => setPage('history')} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#66BB6A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ประวัติ</button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '30px', backgroundColor: 'white', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อ-นามสกุล: *</label>
            <input type="text" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชั้น: *</label>
            <input type="text" placeholder="เช่น ม.4/1" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รหัสนักเรียน: *</label>
            <input type="text" placeholder="เช่น 12345" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รหัสวิชา: *</label>
              <input type="text" placeholder="เช่น ค21101" value={formData.subjectCode} onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อวิชา: *</label>
              <input type="text" placeholder="เช่น คณิตศาสตร์" value={formData.subjectName} onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ติด: *</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <option value="ศูนย์">ศูนย์</option>
                <option value="ร.">ร.</option>
                <option value="มส.">มส.</option>
                <option value="มพ.">มพ.</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชั้นที่ติด-ปีการศึกษา: *</label>
            <input type="text" placeholder="เช่น 4/3 2567" value={formData.gradeYear} onChange={(e) => setFormData({ ...formData, gradeYear: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>วันที่ส่ง: *</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รูปงานแก้: *</label>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
          {formData.images.length > 0 && (
            <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
              {formData.images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={img} alt={`preview ${idx}`} style={{ width: '100%', height: '120px', objectFit: 'cover', border: '2px solid #ddd', borderRadius: '4px' }} />
                  <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', fontSize: '16px' }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit" style={{ marginTop: '25px', padding: '12px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', width: '100%', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Upload size={18} /> ส่งงาน
        </button>
      </form>
    </div>
  );
};

const HistoryPage = ({ userSubmissions, handleLogout, setPage, setViewImage }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localSearchType, setLocalSearchType] = useState('subject');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const getFilteredSubmissions = () => {
    let filtered = userSubmissions;

    if (localSearchTerm) {
      filtered = filtered.filter(sub => {
        if (localSearchType === 'subject') {
          return sub.subjectName.toLowerCase().includes(localSearchTerm.toLowerCase());
        } else {
          return sub.subjectCode.toLowerCase().includes(localSearchTerm.toLowerCase());
        }
      });
    }
    return filtered;
  };

  const filteredSubmissions = getFilteredSubmissions();

  const getStatusColor = (status) => {
    switch (status) {
      case 'รอตรวจ': return '#FFC107';
      case 'ตรวจแล้ว': return '#4CAF50';
      case 'แก้ไข': return '#f44336';
      case 'ถูกลบ': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>ประวัติการส่งงาน ({filteredSubmissions.length} งาน)</h2>
        <div>
          <button onClick={() => setPage('submit')} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ส่งงานใหม่</button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '25px', display: 'flex', gap: '10px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <select value={localSearchType} onChange={(e) => setLocalSearchType(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '180px' }}>
          <option value="subject">ค้นหาด้วยชื่อวิชา</option>
          <option value="code">ค้นหาด้วยรหัสวิชา</option>
        </select>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder={`ค้นหา${localSearchType === 'subject' ? 'ชื่อวิชา' : 'รหัสวิชา'}...`}
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 40px 10px 10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <Search size={20} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            {localSearchTerm ? 'ไม่พบงานที่ค้นหา' : 'ยังไม่มีประวัติการส่งงาน'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {filteredSubmissions.map(sub => (
            <div key={sub.id} style={{ border: '1px solid #ddd', padding: '20px', cursor: 'pointer', backgroundColor: sub.isDeleted ? '#f5f5f5' : 'white', borderRadius: '8px', transition: 'transform 0.2s', opacity: sub.isDeleted ? 0.7 : 1 }} onClick={() => setSelectedSubmission(sub)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>
                    {sub.subjectName} ({sub.subjectCode})
                    {sub.isDeleted && <span style={{ marginLeft: '10px', fontSize: '14px', color: '#9E9E9E' }}>🗑️ อยู่ในถังขยะ</span>}
                  </h3>
                  <p style={{ margin: '5px 0', color: '#666' }}>ติด {sub.type} | ส่งเมื่อ {new Date(sub.submittedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  <p style={{ margin: '5px 0', color: '#666' }}>รูปงาน: {sub.images?.length || 0} รูป</p>
                  {sub.isDeleted && (
                    <p style={{ margin: '5px 0', color: '#f44336', fontSize: '13px' }}>
                      ถูกย้ายไปถังขยะเมื่อ: {new Date(sub.deletedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
                <div style={{ padding: '8px 16px', backgroundColor: getStatusColor(sub.isDeleted ? 'ถูกลบ' : sub.status), color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
                  {sub.isDeleted ? 'ถูกลบ' : sub.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSubmission && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedSubmission(null)}>
          <div style={{ backgroundColor: 'white', padding: '30px', maxWidth: '700px', maxHeight: '85vh', overflow: 'auto', borderRadius: '8px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, borderBottom: '2px solid #4CAF50', paddingBottom: '10px' }}>รายละเอียดงาน</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div><strong>ชื่อ:</strong> {selectedSubmission.studentName}</div>
              <div><strong>ชั้น:</strong> {selectedSubmission.grade}</div>
              <div><strong>รหัสนักเรียน:</strong> {selectedSubmission.studentId}</div>
              <div><strong>รหัสวิชา:</strong> {selectedSubmission.subjectCode}</div>
              <div style={{ gridColumn: '1 / -1' }}><strong>ชื่อวิชา:</strong> {selectedSubmission.subjectName}</div>
              <div><strong>ติด:</strong> {selectedSubmission.type}</div>
              <div><strong>ชั้นที่ติด-ปีการศึกษา:</strong> {selectedSubmission.gradeYear}</div>
              <div style={{ gridColumn: '1 / -1' }}><strong>วันที่ส่ง:</strong> {new Date(selectedSubmission.date).toLocaleDateString('th-TH')}</div>
              {selectedSubmission.completedAt && (
                <div style={{ gridColumn: '1 / -1', backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '4px' }}>
                  <strong>✅ ตรวจเสร็จเมื่อ:</strong> {new Date(selectedSubmission.completedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>สถานะ:</strong>
                <span style={{ marginLeft: '10px', padding: '5px 12px', backgroundColor: getStatusColor(selectedSubmission.status), color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
                  {selectedSubmission.status}
                </span>
              </div>
            </div>

            {selectedSubmission.images && selectedSubmission.images.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <strong style={{ display: 'block', marginBottom: '10px' }}>รูปงาน ({selectedSubmission.images.length} รูป):</strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  {selectedSubmission.images.map((img, idx) => (
                    <div
                      key={idx}
                      style={{ position: 'relative', cursor: 'pointer' }}
                      onClick={() => setViewImage(img)}
                    >
                      <img
                        src={img}
                        alt={`work ${idx + 1}`}
                        style={{ width: '100%', height: '200px', objectFit: 'cover', border: '2px solid #ddd', borderRadius: '4px' }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '50%',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        pointerEvents: 'none'
                      }}
                        className="zoom-icon">
                        <ZoomIn size={24} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setSelectedSubmission(null)} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPage = ({ submissions, handleLogout, updateSubmission, deleteSubmission, restoreSubmission, permanentDeleteSubmission, setViewImage }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localSearchType, setLocalSearchType] = useState('name');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmPermanentDelete, setConfirmPermanentDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'trash'
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [expandedCards, setExpandedCards] = useState({});

  const getFilteredSubmissions = () => {
    const filtered = submissions.filter(sub => {
      // Filter by Tab
      if (activeTab === 'active' && sub.isDeleted) return false;
      if (activeTab === 'trash' && !sub.isDeleted) return false;

      // Filter by Search
      if (!localSearchTerm) return true;
      if (localSearchType === 'name') {
        return sub.studentName.toLowerCase().includes(localSearchTerm.toLowerCase());
      } else {
        return sub.studentId.includes(localSearchTerm);
      }
    });

    const grouped = {};
    filtered.forEach(sub => {
      const key = sub.studentId;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(sub);
    });

    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    });

    return grouped;
  };

  const groupedSubmissions = getFilteredSubmissions();

  const handleEdit = (submission) => {
    setEditingId(submission.id);
    setEditData(submission);
  };

  const handleSaveEdit = () => {
    updateSubmission(editingId, editData);
    setEditingId(null);
  };

  const handleDelete = (submissionId) => {
    deleteSubmission(submissionId);
    setConfirmDelete(null);
  };

  const handleRestore = (submissionId) => {
    restoreSubmission(submissionId);
  };

  const handlePermanentDelete = (submissionId) => {
    permanentDeleteSubmission(submissionId);
    setConfirmPermanentDelete(null);
  };

  const toggleCard = (studentId) => {
    setExpandedCards(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'รอตรวจ': return '#FFC107';
      case 'ตรวจแล้ว': return '#4CAF50';
      case 'แก้ไข': return '#f44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Admin Panel</h2>
          <p style={{ margin: '5px 0', color: '#666' }}>
            จำนวนนักเรียนที่ส่งงาน: {Object.keys(groupedSubmissions).length} คน |
            งานทั้งหมด: {submissions.filter(s => !s.isDeleted).length} งาน |
            ตรวจแล้ว: {submissions.filter(s => s.status === 'ตรวจแล้ว' && !s.isDeleted).length} งาน |
            ถังขยะ: {submissions.filter(s => s.isDeleted).length} งาน
          </p>
        </div>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <LogOut size={16} /> ออกจากระบบ
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'active' ? '#4CAF50' : 'white',
            color: activeTab === 'active' ? 'white' : '#666',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          📋 งานที่ส่ง ({submissions.filter(s => !s.isDeleted).length})
        </button>
        <button
          onClick={() => setActiveTab('trash')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'trash' ? '#f44336' : 'white',
            color: activeTab === 'trash' ? 'white' : '#666',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Trash size={18} /> ถังขยะ ({submissions.filter(s => s.isDeleted).length})
        </button>
      </div>

      <div style={{ marginBottom: '25px', display: 'flex', gap: '10px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <select value={localSearchType} onChange={(e) => setLocalSearchType(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '180px' }}>
          <option value="name">ค้นหาด้วยชื่อ</option>
          <option value="id">ค้นหาด้วยรหัสนักเรียน</option>
        </select>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder={`ค้นหา${localSearchType === 'name' ? 'ชื่อนักเรียน' : 'รหัสนักเรียน'}...`}
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 40px 10px 10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <Search size={20} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
        {Object.entries(groupedSubmissions).map(([studentId, subs]) => {
          const isExpanded = expandedCards[studentId];
          const displaySubs = isExpanded ? subs : subs.slice(0, 1);

          return (
            <div key={studentId} style={{ border: '2px solid #ddd', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{subs[0].studentName}</h3>
                  <p style={{ margin: '5px 0', color: '#666' }}>รหัส: {studentId} | ชั้น: {subs[0].grade}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#4CAF50' }}>{subs.length}</span>
                  <span style={{ fontSize: '12px', color: '#666' }}> งาน</span>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '15px' }}>
                {displaySubs.map(sub => (
                  <div key={sub.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0' }}>{sub.subjectName} ({sub.subjectCode})</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                          ติด {sub.type} | {sub.gradeYear}
                          <br />
                          ส่ง: {new Date(sub.submittedAt).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                      {editingId === sub.id ? (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={handleSaveEdit} style={{ padding: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Check size={16} /></button>
                          <button onClick={() => setEditingId(null)} style={{ padding: '5px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {!sub.isDeleted && (
                            <button onClick={() => handleEdit(sub)} style={{ padding: '5px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                          )}
                          {sub.isDeleted ? (
                            <>
                              <button onClick={() => handleRestore(sub.id)} style={{ padding: '6px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <RotateCcw size={14} /> กู้คืน
                              </button>
                              <button onClick={() => setConfirmPermanentDelete(sub.id)} style={{ padding: '6px 12px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Trash size={14} /> ลบถาวร
                              </button>
                            </>
                          ) : (
                            <button onClick={() => setConfirmDelete(sub.id)} style={{ padding: '5px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                          )}
                        </div>
                      )}
                    </div>

                    {editingId === sub.id ? (
                      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                        <div style={{ marginBottom: '10px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>สถานะ:</label>
                          <select
                            value={editData.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                            style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                          >
                            <option value="รอตรวจ">รอตรวจ</option>
                            <option value="ตรวจแล้ว">ตรวจแล้ว</option>
                            <option value="แก้ไข">แก้ไข</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: getStatusColor(sub.status), color: 'white', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                        {sub.status}
                      </div>
                    )}

                    {sub.images && sub.images.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>รูปงาน ({sub.images.length} รูป):</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                          {sub.images.slice(0, 3).map((img, imgIdx) => (
                            <div
                              key={imgIdx}
                              style={{ position: 'relative', cursor: 'pointer' }}
                              onClick={() => setViewImage(img)}
                            >
                              <img
                                src={img}
                                alt={`work ${imgIdx + 1}`}
                                style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                              />
                            </div>
                          ))}
                        </div>
                        {sub.images.length > 3 && (
                          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px', textAlign: 'center' }}>
                            และอีก {sub.images.length - 3} รูป
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {subs.length > 1 && (
                <button
                  onClick={() => toggleCard(studentId)}
                  style={{
                    width: '100%',
                    marginTop: '15px',
                    padding: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: '#666',
                    fontSize: '13px'
                  }}
                >
                  {isExpanded ? 'ย่อรายการ' : `ดูทั้งหมด (${subs.length})`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Modals */}
      {confirmDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <AlertCircle size={48} color="#f44336" style={{ marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 10px 0' }}>ยืนยันการลบ?</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>รายการนี้จะถูกย้ายไปที่ถังขยะ</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: '10px 20px', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>ยกเลิก</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ลบรายการ</button>
            </div>
          </div>
        </div>
      )}

      {confirmPermanentDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <AlertCircle size={48} color="#d32f2f" style={{ marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 10px 0' }}>ยืนยันการลบถาวร?</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>รายการนี้จะถูกลบออกจากระบบอย่างถาวรและไม่สามารถกู้คืนได้</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setConfirmPermanentDelete(null)} style={{ padding: '10px 20px', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>ยกเลิก</button>
              <button onClick={() => handlePermanentDelete(confirmPermanentDelete)} style={{ padding: '10px 20px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ลบถาวร</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); // login, submit, history, admin
  const [submissions, setSubmissions] = useState([]);
  const [viewImage, setViewImage] = useState(null);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('regradeUser');
    const savedSubmissions = localStorage.getItem('regradeSubmissions');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setPage(parsedUser.isAdmin ? 'admin' : 'submit');
    }

    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }
  }, []);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ ...popup, show: false }), 3000);
  };

  const handleLogin = (email, password) => {
    // 1. Check Hardcoded Admin
    if (email === 'admin@taweethapisek.ac.th' && password === 'admin1234') {
      const adminUser = { name: 'Admin', email, isAdmin: true };
      loginUser(adminUser);
      return;
    }

    // 2. Check Registered Users from LocalStorage
    const usersList = JSON.parse(localStorage.getItem('regradeUsersList') || '[]');
    const foundUser = usersList.find(u => u.email === email && u.password === password);

    if (foundUser) {
      loginUser(foundUser);
    } else {
      // Fallback for demo/testing if no user found (Optional: remove this if you want strict login)
      // For now, let's show error if not found to be correct
      showPopup('อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'error');
    }
  };

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('regradeUser', JSON.stringify(userData));
    setPage(userData.isAdmin ? 'admin' : 'submit');
    showPopup(userData.isAdmin ? 'เข้าสู่ระบบผู้ดูแลระบบสำเร็จ' : 'เข้าสู่ระบบสำเร็จ');
  };

  const handleRegister = (email, password, name, adminCode) => {
    if (adminCode && adminCode !== ADMIN_SECRET_CODE) {
      showPopup('รหัส Admin ไม่ถูกต้อง', 'error');
      return;
    }

    // Check if email already exists
    const usersList = JSON.parse(localStorage.getItem('regradeUsersList') || '[]');
    if (usersList.some(u => u.email === email)) {
      showPopup('อีเมลนี้ถูกใช้งานแล้ว', 'error');
      return;
    }

    const newUser = {
      name,
      email,
      password, // In a real app, never store plain passwords!
      isAdmin: !!adminCode
    };

    // Save to list
    usersList.push(newUser);
    localStorage.setItem('regradeUsersList', JSON.stringify(usersList));

    // Auto login
    loginUser(newUser);
    showPopup('ลงทะเบียนสำเร็จ');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('regradeUser');
    setPage('login');
    showPopup('ออกจากระบบแล้ว');
  };

  const handleSubmitWork = (data) => {
    const newSubmission = {
      id: Date.now(),
      ...data,
      status: 'รอตรวจ',
      submittedAt: new Date().toISOString(),
      isDeleted: false
    };

    const updatedSubmissions = [newSubmission, ...submissions];
    setSubmissions(updatedSubmissions);
    localStorage.setItem('regradeSubmissions', JSON.stringify(updatedSubmissions));
    showPopup('ส่งงานเรียบร้อยแล้ว');
    setPage('history');
  };

  const updateSubmission = (id, updates) => {
    const updatedSubmissions = submissions.map(sub => {
      if (sub.id === id) {
        const updated = { ...sub, ...updates };
        if (updates.status === 'ตรวจแล้ว' && sub.status !== 'ตรวจแล้ว') {
          updated.completedAt = new Date().toISOString();
        }
        return updated;
      }
      return sub;
    });
    setSubmissions(updatedSubmissions);
    localStorage.setItem('regradeSubmissions', JSON.stringify(updatedSubmissions));
    showPopup('อัปเดตสถานะเรียบร้อย');
  };

  const deleteSubmission = (id) => {
    const updatedSubmissions = submissions.map(sub =>
      sub.id === id ? { ...sub, isDeleted: true, deletedAt: new Date().toISOString() } : sub
    );
    setSubmissions(updatedSubmissions);
    localStorage.setItem('regradeSubmissions', JSON.stringify(updatedSubmissions));
    showPopup('ย้ายไปถังขยะแล้ว');
  };

  const restoreSubmission = (id) => {
    const updatedSubmissions = submissions.map(sub =>
      sub.id === id ? { ...sub, isDeleted: false, deletedAt: null } : sub
    );
    setSubmissions(updatedSubmissions);
    localStorage.setItem('regradeSubmissions', JSON.stringify(updatedSubmissions));
    showPopup('กู้คืนรายการแล้ว');
  };

  const permanentDeleteSubmission = (id) => {
    const updatedSubmissions = submissions.filter(sub => sub.id !== id);
    setSubmissions(updatedSubmissions);
    localStorage.setItem('regradeSubmissions', JSON.stringify(updatedSubmissions));
    showPopup('ลบรายการถาวรแล้ว');
  };

  return (
    <div style={{ fontFamily: "'Sarabun', sans-serif", backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '50px' }}>
      <Header />
      <div style={{ paddingTop: '80px' }}>
        {page === 'login' && <LoginPage handleLogin={handleLogin} handleRegister={handleRegister} />}
        {page === 'submit' && <SubmitWorkPage handleSubmitWork={handleSubmitWork} handleLogout={handleLogout} setPage={setPage} showPopup={showPopup} />}
        {page === 'history' && <HistoryPage userSubmissions={submissions.filter(s => !s.isDeleted)} handleLogout={handleLogout} setPage={setPage} setViewImage={setViewImage} />}
        {page === 'admin' && (
          <AdminPage
            submissions={submissions}
            handleLogout={handleLogout}
            updateSubmission={updateSubmission}
            deleteSubmission={deleteSubmission}
            restoreSubmission={restoreSubmission}
            permanentDeleteSubmission={permanentDeleteSubmission}
            setViewImage={setViewImage}
          />
        )}
      </div>

      <ImageViewer viewImage={viewImage} onClose={() => setViewImage(null)} />
      <PopupNotification popup={popup} onClose={() => setPopup({ ...popup, show: false })} />
    </div>
  );
};

export default App;