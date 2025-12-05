import React, { useState } from 'react';

const EditSubmissionDialog = ({ submission, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ ...submission });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData.id, formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">แก้ไขข้อมูลงาน</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">ชื่อ-นามสกุล</label>
                            <input name="studentName" value={formData.studentName} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">รหัสนักเรียน</label>
                            <input name="studentId" value={formData.studentId} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">ชั้นเรียนปัจจุบัน</label>
                            <input name="grade" value={formData.grade} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">รหัสวิชาที่ติด</label>
                            <input name="subjectCode" value={formData.subjectCode} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">ชื่อวิชาที่ติด</label>
                            <input name="subjectName" value={formData.subjectName} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">ติด</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="form-select">
                                <option value="ศูนย์">ศูนย์</option>
                                <option value="ร.">ร.</option>
                                <option value="มส.">มส.</option>
                                <option value="มผ.">มผ.</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">ชั้นที่ติด-ปีการศึกษา</label>
                            <input name="gradeYear" value={formData.gradeYear} onChange={handleChange} className="form-input" required />
                        </div>
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="btn btn-primary btn-full">บันทึก</button>
                        <button type="button" onClick={onCancel} className="btn btn-secondary btn-full">ยกเลิก</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSubmissionDialog;
