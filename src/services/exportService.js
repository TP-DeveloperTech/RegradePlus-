import * as XLSX from 'xlsx';

/**
 * Export Service
 * Handles data export to Excel and CSV formats
 */

export const exportService = {
    /**
     * Export data to Excel format
     * @param {Array} data - Array of submission objects
     * @param {string} filename - Output filename (without extension)
     */
    exportToExcel: (data, filename = 'submissions') => {
        // Prepare data for export
        const exportData = data.map(sub => ({
            'ชื่อ-นามสกุล': sub.studentName,
            'รหัสนักเรียน': sub.studentId,
            'ชั้น': sub.grade,
            'รหัสวิชา': sub.subjectCode,
            'ชื่อวิชา': sub.subjectName,
            'ติด': sub.type,
            'ชั้นที่ติด-ปีการศึกษา': sub.gradeYear,
            'วันที่ส่ง': new Date(sub.date).toLocaleDateString('th-TH'),
            'สถานะ': sub.status,
            'ส่งเมื่อ': new Date(sub.submittedAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            'ตรวจเสร็จเมื่อ': sub.completedAt ? new Date(sub.completedAt).toLocaleDateString('th-TH') : '-',
            'หมายเหตุจากครู': sub.adminNote || '-'
        }));

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Set column widths
        const colWidths = [
            { wch: 20 }, // ชื่อ-นามสกุล
            { wch: 15 }, // รหัสนักเรียน
            { wch: 10 }, // ชั้น
            { wch: 12 }, // รหัสวิชา
            { wch: 25 }, // ชื่อวิชา
            { wch: 10 }, // ติด
            { wch: 20 }, // ชั้นที่ติด-ปีการศึกษา
            { wch: 15 }, // วันที่ส่ง
            { wch: 12 }, // สถานะ
            { wch: 25 }, // ส่งเมื่อ
            { wch: 15 }, // ตรวจเสร็จเมื่อ
            { wch: 30 }  // หมายเหตุจากครู
        ];
        ws['!cols'] = colWidths;

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'งานที่ส่ง');

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const fullFilename = `${filename}_${timestamp}.xlsx`;

        // Write file
        XLSX.writeFile(wb, fullFilename);
    },

    /**
     * Export data to CSV format
     * @param {Array} data - Array of submission objects
     * @param {string} filename - Output filename (without extension)
     */
    exportToCSV: (data, filename = 'submissions') => {
        // Prepare data for export
        const exportData = data.map(sub => ({
            'ชื่อ-นามสกุล': sub.studentName,
            'รหัสนักเรียน': sub.studentId,
            'ชั้น': sub.grade,
            'รหัสวิชา': sub.subjectCode,
            'ชื่อวิชา': sub.subjectName,
            'ติด': sub.type,
            'ชั้นที่ติด-ปีการศึกษา': sub.gradeYear,
            'วันที่ส่ง': new Date(sub.date).toLocaleDateString('th-TH'),
            'สถานะ': sub.status,
            'ส่งเมื่อ': new Date(sub.submittedAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            'ตรวจเสร็จเมื่อ': sub.completedAt ? new Date(sub.completedAt).toLocaleDateString('th-TH') : '-',
            'หมายเหตุจากครู': sub.adminNote || '-'
        }));

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'งานที่ส่ง');

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const fullFilename = `${filename}_${timestamp}.csv`;

        // Write CSV file
        XLSX.writeFile(wb, fullFilename, { bookType: 'csv' });
    }
};

export default exportService;
