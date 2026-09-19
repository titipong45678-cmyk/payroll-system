import React, { useState } from 'react';
import { UserPlus, Trash2, Edit3, Search, UserCheck } from 'lucide-react';

export const EmployeeManager = ({ employees, onSaveEmployee, onDeleteEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);

  const [formData, setFormData] = useState({
    empCode: '',
    name: '',
    department: 'พนักงานขายหน้าร้าน',
    payType: 'daily', // daily | monthly
    dailyRate: 400,
    monthlySalary: 15000,
    bankName: 'กรุงไทย',
    accountNo: ''
  });

  const handleOpenAdd = () => {
    setEditingEmp(null);
    setFormData({
      empCode: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      name: '',
      department: 'พนักงานขายหน้าร้าน',
      payType: 'daily',
      dailyRate: 400,
      monthlySalary: 15000,
      bankName: 'กรุงไทย',
      accountNo: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmp(emp);
    setFormData({ ...emp });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('กรุณาระบุชื่อ-นามสกุล');

    onSaveEmployee({
      ...formData,
      id: editingEmp ? editingEmp.id : Date.now()
    });
    setIsModalOpen(false);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.empCode && emp.empCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: '24px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={22} color="#3b82f6" />
            ข้อมูลพนักงานในระบบ ({employees.length} คน)
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
            จัดการบัญชีรายชื่อพนักงาน ข้อมูลธนาคาร และอัตราค่าแรง
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="ค้นหาพนักงาน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#fff',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                width: '220px'
              }}
            />
          </div>

          <button
            onClick={handleOpenAdd}
            style={{
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              padding: '9px 16px',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px'
            }}
          >
            <UserPlus size={16} />
            เพิ่มพนักงานใหม่
          </button>
        </div>
      </div>

      {/* Employees Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', backgroundColor: '#0f172a' }}>
              <th style={{ padding: '12px' }}>รหัสพนักงาน</th>
              <th style={{ padding: '12px' }}>ชื่อ-นามสกุล</th>
              <th style={{ padding: '12px' }}>แผนก/ตำแหน่ง</th>
              <th style={{ padding: '12px' }}>รูปแบบค่าแรง</th>
              <th style={{ padding: '12px' }}>อัตราค่าแรง</th>
              <th style={{ padding: '12px' }}>ธนาคาร / เลขบัญชี</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  ไม่พบข้อมูลพนักงาน
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '12px', color: '#cbd5e1' }}>{emp.empCode || '-'}</td>
                  <td style={{ padding: '12px', fontWeight: '500', color: '#f8fafc' }}>{emp.name}</td>
                  <td style={{ padding: '12px', color: '#cbd5e1' }}>{emp.department}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      backgroundColor: emp.payType === 'daily' ? '#1e3a8a' : '#065f46',
                      color: emp.payType === 'daily' ? '#93c5fd' : '#a7f3d0',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {emp.payType === 'daily' ? 'รายวัน' : 'รายเดือน'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: '600', color: '#10b981' }}>
                    {emp.payType === 'daily' ? `฿${emp.dailyRate}/วัน` : `฿${emp.monthlySalary.toLocaleString()}/เดือน`}
                  </td>
                  <td style={{ padding: '12px', color: '#cbd5e1' }}>
                    <div>{emp.bankName}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{emp.accountNo || '-'}</div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenEdit(emp)}
                      style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '4px 8px' }}
                      title="แก้ไข"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteEmployee(emp.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px 8px' }}
                      title="ลบ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '500px',
            border: '1px solid #334155', color: '#fff'
          }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
              {editingEmp ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>รหัสพนักงาน</label>
                  <input
                    type="text"
                    value={formData.empCode}
                    onChange={(e) => setFormData({ ...formData, empCode: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>ชื่อ-นามสกุล *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>แผนก/ตำแหน่ง</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>รูปแบบการจ่าย</label>
                  <select
                    value={formData.payType}
                    onChange={(e) => setFormData({ ...formData, payType: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
                  >
                    <option value="daily">รายวัน (Daily)</option>
                    <option value="monthly">รายเดือน (Monthly)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    {formData.payType === 'daily' ? 'อัตราค่าแรงต่อวัน (บาท)' : 'เงินเดือนประจำ (บาท)'}
                  </label>
                  <input
                    type="number"
                    value={formData.payType === 'daily' ? formData.dailyRate : formData.monthlySalary}
                    onChange={(e) => setFormData({
                      ...formData,
                      [formData.payType === 'daily' ? 'dailyRate' : 'monthlySalary']: Number(e.target.value)
                    })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>ธนาคาร</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>เลขที่บัญชีธนาคาร</label>
                  <input
                    type="text"
                    value={formData.accountNo}
                    onChange={(e) => setFormData({ ...formData, accountNo: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: '500' }}
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
