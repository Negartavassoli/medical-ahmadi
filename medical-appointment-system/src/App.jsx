import React, { useEffect, useState } from 'react';
import {
  Stethoscope, Calendar, Clock, User, Users, CheckCircle2, XCircle,
  AlertCircle, ChevronLeft, ChevronRight, LogOut, PlusCircle, History,
  ShieldCheck, Sparkles, Award, MapPin, KeyRound, UserPlus, Shield,
  Trash2, Lock, Unlock, Phone, ArrowLeft, HeartPulse, Star, Building2
} from 'lucide-react';

// داده‌های اولیه کاربران سیستم (بیماران، منشی‌ها و ادمین‌ها)
const INITIAL_USERS = [
  {
    id: 1,
    username: 'negar_tavassoli',
    password: 'User@1234',
    fullName: 'نگار توسلی',
    phone: '09123456789',
    nationalId: '0012345678',
    role: 'patient', // 'patient' | 'secretary' | 'admin'
    birthDate: '۱۳۷۶/۰۵/۱۴',
    gender: 'زن',
    isActive: true
  },
  {
    id: 2,
    username: 'amir_rezaei',
    password: 'User@1234',
    fullName: 'امیرحسین رضایی',
    phone: '09121112233',
    nationalId: '0023456789',
    role: 'patient',
    birthDate: '۱۳۷۰/۰۲/۱۰',
    gender: 'مرد',
    isActive: true
  },
  {
    id: 3,
    username: 'monshi_clinic',
    password: 'Monshi@1234',
    fullName: 'مریم کاظمی (منشی ارشد)',
    phone: '09120000001',
    nationalId: '0098765432',
    role: 'secretary',
    birthDate: '۱۳۷۴/۰۸/۱۹',
    gender: 'زن',
    isActive: true
  },
  {
    id: 4,
    username: 'admin_dr',
    password: 'Admin@1234',
    fullName: 'دکتر سارا احمدی (مدیر سیستم)',
    phone: '09120000002',
    nationalId: '0087654321',
    role: 'admin',
    birthDate: '۱۳۶۲/۰۴/۰۵',
    gender: 'زن',
    isActive: true
  }
];

// داده‌های اولیه برنامه پزشک (تقویم آبان ۱۴۰۵)
const INITIAL_SCHEDULES = [
  { id: 1, date: '۱۴۰۵/۰۸/۰۱', dayName: 'دوشنبه', dayNum: '۰۱', maxCapacity: 15, bookedCount: 15, isActive: true, shift: 'عصر (۱۶ تا ۲۰)' },
  { id: 2, date: '۱۴۰۵/۰۸/۰۲', dayName: 'سه‌شنبه', dayNum: '۰۲', maxCapacity: 0, bookedCount: 0, isActive: false, shift: 'عدم پذیرش' },
  { id: 3, date: '۱۴۰۵/۰۸/۰۳', dayName: 'چهارشنبه', dayNum: '۰۳', maxCapacity: 15, bookedCount: 15, isActive: true, shift: 'عصر (۱۶ تا ۲۰)' },
  { id: 4, date: '۱۴۰۵/۰۸/۰۴', dayName: 'پنج‌شنبه', dayNum: '۰۴', maxCapacity: 0, bookedCount: 0, isActive: false, shift: 'عدم پذیرش' },
  { id: 5, date: '۱۴۰۵/۰۸/۰۵', dayName: 'جمعه', dayNum: '۰۵', maxCapacity: 0, bookedCount: 0, isActive: false, shift: 'تعطیل رسمی' },
  { id: 6, date: '۱۴۰۵/۰۸/۰۶', dayName: 'شنبه', dayNum: '۰۶', maxCapacity: 20, bookedCount: 16, isActive: true, shift: 'عصر (۱۶ تا ۲۰)' },
  { id: 7, date: '۱۴۰۵/۰۸/۰۷', dayName: 'یکشنبه', dayNum: '۰۷', maxCapacity: 20, bookedCount: 11, isActive: true, shift: 'صبح (۹ تا ۱۳)' },
  { id: 8, date: '۱۴۰۵/۰۸/۰۸', dayName: 'دوشنبه', dayNum: '۰۸', maxCapacity: 20, bookedCount: 13, isActive: true, shift: 'عصر (۱۶ تا ۲۰)' },
  { id: 9, date: '۱۴۰۵/۰۸/۰۹', dayName: 'سه‌شنبه', dayNum: '۰۹', maxCapacity: 0, bookedCount: 0, isActive: false, shift: 'عدم پذیرش' },
  { id: 10, date: '۱۴۰۵/۰۸/۱۰', dayName: 'چهارشنبه', dayNum: '۱۰', maxCapacity: 20, bookedCount: 8, isActive: true, shift: 'عصر (۱۶ تا ۲۰)' },
  { id: 11, date: '۱۴۰۵/۰۸/۱۱', dayName: 'پنج‌شنبه', dayNum: '۱۱', maxCapacity: 15, bookedCount: 5, isActive: true, shift: 'صبح (۹ تا ۱۳)' },
  { id: 12, date: '۱۴۰۵/۰۸/۱۲', dayName: 'جمعه', dayNum: '۱۲', maxCapacity: 0, bookedCount: 0, isActive: false, shift: 'تعطیل رسمی' },
  { id: 13, date: '۱۴۰۵/۰۸/۱۳', dayName: 'شنبه', dayNum: '۱۳', maxCapacity: 20, bookedCount: 3, isActive: true, shift: 'عصر (۱۶ تا ۲۰)' },
  { id: 14, date: '۱۴۰۵/۰۸/۱۴', dayName: 'یکشنبه', dayNum: '۱۴', maxCapacity: 20, bookedCount: 0, isActive: true, shift: 'صبح (۹ تا ۱۳)' },
];

// لیست ۱۲ ماه سال شمسی و تعداد روز هر ماه برای ساخت تقویم کامل سال ۱۴۰۵
const JALALI_MONTHS = [
  { index: 1, name: 'فروردین', code: '۰۱', days: 31, startWeekday: 6 },
  { index: 2, name: 'اردیبهشت', code: '۰۲', days: 31, startWeekday: 2 },
  { index: 3, name: 'خرداد', code: '۰۳', days: 31, startWeekday: 5 },
  { index: 4, name: 'تیر', code: '۰۴', days: 31, startWeekday: 1 },
  { index: 5, name: 'مرداد', code: '۰۵', days: 31, startWeekday: 4 },
  { index: 6, name: 'شهریور', code: '۰۶', days: 31, startWeekday: 0 },
  { index: 7, name: 'مهر', code: '۰۷', days: 30, startWeekday: 3 },
  { index: 8, name: 'آبان', code: '۰۸', days: 30, startWeekday: 5 },
  { index: 9, name: 'آذر', code: '۰۹', days: 30, startWeekday: 0 },
  { index: 10, name: 'دی', code: '۱۰', days: 30, startWeekday: 2 },
  { index: 11, name: 'بهمن', code: '۱۱', days: 30, startWeekday: 4 },
  { index: 12, name: 'اسفند', code: '۱۲', days: 29, startWeekday: 6 }
];

const WEEKDAYS_FA = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

const toPersianDigits = (num) => String(num).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const pad2 = (num) => String(num).padStart(2, '0');

