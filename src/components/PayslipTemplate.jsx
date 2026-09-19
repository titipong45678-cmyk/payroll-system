import React from 'react';
import { TSGLogo } from './TSGLogo';

export const PayslipTemplate = React.forwardRef(({ data }, ref) => {
  const payslip = data || {
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
    isOriginal: true
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null || isNaN(val) || val === 0) return '-';
    return Number(val).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const totalIncome = payslip.incomes?.reduce((acc, curr) => acc + (Number(curr.amount) * (curr.quantity ? Number(curr.quantity) : 1) || 0), 0) || 0;
  const totalDeduct = payslip.deductions?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;
  const netIncome = totalIncome - totalDeduct;

  return (
    <div ref={ref} className="payslip-container" id="printable-payslip" style={{ fontFamily: "'Sarabun', 'Prompt', sans-serif" }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        {/* Company Info Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <TSGLogo width={85} height={85} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#000', margin: 0 }}>
              {payslip.companyNameTh}
            </h1>
            <p style={{ fontSize: '13px', fontWeight: '500', color: '#000', margin: '2px 0 0 0' }}>
              {payslip.companyNameEn}
            </p>
          </div>
        </div>

        {/* Payslip Header Right */}
        <div style={{ textAlign: 'right' }}>
          {payslip.isOriginal !== false && (
            <div style={{ color: '#ff0000', fontSize: '28px', fontWeight: 'bold', fontFamily: "'Sarabun', sans-serif", lineHeight: 1 }}>
              ต้นฉบับ
            </div>
          )}
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#000', marginTop: '4px' }}>
            สลิปเงินเดือน / ใบจ่ายเงินเดือน
          </div>
          <div style={{ fontSize: '13px', color: '#000' }}>
            (Pay Slip)
          </div>
        </div>
      </div>

      {/* Period Month / Year Subtitle */}
      <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: '#000', margin: '14px 0 20px 0' }}>
        {payslip.periodMonthYear}
      </div>

      {/* Employee Metadata Block (Borderless, exact matching Image 2 layout) */}
      <div style={{ fontSize: '13px', color: '#000', marginBottom: '16px', lineHeight: 1.4 }}>
        {/* Line 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.5fr 2.2fr 1.3fr 1.3fr', gap: '8px' }}>
          <div>
            <span style={{ fontWeight: 'bold' }}>รหัสพนักงาน</span> {payslip.empCode}
            <div style={{ fontSize: '11px', color: '#333' }}>Emp. Code</div>
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>ชื่อ-สกุล</span> &nbsp;{payslip.empName}
            <div style={{ fontSize: '11px', color: '#333' }}>Name</div>
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>แผนก</span> &nbsp;{payslip.department}
            <div style={{ fontSize: '11px', color: '#333' }}>Dept</div>
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>วันที่</span> &nbsp;{payslip.dateRangeStart}
            <div style={{ fontSize: '11px', color: '#333' }}>Date</div>
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>ถึงวันที่</span> &nbsp;{payslip.dateRangeEnd}
            <div style={{ fontSize: '11px', color: '#333' }}>To</div>
          </div>
        </div>

        {/* Line 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '8px', marginTop: '8px' }}>
          <div>
            <span style={{ fontWeight: 'bold' }}>บัญชีธนาคาร</span> &nbsp;{payslip.bankName}
            <div style={{ fontSize: '11px', color: '#333' }}>Bank</div>
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>เลขที่บัญชีธนาคาร</span> &nbsp;&nbsp;&nbsp;&nbsp;{payslip.accountNo}
            <div style={{ fontSize: '11px', color: '#333' }}>A/C No.</div>
          </div>
        </div>
      </div>

      {/* Main Table Matching Image 2 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #000' }}>
        <thead>
          <tr style={{ backgroundColor: '#d9d9d9', textAlign: 'center', fontWeight: 'bold' }}>
            <th style={{ border: '1px solid #000', padding: '6px 4px', width: '22%' }}>
              รายได้
              <div style={{ fontSize: '11px', fontWeight: 'normal' }}>Income</div>
            </th>
            <th style={{ border: '1px solid #000', padding: '6px 4px', width: '8%' }}>
              จำนวน
              <div style={{ fontSize: '11px', fontWeight: 'normal' }}>Number</div>
            </th>
            <th style={{ border: '1px solid #000', padding: '6px 4px', width: '14%' }}>
              จำนวนเงิน
              <div style={{ fontSize: '11px', fontWeight: 'normal' }}>Amount</div>
            </th>
            <th style={{ border: '1px solid #000', padding: '6px 4px', width: '26%' }}>
              รายการหัก
              <div style={{ fontSize: '11px', fontWeight: 'normal' }}>Deduction</div>
            </th>
            <th style={{ border: '1px solid #000', padding: '6px 4px', width: '15%' }}>
              จำนวนเงิน
              <div style={{ fontSize: '11px', fontWeight: 'normal' }}>Amount</div>
            </th>
            <th style={{ border: '1px solid #000', padding: '6px 4px', width: '15%' }}>
              วันที่จ่าย
              <div style={{ fontSize: '11px', fontWeight: 'normal' }}>Payroll Date</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Main Rows Container */}
          <tr style={{ height: '140px', verticalAlign: 'top' }}>
            {/* Income Title */}
            <td style={{ border: '1px solid #000', borderBottom: 'none', padding: '8px' }}>
              {payslip.incomes?.map((inc, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>
                  <div>{inc.name}</div>
                  {inc.subtext && <div style={{ fontSize: '12px' }}>{inc.subtext}</div>}
                </div>
              ))}
            </td>

            {/* Income Quantity */}
            <td style={{ border: '1px solid #000', borderBottom: 'none', padding: '8px', textAlign: 'center' }}>
              {payslip.incomes?.map((inc, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>
                  {inc.quantity || ''}
                </div>
              ))}
            </td>

            {/* Income Amount */}
            <td style={{ border: '1px solid #000', borderBottom: 'none', padding: '8px' }}>
              {payslip.incomes?.map((inc, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>฿</span>
                  <span>{formatCurrency(Number(inc.amount) * (inc.quantity ? Number(inc.quantity) : 1))}</span>
                </div>
              ))}
            </td>

            {/* Deductions List */}
            <td style={{ border: '1px solid #000', borderBottom: 'none', padding: '8px' }}>
              {payslip.deductions?.map((ded, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>
                  {ded.name}
                </div>
              ))}
            </td>

            {/* Deduction Amount */}
            <td style={{ border: '1px solid #000', borderBottom: 'none', padding: '8px' }}>
              {payslip.deductions?.map((ded, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>฿</span>
                  <span>{formatCurrency(ded.amount)}</span>
                </div>
              ))}
            </td>

            {/* Payroll Date Side Column */}
            <td style={{ border: '1px solid #000', padding: '0', textAlign: 'center', verticalAlign: 'top' }}>
              <div style={{ padding: '24px 8px', fontSize: '13px' }}>
                {payslip.payrollDate}
              </div>
              <div style={{
                backgroundColor: '#d9d9d9', borderTop: '1px solid #000', borderBottom: '1px solid #000',
                padding: '6px 4px', fontWeight: 'bold', fontSize: '13px'
              }}>
                รายได้สุทธิ
              </div>
            </td>
          </tr>

          {/* Table Totals Row */}
          <tr style={{ backgroundColor: '#d9d9d9', fontWeight: 'bold', fontSize: '13px' }}>
            <td colSpan={2} style={{ border: '1px solid #000', padding: '6px 8px', textAlign: 'right' }}>
              รวมรายได้
              <div style={{ fontSize: '10px', fontWeight: 'normal', color: '#333' }}>Total Income</div>
            </td>
            <td style={{ border: '1px solid #000', padding: '6px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>฿</span>
                <span>{formatCurrency(totalIncome)}</span>
              </div>
            </td>
            <td style={{ border: '1px solid #000', padding: '6px 8px', textAlign: 'right' }}>
              รวมรายหัก
              <div style={{ fontSize: '10px', fontWeight: 'normal', color: '#333' }}>Total Deduct</div>
            </td>
            <td style={{ border: '1px solid #000', padding: '6px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>฿</span>
                <span>{totalDeduct > 0 ? formatCurrency(totalDeduct) : '-'}</span>
              </div>
            </td>
            <td style={{ border: '1px solid #000', padding: '6px 8px', backgroundColor: '#d9d9d9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>฿</span>
                <span>{formatCurrency(netIncome)}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footer Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
        {/* Notes Left */}
        <div style={{ fontSize: '12px', color: '#000', lineHeight: 1.5 }}>
          <div style={{ fontWeight: 'bold' }}>* หมายเหตุ *</div>
          {payslip.notes?.map((note, idx) => (
            <div key={idx}>{note}</div>
          ))}
        </div>

        {/* Signature Box Right */}
        <div style={{ width: '220px', border: '1px solid #000', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#d9d9d9', borderBottom: '1px solid #000', padding: '4px', fontSize: '12px', fontWeight: 'bold' }}>
            ลงชื่อพนักงาน
            <div style={{ fontSize: '10px', fontWeight: 'normal' }}>Signature</div>
          </div>
          <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {payslip.signatureImg ? (
              <img src={payslip.signatureImg} alt="Signature" style={{ maxHeight: '40px' }} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
});
