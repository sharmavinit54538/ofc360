import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  Briefcase,
  FileText,
  CreditCard,
  CalendarCheck,
  CalendarOff,
  TrendingUp,
  Laptop,
  Clock,
  Pencil,
  MoreVertical,
  ChevronDown,
  Camera,
  BadgeCheck,
  MapPin,
  Calendar,
  Mail,
  Phone,
  UserCheck,
  Banknote,
  CalendarPlus,
  Target,
  CheckCircle2,
  Zap,
  Upload,
  FileSpreadsheet,
  MessageSquarePlus,
  MoreHorizontal,
  KeyRound,
  IdCard,
  Star,
  Download,
  Eye,
  ShieldCheck,
  AlertCircle,
  Building2,
  Share2,
  ArrowLeft,
  X,
  Save,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { toast } from '@/shared/lib/toast';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useGetEmployeeByIdQuery, useUpdateEmployeeMutation } from '../api/workforceApi';
import type { EmployeeItem } from '../types/workforce.types';

export type ProfileTab =
  | 'overview'
  | 'personal'
  | 'employment'
  | 'documents'
  | 'payroll'
  | 'attendance'
  | 'leave'
  | 'performance'
  | 'assets'
  | 'history';

interface TabItem {
  id: ProfileTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PROFILE_TABS: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'employment', label: 'Employment', icon: Briefcase },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'payroll', label: 'Payroll', icon: CreditCard },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'leave', label: 'Leave', icon: CalendarOff },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'assets', label: 'Assets', icon: Laptop },
  { id: 'history', label: 'History', icon: Clock },
];

/**
 * Rich default fallback record matching Rahul Sharma (EMP-1025)
 */
const DEFAULT_RAHUL_SHARMA: EmployeeItem = {
  id: 'emp-1025',
  employeeCode: 'EMP-1025',
  firstName: 'Rahul',
  lastName: 'Sharma',
  fullName: 'Rahul Sharma',
  email: 'rahul.sharma@equinoxsphere.com',
  personalEmail: 'rahul.sharma@gmail.com',
  phone: '+91 98765 43210',
  gender: 'MALE',
  department: { id: 'dept-eng', name: 'Engineering' },
  departmentName: 'Engineering',
  designation: { id: 'desg-swe', title: 'Software Developer' },
  designationTitle: 'Software Developer',
  reportingManager: { id: 'mgr-priya', name: 'Priya Mehta' },
  reportingManagerName: 'Priya Mehta',
  joiningDate: '2025-01-15',
  employmentType: 'FULL_TIME',
  status: 'ACTIVE',
  workLocation: 'Noida (HQ)',
  avatarUrl: null,
  role: 'EMPLOYEE',
  dateOfBirth: '2004-01-19',
  maritalStatus: 'Single',
  bloodGroup: 'B+',
  currentAddress: 'Sector 62, Noida, Uttar Pradesh – 201309',
  permanentAddress: 'House 42, Civil Lines, Jaipur, Rajasthan – 302006',
  probationPeriod: '6 Months',
  confirmationDate: '15 Jul 2025',
  noticePeriod: '30 Days',
  tenureYears: '1.8',
  monthlySalary: 45000,
  leaveBalanceDays: 12,
  profileCompletionPercentage: 92,
  rating: 4.5,
  emergencyContactName: 'Sunita Sharma',
  emergencyContactRelation: 'Mother',
  emergencyContactPhone: '+91 98111 22334',
  panNumber: 'ABCPS1234F',
  aadhaarNumber: 'XXXX-XXXX-4812',
  bankName: 'HDFC Bank',
  bankAccountNumber: '50100492819201',
  bankIfsc: 'HDFC0001234',
};