function buildFullYearSchedules() {
  const customMap = new Map();
  INITIAL_SCHEDULES.forEach(item => {
    customMap.set(item.date, item);
  });

  const allDays = [];
  let runningId = 1;

  JALALI_MONTHS.forEach((month) => {
    for (let d = 1; d <= month.days; d++) {
      const weekdayIndex = (month.startWeekday + (d - 1)) % 7;
      const dayName = WEEKDAYS_FA[weekdayIndex];
      const dateStr = `۱۴۰۵/${month.code}/${toPersianDigits(pad2(d))}`;

      if (customMap.has(dateStr)) {
        const existing = customMap.get(dateStr);
        allDays.push({
          ...existing,
          id: runningId++,
          monthIndex: month.index,
          monthName: month.name,
          dayNumberRaw: d,
          weekdayIndex
        });
      } else {
        const isFriday = weekdayIndex === 6;
        const isThursday = weekdayIndex === 5;
        allDays.push({
          id: runningId++,
          date: dateStr,
          monthIndex: month.index,
          monthName: month.name,
          dayNumberRaw: d,
          weekdayIndex,
          dayName,
          dayNum: toPersianDigits(pad2(d)),
          maxCapacity: isFriday ? 0 : isThursday ? 12 : 20,
          bookedCount: 0,
          isActive: !isFriday,
          shift: isFriday ? 'تعطیل رسمی' : isThursday ? 'صبح (۹ تا ۱۳)' : 'عصر (۱۶ تا ۲۰)'
        });
      }
    }
  });

  return allDays;
}

const FULL_YEAR_SCHEDULES = buildFullYearSchedules();

const INITIAL_APPOINTMENTS = [
  {
    id: 101,
    username: 'negar_tavassoli',
    patientName: 'نگار توسلی',
    nationalId: '0012345678',
    phone: '09123456789',
    scheduleId: 8,
    date: '۱۴۰۵/۰۸/۰۸',
    dayName: 'دوشنبه',
    shift: 'عصر (۱۶ تا ۲۰)',
    trackingCode: 'TRK-84920',
    queueNumber: 14,
    estimatedTime: '۱۸:۱۵',
    status: 'booked',
    createdAt: '۱۴۰۵/۰۸/۰۲'
  },
  {
    id: 102,
    username: 'amir_rezaei',
    patientName: 'امیرحسین رضایی',
    nationalId: '0023456789',
    phone: '09121112233',
    scheduleId: 6,
    date: '۱۴۰۵/۰۸/۰۶',
    dayName: 'شنبه',
    shift: 'عصر (۱۶ تا ۲۰)',
    trackingCode: 'TRK-73194',
    queueNumber: 17,
    estimatedTime: '۱۸:۴۵',
    status: 'booked',
    createdAt: '۱۴۰۵/۰۸/۰۱'
  },
  {
    id: 103,
    username: 'negar_tavassoli',
    patientName: 'نگار توسلی',
    nationalId: '0012345678',
    phone: '09123456789',
    scheduleId: 1,
    date: '۱۴۰۵/۰۷/۱۵',
    dayName: 'چهارشنبه',
    shift: 'عصر (۱۶ تا ۲۰)',
    trackingCode: 'TRK-61029',
    queueNumber: 5,
    estimatedTime: '۱۶:۴۵',
    status: 'visited',
    createdAt: '۱۴۰۵/۰۷/۱۰'
  }
];

const ROLE_LABELS = {
  patient: 'بیمار',
  secretary: 'منشی',
  admin: 'ادمین / پزشک'
};

function isValidIranianNationalId(input) {
  if (!/^\d{10}$/.test(input)) return false;
  const check = +input[9];
  const sum = input
    .split('')
    .slice(0, 9)
    .reduce((acc, x, i) => acc + +x * (10 - i), 0) % 11;
  return sum < 2 ? check === sum : check + sum === 11;
}

