import React, { useState } from 'react';
import { Search, LogOut, ZoomIn, MessageSquare, Filter } from 'lucide-react';

const HistoryPage = ({ submissions, onNavigate, onLogout, onViewImage }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const [localSearchType, setLocalSearchType] = useState('subject');
    const [expandedSubmissions, setExpandedSubmissions] = useState({});
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc');

    // Student can see ALL their submissions, regardless of isDeleted or isPermanentlyDeleted status
    let filteredSubmissions = submissions.filter(sub => {
        // Filter by search term
        if (localSearchTerm) {
            if (localSearchType === 'subject' && !sub.subjectName.toLowerCase().includes(localSearchTerm.toLowerCase())) return false;
            if (localSearchType === 'code' && !sub.subjectCode.toLowerCase().includes(localSearchTerm.toLowerCase())) return false;
        }
        // Filter by status
        if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
        return true;
    });

    // Sort submissions
    filteredSubmissions = filteredSubmissions.sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.submittedAt) - new Date(a.submittedAt);
        if (sortBy === 'date-asc') return new Date(a.submittedAt) - new Date(b.submittedAt);
        if (sortBy === 'subject') return a.subjectName.localeCompare(b.subjectName, 'th');
        return 0;
    });

    const toggleDetail = (id) => setExpandedSubmissions(prev => ({ ...prev, [id]: !prev[id] }));

    const getStatusColor = (status) => {
        if (status === 'ตรวจแล้ว') return 'status-completed';
        if (status === 'รอตรวจ') return 'status-checking';
        return 'status-pending';
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '20px 30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="page-title">ประวัติการส่งงาน ({filteredSubmissions.length} งาน)</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => onNavigate('submit')} className="btn btn-primary">ส่งงานใหม่</button>
                    <button onClick={onLogout} className="btn btn-danger" type="button"><LogOut size={16} /> ออกจากระบบ</button>
                </div>
            </div>

            {/* Filter and Sort Controls */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <select value={localSearchType} onChange={(e) => setLocalSearchType(e.target.value)} className="form-select" style={{ width: 'auto', minWidth: '150px' }}>
                    <option value="subject">ค้นหาด้วยชื่อวิชา</option>
                    <option value="code">ค้นหาด้วยรหัสวิชา</option>
                </select>
                <div className="search-input-wrapper" style={{ flex: 1, minWidth: '200px' }}>
                    <input type="text" placeholder={`ค้นหา${localSearchType === 'subject' ? 'ชื่อวิชา' : 'รหัสวิชา'}...`} value={localSearchTerm} onChange={(e) => setLocalSearchTerm(e.target.value)} className="search-input" />
                </div>
            </div>

            {filteredSubmissions.length === 0 ? (
                <div className="empty-state"><p className="empty-state-text">{localSearchTerm || statusFilter !== 'all' ? 'ไม่พบงานที่ค้นหา' : 'ยังไม่มีประวัติการส่งงาน'}</p></div>
            ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                    {filteredSubmissions.map(sub => (
                        <div key={sub.id} className="card card-border">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: 'var(--text-primary)' }}>{sub.subjectName} ({sub.subjectCode})</h3>
                                    <p style={{ margin: '5px 0', color: 'var(--text-secondary)' }}>ติด {sub.type} | ส่งเมื่อ {new Date(sub.submittedAt).toLocaleDateString('th-TH')}</p>
                                </div>
                                <div className={`status-badge ${getStatusColor(sub.status)}`} style={{ padding: '8px 16px' }}>{sub.status}</div>
                            </div>

                            {/* Admin Note Preview */}
                            {sub.adminNote && (
                                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0f9ff', borderLeft: '3px solid #4CAF50', borderRadius: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                        <MessageSquare size={16} style={{ color: '#4CAF50' }} />
                                        <strong style={{ color: '#4CAF50', fontSize: '14px' }}>หมายเหตุจากครู:</strong>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.5' }}>{sub.adminNote}</p>
                                </div>
                            )}

                            <button onClick={(e) => { e.stopPropagation(); toggleDetail(sub.id); }} className={`detail-toggle ${expandedSubmissions[sub.id] ? 'active' : ''}`} type="button">{expandedSubmissions[sub.id] ? '▼ ซ่อนรายละเอียด' : '▶ ดูรายละเอียด'}</button>

                            {expandedSubmissions[sub.id] && (
                                <div className="detail-content">
                                    <div className="grid-2" style={{ marginBottom: '20px' }}>
                                        <div><strong>ชื่อ:</strong> {sub.studentName}</div>
                                        <div><strong>ชั้น:</strong> {sub.grade}</div>
                                        <div><strong>รหัสนักเรียน:</strong> {sub.studentId}</div>
                                        <div><strong>รหัสวิชา:</strong> {sub.subjectCode}</div>
                                        <div style={{ gridColumn: '1 / -1' }}><strong>ชื่อวิชา:</strong> {sub.subjectName}</div>
                                        <div><strong>ติด:</strong> {sub.type}</div>
                                        <div><strong>ชั้นที่ติด-ปีการศึกษา:</strong> {sub.gradeYear}</div>
                                        <div style={{ gridColumn: '1 / -1' }}><strong>วันที่ส่ง:</strong> {new Date(sub.date).toLocaleDateString('th-TH')}</div>
                                        {sub.completedAt && <div style={{ gridColumn: '1 / -1', backgroundColor: 'var(--primary-green-light)', padding: '10px', borderRadius: '4px' }}><strong>ตรวจเสร็จเมื่อ:</strong> {new Date(sub.completedAt).toLocaleDateString('th-TH')}</div>}
                                    </div>
                                    {sub.images?.length > 0 && (
                                        <div style={{ marginTop: '20px' }}>
                                            <strong style={{ display: 'block', marginBottom: '10px' }}>รูปงาน ({sub.images.length} รูป):</strong>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                                {sub.images.map((img, idx) => (
                                                    <div key={idx} className="image-preview" onClick={() => onViewImage(img)}>
                                                        <img src={img} alt={`work ${idx + 1}`} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                                        <div className="zoom-icon"><ZoomIn size={24} /></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