export const EmployeeProfilePage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch from RTK Query if employeeId is provided
  const { data: apiEmployee, refetch } = useGetEmployeeByIdQuery(employeeId || '', {
    skip: !employeeId || employeeId === 'default' || employeeId === 'emp-1025',
  });

  const [updateEmployee] = useUpdateEmployeeMutation();

  // Local state for immediate responsiveness and fallback
  const [localEmployee, setLocalEmployee] = useState<EmployeeItem>(() => {
    return apiEmployee || DEFAULT_RAHUL_SHARMA;
  });

  // Keep in sync when API returns fresh data
  React.useEffect(() => {
    if (apiEmployee) {
      setLocalEmployee((prev) => ({
        ...DEFAULT_RAHUL_SHARMA,
        ...apiEmployee,
        ...prev,
      }));
    }
  }, [apiEmployee]);

  const emp = localEmployee;

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    firstName: emp.firstName,
    lastName: emp.lastName,
    phone: emp.phone,
    personalEmail: emp.personalEmail || '',
    designation: emp.designation?.title || emp.designationTitle || 'Software Developer',
    department: emp.department?.name || emp.departmentName || 'Engineering',
    workLocation: emp.workLocation || 'Noida (HQ)',
    currentAddress: emp.currentAddress || 'Sector 62, Noida, Uttar Pradesh – 201309',
    emergencyContactPhone: emp.emergencyContactPhone || '+91 98111 22334',
  });

  const handleOpenEditModal = () => {
    setEditFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      phone: emp.phone,
      personalEmail: emp.personalEmail || '',
      designation: emp.designation?.title || emp.designationTitle || 'Software Developer',
      department: emp.department?.name || emp.departmentName || 'Engineering',
      workLocation: emp.workLocation || 'Noida (HQ)',
      currentAddress: emp.currentAddress || 'Sector 62, Noida, Uttar Pradesh – 201309',
      emergencyContactPhone: emp.emergencyContactPhone || '+91 98111 22334',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalEmployee((prev) => ({
      ...prev,
      firstName: editFormData.firstName,
      lastName: editFormData.lastName,
      fullName: `${editFormData.firstName} ${editFormData.lastName}`.trim(),
      phone: editFormData.phone,
      personalEmail: editFormData.personalEmail,
      designation: { id: prev.designation?.id || 'desg-1', title: editFormData.designation },
      designationTitle: editFormData.designation,
      department: { id: prev.department?.id || 'dept-1', name: editFormData.department },
      departmentName: editFormData.department,
      workLocation: editFormData.workLocation,
      currentAddress: editFormData.currentAddress,
      emergencyContactPhone: editFormData.emergencyContactPhone,
    }));

    if (employeeId && employeeId !== 'default' && employeeId !== 'emp-1025') {
      try {
        await updateEmployee({
          id: employeeId,
          data: {
            first_name: editFormData.firstName,
            last_name: editFormData.lastName,
            phone: editFormData.phone,
            personal_email: editFormData.personalEmail,
            work_location: editFormData.workLocation,
          },
        }).unwrap();
      } catch {
        // Optimistic local state remains updated
      }
    }

    setIsEditModalOpen(false);
    toast.success('Employee profile updated successfully', { title: 'Profile Updated' });
  };

  // Close dropdown on click outside
  React.useEffect(() => {
    if (!isMoreMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-more-dropdown]')) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMoreMenuOpen]);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ── Top Page Header with Edit Profile & More Action Buttons ────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Employee Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5 truncate">
            Complete employee information, documents, performance and history.
          </p>
        </div>

        {/* Action Button Group: Exact OFC360 Spec */}
        <div className="flex items-center gap-[10px] shrink-0 self-start sm:self-auto">
          {/* 1. Edit Profile Button */}
          <button
            type="button"
            onClick={handleOpenEditModal}
            className="h-[42px] px-4 rounded-[10px] border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-[14px] font-medium shadow-xs inline-flex items-center justify-center gap-2 transition-colors cursor-pointer select-none whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.98]"
          >
            <Pencil className="w-[18px] h-[18px] text-slate-600 dark:text-zinc-300 shrink-0" />
            <span>Edit Profile</span>
          </button>

          {/* 2. More Dropdown Button */}
          <div className="relative" data-more-dropdown>
            <button
              type="button"
              onClick={() => setIsMoreMenuOpen((v) => !v)}
              className="h-[42px] min-w-[100px] px-4 rounded-[10px] border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-[14px] font-medium shadow-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.98]"
              aria-expanded={isMoreMenuOpen}
              aria-haspopup="true"
            >
              <MoreVertical className="w-[18px] h-[18px] text-slate-600 dark:text-zinc-300 shrink-0" />
              <span>More</span>
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
            </button>

            {isMoreMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95"
                onClick={() => setIsMoreMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => toast.info('Downloading employee profile PDF...', { title: 'Export PDF' })}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4 text-indigo-500" />
                  <span>Download Profile PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => toast.success(`Password reset link sent to ${emp.email}`, { title: 'Password Reset' })}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  <span>Reset Password</span>
                </button>
                <button
                  type="button"
                  onClick={() => toast.info('Initiating employee exit workflow...', { title: 'Exit Workflow' })}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>Initiate Exit</span>
                </button>
                <div className="my-1 border-t border-slate-100 dark:border-zinc-800" />
                <button
                  type="button"
                  onClick={() => toast.warning('Account deactivation requested for approval', { title: 'Deactivation' })}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4 text-rose-600" />
                  <span>Deactivate Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Employee Hero Banner Card ──────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Avatar + Core Identity */}
          <div className="flex items-start sm:items-center gap-5">
            {/* Avatar with Camera badge */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-inner overflow-hidden border border-slate-200 dark:border-zinc-700">
                {emp.avatarUrl ? (
                  <img
                    src={emp.avatarUrl}
                    alt={emp.fullName || `${emp.firstName} ${emp.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {emp.firstName?.charAt(0)}
                    {emp.lastName?.charAt(0)}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => toast.info('Avatar photo upload triggered', { title: 'Upload Avatar' })}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm text-slate-600 dark:text-zinc-300 hover:text-indigo-600 transition-colors cursor-pointer"
                title="Change Photo"
                aria-label="Upload photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Core Info Details */}
            <div className="space-y-1.5">
              {/* Row 1: Name + Blue Verified Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {emp.fullName || `${emp.firstName} ${emp.lastName}`}
                </h2>
                <BadgeCheck className="w-6 h-6 text-indigo-600 fill-indigo-100 dark:fill-indigo-950" />
              </div>

              {/* Row 2: EMP-1025 pill + Designation */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold text-xs px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800/60">
                  {emp.employeeCode}
                </span>
                <span className="text-slate-700 dark:text-zinc-300 font-medium text-sm">
                  {emp.designation?.title || emp.designationTitle || 'Software Developer'}
                </span>
              </div>

              {/* Row 3: Meta icons: Engineering • Noida (HQ) • Joined 15 Jan 2025 */}
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {emp.department?.name || emp.departmentName || 'Engineering'}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {emp.workLocation || 'Noida (HQ)'}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Joined 15 Jan 2025
                </span>
              </div>

              {/* Row 4: Green status pill */}
              <div className="pt-0.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  • Active Employee
                </span>
              </div>
            </div>
          </div>

          {/* Center-Right: Contact & Reporting (with Divider) */}
          <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-start pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-zinc-800">
            <div className="hidden lg:block w-px h-16 bg-slate-200 dark:bg-zinc-800 self-center" />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-300">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium truncate">{emp.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-300">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium">{emp.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-300">
                <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  Reporting to:{' '}
                  <button
                    type="button"
                    onClick={() => toast.info(`Manager profile for ${emp.reportingManager?.name || 'Priya Mehta'}`)}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline"
                  >
                    {emp.reportingManager?.name || emp.reportingManagerName || 'Priya Mehta'}
                  </button>
                </span>
              </div>
            </div>

            {/* Far Right: Tenure Highlight Box */}
            <div className="bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl px-6 py-4 text-center min-w-[110px] shrink-0">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {emp.tenureYears || '1.8'}
              </p>
              <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Years</p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">Tenure</p>
            </div>
          </div>
        </div>

        {/* ── C. 10-Tab Horizontal Navigation Bar ─────────────────────────── */}
        <div className="mt-6 pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
          {PROFILE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-all cursor-pointer',
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 hover:border-slate-300'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400')} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB CONTENT AREA ──────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in-50">
          {/* Main 12-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ── Left / Center 8-Column Area ──────────────────────────────── */}
            <div className="lg:col-span-8 space-y-6">
              {/* Top Left: 3 KPI Metric Cards (3-column subgrid) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Years of Service */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {emp.tenureYears || '1.8'} Years
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Years of Service</p>
                  </div>
                </div>

                {/* 2. Monthly Salary */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      ₹{emp.monthlySalary?.toLocaleString('en-IN') || '45,000'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Monthly Salary</p>
                  </div>
                </div>

                {/* 3. Leave Balance */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <CalendarPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {emp.leaveBalanceDays ?? 12} Days
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Leave Balance</p>
                  </div>
                </div>
              </div>

              {/* Middle Left: 2 Side-by-Side Detail Cards (2-column subgrid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Details Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                          <User className="w-4 h-4" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">Basic Details</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenEditModal}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs py-1">
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Full Name</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          {emp.fullName || `${emp.firstName} ${emp.lastName}`}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Employee ID</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">{emp.employeeCode}</span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Date of Birth</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">19 Jan 2004 (21 Years)</span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Gender</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          {emp.gender === 'MALE' ? 'Male' : emp.gender === 'FEMALE' ? 'Female' : 'Other'}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Marital Status</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          {emp.maritalStatus || 'Single'}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Blood Group</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          {emp.bloodGroup || 'B+'}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Personal Email</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200 truncate max-w-[180px]">
                          {emp.personalEmail || 'rahul.sharma@gmail.com'}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Contact Number</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">{emp.phone}</span>
                      </div>
                      <div className="py-2.5 flex justify-between items-start gap-4">
                        <span className="text-slate-500 dark:text-zinc-400 shrink-0">Current Address</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200 text-right">
                          {emp.currentAddress || 'Sector 62, Noida, Uttar Pradesh – 201309'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Details Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">Employment Details</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenEditModal}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs py-1">
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Designation</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          {emp.designation?.title || emp.designationTitle || 'Software Developer'}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Department</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          {emp.department?.name || emp.departmentName || 'Engineering'}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Employment Type</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">Full-time</span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Date of Joining</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">15 Jan 2025</span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Probation Period</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          {emp.probationPeriod || '6 Months'}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Confirmation Date</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          {emp.confirmationDate || '15 Jul 2025'}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Work Location</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          {emp.workLocation || 'Noida (HQ)'}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Reporting Manager</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          {emp.reportingManager?.name || emp.reportingManagerName || 'Priya Mehta'}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-zinc-400">Notice Period</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          {emp.noticePeriod || '30 Days'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right 4-Column Sidebar Area ──────────────────────────────── */}
            <div className="lg:col-span-4 space-y-6">
              {/* Profile Completion Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                    <Target className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Profile Completion</h4>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-center gap-6">
                  {/* SVG Circular Donut Ring (92%) */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          className="stroke-slate-100 dark:stroke-zinc-800 fill-none"
                          strokeWidth="8"
                        />
                        {/* 92% Progress ring: circumference = 2 * PI * 38 = 238.76 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
                          strokeWidth="8"
                          strokeDasharray="238.76"
                          strokeDashoffset="19.1"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">92%</span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-zinc-400">
                      Profile Completion
                    </p>
                  </div>

                  {/* Right checklist */}
                  <div className="space-y-2.5 text-xs w-full">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Personal Information</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Employment Details</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Documents (8/8)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Bank & Payroll</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Emergency Contact</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Quick Actions</h4>
                </div>

                {/* 2x3 Grid of buttons */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleOpenEditModal}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-100 text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer group"
                  >
                    <Pencil className="w-5 h-5 text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Update Info</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('documents')}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-100 text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer group"
                  >
                    <Upload className="w-5 h-5 text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Upload Document</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('payroll')}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-100 text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer group"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">View Payslip</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('leave')}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-100 text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer group"
                  >
                    <Calendar className="w-5 h-5 text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Apply Leave</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info('Raise HR request modal opened', { title: 'Helpdesk' })}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-100 text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer group"
                  >
                    <MessageSquarePlus className="w-5 h-5 text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Raise Request</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMoreMenuOpen(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-100 text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-0.5 mb-1.5 text-indigo-600">
                      <MoreHorizontal className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <ChevronDown className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-semibold">More Actions</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Bottom Row: 3 Equal 4-Column Cards ───────────────────────── */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Recent Activity Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="mt-4 space-y-4">
                    {/* Item 1 */}
                    <div className="flex items-start gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Profile updated</p>
                          <span className="text-[11px] text-slate-400">2 days ago</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">Emergency contact changed</p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded bg-purple-100 text-purple-600 mt-0.5 shrink-0">
                        <Upload className="w-2.5 h-2.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Document uploaded</p>
                          <span className="text-[11px] text-slate-400">5 days ago</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">Aadhaar Card (Verified)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Assigned Assets Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Assigned Assets</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('assets')}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {/* Row 1 */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
                      <div className="flex items-center gap-2.5">
                        <Laptop className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">Laptop</p>
                          <p className="text-[11px] text-slate-500">Dell Latitude 5430</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </div>

                    {/* Row 2 */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
                      <div className="flex items-center gap-2.5">
                        <KeyRound className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">Access Card</p>
                          <p className="text-[11px] text-slate-500">AC-7821</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </div>

                    {/* Row 3 */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
                      <div className="flex items-center gap-2.5">
                        <IdCard className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">ID Card</p>
                          <p className="text-[11px] text-slate-500">ID-1025</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Performance & Goals Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Performance & Goals</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('performance')}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {/* Left box: Gold Star Rating */}
                    <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">Current Rating</span>
                      </div>
                      <div className="mt-3">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">4.5</span>
                        <span className="text-xs text-slate-500 font-medium"> / 5</span>
                      </div>
                    </div>

                    {/* Right box: 67% Goals Ring */}
                    <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 flex flex-col items-center justify-center text-center">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="stroke-slate-200 dark:stroke-zinc-700"
                            strokeWidth="3.5"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="stroke-indigo-600"
                            strokeDasharray="67, 100"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-[11px] font-bold text-slate-900 dark:text-white">67%</span>
                      </div>
                      <p className="mt-1 text-[11px] font-bold text-slate-800 dark:text-zinc-200">Goals (Q4)</p>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400">2 / 3 Completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: PERSONAL INFO ───────────────────────────────────────────── */}
      {activeTab === 'personal' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h3>
              <p className="text-xs text-slate-500">Contact, identity and emergency contacts</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleOpenEditModal}>
              <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit Personal Info
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Identity & Bio</h4>
              <div className="bg-slate-50 dark:bg-zinc-800/40 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Father's Name</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">Mr. R. K. Sharma</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nationality</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">Indian</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PAN Card</span>
                  <span className="font-semibold font-mono text-slate-800 dark:text-zinc-200">
                    {emp.panNumber || 'ABCPS1234F'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Aadhaar Number</span>
                  <span className="font-semibold font-mono text-slate-800 dark:text-zinc-200">
                    {emp.aadhaarNumber || 'XXXX-XXXX-4812'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Emergency Contact</h4>
              <div className="bg-slate-50 dark:bg-zinc-800/40 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Name</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">
                    {emp.emergencyContactName || 'Sunita Sharma'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Relationship</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">
                    {emp.emergencyContactRelation || 'Mother'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Number</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">
                    {emp.emergencyContactPhone || '+91 98111 22334'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: EMPLOYMENT ──────────────────────────────────────────────── */}
      {activeTab === 'employment' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Employment Record</h3>
              <p className="text-xs text-slate-500">Position details, reporting hierarchy and shift schedules</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Contract: Permanent
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 space-y-2">
              <p className="text-slate-400 font-medium">Shift Timing</p>
              <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">09:30 AM – 06:30 PM IST</p>
              <p className="text-[11px] text-slate-500">Standard General Shift (5 Days/Week)</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 space-y-2">
              <p className="text-slate-400 font-medium">Work Mode</p>
              <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">Hybrid (3 Days Office)</p>
              <p className="text-[11px] text-slate-500">Noida HQ Facility, Floor 4</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 space-y-2">
              <p className="text-slate-400 font-medium">Probation Status</p>
              <p className="text-sm font-bold text-emerald-600">Confirmed (15 Jul 2025)</p>
              <p className="text-[11px] text-slate-500">Rating during confirmation: Exceeds (4.6/5)</p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: DOCUMENTS ──────────────────────────────────────────────── */}
      {activeTab === 'documents' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Document Repository</h3>
              <p className="text-xs text-slate-500">Verified identity, contract and educational proofs</p>
            </div>
            <Button
              variant="brand"
              size="sm"
              onClick={() => toast.info('Document upload dialog opened', { title: 'Upload' })}
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Document
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Aadhaar Card', type: 'Identity', date: '15 Jan 2025', size: '1.2 MB' },
              { name: 'PAN Card', type: 'Tax ID', date: '15 Jan 2025', size: '850 KB' },
              { name: 'Offer Letter Signed', type: 'Contract', date: '02 Jan 2025', size: '2.4 MB' },
              { name: 'Appointment Letter', type: 'Contract', date: '15 Jan 2025', size: '1.8 MB' },
              { name: 'B.Tech Degree Certificate', type: 'Education', date: '15 Jan 2025', size: '3.1 MB' },
              { name: 'Previous Experience & Relieving', type: 'Experience', date: '10 Jan 2025', size: '1.5 MB' },
            ].map((doc) => (
              <div
                key={doc.name}
                className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{doc.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {doc.type} • {doc.date} • {doc.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified
                  </span>
                  <button
                    type="button"
                    onClick={() => toast.info(`Viewing ${doc.name}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.success(`Downloaded ${doc.name}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: PAYROLL ────────────────────────────────────────────────── */}
      {activeTab === 'payroll' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Compensation & Payslips</h3>
              <p className="text-xs text-slate-500">Salary structure, bank account and historical payslips</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">Annual CTC</span>
              <p className="text-lg font-bold text-emerald-600">₹6,00,000 / annum</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Salary Breakdown Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Earnings Split</h4>
              <div className="bg-slate-50 dark:bg-zinc-800/40 rounded-xl p-4 divide-y divide-slate-200/60 dark:divide-zinc-700 text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹22,500</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600">House Rent Allowance (HRA)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹11,250</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600">Special Allowance</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹8,250</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600">Conveyance Allowance</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹1,000</span>
                </div>
                <div className="py-2 flex justify-between text-rose-600 font-medium">
                  <span>Provident Fund (PF Deduction)</span>
                  <span>- ₹2,000</span>
                </div>
                <div className="pt-2 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                  <span>Net Take-Home Pay</span>
                  <span className="text-indigo-600">₹45,000</span>
                </div>
              </div>
            </div>

            {/* Bank details & Payslips list */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Deposit Account</h4>
              <div className="bg-slate-50 dark:bg-zinc-800/40 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank Name</span>
                  <span className="font-semibold text-slate-800">{emp.bankName || 'HDFC Bank'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Number</span>
                  <span className="font-semibold font-mono text-slate-800">
                    {emp.bankAccountNumber || '50100492819201'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IFSC Code</span>
                  <span className="font-semibold font-mono text-slate-800">{emp.bankIfsc || 'HDFC0001234'}</span>
                </div>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">Recent Payslips</h4>
              <div className="space-y-2">
                {['October 2026', 'September 2026', 'August 2026'].map((month) => (
                  <div
                    key={month}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">{month} Payslip</span>
                    <button
                      type="button"
                      onClick={() => toast.success(`Downloading ${month} Payslip`)}
                      className="inline-flex items-center gap-1 text-indigo-600 font-semibold hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 6: ATTENDANCE ─────────────────────────────────────────────── */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Attendance Analytics</h3>
              <p className="text-xs text-slate-500">Monthly check-in records and punctuality score</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              96% Present Rate
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40">
              <p className="text-xs text-slate-400 font-medium">Working Days</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">22</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20">
              <p className="text-xs text-emerald-600 font-medium">Days Present</p>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">21</p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20">
              <p className="text-xs text-amber-600 font-medium">Late Arrivals</p>
              <p className="text-xl font-bold text-amber-700 dark:text-amber-300 mt-1">1</p>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20">
              <p className="text-xs text-rose-600 font-medium">Leaves Taken</p>
              <p className="text-xl font-bold text-rose-700 dark:text-rose-300 mt-1">0</p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 7: LEAVE ──────────────────────────────────────────────────── */}
      {activeTab === 'leave' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Leave Balances</h3>
              <p className="text-xs text-slate-500">Available quotas, approval history and encashable balances</p>
            </div>
            <Button
              variant="brand"
              size="sm"
              onClick={() => toast.info('Leave application modal opened', { title: 'Apply Leave' })}
            >
              <CalendarPlus className="w-3.5 h-3.5 mr-1.5" /> Apply Leave
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100">
              <p className="text-xs font-semibold text-blue-700">Casual Leave</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">4 / 6</p>
              <p className="text-[10px] text-slate-500">Days Available</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700">Sick Leave</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">5 / 6</p>
              <p className="text-[10px] text-slate-500">Days Available</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100">
              <p className="text-xs font-semibold text-purple-700">Earned Leave</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">3 / 8</p>
              <p className="text-[10px] text-slate-500">Days Available</p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-700">Total Available</p>
              <p className="text-2xl font-black text-indigo-600 mt-1">12 Days</p>
              <p className="text-[10px] text-slate-500">Eligible for encashment</p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 8: PERFORMANCE ────────────────────────────────────────────── */}
      {activeTab === 'performance' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Performance Appraisals & OKRs</h3>
              <p className="text-xs text-slate-500">Quarterly goal milestones and manager feedback</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>Rating: 4.5 / 5.0</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quarterly OKRs (Q4 2026)</h4>
            <div className="space-y-3">
              {[
                { title: 'Migrate legacy workforce endpoints to RTK Query', progress: 100, status: 'Completed' },
                { title: 'Ship Employee Profile 360 view with 10 interactive tabs', progress: 100, status: 'Completed' },
                { title: 'Reduce bundle size and optimize Vite build by 15%', progress: 35, status: 'In Progress' },
              ].map((goal) => (
                <div key={goal.title} className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-zinc-200">{goal.title}</span>
                    <span
                      className={cn(
                        'font-semibold px-2 py-0.5 rounded-full text-[10px]',
                        goal.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      )}
                    >
                      {goal.status} ({goal.progress}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        goal.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                      )}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 9: ASSETS ─────────────────────────────────────────────────── */}
      {activeTab === 'assets' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Assigned Company Assets</h3>
              <p className="text-xs text-slate-500">Hardware, security tokens and identification cards</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Asset request initiated', { title: 'Request Asset' })}
            >
              <Laptop className="w-3.5 h-3.5 mr-1.5" /> Request New Asset
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Laptop', model: 'Dell Latitude 5430', serial: 'DL-902183', handedOver: '15 Jan 2025' },
              { title: 'Access Card', model: 'AC-7821', serial: 'Noida HQ Gate Access', handedOver: '15 Jan 2025' },
              { title: 'ID Card', model: 'ID-1025', serial: 'OFC360 Official Pass', handedOver: '15 Jan 2025' },
            ].map((asset) => (
              <div
                key={asset.title}
                className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-2 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{asset.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>
                <p className="text-slate-600 font-semibold">{asset.model}</p>
                <p className="text-slate-400 text-[11px]">Serial: {asset.serial}</p>
                <p className="text-slate-400 text-[11px]">Issued: {asset.handedOver}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 10: HISTORY ───────────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-6 animate-in fade-in-50">
          <div className="pb-4 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Audit Trail & Timeline</h3>
            <p className="text-xs text-slate-500">Chronological history of employment events, revisions and approvals</p>
          </div>

          <div className="relative border-l-2 border-slate-200 dark:border-zinc-800 ml-4 space-y-6">
            {[
              { event: 'Emergency contact information updated', date: '2 days ago', author: 'Rahul Sharma (Self)' },
              { event: 'Aadhaar identity verification completed', date: '5 days ago', author: 'HR Compliance' },
              { event: 'Annual Appraisal Cycle Completed – 4.5 Rating', date: '15 Oct 2025', author: 'Priya Mehta' },
              { event: 'Probation Confirmation Approved', date: '15 Jul 2025', author: 'HR Admin' },
              { event: 'Onboarding completed & joined EquinoxSphere', date: '15 Jan 2025', author: 'System' },
            ].map((item, idx) => (
              <div key={idx} className="relative pl-6">
                <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-zinc-900" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">{item.event}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {item.date} • by {item.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EDIT PROFILE MODAL ────────────────────────────────────────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Employee Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Personal Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.personalEmail}
                    onChange={(e) => setEditFormData({ ...editFormData, personalEmail: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={editFormData.designation}
                    onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={editFormData.department}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Work Location
                </label>
                <input
                  type="text"
                  value={editFormData.workLocation}
                  onChange={(e) => setEditFormData({ ...editFormData, workLocation: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Current Address
                </label>
                <textarea
                  rows={2}
                  value={editFormData.currentAddress}
                  onChange={(e) => setEditFormData({ ...editFormData, currentAddress: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="brand"
                  className="flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfilePage;