export default function App() {
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'fa';
  }, []);

  const [users, setUsers] = useState(INITIAL_USERS);
  const [schedules, setSchedules] = useState(FULL_YEAR_SCHEDULES);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  // به صورت پیش‌فرض صفحه اول لندینگ پیج باز می‌شود
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'booking' | 'checkout' | 'patient-dashboard' | 'doctor-dashboard' | 'auth'

  const [selectedMonth, setSelectedMonth] = useState(8);
  const [selectedScheduleId, setSelectedScheduleId] = useState(() => {
    const found = FULL_YEAR_SCHEDULES.find(s => s.date === '۱۴۰۵/۰۸/۰۸');
    return found ? found.id : 1;
  });
  const [dashboardTab, setDashboardTab] = useState('upcoming');
  const [doctorTab, setDoctorTab] = useState('appointments');
  const [toast, setToast] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    nationalId: '',
    phone: '',
    notes: ''
  });

  const [authMode, setAuthMode] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    nationalId: ''
  });

  const [doctorDateFilter, setDoctorDateFilter] = useState('all');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [newSlotModal, setNewSlotModal] = useState(false);
  const [newSlotForm, setNewSlotForm] = useState({
    monthIndex: 8,
    dayNumberRaw: 15,
    maxCapacity: 20,
    shift: 'عصر (۱۶ تا ۲۰)'
  });

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [newStaffUser, setNewStaffUser] = useState({
    username: '',
    password: '',
    fullName: '',
    phone: '',
    nationalId: '',
    role: 'secretary'
  });

  const isStaff = currentUser && (currentUser.role === 'secretary' || currentUser.role === 'admin');

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  const selectedSchedule = schedules.find(s => s.id === selectedScheduleId);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const cleanUsername = loginForm.username.trim().toLowerCase();
    const matchedUser = users.find(
      u => u.username.toLowerCase() === cleanUsername && u.password === loginForm.password
    );

    if (!matchedUser) {
      showNotification('نام کاربری یا رمز عبور اشتباه است.', 'error');
      return;
    }

    if (!matchedUser.isActive) {
      showNotification('این حساب کاربری توسط مدیریت غیرفعال شده است.', 'error');
      return;
    }

    setCurrentUser(matchedUser);
    setLoginForm({ username: '', password: '' });
    showNotification(`خوش آمدید ${matchedUser.fullName} (${ROLE_LABELS[matchedUser.role]})`, 'success');

    if (matchedUser.role === 'secretary' || matchedUser.role === 'admin') {
      setActiveView('doctor-dashboard');
    } else {
      setActiveView('booking');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const cleanUsername = registerForm.username.trim().toLowerCase();

    if (!/^[a-zA-Z0-9_]{4,20}$/.test(cleanUsername)) {
      showNotification('نام کاربری باید بین ۴ تا ۲۰ کاراکتر و شامل حروف انگلیسی، عدد یا خط زیر (_) باشد.', 'error');
      return;
    }

    if (registerForm.password.length < 6) {
      showNotification('رمز عبور باید حداقل ۶ کاراکتر باشد.', 'error');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      showNotification('رمز عبور و تکرار آن یکسان نیستند.', 'error');
      return;
    }

    if (registerForm.fullName.trim().length < 3) {
      showNotification('لطفاً نام و نام خانوادگی معتبر وارد کنید.', 'error');
      return;
    }

    if (!/^09\d{9}$/.test(registerForm.phone)) {
      showNotification('شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.', 'error');
      return;
    }

    if (!isValidIranianNationalId(registerForm.nationalId)) {
      showNotification('کد ملی وارد شده معتبر نیست.', 'error');
      return;
    }

    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      showNotification('این نام کاربری قبلاً ثبت شده است؛ نام کاربری دیگری انتخاب کنید.', 'error');
      return;
    }

    const createdUser = {
      id: Date.now(),
      username: cleanUsername,
      password: registerForm.password,
      fullName: registerForm.fullName.trim(),
      phone: registerForm.phone,
      nationalId: registerForm.nationalId,
      role: 'patient',
      birthDate: '',
      gender: '',
      isActive: true
    };

    setUsers(prev => [...prev, createdUser]);
    setCurrentUser(createdUser);
    setRegisterForm({
      username: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
      nationalId: ''
    });

    showNotification('ثبت‌نام با موفقیت انجام شد! اکنون می‌توانید نوبت خود را رزرو کنید.', 'success');
    setActiveView('booking');
  };

  const handleAdminCreateUser = (e) => {
    e.preventDefault();
    const cleanUsername = newStaffUser.username.trim().toLowerCase();

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
      showNotification('نام کاربری باید معتبر (حروف انگلیسی، عدد یا _) باشد.', 'error');
      return;
    }

    if (newStaffUser.password.length < 6) {
      showNotification('رمز عبور باید حداقل ۶ کاراکتر باشد.', 'error');
      return;
    }

    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      showNotification('این نام کاربری تکراری است.', 'error');
      return;
    }

    const item = {
      id: Date.now(),
      username: cleanUsername,
      password: newStaffUser.password,
      fullName: newStaffUser.fullName.trim(),
      phone: newStaffUser.phone,
      nationalId: newStaffUser.nationalId,
      role: newStaffUser.role,
      isActive: true
    };

    setUsers(prev => [item, ...prev]);
    setNewStaffUser({
      username: '',
      password: '',
      fullName: '',
      phone: '',
      nationalId: '',
      role: 'secretary'
    });
    setUserModalOpen(false);
    showNotification(`کاربر جدید با نقش «${ROLE_LABELS[item.role]}» ایجاد شد.`, 'success');
  };

  const handleChangeUserRole = (userId, nextRole) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: nextRole } : u)));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, role: nextRole }));
    }
    showNotification(`نقش کاربر به «${ROLE_LABELS[nextRole]}» تغییر یافت.`, 'info');
  };

  const handleToggleUserActive = (userId) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, isActive: !u.isActive } : u)));
    showNotification('وضعیت فعال بودن حساب کاربری بروزرسانی شد.', 'info');
  };

  const handleDeleteUser = (userId) => {
    if (currentUser && currentUser.id === userId) {
      showNotification('امکان حذف حساب کاربری فعال فعلی وجود ندارد.', 'error');
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
    showNotification('کاربر از سیستم حذف شد.', 'info');
  };

  const handleProceedToCheckout = () => {
    if (!selectedSchedule || !selectedSchedule.isActive) {
      showNotification('لطفاً یک روز کاری فعال را از تقویم انتخاب کنید.', 'error');
      return;
    }
    const remaining = selectedSchedule.maxCapacity - selectedSchedule.bookedCount;
    if (remaining <= 0) {
      showNotification('ظرفیت این روز تکمیل شده است.', 'error');
      return;
    }
    if (!currentUser) {
      showNotification('برای ثبت نوبت، ابتدا وارد حساب کاربری خود شوید یا ثبت‌نام کنید.', 'warning');
      setAuthMode('login');
      setActiveView('auth');
      return;
    }
    setBookingForm({
      fullName: currentUser.fullName || '',
      nationalId: currentUser.nationalId || '',
      phone: currentUser.phone || '',
      notes: ''
    });
    setActiveView('checkout');
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();

    if (!bookingForm.fullName.trim() || bookingForm.fullName.trim().length < 3) {
      showNotification('لطفاً نام و نام خانوادگی معتبر وارد کنید.', 'error');
      return;
    }
    if (!/^09\d{9}$/.test(bookingForm.phone)) {
      showNotification('شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.', 'error');
      return;
    }
    if (!isValidIranianNationalId(bookingForm.nationalId)) {
      showNotification('کد ملی وارد شده معتبر نیست (بررسی الگوریتم کد ملی ایران).', 'error');
      return;
    }

    const hasActiveAppointment = appointments.some(
      app => app.nationalId === bookingForm.nationalId && app.status === 'booked'
    );
    if (hasActiveAppointment) {
      showNotification('طبق قوانین مطب، هر کد ملی مجاز به داشتن حداکثر ۱ نوبت فعال است.', 'error');
      return;
    }

    const targetSchedule = schedules.find(s => s.id === selectedScheduleId);
    if (!targetSchedule || !targetSchedule.isActive || targetSchedule.bookedCount >= targetSchedule.maxCapacity) {
      showNotification('متأسفانه ظرفیت این روز به تازگی تکمیل شده است.', 'error');
      return;
    }

    const nextQueue = targetSchedule.bookedCount + 1;
    const trackingCode = 'TRK-' + Math.floor(10000 + Math.random() * 90000);
    const baseHour = targetSchedule.shift.includes('صبح') ? 9 : 16;
    const totalMinutes = (nextQueue - 1) * 15;
    const hour = baseHour + Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const estimatedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

    const newAppointment = {
      id: Date.now(),
      username: currentUser.username,
      patientName: bookingForm.fullName,
      nationalId: bookingForm.nationalId,
      phone: bookingForm.phone,
      scheduleId: targetSchedule.id,
      date: targetSchedule.date,
      dayName: targetSchedule.dayName,
      shift: targetSchedule.shift,
      trackingCode,
      queueNumber: nextQueue,
      estimatedTime,
      status: 'booked',
      createdAt: '۱۴۰۵/۰۸/۰۵'
    };

    setSchedules(prev =>
      prev.map(s => (s.id === targetSchedule.id ? { ...s, bookedCount: s.bookedCount + 1 } : s))
    );
    setAppointments(prev => [newAppointment, ...prev]);

    setCurrentUser(prev => ({
      ...prev,
      fullName: bookingForm.fullName,
      nationalId: bookingForm.nationalId,
      phone: bookingForm.phone
    }));

    setUsers(prev =>
      prev.map(u =>
        u.id === currentUser.id
          ? { ...u, fullName: bookingForm.fullName, nationalId: bookingForm.nationalId, phone: bookingForm.phone }
          : u
      )
    );

    showNotification(`نوبت شما با موفقیت ثبت شد! کد رهگیری: ${trackingCode}`, 'success');
    setDashboardTab('upcoming');
    setActiveView('patient-dashboard');
  };

  const handleCancelAppointment = (appId) => {
    const targetApp = appointments.find(a => a.id === appId);
    if (!targetApp || targetApp.status !== 'booked') return;

    setAppointments(prev =>
      prev.map(a => (a.id === appId ? { ...a, status: 'cancelled' } : a))
    );
    setSchedules(prev =>
      prev.map(s =>
        s.id === targetApp.scheduleId && s.bookedCount > 0
          ? { ...s, bookedCount: s.bookedCount - 1 }
          : s
      )
    );
    showNotification('نوبت شما لغو شد و ظرفیت آن در تقویم آزاد گردید.', 'info');
  };

  const handleDoctorChangeStatus = (appId, newStatus) => {
    const targetApp = appointments.find(a => a.id === appId);
    if (!targetApp) return;

    if (targetApp.status === 'booked' && newStatus === 'cancelled') {
      setSchedules(prev =>
        prev.map(s =>
          s.id === targetApp.scheduleId && s.bookedCount > 0
            ? { ...s, bookedCount: s.bookedCount - 1 }
            : s
        )
      );
    }

    setAppointments(prev =>
      prev.map(a => (a.id === appId ? { ...a, status: newStatus } : a))
    );

    const statusLabel = newStatus === 'visited' ? 'ویزیت شده' : newStatus === 'cancelled' ? 'لغو شده' : 'رزرو شده';
    showNotification(`وضعیت نوبت به «${statusLabel}» تغییر یافت.`, 'info');
  };

  const toggleScheduleActive = (scheduleId) => {
    setSchedules(prev =>
      prev.map(s =>
        s.id === scheduleId
          ? {
              ...s,
              isActive: !s.isActive,
              maxCapacity: !s.isActive && s.maxCapacity === 0 ? 20 : s.maxCapacity,
              shift: !s.isActive && s.shift === 'تعطیل رسمی' ? 'عصر (۱۶ تا ۲۰)' : s.shift
            }
          : s
      )
    );
    showNotification('وضعیت روز کاری در تقویم بروزرسانی شد.', 'info');
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    const targetMonth = JALALI_MONTHS.find(m => m.index === Number(newSlotForm.monthIndex)) || JALALI_MONTHS[7];
    const dayRaw = Math.min(targetMonth.days, Math.max(1, Number(newSlotForm.dayNumberRaw) || 1));
    const weekdayIndex = (targetMonth.startWeekday + (dayRaw - 1)) % 7;
    const computedDayName = WEEKDAYS_FA[weekdayIndex];
    const formattedDate = `۱۴۰۵/${targetMonth.code}/${toPersianDigits(pad2(dayRaw))}`;

    const existingIndex = schedules.findIndex(s => s.date === formattedDate);
    if (existingIndex !== -1) {
      setSchedules(prev =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                maxCapacity: Math.max(item.bookedCount, Number(newSlotForm.maxCapacity)),
                isActive: true,
                shift: newSlotForm.shift
              }
            : item
        )
      );
      setSelectedMonth(targetMonth.index);
      setSelectedScheduleId(schedules[existingIndex].id);
      setNewSlotModal(false);
      showNotification(`ظرفیت روز ${formattedDate} (${targetMonth.name}) بروزرسانی شد.`, 'success');
      return;
    }

    const createdId = Date.now();
    const newItem = {
      id: createdId,
      date: formattedDate,
      monthIndex: targetMonth.index,
      monthName: targetMonth.name,
      dayNumberRaw: dayRaw,
      weekdayIndex,
      dayName: computedDayName,
      dayNum: toPersianDigits(pad2(dayRaw)),
      maxCapacity: Number(newSlotForm.maxCapacity),
      bookedCount: 0,
      isActive: true,
      shift: newSlotForm.shift
    };
    setSchedules(prev => [...prev, newItem]);
    setSelectedMonth(targetMonth.index);
    setSelectedScheduleId(createdId);
    setNewSlotModal(false);
    showNotification(`روز ${formattedDate} در ماه ${targetMonth.name} فعال و ثبت شد.`, 'success');
  };

  const quickSwitchDemoUser = (targetUsername, targetView) => {
    const found = users.find(u => u.username === targetUsername);
    if (found) {
      setCurrentUser(found);
      setActiveView(targetView);
      showNotification(`وارد حساب «${found.fullName}» با نقش ${ROLE_LABELS[found.role]} شدید.`, 'info');
    }
  };

  const userAppointments = appointments.filter(
    a =>
      currentUser &&
      (a.username === currentUser.username ||
        a.phone === currentUser.phone ||
        (currentUser.nationalId && a.nationalId === currentUser.nationalId))
  );
  const upcomingAppointments = userAppointments.filter(a => a.status === 'booked');
  const historyAppointments = userAppointments.filter(a => a.status !== 'booked');

  const filteredDoctorAppointments = doctorDateFilter === 'all'
    ? appointments
    : appointments.filter(a => a.date === doctorDateFilter);

  const filteredUsers = userRoleFilter === 'all'
    ? users
    : users.filter(u => u.role === userRoleFilter);

  const currentMonthInfo = JALALI_MONTHS.find(m => m.index === selectedMonth) || JALALI_MONTHS[7];
  const monthSchedules = schedules
    .filter(s => s.monthIndex === selectedMonth)
    .sort((a, b) => a.dayNumberRaw - b.dayNumberRaw);
  const leadingEmptyDays = monthSchedules.length > 0 ? monthSchedules[0].weekdayIndex : currentMonthInfo.startWeekday;

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-slate-800 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');
        body, * {
          font-family: 'IRANYekan', 'Vazirmatn', Tahoma, sans-serif !important;
        }
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      {/* اعلان شناور */}
      {toast && (
        <div className="fixed bottom-5 left-5 right-5 sm:right-auto sm:w-96 z-50 animate-bounce">
          <div className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-medium ${
            toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
            toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
            toast.type === 'info' ? 'bg-sky-50 border-sky-200 text-sky-800' :
            'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            {toast.type === 'error' ? <XCircle className="w-5 h-5 text-rose-600 shrink-0" /> :
             toast.type === 'warning' ? <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" /> :
             <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* هدر اصلی سایت */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 py-3.5 flex items-center justify-between gap-4">
          <div
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
                کلینیک تخصصی دکتر سارا احمدی
              </h1>
              <p className="text-xs text-slate-500">سامانه هوشمند نوبت‌دهی آنلاین مطب</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveView('landing')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeView === 'landing'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              خانه
            </button>

            <button
              onClick={() => setActiveView('booking')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeView === 'booking' || activeView === 'checkout'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">تقویم نوبت‌دهی</span>
              <span className="sm:hidden">نوبت</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setActiveView(isStaff ? 'doctor-dashboard' : 'patient-dashboard')
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                    activeView === 'patient-dashboard' || activeView === 'doctor-dashboard'
                      ? 'bg-[#0F2942] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  <User className="w-4 h-4 text-teal-500" />
                  <span>{currentUser.fullName}</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setAuthMode('login');
                    setActiveView('auth');
                    showNotification('از حساب کاربری خود خارج شدید.', 'info');
                  }}
                  title="خروج از حساب"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setActiveView('auth');
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-1.5"
              >
                <KeyRound className="w-4 h-4" />
                <span>ورود / ثبت‌نام</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* محتوای اصلی صفحات */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ========================================================= */}
        {/* صفحه ۰: لندینگ پیج حرفه‌ای مطب پزشکی (Landing Page)       */}
        {/* ========================================================= */}
        {activeView === 'landing' && (
          <div className="space-y-12 pb-6">
            {/* بخش Hero */}
            <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-bl from-[#0F2942] via-[#133859] to-teal-800 text-white p-7 sm:p-12 lg:p-14 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-teal-200 text-xs font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>نوبت‌دهی آنلاین ۲۴ ساعته بدون نیاز به تماس تلفنی</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold leading-snug">
                    سلامتی شما، اولویت ماست؛
                    <span className="block text-teal-300 mt-1">
                      دریافت نوبت آنلاین مطب در کمتر از یک دقیقه
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                    به سامانه رسمی کلینیک تخصصی دکتر سارا احمدی خوش آمدید. ظرفیت‌های روزانه مطب را به صورت زنده در تقویم کل سال مشاهده کنید، نوبت خود را قطعی نمایید و کد رهگیری اختصاصی دریافت کنید.
                  </p>

                  <div className="flex flex-wrap items-center gap-3.5 pt-2">
                    <button
                      onClick={() => setActiveView('booking')}
                      className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/25 transition flex items-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      <span>دریافت نوبت آنلاین</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setActiveView('auth');
                      }}
                      className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition flex items-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>ورود به پنل کاربری / منشی</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15 max-w-lg">
                    <div>
                      <div className="text-xl sm:text-2xl font-extrabold text-teal-300 tabular-nums">+۱۵ سال</div>
                      <div className="text-xs text-slate-300 mt-0.5">تجربه تخصصی بالینی</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-extrabold text-teal-300 tabular-nums">۱۲ ماه</div>
                      <div className="text-xs text-slate-300 mt-0.5">تقویم فعال کل سال</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-extrabold text-teal-300 tabular-nums">۱۰۰٪</div>
                      <div className="text-xs text-slate-300 mt-0.5">صدور آنی کد رهگیری</div>
                    </div>
                  </div>
                </div>

                {/* کارت معرفی پزشک در Hero */}
                <div className="lg:col-span-5">
                  <div className="bg-white text-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center font-extrabold text-2xl shrink-0 shadow-md">
                        س.ا
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold">
                            فوق تخصص داخلی و گوارش
                          </span>
                        </div>
                        <h2 className="text-lg font-extrabold text-slate-900 mt-1">دکتر سارا احمدی</h2>
                        <p className="text-xs text-slate-500">عضو هیئت علمی • نظام پزشکی ۱۲۴۵۸۹</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 text-xs text-slate-600 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">روزهای پذیرش مطب:</span>
                        <span className="font-bold text-slate-800">شنبه تا چهارشنبه</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">نوبت‌دهی زنده سال ۱۴۰۵:</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          در حال پذیرش
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">تلفن پذیرش مطب:</span>
                        <span className="font-bold text-slate-800 tabular-nums" dir="ltr">021 - 22894510</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveView('booking')}
                      className="w-full py-3 rounded-xl bg-[#0F2942] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-teal-400" />
                      <span>مشاهده ظرفیت‌های خالی این هفته</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* بخش خدمات و مزایای سامانه */}
            <section className="space-y-6">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  خدمات کلینیک و امکانات سامانه
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-3">
                  چرا رزرو آنلاین از سامانه کلینیک دکتر احمدی؟
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">
                  ساختار هوشمند نوبت‌دهی برای صرفه‌جویی در وقت بیماران و نظم‌بخشی دقیق به پذیرش روزانه مطب
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-teal-300 transition space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">بررسی زنده ظرفیت روزانه</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    مشاهده تعداد دقیق نوبت‌های باقی‌مانده در هر روز از ماه‌های سال ۱۴۰۵ و جلوگیری کامل از رزرو مضاعف یا معطلی در مطب.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-teal-300 transition space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">خدمات تخصصی تشخیص و درمان</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    ویزیت تخصصی بیماری‌های داخلی، گوارش و کبد، چکاپ‌های دوره‌ای و مشاوره پزشکی با پرونده الکترونیک اختصاصی بیمار.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-teal-300 transition space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">پنل اختصاصی بیمار و مدیریت</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    دسترسی آسان بیماران به تاریخچه نوبت‌ها و کد رهگیری، همراه با میز کار پیشرفته برای منشی و مدیر کلینیک.
                  </p>
                </div>
              </div>
            </section>

            {/* بخش مراحل دریافت نوبت در ۳ گام */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">مراحل دریافت نوبت آنلاین در ۳ گام ساده</h2>
                  <p className="text-xs text-slate-500 mt-1">بدون نیاز به تماس تلفنی، نوبت خود را در تقویم ثبت کنید</p>
                </div>
                <button
                  onClick={() => setActiveView('booking')}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold transition"
                >
                  شروع رزرو نوبت
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <span className="inline-flex w-8 h-8 rounded-xl bg-teal-600 text-white font-extrabold text-sm items-center justify-center mb-3 tabular-nums">
                    ۱
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">ثبت‌نام یا ورود به حساب</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    با ساخت نام کاربری و رمز عبور اختصاصی وارد پنل کاربری خود شوید.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <span className="inline-flex w-8 h-8 rounded-xl bg-teal-600 text-white font-extrabold text-sm items-center justify-center mb-3 tabular-nums">
                    ۲
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">انتخاب روز از تقویم سالانه</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    روز دارای ظرفیت خالی را در ماه دلخواه خود از تقویم انتخاب نمایید.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <span className="inline-flex w-8 h-8 rounded-xl bg-teal-600 text-white font-extrabold text-sm items-center justify-center mb-3 tabular-nums">
                    ۳
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">دریافت کد رهگیری و شماره صف</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    اطلاعات را تایید کرده و کد رهگیری و ساعت تقریبی حضور را دریافت کنید.
                  </p>
                </div>
              </div>
            </section>

            {/* بخش آدرس و اطلاعات تماس مطب */}
            <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-teal-300 text-xs font-bold">
                  <Building2 className="w-4 h-4" />
                  <span>نشانی و راه‌های ارتباطی کلینیک</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold">
                  تهران، خیابان شریعتی، بالاتر از میرداماد، ساختمان پزشکان پارس، طبقه ۴
                </h3>
                <p className="text-xs text-slate-300 flex flex-wrap items-center gap-4 pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-teal-400" />
                    تلفن پذیرش: ۰۲۱-۲۲۸۹۴۵۱۰
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400" />
                    پاسخگویی آنلاین: ۲۴ ساعته در تمام ایام هفته
                  </span>
                </p>
              </div>

              <button
                onClick={() => setActiveView('booking')}
                className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm transition shrink-0"
              >
                ورود به تقویم نوبت‌دهی
              </button>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* صفحه ۱: تقویم تعاملی انتخاب روز (Booking Page)            */}
        {/* ========================================================= */}
        {activeView === 'booking' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-50 to-sky-100 border border-teal-200 flex items-center justify-center text-teal-700 font-extrabold text-2xl shrink-0">
                    س.ا
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold mb-1">
                      بورد تخصصی داخلی و گوارش
                    </span>
                    <h2 className="font-extrabold text-slate-900 text-lg">دکتر سارا احمدی</h2>
                    <p className="text-xs text-slate-500 mt-0.5">کد نظام پزشکی: ۱۲۴۵۸۹</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>فارغ‌التحصیل دانشگاه علوم پزشکی تهران</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>روزهای پذیرش: شنبه، یکشنبه، دوشنبه و چهارشنبه</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>تهران، خیابان شریعتی، بالاتر از میرداماد، ساختمان پزشکان پارس</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0F2942] to-[#173B5E] text-white rounded-3xl p-6 shadow-md">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-teal-300">
                  <ShieldCheck className="w-5 h-5" />
                  <span>قوانین و راهنمای دریافت نوبت</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-200 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0"></span>
                    <span>برای ثبت نوبت، ساخت حساب کاربری با <strong>نام کاربری و رمز عبور</strong> الزامی است.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0"></span>
                    <span>هر کد ملی تنها مجاز به ثبت <strong>یک نوبت فعال</strong> در سامانه است.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0"></span>
                    <span>امکان لغو آنلاین نوبت تا ۲۴ ساعت پیش از تاریخ ویزیت وجود دارد.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    تقویم سالانه نوبت‌دهی (سال ۱۴۰۵)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    ماه مورد نظر خود را انتخاب کنید و برای روزهای ماه‌های آینده نوبت رزرو نمایید.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span> آزاد
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span> تکمیل
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-slate-300"></span> تعطیل / عدم پذیرش
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-700">
                    انتخاب ماه سال ۱۴۰۵ ({currentMonthInfo.name} — {toPersianDigits(currentMonthInfo.days)} روزه):
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={selectedMonth <= 1}
                      onClick={() => setSelectedMonth(m => Math.max(1, m - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                      title="ماه قبل"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-extrabold">
                      {currentMonthInfo.name} ۱۴۰۵
                    </span>
                    <button
                      type="button"
                      disabled={selectedMonth >= 12}
                      onClick={() => setSelectedMonth(m => Math.min(12, m + 1))}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                      title="ماه بعد"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                  {JALALI_MONTHS.map((m) => (
                    <button
                      key={m.index}
                      type="button"
                      onClick={() => setSelectedMonth(m.index)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                        selectedMonth === m.index
                          ? 'bg-[#0F2942] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] sm:text-xs font-bold text-slate-500">
                {WEEKDAYS_FA.map((wd) => (
                  <div key={wd} className="py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                    {wd}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 mb-6">
                {Array.from({ length: leadingEmptyDays }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="min-h-[84px] sm:min-h-[98px] rounded-2xl bg-slate-50/40 border border-dashed border-slate-100" />
                ))}

                {monthSchedules.map((slot) => {
                  const remaining = slot.maxCapacity - slot.bookedCount;
                  const isFull = slot.isActive && remaining <= 0;
                  const isDisabled = !slot.isActive || isFull;
                  const isSelected = selectedScheduleId === slot.id && !isDisabled;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setSelectedScheduleId(slot.id)}
                      className={`p-2 sm:p-2.5 rounded-2xl border text-right transition relative flex flex-col justify-between min-h-[84px] sm:min-h-[98px] ${
                        isSelected
                          ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-600/25 scale-[1.02]'
                          : !slot.isActive
                          ? 'bg-slate-50 border-slate-200/70 text-slate-400 cursor-not-allowed'
                          : isFull
                          ? 'bg-rose-50/70 border-rose-200 text-rose-700 cursor-not-allowed'
                          : 'bg-white border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[10px] hidden sm:inline font-medium ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                          {slot.dayName}
                        </span>
                        <span className="text-sm sm:text-base font-extrabold tabular-nums">
                          {slot.dayNum}
                        </span>
                      </div>

                      <div className="mt-1">
                        {!slot.isActive ? (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-500 text-[10px] font-medium truncate max-w-full">
                            تعطیل
                          </span>
                        ) : isFull ? (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold truncate max-w-full">
                            تکمیل
                          </span>
                        ) : (
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold tabular-nums truncate max-w-full ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {toPersianDigits(remaining)} خالی
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                {selectedSchedule && selectedSchedule.isActive && (selectedSchedule.maxCapacity - selectedSchedule.bookedCount > 0) ? (
                  <div className="text-center sm:text-right">
                    <div className="text-xs text-slate-500">تاریخ انتخاب‌شده شما:</div>
                    <div className="font-extrabold text-slate-900 text-base mt-0.5">
                      {selectedSchedule.dayName} {selectedSchedule.date} — {selectedSchedule.shift}
                    </div>
                    <div className="text-xs text-teal-700 font-semibold mt-1 tabular-nums">
                      ظرفیت باقی‌مانده: {selectedSchedule.maxCapacity - selectedSchedule.bookedCount} نفر از {selectedSchedule.maxCapacity} نفر
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">
                    لطفاً یکی از روزهای سبز رنگ (دارای ظرفیت خالی) را انتخاب نمایید.
                  </div>
                )}

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2 shrink-0"
                >
                  <span>ادامه و ثبت مشخصات بیمار</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* صفحه ۲: فرم ثبت مشخصات و تایید نهایی نوبت (Checkout Form) */}
        {/* ========================================================= */}
        {activeView === 'checkout' && selectedSchedule && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <span className="text-xs font-bold text-teal-600">مرحله ۲ از ۲</span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    تکمیل مشخصات بیمار و تایید نهایی
                  </h2>
                </div>
                <button
                  onClick={() => setActiveView('booking')}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>تغییر تاریخ</span>
                </button>
              </div>

              <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-teal-700 block">زمان مراجعه انتخاب‌شده:</span>
                  <span className="font-extrabold text-slate-900 text-base">
                    {selectedSchedule.dayName} {selectedSchedule.date}
                  </span>
                </div>
                <div className="text-left">
                  <span className="inline-block px-3 py-1 rounded-lg bg-white text-teal-800 font-bold text-xs border border-teal-200">
                    {selectedSchedule.shift}
                  </span>
                </div>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    نام و نام خانوادگی بیمار <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.fullName}
                    onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                    placeholder="مثال: نگار توسلی"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      کد ملی ۱۰ رقمی <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      required
                      dir="ltr"
                      value={bookingForm.nationalId}
                      onChange={(e) => setBookingForm({ ...bookingForm, nationalId: e.target.value.replace(/\D/g, '') })}
                      placeholder="0012345678"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm text-left tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      شماره تلفن همراه <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      maxLength={11}
                      required
                      dir="ltr"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value.replace(/\D/g, '') })}
                      placeholder="09123456789"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm text-left tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    توضیحات یا علت مراجعه (اختیاری)
                  </label>
                  <textarea
                    rows={2}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="در صورت نیاز توضیح کوتاهی برای منشی بنویسید..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    لطفاً ۱۵ دقیقه پیش از زمان اعلام‌شده، کارت ملی خود را به پذیرش مطب ارائه دهید. پس از تایید، کد رهگیری یکتا صادر می‌شود.
                  </span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>تایید نهایی و دریافت کد رهگیری</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* صفحه ۳: داشبورد اختصاصی بیمار (User Dashboard)            */}
        {/* ========================================================= */}
        {activeView === 'patient-dashboard' && currentUser && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3.5 pb-5 mb-5 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-[#0F2942] text-white flex items-center justify-center font-bold text-xl">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-base">{currentUser.fullName}</h2>
                  <p className="text-xs text-teal-700 font-mono mt-0.5" dir="ltr">@{currentUser.username}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setDashboardTab('upcoming')}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition ${
                    dashboardTab === 'upcoming'
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    نوبت‌های فعال من
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white text-xs tabular-nums">
                    {upcomingAppointments.length}
                  </span>
                </button>

                <button
                  onClick={() => setDashboardTab('history')}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition ${
                    dashboardTab === 'history'
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <History className="w-4 h-4 text-teal-600" />
                    تاریخچه و سابقه نوبت‌ها
                  </span>
                  <span className="text-xs text-slate-400 tabular-nums">{historyAppointments.length}</span>
                </button>

                <button
                  onClick={() => setDashboardTab('profile')}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition ${
                    dashboardTab === 'profile'
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4 text-teal-600" />
                  <span>اطلاعات شخصی و پروفایل</span>
                </button>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setActiveView('booking')}
                    className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>رزرو نوبت جدید</span>
                  </button>
                </div>
              </nav>
            </div>

            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              {dashboardTab === 'upcoming' && (
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-5">نوبت‌های فعال پیش‌رو</h3>
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                      <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-700">شما در حال حاضر نوبت فعالی ندارید.</p>
                      <p className="text-xs text-slate-500 mt-1 mb-4">می‌توانید از تقویم مطب برای روزهای آینده نوبت رزرو کنید.</p>
                      <button
                        onClick={() => setActiveView('booking')}
                        className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
                      >
                        مشاهده تقویم و رزرو نوبت
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments.map(app => (
                        <div key={app.id} className="rounded-2xl border-2 border-teal-500/30 bg-gradient-to-l from-teal-50/50 to-white p-5">
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5 mb-4">
                            <div className="flex items-center gap-2.5">
                              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                تایید شده (فعال)
                              </span>
                              <span className="text-xs text-slate-500">پزشک: دکتر سارا احمدی</span>
                            </div>
                            <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg tabular-nums">
                              کد رهگیری: <span className="text-teal-700 font-extrabold" dir="ltr">{app.trackingCode}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-5">
                            <div>
                              <span className="text-slate-400 block mb-1">تاریخ مراجعه</span>
                              <span className="font-extrabold text-slate-900 text-sm">{app.dayName} {app.date}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-1">شماره نوبت در صف</span>
                              <span className="font-extrabold text-teal-700 text-sm tabular-nums">نفر {app.queueNumber}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-1">ساعت تقریبی حضور</span>
                              <span className="font-extrabold text-slate-900 text-sm tabular-nums">{app.estimatedTime}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-1">شیفت کاری</span>
                              <span className="font-bold text-slate-700">{app.shift}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                            <span className="text-[11px] text-slate-500">
                              * امکان لغو تا ۲۴ ساعت قبل از نوبت فعال است.
                            </span>
                            <button
                              onClick={() => handleCancelAppointment(app.id)}
                              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1.5"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>لغو نوبت</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {dashboardTab === 'history' && (
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-5">تاریخچه نوبت‌های قبلی</h3>
                  {historyAppointments.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">سابقه‌ای ثبت نشده است.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm text-right border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                            <th className="p-3">تاریخ</th>
                            <th className="p-3">کد رهگیری</th>
                            <th className="p-3">شماره صف</th>
                            <th className="p-3">وضعیت نهایی</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {historyAppointments.map(app => (
                            <tr key={app.id}>
                              <td className="p-3 font-medium">{app.dayName} {app.date}</td>
                              <td className="p-3 font-mono text-xs" dir="ltr">{app.trackingCode}</td>
                              <td className="p-3 tabular-nums">نفر {app.queueNumber}</td>
                              <td className="p-3">
                                {app.status === 'visited' ? (
                                  <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold">
                                    ویزیت شده
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">
                                    لغو شده
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {dashboardTab === 'profile' && (
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-5">ویرایش اطلاعات شخصی</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!isValidIranianNationalId(currentUser.nationalId)) {
                        showNotification('کد ملی وارد شده معتبر نیست.', 'error');
                        return;
                      }
                      showNotification('تغییرات پروفایل با موفقیت ذخیره شد.', 'success');
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">نام و نام خانوادگی</label>
                        <input
                          type="text"
                          value={currentUser.fullName}
                          onChange={(e) => setCurrentUser({ ...currentUser, fullName: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">کد ملی</label>
                        <input
                          type="text"
                          maxLength={10}
                          dir="ltr"
                          value={currentUser.nationalId}
                          onChange={(e) => setCurrentUser({ ...currentUser, nationalId: e.target.value.replace(/\D/g, '') })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-left tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">شماره موبایل (غیرقابل تغییر)</label>
                        <input
                          type="text"
                          disabled
                          dir="ltr"
                          value={currentUser.phone}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm text-left tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">تاریخ تولد</label>
                        <input
                          type="text"
                          value={currentUser.birthDate || ''}
                          onChange={(e) => setCurrentUser({ ...currentUser, birthDate: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold transition"
                    >
                      ذخیره تغییرات پروفایل
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* صفحه ۴: پنل مدیریت منشی و ادمین (Staff Dashboard)        */}
        {/* ========================================================= */}
        {activeView === 'doctor-dashboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg font-extrabold text-slate-900">
                    میز کار مدیریت ({currentUser ? ROLE_LABELS[currentUser.role] : 'منشی'})
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  مدیریت نوبت‌های روزانه، تقویم کاری مطب و کنترل کامل حساب‌های بیماران، منشی‌ها و ادمین‌ها
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setDoctorTab('appointments')}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                    doctorTab === 'appointments'
                      ? 'bg-[#0F2942] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>نوبت‌های ثبت‌شده</span>
                </button>
                <button
                  onClick={() => setDoctorTab('schedules')}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                    doctorTab === 'schedules'
                      ? 'bg-[#0F2942] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>تقویم و ظرفیت‌ها</span>
                </button>
                <button
                  onClick={() => setDoctorTab('users')}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                    doctorTab === 'users'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>مدیریت کاربران (بیمار / منشی / ادمین)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">نوبت‌های فعال ثبت‌شده</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                    {appointments.filter(a => a.status === 'booked').length} نفر
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">تعداد کاربران ثبت‌شده</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                    {users.length} کاربر
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">تعداد منشی و ادمین‌ها</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                    {users.filter(u => u.role === 'secretary' || u.role === 'admin').length} نفر
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
            </div>

            {doctorTab === 'appointments' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <h2 className="text-lg font-extrabold text-slate-900">فهرست بیماران و مدیریت وضعیت نوبت‌ها</h2>
                  <select
                    value={doctorDateFilter}
                    onChange={(e) => setDoctorDateFilter(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white outline-none"
                  >
                    <option value="all">نمایش همه تاریخ‌ها</option>
                    {schedules.filter(s => s.isActive).map(s => (
                      <option key={s.id} value={s.date}>{s.dayName} {s.date}</option>
                    ))}
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                        <th className="p-3">صف</th>
                        <th className="p-3">نام بیمار</th>
                        <th className="p-3">کد ملی</th>
                        <th className="p-3">موبایل</th>
                        <th className="p-3">تاریخ مراجعه</th>
                        <th className="p-3">کد رهگیری</th>
                        <th className="p-3">وضعیت</th>
                        <th className="p-3">عملیات منشی</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDoctorAppointments.map(app => (
                        <tr key={app.id} className="hover:bg-slate-50/70">
                          <td className="p-3 font-extrabold text-teal-700 tabular-nums">#{app.queueNumber}</td>
                          <td className="p-3 font-bold text-slate-900">{app.patientName}</td>
                          <td className="p-3 tabular-nums" dir="ltr">{app.nationalId}</td>
                          <td className="p-3 tabular-nums" dir="ltr">{app.phone}</td>
                          <td className="p-3">{app.dayName} {app.date}</td>
                          <td className="p-3 font-mono text-xs" dir="ltr">{app.trackingCode}</td>
                          <td className="p-3">
                            {app.status === 'booked' && (
                              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">در انتظار ویزیت</span>
                            )}
                            {app.status === 'visited' && (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">ویزیت شد</span>
                            )}
                            {app.status === 'cancelled' && (
                              <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">لغو شده</span>
                            )}
                          </td>
                          <td className="p-3">
                            {app.status === 'booked' ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleDoctorChangeStatus(app.id, 'visited')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                                >
                                  ثبت ویزیت
                                </button>
                                <button
                                  onClick={() => handleDoctorChangeStatus(app.id, 'cancelled')}
                                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition"
                                >
                                  لغو
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">بایگانی شده</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {doctorTab === 'schedules' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">مدیریت تقویم سالانه و ظرفیت‌های ماه‌های آینده</h2>
                    <p className="text-xs text-slate-500 mt-0.5">ماه مورد نظر را انتخاب کنید و روزهای خاص را مسدود یا برای ماه‌های آینده ظرفیت ثبت نمایید.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white outline-none"
                    >
                      {JALALI_MONTHS.map(m => (
                        <option key={m.index} value={m.index}>{m.name} ۱۴۰۵</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const mObj = JALALI_MONTHS.find(m => m.index === selectedMonth) || JALALI_MONTHS[7];
                        setNewSlotForm({
                          monthIndex: mObj.index,
                          dayNumberRaw: 15,
                          maxCapacity: 20,
                          shift: 'عصر (۱۶ تا ۲۰)'
                        });
                        setNewSlotModal(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>ثبت / ویرایش روز در {currentMonthInfo.name}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {monthSchedules.map(slot => (
                    <div key={slot.id} className={`p-4 rounded-2xl border ${slot.isActive ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200/70'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-sm text-slate-900">{slot.dayName} {slot.dayNum} {slot.monthName}</span>
                        <button
                          type="button"
                          onClick={() => toggleScheduleActive(slot.id)}
                          className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                            slot.isActive
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          }`}
                          title="تغییر وضعیت باز یا بسته بودن روز"
                        >
                          {slot.isActive ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          <span>{slot.isActive ? 'فعال' : 'مسدود'}</span>
                        </button>
                      </div>
                      <div className="text-xs text-slate-500 mb-2">{slot.shift}</div>
                      {slot.isActive && (
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-teal-500 h-full transition-all"
                            style={{ width: `${Math.min(100, (slot.bookedCount / Math.max(1, slot.maxCapacity)) * 100)}%` }}
                          ></div>
                        </div>
                      )}
                      <div className="text-[11px] text-slate-600 mt-1.5 tabular-nums">
                        {slot.isActive ? `رزرو شده: ${toPersianDigits(slot.bookedCount)} از ${toPersianDigits(slot.maxCapacity)} نفر` : 'پذیرش غیرفعال است'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {doctorTab === 'users' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      مدیریت کاربران سیستم (بیماران، منشی‌ها و ادمین‌ها)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ایجاد حساب جدید، ارتقا یا تغییر نقش کاربران، فعال/غیرفعال‌سازی و حذف حساب‌ها
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white outline-none"
                    >
                      <option value="all">همه نقش‌ها ({users.length})</option>
                      <option value="patient">بیماران ({users.filter(u => u.role === 'patient').length})</option>
                      <option value="secretary">منشی‌ها ({users.filter(u => u.role === 'secretary').length})</option>
                      <option value="admin">ادمین‌ها ({users.filter(u => u.role === 'admin').length})</option>
                    </select>

                    <button
                      onClick={() => setUserModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>افزودن کاربر جدید</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                        <th className="p-3">نام و نام خانوادگی</th>
                        <th className="p-3">نام کاربری</th>
                        <th className="p-3">شماره تماس</th>
                        <th className="p-3">نقش کاربری</th>
                        <th className="p-3">وضعیت حساب</th>
                        <th className="p-3">عملیات مدیریتی</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/70">
                          <td className="p-3 font-bold text-slate-900">{u.fullName}</td>
                          <td className="p-3 font-mono text-xs text-teal-800" dir="ltr">{u.username}</td>
                          <td className="p-3 tabular-nums" dir="ltr">{u.phone}</td>
                          <td className="p-3">
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border outline-none ${
                                u.role === 'admin'
                                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                                  : u.role === 'secretary'
                                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              <option value="patient">بیمار</option>
                              <option value="secretary">منشی</option>
                              <option value="admin">ادمین / پزشک</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleUserActive(u.id)}
                              className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                                u.isActive
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              }`}
                            >
                              {u.isActive ? 'فعال' : 'غیرفعال'}
                            </button>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                              title="حذف کاربر"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* صفحه ۵: ورود و ثبت‌نام با نام کاربری و رمز عبور           */}
        {/* ========================================================= */}
        {activeView === 'auth' && (
          <div className="max-w-lg mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
                  authMode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <KeyRound className="w-4 h-4 text-teal-600" />
                <span>ورود به حساب</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
                  authMode === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-4 h-4 text-teal-600" />
                <span>ثبت‌نام بیمار جدید</span>
              </button>
            </div>

            {authMode === 'login' ? (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-extrabold text-slate-900">ورود به سامانه نوبت‌دهی</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    نام کاربری و رمز عبور خود را وارد نمایید.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">نام کاربری</label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      placeholder="username"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-teal-500 outline-none text-left text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">رمز عبور</label>
                    <input
                      type="password"
                      dir="ltr"
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-teal-500 outline-none text-left text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition"
                  >
                    ورود به حساب کاربری
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500 space-y-1.5 bg-slate-50 p-4 rounded-2xl">
                  <div className="font-bold text-slate-700 mb-1">حساب‌های نمونه جهت آزمایش:</div>
                  <div dir="ltr" className="text-right">• منشی: <code className="text-teal-700 font-bold">monshi_clinic</code> / رمز: <code className="text-slate-700 font-bold">Monshi@1234</code></div>
                  <div dir="ltr" className="text-right">• ادمین: <code className="text-teal-700 font-bold">admin_dr</code> / رمز: <code className="text-slate-700 font-bold">Admin@1234</code></div>
                  <div dir="ltr" className="text-right">• بیمار: <code className="text-teal-700 font-bold">negar_tavassoli</code> / رمز: <code className="text-slate-700 font-bold">User@1234</code></div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-extrabold text-slate-900">ایجاد حساب کاربری جدید (بیمار)</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    برای دریافت نوبت آنلاین، نام کاربری و رمز عبور اختصاصی بسازید.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">نام کاربری (انگلیسی) <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      placeholder="ali_mohammadi"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 outline-none text-left text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">رمز عبور <span className="text-rose-500">*</span></label>
                      <input
                        type="password"
                        dir="ltr"
                        required
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        placeholder="حداقل ۶ کاراکتر"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 outline-none text-left text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">تکرار رمز عبور <span className="text-rose-500">*</span></label>
                      <input
                        type="password"
                        dir="ltr"
                        required
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        placeholder="تکرار رمز عبور"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 outline-none text-left text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">نام و نام خانوادگی <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={registerForm.fullName}
                      onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                      placeholder="مثال: علی محمدی"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">کد ملی ۱۰ رقمی <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        maxLength={10}
                        dir="ltr"
                        required
                        value={registerForm.nationalId}
                        onChange={(e) => setRegisterForm({ ...registerForm, nationalId: e.target.value.replace(/\D/g, '') })}
                        placeholder="0012345678"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 outline-none text-left text-sm tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">شماره تلفن همراه <span className="text-rose-500">*</span></label>
                      <input
                        type="tel"
                        maxLength={11}
                        dir="ltr"
                        required
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value.replace(/\D/g, '') })}
                        placeholder="09123456789"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 outline-none text-left text-sm tabular-nums"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition"
                  >
                    تکمیل ثبت‌نام و ورود به سامانه
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      {/* مودال افزودن کاربر جدید در پنل مدیریت */}
      {userModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">ایجاد حساب کاربری جدید</h3>
            <form onSubmit={handleAdminCreateUser} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نقش کاربر در سیستم</label>
                <select
                  value={newStaffUser.role}
                  onChange={(e) => setNewStaffUser({ ...newStaffUser, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                >
                  <option value="secretary">منشی مطب</option>
                  <option value="admin">ادمین / مدیر سیستم</option>
                  <option value="patient">بیمار</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نام و نام خانوادگی</label>
                <input
                  type="text"
                  required
                  value={newStaffUser.fullName}
                  onChange={(e) => setNewStaffUser({ ...newStaffUser, fullName: e.target.value })}
                  placeholder="نام کامل"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نام کاربری</label>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={newStaffUser.username}
                    onChange={(e) => setNewStaffUser({ ...newStaffUser, username: e.target.value })}
                    placeholder="username"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-left"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رمز عبور</label>
                  <input
                    type="password"
                    dir="ltr"
                    required
                    value={newStaffUser.password}
                    onChange={(e) => setNewStaffUser({ ...newStaffUser, password: e.target.value })}
                    placeholder="حداقل ۶ کاراکتر"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">شماره تماس</label>
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={newStaffUser.phone}
                    onChange={(e) => setNewStaffUser({ ...newStaffUser, phone: e.target.value })}
                    placeholder="0912..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-left tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">کد ملی</label>
                  <input
                    type="text"
                    maxLength={10}
                    dir="ltr"
                    required
                    value={newStaffUser.nationalId}
                    onChange={(e) => setNewStaffUser({ ...newStaffUser, nationalId: e.target.value.replace(/\D/g, '') })}
                    placeholder="0012345678"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-left tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
                >
                  ثبت کاربر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال تعریف روز کاری جدید در پنل مدیریت */}
      {newSlotModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">ثبت یا بروزرسانی روز کاری در سال ۱۴۰۵</h3>
            <form onSubmit={handleAddSchedule} className="space-y-3.5 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ماه سال ۱۴۰۵</label>
                  <select
                    value={newSlotForm.monthIndex}
                    onChange={(e) => setNewSlotForm({ ...newSlotForm, monthIndex: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                  >
                    {JALALI_MONTHS.map(m => (
                      <option key={m.index} value={m.index}>{m.name} ({m.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">روز ماه (۱ تا ۳۱)</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    required
                    value={newSlotForm.dayNumberRaw}
                    onChange={(e) => setNewSlotForm({ ...newSlotForm, dayNumberRaw: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">حداکثر ظرفیت</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={newSlotForm.maxCapacity}
                    onChange={(e) => setNewSlotForm({ ...newSlotForm, maxCapacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">شیفت کاری</label>
                  <input
                    type="text"
                    required
                    value={newSlotForm.shift}
                    onChange={(e) => setNewSlotForm({ ...newSlotForm, shift: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewSlotModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
                >
                  ذخیره در تقویم سالانه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* فوتر برنامه */}
      <footer className="bg-white border-t border-slate-200/80 py-5 px-4 text-center text-xs text-slate-500">
        تمامی حقوق برای کلینیک تخصصی دکتر سارا احمدی محفوظ است • سامانه هوشمند نوبت‌دهی آنلاین
      </footer>
    </div>
  );
}
