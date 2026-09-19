import React, { useState } from 'react';
import { PayslipTemplate } from './PayslipTemplate';
import { exportPayslipToPDF, printPayslip } from '../utils/pdfExport';
import { FileText, Printer, Download, Eye, Trash2, CheckSquare, Square } from 'lucide-react';

export const PayslipHistory = ({ payslips, onDeletePayslip }) => {
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState('');

  const toggleSelectAll = () => {
    if (selectedIds.length === payslips.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(payslips.map(p => p.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkPrint = () => {
    if (selectedIds.length === 0) return alert('กรุณาเลือกรายการสลิปเงินเดือนก่อน');
    window.print();
  };

  const filteredPayslips = payslips.filter(p =>
    filterPeriod === '' || (p.periodMonthYear && p.periodMonthYear.includes(filterPeriod))
  );

  return (
    <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={22} color="#10b981" />
            ประวัติการออกสลิปเงินเดือน ({payslips.length} รายการ)
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
            ค้นหา ตรวจสอบ พิมพ์สลิปย้อนหลัง และดาวน์โหลด PDF เป็นชุด
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkPrint}
              style={{
                backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '8px 14px',
                borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <Printer size={16} /> พิมพ์สลิปที่เลือก ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* History Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', backgroundColor: '#0f172a' }}>
              <th style={{ padding: '12px', width: '40px' }}>
                <button onClick={toggleSelectAll} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  {selectedIds.length === payslips.length && payslips.length > 0 ? <CheckSquare size={18} color="#3b82f6" /> : <Square size={18} />}
                </button>
              </th>
              <th style={{ padding: '12px' }}>รอบเดือน</th>
              <th style={{ padding: '12px' }}>พนักงาน</th>
              <th style={{ padding: '12px' }}>ช่วงวันที่ทำงาน</th>
              <th style={{ padding: '12px' }}>วันที่จ่าย</th>
              <th style={{ padding: '12px' }}>ยอดสุทธิ</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>เครื่องมือ</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayslips.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  ยังไม่มีประวัติการออกสลิปเงินเดือน
                </td>
              </tr>
            ) : (
              filteredPayslips.map((item) => {
                const totalIncome = item.incomes?.reduce((acc, curr) => acc + (Number(curr.amount) * (curr.quantity ? Number(curr.quantity) : 1) || 0), 0) || 0;
                const totalDeduct = item.deductions?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;
                const netPay = totalIncome - totalDeduct;

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => toggleSelectOne(item.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        {selectedIds.includes(item.id) ? <CheckSquare size={18} color="#3b82f6" /> : <Square size={18} />}
                      </button>
                    </td>
                    <td style={{ padding: '12px', color: '#cbd5e1', fontWeight: '500' }}>{item.periodMonthYear}</td>
                    <td style={{ padding: '12px', color: '#f8fafc', fontWeight: '600' }}>
                      {item.empName}
                      <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'normal' }}>{item.department}</div>
                    </td>
                    <td style={{ padding: '12px', color: '#cbd5e1' }}>{item.dateRangeStart} - {item.dateRangeEnd}</td>
                    <td style={{ padding: '12px', color: '#cbd5e1' }}>{item.payrollDate}</td>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#10b981' }}>
                      ฿{netPay.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedPayslip(item)}
                        style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '4px 8px' }}
                        title="ดูตัวอย่างสลิป"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onDeletePayslip(item.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px 8px' }}
                        title="ลบ"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Payslip View Modal */}
      {selectedPayslip && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', width: '100%', maxWidth: '960px',
            maxHeight: '90vh', overflowY: 'auto', border: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>
                ตัวอย่างสลิปเงินเดือน: {selectedPayslip.empName}
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => printPayslip()}
                  style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={16} /> พิมพ์
                </button>
                <button
                  onClick={() => exportPayslipToPDF('modal-printable-payslip', `สลิปเงินเดือน_${selectedPayslip.empName}.pdf`)}
                  style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={16} /> ดาวน์โหลด PDF
                </button>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  ปิด
                </button>
              </div>
            </div>

            <div id="modal-printable-payslip" style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
              <PayslipTemplate data={selectedPayslip} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
