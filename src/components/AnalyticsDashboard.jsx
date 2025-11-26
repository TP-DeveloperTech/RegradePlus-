import React, { useMemo } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { TrendingUp, Users, BookOpen, Calendar } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AnalyticsDashboard = ({ submissions }) => {
    // Filter out deleted and permanently deleted submissions
    const activeSubmissions = submissions.filter(s => !s.isDeleted && !s.isPermanentlyDeleted);

    // Status Distribution
    const statusData = useMemo(() => {
        const counts = {
            'รอตรวจ': 0,
            'กำลังตรวจ': 0,
            'ตรวจแล้ว': 0
        };
        activeSubmissions.forEach(s => {
            if (counts[s.status] !== undefined) counts[s.status]++;
        });
        return {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: ['#ff9800', '#2196F3', '#4CAF50'],
                borderWidth: 0
            }]
        };
    }, [activeSubmissions]);

    // Monthly Submissions
    const monthlyData = useMemo(() => {
        const monthCounts = {};
        activeSubmissions.forEach(s => {
            const month = new Date(s.submittedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short' });
            monthCounts[month] = (monthCounts[month] || 0) + 1;
        });
        const sortedMonths = Object.keys(monthCounts).sort();
        return {
            labels: sortedMonths,
            datasets: [{
                label: 'จำนวนงานที่ส่ง',
                data: sortedMonths.map(m => monthCounts[m]),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };
    }, [activeSubmissions]);

    // Top Students
    const topStudents = useMemo(() => {
        const studentCounts = {};
        activeSubmissions.forEach(s => {
            const key = `${s.studentName} (${s.studentId})`;
            studentCounts[key] = (studentCounts[key] || 0) + 1;
        });
        const sorted = Object.entries(studentCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);
        return {
            labels: sorted.map(([name]) => name),
            datasets: [{
                label: 'จำนวนงานที่ส่ง',
                data: sorted.map(([, count]) => count),
                backgroundColor: '#4CAF50',
                borderRadius: 6
            }]
        };
    }, [activeSubmissions]);

    // Subject Distribution
    const subjectData = useMemo(() => {
        const subjectCounts = {};
        activeSubmissions.forEach(s => {
            subjectCounts[s.subjectName] = (subjectCounts[s.subjectName] || 0) + 1;
        });
        const sorted = Object.entries(subjectCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8);
        return {
            labels: sorted.map(([name]) => name),
            datasets: [{
                label: 'จำนวนงาน',
                data: sorted.map(([, count]) => count),
                backgroundColor: '#2196F3',
                borderRadius: 6
            }]
        };
    }, [activeSubmissions]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    return (
        <div style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <TrendingUp size={24} style={{ color: '#4CAF50' }} />
                <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary)' }}>
                    Analytics Dashboard
                </h3>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <Users size={32} style={{ color: '#2196F3', margin: '0 auto 12px' }} />
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {new Set(activeSubmissions.map(s => s.studentId)).size}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        นักเรียนทั้งหมด
                    </div>
                </div>

                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <BookOpen size={32} style={{ color: '#4CAF50', margin: '0 auto 12px' }} />
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {new Set(activeSubmissions.map(s => s.subjectCode)).size}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        วิชาทั้งหมด
                    </div>
                </div>

                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <Calendar size={32} style={{ color: '#ff9800', margin: '0 auto 12px' }} />
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {Math.round(activeSubmissions.length / Math.max(new Set(activeSubmissions.map(s => s.studentId)).size, 1))}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        งานเฉลี่ย/คน
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                {/* Status Distribution */}
                <div className="card" style={{ padding: '20px' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-primary)' }}>
                        สถานะงาน
                    </h4>
                    <div style={{ height: '300px' }}>
                        <Doughnut data={statusData} options={doughnutOptions} />
                    </div>
                </div>

                {/* Monthly Trend */}
                <div className="card" style={{ padding: '20px' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-primary)' }}>
                        แนวโน้มรายเดือน
                    </h4>
                    <div style={{ height: '300px' }}>
                        <Line data={monthlyData} options={chartOptions} />
                    </div>
                </div>

                {/* Top Students */}
                <div className="card" style={{ padding: '20px' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-primary)' }}>
                        นักเรียนที่ส่งงานมากที่สุด (Top 10)
                    </h4>
                    <div style={{ height: '300px' }}>
                        <Bar data={topStudents} options={chartOptions} />
                    </div>
                </div>

                {/* Subject Distribution */}
                <div className="card" style={{ padding: '20px' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-primary)' }}>
                        วิชาที่มีงานมากที่สุด (Top 8)
                    </h4>
                    <div style={{ height: '300px' }}>
                        <Bar data={subjectData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
