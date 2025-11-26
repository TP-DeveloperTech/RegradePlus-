import React, { useState } from 'react';
import { Search, LogOut, Edit2, Trash2, RotateCcw, Trash, ZoomIn, ChevronDown, ChevronUp, MessageSquare, Filter } from 'lucide-react';
import EditSubmissionDialog from '../components/EditSubmissionDialog';
import ExportButton from '../components/ExportButton';

const AdminPage = ({ submissions, onLogout, onUpdateStatus, onDelete, onRestore, onPermanentDelete, onViewImage, onUpdateSubmission, onUpdateNote, onExport }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const [localSearchType, setLocalSearchType] = useState('name');
    const [activeTab, setActiveTab] = useState('active');
    const [expandedStudentId, setExpandedStudentId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [confirmPermanentDelete, setConfirmPermanentDelete] = useState(null);
    const [expandedSubItems, setExpandedSubItems] = useState({});
    const [editingSubmission, setEditingSubmission] = useState(null);
    const [editingNote, setEditingNote] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const toggleSubItem = (studentId, id) => {
        const key = `${studentId}-${id}`;
        setExpandedSubItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleEditNote = (sub) => {
        setEditingNote(sub.id);
        setNoteText(sub.adminNote || '');
    };

    const handleSaveNote = (id) => {
        onUpdateNote(id, noteText);
        setEditingNote(null);
        setNoteText('');
    };

    const filteredSubmissions = submissions.filter(sub => {
        if (sub.isPermanentlyDeleted) return false;
        if (activeTab === 'active' && sub.isDeleted) return false;
        if (activeTab === 'trash' && !sub.isDeleted) return false;
        if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
        if (!localSearchTerm) return true;
        if (localSearchType === 'name') return sub.studentName.toLowerCase().includes(localSearchTerm.toLowerCase());
        return sub.studentId.includes(localSearchTerm);
    });

    const groupedSubmissions = {};
    filteredSubmissions.forEach(sub => {
        if (!groupedSubmissions[sub.studentId]) groupedSubmissions[sub.studentId] = [];
        groupedSubmissions[sub.studentId].push(sub);
    });

    const getStatusColor = (status) => {
        if (status === 'ตรวจแล้ว') return 'status-completed';
        if (status === 'รอตรวจ') return 'status-checking';
        if (status === 'ถูกลบ') return 'status-deleted';
        return 'status-pending';
    };

    const totalSubmissions = submissions.filter(s => !s.isDeleted && !s.isPermanentlyDeleted).length;
    const pendingSubmissions = submissions.filter(s => !s.isDeleted && !s.isPermanentlyDeleted && (s.status === 'รอตรวจ' || s.status === 'ยังไม่ตรวจ')).length;
    const completedSubmissions = submissions.filter(s => !s.isDeleted && !s.isPermanentlyDeleted && s.status === 'ตรวจแล้ว').length;
    const trashCount = submissions.filter(s => s.isDeleted && !s.isPermanentlyDeleted).length;

    return (
        <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '20px 30px', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className="page-title">Admin Dashboard</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <ExportButton data={filteredSubmissions} filename="admin_submissions" onExport={onExport} />
                        <button onClick={onLogout} className="btn btn-danger"><LogOut size={18} /> ออกจากระบบ</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>งานทั้งหมด</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalSubmissions}</div>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>รอตรวจ</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800' }}>{pendingSubmissions}</div>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>ตรวจแล้ว</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>{completedSubmissions}</div>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>ถังขยะ</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f44336' }}>{trashCount}</div>
                    </div>
                </div>
            </div>

            <div className="tabs-container">
                <button onClick={() => setActiveTab('active')} className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}>
                    งานที่ส่ง <span className="tab-badge">{totalSubmissions}</span>
                </button>
                <button onClick={() => setActiveTab('trash')} className={`tab-btn ${activeTab === 'trash' ? 'active' : ''}`}>
                    <Trash size={18} /> ถังขยะ <span className="tab-badge">{trashCount}</span>
                </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <select value={localSearchType} onChange={(e) => setLocalSearchType(e.target.value)} className="form-select" style={{ width: 'auto', minWidth: '150px' }}>
                    <option value="name">ค้นหาด้วยชื่อ</option>
                    <option value="id">ค้นหาด้วยรหัสนักเรียน</option>
                </select>
                <div className="search-input-wrapper" style={{ flex: 1, minWidth: '200px' }}>
                    <input type="text" placeholder={`ค้นหา${localSearchType === 'name' ? 'ชื่อนักเรียน' : 'รหัสนักเรียน'}...`} value={localSearchTerm} onChange={(e) => setLocalSearchTerm(e.target.value)} className="search-input" />
                    <Search size={20} className="search-icon" />
                </div>
                {activeTab === 'active' && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select" style={{ width: 'auto', minWidth: '130px' }}>
                            <option value="all">ทุกสถานะ</option>
                            <option value="ยังไม่ตรวจ">ยังไม่ตรวจ</option>
                            <option value="รอตรวจ">รอตรวจ</option>
                            <option value="ตรวจแล้ว">ตรวจแล้ว</option>
                        </select>
                    </div>
                )}
            </div>

            {Object.keys(groupedSubmissions).length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">∅</div><p className="empty-state-text">{localSearchTerm || statusFilter !== 'all' ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีงานที่ส่งมา'}</p></div>
            ) : (
                <div className="grid-auto-fill">
                    {Object.entries(groupedSubmissions).map(([studentId, subs], index) => {
                        const isExpanded = expandedStudentId === studentId;
                        const student = subs[0];
                        return (
                            <div key={studentId} className={`card ${isExpanded ? 'card-selected' : ''}`} style={{ cursor: 'pointer', animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both` }} onClick={() => setExpandedStudentId(isExpanded ? null : studentId)}>
                                <div style={{ padding: '20px' }}>
                                    <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-primary)' }}>{student.studentName}</h3>
                                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>รหัส: {studentId} | ชั้น: {student.grade}</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="status-badge status-completed">{subs.length} งาน</span>
                                        <button className={`detail-toggle ${isExpanded ? 'active' : ''}`} style={{ width: 'auto', margin: 0, padding: '8px 16px' }}>{isExpanded ? 'ซ่อน' : 'ดูรายละเอียด'}</button>
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div className="detail-content" onClick={(e) => e.stopPropagation()} style={{ padding: '20px', backgroundColor: '#f8f9fa', cursor: 'default' }}>
                                        {subs.map(sub => (
                                            <div key={sub.id} className="submission-item" style={{ padding: 0, overflow: 'hidden', backgroundColor: 'white', marginBottom: '8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                                <div onClick={() => toggleSubItem(studentId, sub.id)} style={{ padding: '10px 15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: expandedSubItems[`${studentId}-${sub.id}`] ? '#f8f9fa' : 'white', borderBottom: expandedSubItems[`${studentId}-${sub.id}`] ? '1px solid var(--border-color)' : 'none' }}>
                                                    <strong style={{ color: 'var(--text-primary)' }}>{sub.subjectName} ({sub.subjectCode})</strong>
                                                    {expandedSubItems[`${studentId}-${sub.id}`] ? <ChevronUp size={20} color="var(--text-secondary)" /> : <ChevronDown size={20} color="var(--text-secondary)" />}
                                                </div>

                                                {expandedSubItems[`${studentId}-${sub.id}`] && (
                                                    <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>ส่งเมื่อ: <span style={{ color: 'var(--text-primary)' }}>{new Date(sub.submittedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
                                                                <div style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>ติด: <span style={{ color: 'var(--text-primary)' }}>{sub.type}</span></div>
                                                                <div style={{ marginBottom: '8px', color: 'var(--text-secondary)', wordBreak: 'break-word' }}>ชั้นที่ติด-ปีการศึกษา: <span style={{ color: 'var(--text-primary)' }}>{sub.gradeYear}</span></div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
                                                                    <strong style={{ color: 'var(--text-primary)' }}>สถานะ:</strong>
                                                                    <select value={sub.status} onChange={(e) => onUpdateStatus(sub.id, e.target.value)} className="form-select" style={{ width: 'auto', padding: '6px 30px 6px 12px', minWidth: '140px', height: '36px' }} onClick={(e) => e.stopPropagation()}>
                                                                        <option value="ยังไม่ตรวจ">ยังไม่ตรวจ</option>
                                                                        <option value="รอตรวจ">รอตรวจ</option>
                                                                        <option value="ตรวจแล้ว">ตรวจแล้ว</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {!sub.isDeleted && (
                                                            <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                                                    <MessageSquare size={16} style={{ color: '#4CAF50' }} />
                                                                    <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>หมายเหตุถึงนักเรียน:</strong>
                                                                </div>
                                                                {editingNote === sub.id ? (
                                                                    <div>
                                                                        <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="เขียนหมายเหตุถึงนักเรียน..." style={{ width: '100%', minHeight: '80px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }} onClick={(e) => e.stopPropagation()} />
                                                                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                                                            <button onClick={() => handleSaveNote(sub.id)} className="btn btn-sm btn-primary">บันทึก</button>
                                                                            <button onClick={() => { setEditingNote(null); setNoteText(''); }} className="btn btn-sm btn-secondary">ยกเลิก</button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        {sub.adminNote ? (
                                                                            <p style={{ margin: '0 0 10px 0', color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.6', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>{sub.adminNote}</p>
                                                                        ) : (
                                                                            <p style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '14px', fontStyle: 'italic' }}>ยังไม่มีหมายเหตุ</p>
                                                                        )}
                                                                        <button onClick={() => handleEditNote(sub)} className="btn btn-sm btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                            <Edit2 size={14} /> {sub.adminNote ? 'แก้ไขหมายเหตุ' : 'เพิ่มหมายเหตุ'}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {sub.images?.length > 0 && (
                                                            <div style={{ marginTop: '15px' }}>
                                                                <div style={{ marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-primary)' }}>รูปงาน ({sub.images.length} รูป):</div>
                                                                <div className="image-grid">
                                                                    {sub.images.map((img, idx) => (
                                                                        <div key={idx} className="image-preview" onClick={() => onViewImage(img)}>
                                                                            <img src={img} alt={`work ${idx + 1}`} />
                                                                            <div className="zoom-icon"><ZoomIn size={20} /></div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                                                            {!sub.isDeleted ? (
                                                                <>
                                                                    <button onClick={() => setEditingSubmission(sub)} className="btn btn-sm btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px 12px' }}>
                                                                        <Edit2 size={14} /> แก้ไข
                                                                    </button>
                                                                    <button onClick={() => setConfirmDelete(sub.id)} className="btn btn-sm btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                        <Trash2 size={14} /> ย้ายไปถังขยะ
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button onClick={() => onRestore(sub.id)} className="btn btn-sm btn-primary"><RotateCcw size={14} /> กู้คืน</button>
                                                                    <button onClick={() => setConfirmPermanentDelete(sub.id)} className="btn btn-sm btn-danger"><Trash size={14} /> ลบถาวร</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {confirmDelete && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <h3 className="modal-title" style={{ color: '#f44336', borderColor: '#f44336' }}>ย้ายไปถังขยะ</h3>
                        <p>คุณต้องการย้ายงานนี้ไปถังขยะหรือไม่?</p>
                        <div className="modal-buttons">
                            <button onClick={() => { onDelete(confirmDelete); setConfirmDelete(null); }} className="btn btn-danger btn-full">ย้ายไปถังขยะ</button>
                            <button onClick={() => setConfirmDelete(null)} className="btn btn-secondary btn-full">ยกเลิก</button>
                        </div>
                    </div>
                </div>
            )}

            {confirmPermanentDelete && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px', border: '2px solid #d32f2f' }}>
                        <h3 className="modal-title" style={{ color: '#d32f2f', borderColor: '#d32f2f' }}>ลบถาวร</h3>
                        <p style={{ fontWeight: 'bold', color: '#d32f2f' }}>คำเตือน! การลบถาวรจะซ่อนงานนี้จากหน้า Admin แต่นักเรียนยังเห็นได้ปกติ</p>
                        <div className="modal-buttons">
                            <button onClick={() => { onPermanentDelete(confirmPermanentDelete); setConfirmPermanentDelete(null); }} className="btn btn-danger btn-full">ลบถาวร</button>
                            <button onClick={() => setConfirmPermanentDelete(null)} className="btn btn-secondary btn-full">ยกเลิก</button>
                        </div>
                    </div>
                </div>
            )}

            {editingSubmission && (
                <EditSubmissionDialog
                    submission={editingSubmission}
                    onSave={(id, data) => { onUpdateSubmission(id, data); setEditingSubmission(null); }}
                    onCancel={() => setEditingSubmission(null)}
                />
            )}
        </div>
    );
};

export default AdminPage;
