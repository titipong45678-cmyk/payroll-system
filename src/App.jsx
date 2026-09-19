import React, { useState, useEffect } from 'react';
import { PayrollForm } from './components/PayrollForm';
import { EmployeeManager } from './components/EmployeeManager';
import { PayslipHistory } from './components/PayslipHistory';
import { TSGLogo } from './components/TSGLogo';
import { FileText, Users, Clock, PlusCircle, CreditCard, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('create'); // create | history | employees

  // Pre-populated initial mock employees
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('tsg_payroll_employees');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 1,
        empCode: '',
        name: 'นางสาวธิดารัตน์ โพนกลาง',
        department: 'พนักงานขายหน้าร้าน',
        payType: 'daily',
        dailyRate: 400,
        monthlySalary: 12000,
        bankName: 'กรุงไทย',
        accountNo: '327-0-77149-5'
      },
      {
        id: 2,
        empCode: 'EMP002',
        name: 'นายสมชาย ใจดี',
        department: 'พนักงานคลังสินค้า',
        payType: 'monthly',
        dailyRate: 500,
        monthlySalary: 18000,
        bankName: 'กสิกรไทย',
        accountNo: '098-7-65432-1'
      }
    ];
  });

  // Pre-populated initial mock payslip matching user PDF sample
  const [payslips, setPayslips] = useState(() => {
    const saved = localStorage.getItem('tsg_payroll_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 101,
        companyNameTh: 'บริษัท ทวีทรัพย์ โกลบอล กรุ๊ป จำกัด',
        companyNameEn: 'THAWEE SUP GLOBAL GROUP CO., LTD.',
        periodMonthYear: 'รอบเดือนกันยายน / 2569',
        empCode: '',
        empName: 'นางสาวธิดารัตน์ โพนกลาง',
        department: 'พนักงานขายหน้าร้าน',
        dateRangeStart: '7/09/69',
        dateRangeEnd: '11/09/69',
        bankName: 'กรุงไทย',
        accountNo: '327-0-77149-5',
        payrollDate: '12/9/2569',
        incomes: [
          { id: 1, name: 'เงินเดือน กันยายน', subtext: '(รายวัน)', quantity: 5, amount: 400.00 }
        ],
        deductions: [],
        notes: [
          'เริ่มงานวันที่ 7/09/2569 สิ้นสุดการทำงานวันที่ 11/09/2569',
          'เวลา 13.30 น. - 21.30 น.'
        ],
        isOriginal: true,
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('tsg_payroll_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('tsg_payroll_history', JSON.stringify(payslips));
  }, [payslips]);

  // Handlers for employees
  const handleSaveEmployee = (emp) => {
    setEmployees(prev => {
      const exists = prev.find(e => e.id === emp.id);
      if (exists) {
        return prev.map(e => e.id === emp.id ? emp : e);
      }
      return [...prev, emp];
    });
  };

  const handleDeleteEmployee = (id) => {
    if (confirm('คุณต้องการลบข้อมูลพนักงานนี้หรือไม่?')) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  // Handlers for payslips
  const handleSavePayslip = (newPayslip) => {
    setPayslips(prev => [newPayslip, ...prev]);
    alert('บันทึกสลิปเงินเดือนเข้าสู่ประวัติเรียบร้อยแล้ว!');
  };

  const handleDeletePayslip = (id) => {
    if (confirm('คุณต้องการลบประวัติสลิปเงินเดือนนี้หรือไม่?')) {
      setPayslips(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header className="no-print" style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 28px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          {/* Logo & App Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <TSGLogo width={64} height={42} />
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                ระบบเงินเดือน & ใบจ่ายเงินเดือน (Pay Slip System)
                <span style={{ fontSize: '11px', backgroundColor: '#3b82f6', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: '500' }}>
                  THAWEE SUP GLOBAL GROUP
                </span>
              </h1>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                สร้างสลิปเงินเดือน พิมพ์ใบจ่ายเงินเดือน และออกไฟล์ PDF ตรงตามแบบฟอร์มบริษัท 100%
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('create')}
              style={{
                backgroundColor: activeTab === 'create' ? '#3b82f6' : 'transparent',
                color: activeTab === 'create' ? '#fff' : '#94a3b8',
                border: 'none',
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <PlusCircle size={16} /> ออกสลิปเงินเดือน
            </button>

            <button
              onClick={() => setActiveTab('history')}
              style={{
                backgroundColor: activeTab === 'history' ? '#3b82f6' : 'transparent',
                color: activeTab === 'history' ? '#fff' : '#94a3b8',
                border: 'none',
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Clock size={16} /> ประวัติสลิปเงินเดือน ({payslips.length})
            </button>

            <button
              onClick={() => setActiveTab('employees')}
              style={{
                backgroundColor: activeTab === 'employees' ? '#3b82f6' : 'transparent',
                color: activeTab === 'employees' ? '#fff' : '#94a3b8',
                border: 'none',
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Users size={16} /> ข้อมูลพนักงาน ({employees.length})
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Body */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '24px' }}>
        {activeTab === 'create' && (
          <PayrollForm
            employees={employees}
            onSavePayslip={handleSavePayslip}
          />
        )}

        {activeTab === 'history' && (
          <PayslipHistory
            payslips={payslips}
            onDeletePayslip={handleDeletePayslip}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeeManager
            employees={employees}
            onSaveEmployee={handleSaveEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print" style={{ borderTop: '1px solid #334155', textAlign: 'center', padding: '16px', color: '#64748b', fontSize: '13px' }}>
        บริษัท ทวีทรัพย์ โกลบอล กรุ๊ป จำกัด (THAWEE SUP GLOBAL GROUP CO., LTD.) — ระบบทำเงินเดือนและออกสลิปเงินเดือนอัตโนมัติ
      </footer>
    </div>
  );
}
