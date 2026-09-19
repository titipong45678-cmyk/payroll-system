import React, { useState, useEffect } from 'react';
import { PayslipTemplate } from './PayslipTemplate';
import { exportPayslipToPDF, printPayslip } from '../utils/pdfExport';
import { PlusCircle, Trash2, Printer, Download, Save, RefreshCw, FileText } from 'lucide-react';

export const PayrollForm = ({ employees, onSavePayslip, initialData }) => {
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  
  const [payslipData, setPayslipData] = useState({
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
      { id: Date.now(), name: 'เงินเดือน กันยายน', subtext: '(รายวัน)', quantity: 5, amount: 400.00 }
    ],
    deductions: [],
    notes: [
      'เริ่มงานวันที่ 7/09/2569 สิ้นสุดการทำงานวันที่ 11/09/2569',
      'เวลา 13.30 น. - 21.30 น.'
    ],
    isOriginal: true
  });

  // When initialData passed (e.g., editing an existing payslip)
  useEffect(() => {
    if (initialData) {
      setPayslipData(initialData);
    }
  }, [initialData]);

  // When selecting an employee from the dropdown
  const handleEmployeeSelect = (empId) => {
    setSelectedEmpId(empId);
    const emp = employees.find(e => e.id === Number(empId) || e.id === empId);
    if (!emp) return;

    setPayslipData(prev => ({
      ...prev,
      empCode: emp.empCode || '',
      empName: emp.name,
      department: emp.department || '',
      bankName: emp.bankName || '',
      accountNo: emp.accountNo || '',
      incomes: [
        {
          id: Date.now(),
          name: emp.payType === 'daily' ? 'เงินเดือน (รายวัน)' : 'เงินเดือนประจำ',
          subtext: emp.payType === 'daily' ? '(รายวัน)' : '(รายเดือน)',
          quantity: emp.payType === 'daily' ? 1 : '',
          amount: emp.payType === 'daily' ? emp.dailyRate : emp.monthlySalary
        }
      ]
    }));
  };

  // Income item operations
  const addIncomeItem = () => {
    setPayslipData(prev => ({
      ...prev,
      incomes: [
        ...prev.incomes,
        { id: Date.now(), name: 'ค่าล่วงเวลา (OT)', subtext: '', quantity: 1, amount: 0 }
      ]
    }));
  };

  const updateIncomeItem = (id, field, value) => {
    setPayslipData(prev => ({
      ...prev,
      incomes: prev.incomes.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeIncomeItem = (id) => {
    setPayslipData(prev => ({
      ...prev,
      incomes: prev.incomes.filter(item => item.id !== id)
    }));
  };

  // Deduction item operations
  const addDeductionItem = () => {
    setPayslipData(prev => ({
      ...prev,
      deductions: [
        ...prev.deductions,
        { id: Date.now(), name: 'หักประกันสังคม', amount: 0 }
      ]
    }));
  };

  const updateDeductionItem = (id, field, value) => {
    setPayslipData(prev => ({
      ...prev,
      deductions: prev.deductions.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeDeductionItem = (id) => {
    setPayslipData(prev => ({
      ...prev,
      deductions: prev.deductions.filter(item => item.id !== id)
    }));
  };

  // Notes operations
  const addNoteLine = () => {
    setPayslipData(prev => ({ ...prev, notes: [...prev.notes, ''] }));
  };

  const updateNoteLine = (index, value) => {
    setPayslipData(prev => {
      const updated = [...prev.notes];
      updated[index] = value;
      return { ...prev, notes: updated };
    });
  };

  const removeNoteLine = (index) => {
    setPayslipData(prev => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (onSavePayslip) {
      onSavePayslip({
        ...payslipData,
        id: payslipData.id || Date.now(),
        createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
      {/* Form Controls Left */}
      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} color="#3b82f6" />
          กรอกข้อมูลสลิปเงินเดือน
        </h2>

        {/* Employee Picker */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>เลือกพนักงานจากระบบ</label>
          <select
            value={selectedEmpId}
            onChange={(e) => handleEmployeeSelect(e.target.value)}
            style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '14px' }}
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.department})
              </option>
            ))}
          </select>
        </div>

        {/* Period & Header Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>รอบเดือน / ปี</label>
            <input
              type="text"
              value={payslipData.periodMonthYear}
              onChange={(e) => setPayslipData({ ...payslipData, periodMonthYear: e.target.value })}
              placeholder="เช่น รอบเดือนกันยายน / 2569"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>วันที่จ่ายเงิน (Payroll Date)</label>
            <input
              type="text"
              value={payslipData.payrollDate}
              onChange={(e) => setPayslipData({ ...payslipData, payrollDate: e.target.value })}
              placeholder="เช่น 12/9/2569"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>
        </div>

        {/* Date Ranges */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>เริ่มวันที่ทำงาน (Date)</label>
            <input
              type="text"
              value={payslipData.dateRangeStart}
              onChange={(e) => setPayslipData({ ...payslipData, dateRangeStart: e.target.value })}
              placeholder="7/09/69"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>ถึงวันที่ (To)</label>
            <input
              type="text"
              value={payslipData.dateRangeEnd}
              onChange={(e) => setPayslipData({ ...payslipData, dateRangeEnd: e.target.value })}
              placeholder="11/09/69"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>
        </div>

        {/* Employee Info Override */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>ชื่อ-สกุล พนักงาน</label>
            <input
              type="text"
              value={payslipData.empName}
              onChange={(e) => setPayslipData({ ...payslipData, empName: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>แผนก (Dept)</label>
            <input
              type="text"
              value={payslipData.department}
              onChange={(e) => setPayslipData({ ...payslipData, department: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>
        </div>

        {/* Bank details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>ธนาคาร</label>
            <input
              type="text"
              value={payslipData.bankName}
              onChange={(e) => setPayslipData({ ...payslipData, bankName: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>เลขที่บัญชี</label>
            <input
              type="text"
              value={payslipData.accountNo}
              onChange={(e) => setPayslipData({ ...payslipData, accountNo: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>
        </div>

        {/* Income Items Section */}
        <div style={{ borderTop: '1px solid #334155', paddingTop: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>รายการรายได้ (Income)</h4>
            <button
              onClick={addIncomeItem}
              style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
            >
              <PlusCircle size={14} /> เพิ่มรายการ
            </button>
          </div>

          {payslipData.incomes.map((inc) => (
            <div key={inc.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="ชื่อรายการ"
                value={inc.name}
                onChange={(e) => updateIncomeItem(inc.id, 'name', e.target.value)}
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '13px' }}
              />
              <input
                type="text"
                placeholder="(รายวัน)"
                value={inc.subtext || ''}
                onChange={(e) => updateIncomeItem(inc.id, 'subtext', e.target.value)}
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '13px' }}
              />
              <input
                type="number"
                placeholder="จำนวน"
                value={inc.quantity}
                onChange={(e) => updateIncomeItem(inc.id, 'quantity', e.target.value)}
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '13px' }}
              />
              <input
                type="number"
                placeholder="จำนวนเงิน/หน่วย"
                value={inc.amount}
                onChange={(e) => updateIncomeItem(inc.id, 'amount', e.target.value)}
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '13px' }}
              />
              <button
                onClick={() => removeIncomeItem(inc.id)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Deductions Items Section */}
        <div style={{ borderTop: '1px solid #334155', paddingTop: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>รายการหัก (Deduction)</h4>
            <button
              onClick={addDeductionItem}
              style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
            >
              <PlusCircle size={14} /> เพิ่มรายการหัก
            </button>
          </div>

          {payslipData.deductions.length === 0 ? (
            <p style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>ไม่มีรายการหัก</p>
          ) : (
            payslipData.deductions.map((ded) => (
              <div key={ded.id} style={{ display: 'grid', gridTemplateColumns: '3fr 2fr auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="ชื่อรายการหัก"
                  value={ded.name}
                  onChange={(e) => updateDeductionItem(ded.id, 'name', e.target.value)}
                  style={{ padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '13px' }}
                />
                <input
                  type="number"
                  placeholder="จำนวนเงิน"
                  value={ded.amount}
                  onChange={(e) => updateDeductionItem(ded.id, 'amount', e.target.value)}
                  style={{ padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '13px' }}
                />
                <button
                  onClick={() => removeDeductionItem(ded.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Remarks Notes Section */}
        <div style={{ borderTop: '1px solid #334155', paddingTop: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '600' }}>หมายเหตุ (Notes)</h4>
            <button
              onClick={addNoteLine}
              style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
            >
              <PlusCircle size={14} /> เพิ่มบรรทัด
            </button>
          </div>

          {payslipData.notes.map((note, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
              <input
                type="text"
                value={note}
                onChange={(e) => updateNoteLine(idx, e.target.value)}
                style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '13px' }}
              />
              <button
                onClick={() => removeNoteLine(idx)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Options */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
          <input
            type="checkbox"
            id="isOriginal"
            checked={payslipData.isOriginal}
            onChange={(e) => setPayslipData({ ...payslipData, isOriginal: e.target.checked })}
          />
          <label htmlFor="isOriginal" style={{ fontSize: '13px', color: '#cbd5e1', cursor: 'pointer' }}>
            แสดงลายน้ำตัวแดง "ต้นฉบับ"
          </label>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1, backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px',
              borderRadius: '8px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            <Save size={16} /> บันทึกประวัติสลิป
          </button>
        </div>
      </div>

      {/* Live Preview Panel Right */}
      <div style={{ position: 'sticky', top: '24px' }}>
        {/* Export / Action Buttons Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f8fafc' }}>
            ตัวอย่างสลิปเงินเดือน (Live Preview)
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => printPayslip()}
              style={{
                backgroundColor: '#334155', color: '#fff', border: 'none', padding: '8px 14px',
                borderRadius: '6px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <Printer size={16} /> พิมพ์สลิป
            </button>
            <button
              onClick={() => exportPayslipToPDF('printable-payslip', `สลิปเงินเดือน_${payslipData.empName}.pdf`)}
              style={{
                backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '8px 14px',
                borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <Download size={16} /> ดาวน์โหลด PDF
            </button>
          </div>
        </div>

        {/* The Live Rendered Payslip Paper */}
        <div style={{ backgroundColor: '#475569', padding: '16px', borderRadius: '8px', overflowX: 'auto' }}>
          <PayslipTemplate data={payslipData} />
        </div>
      </div>
    </div>
  );
};
