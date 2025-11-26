import React, { useState } from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';

const AdvancedSearch = ({ onSearch, onClear }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [filters, setFilters] = useState({
        searchTerm: '',
        searchType: 'name',
        status: 'all',
        grade: 'all',
        type: 'all',
        dateFrom: '',
        dateTo: ''
    });

    const handleSearch = () => {
        onSearch(filters);
    };

    const handleClear = () => {
        const clearedFilters = {
            searchTerm: '',
            searchType: 'name',
            status: 'all',
            grade: 'all',
            type: 'all',
            dateFrom: '',
            dateTo: ''
        };
        setFilters(clearedFilters);
        onClear();
    };

    const hasActiveFilters = filters.searchTerm || filters.status !== 'all' ||
        filters.grade !== 'all' || filters.type !== 'all' ||
        filters.dateFrom || filters.dateTo;

    return (
        <div style={{ marginBottom: '20px' }}>
            {/* Basic Search Bar */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                    value={filters.searchType}
                    onChange={(e) => setFilters({ ...filters, searchType: e.target.value })}
                    className="form-select"
                    style={{ width: 'auto', minWidth: '150px' }}
                >
                    <option value="name">ค้นหาด้วยชื่อ</option>
                    <option value="id">ค้นหาด้วยรหัส</option>
                    <option value="subject">ค้นหาด้วยวิชา</option>
                </select>

                <div className="search-input-wrapper" style={{ flex: 1 }}>
                    <input
                        type="text"
                        placeholder={`ค้นหา${filters.searchType === 'name' ? 'ชื่อนักเรียน' : filters.searchType === 'id' ? 'รหัสนักเรียน' : 'ชื่อวิชา'}...`}
                        value={filters.searchTerm}
                        onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="search-input"
                    />
                    <Search size={20} className="search-icon" />
                </div>

                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="btn btn-outline"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: showAdvanced ? '#4CAF50' : 'white',
                        color: showAdvanced ? 'white' : 'var(--text-primary)',
                        border: `1px solid ${showAdvanced ? '#4CAF50' : 'var(--border-color)'}`
                    }}
                >
                    <Filter size={16} />
                    ตัวกรองขั้นสูง
                </button>

                <button onClick={handleSearch} className="btn btn-primary">
                    <Search size={16} style={{ marginRight: '8px' }} />
                    ค้นหา
                </button>

                {hasActiveFilters && (
                    <button onClick={handleClear} className="btn btn-secondary">
                        <X size={16} style={{ marginRight: '8px' }} />
                        ล้าง
                    </button>
                )}
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div style={{
                    marginTop: '16px',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-primary)' }}>
                        ตัวกรองขั้นสูง
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        {/* Status Filter */}
                        <div>
                            <label className="form-label">สถานะ</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="form-select"
                            >
                                <option value="all">ทุกสถานะ</option>
                                <option value="รอตรวจ">รอตรวจ</option>
                                <option value="กำลังตรวจ">กำลังตรวจ</option>
                                <option value="ตรวจแล้ว">ตรวจแล้ว</option>
                            </select>
                        </div>

                        {/* Grade Filter */}
                        <div>
                            <label className="form-label">ชั้น</label>
                            <select
                                value={filters.grade}
                                onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                                className="form-select"
                            >
                                <option value="all">ทุกชั้น</option>
                                <option value="ม.1">ม.1</option>
                                <option value="ม.2">ม.2</option>
                                <option value="ม.3">ม.3</option>
                                <option value="ม.4">ม.4</option>
                                <option value="ม.5">ม.5</option>
                                <option value="ม.6">ม.6</option>
                            </select>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label className="form-label">ประเภท</label>
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                className="form-select"
                            >
                                <option value="all">ทุกประเภท</option>
                                <option value="0">0</option>
                                <option value="ร">ร</option>
                                <option value="มส">มส</option>
                            </select>
                        </div>

                        {/* Date From */}
                        <div>
                            <label className="form-label">
                                <Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                วันที่เริ่มต้น
                            </label>
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                className="form-input"
                            />
                        </div>

                        {/* Date To */}
                        <div>
                            <label className="form-label">
                                <Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                วันที่สิ้นสุด
                            </label>
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                className="form-input"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedSearch;
