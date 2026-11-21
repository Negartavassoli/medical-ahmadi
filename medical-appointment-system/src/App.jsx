import React, { useState, useMemo } from "react";
import {
  Calendar,
  UserCheck,
  Users,
  LogIn,
  LogOut,
  UserPlus,
  AlertCircle,
  Plus,
  ChevronRight,
  ChevronLeft,
  Stethoscope,
  FileText,
  Lock,
  User,
} from "lucide-react";

const JALALI_MONTHS = [
  { index: 0, name: "فروردین", days: 31 },
  { index: 1, name: "اردیبهشت", days: 31 },
  { index: 2, name: "خرداد", days: 31 },
  { index: 3, name: "تیر", days: 31 },
  { index: 4, name: "مرداد", days: 31 },
  { index: 5, name: "شهریور", days: 31 },
  { index: 6, name: "مهر", days: 30 },
  { index: 7, name: "آبان", days: 30 },
  { index: 8, name: "آذر", days: 30 },
  { index: 9, name: "دی", days: 30 },
  { index: 10, name: "بهمن", days: 30 },
  { index: 11, name: "اسفند", days: 29 },
];

const WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const INITIAL_USERS = [
  {
    id: 1,
    username: "admin",
    password: "123",
    fullName: "دکتر رادمنش (مدیر سیستم)",
    phone: "09120000001",
    nationalId: "0011223344",
    role: "admin",
    active: true,
  },
  {
    id: 2,
    username: "secretary",
    password: "123",
    fullName: "سارا کاظمی (منشی مطب)",
    phone: "09120000002",
    nationalId: "0022334455",
    role: "secretary",
    active: true,
  },
  {
    id: 3,
    username: "patient1",
    password: "123",
    fullName: "نگار توسلی",
    phone: "09123456789",
    nationalId: "0012345678",
    role: "patient",
    active: true,
  },
];

function buildInitialSchedules() {
  const map = {};
  JALALI_MONTHS.forEach((m) => {
    for (let d = 1; d <= m.days; d++) {
      const key = `1405-${String(m.index + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isFriday = (d + m.index * 2) % 7 === 6;
      map[key] = {
        dateKey: key,
        year: 1405,
        monthIndex: m.index,
        monthName: m.name,
        day: d,
        maxCapacity: isFriday ? 0 : 15,
        isActive: !isFriday,
        note: isFriday ? "تعطیل هفتگی" : "شیفت عصر (۱۶:۰۰ تا ۲۰:۰۰)",
      };
    }
  });
  return map;
}

export default function App() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    fullName: "",
    phone: "",
    nationalId: "",
  });
  const [authError, setAuthError] = useState("");

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(7);
  const [schedules, setSchedules] = useState(buildInitialSchedules);
  const [selectedDateKey, setSelectedDateKey] = useState("1405-08-05");
  const [appointments, setAppointments] = useState([
    {
      id: 101,
      userId: 3,
      patientName: "نگار توسلی",
      phone: "09123456789",
      nationalId: "0012345678",
      dateKey: "1405-08-05",
      queueNumber: 1,
      trackingCode: "TRK-140501",
      status: "booked",
    },
  ]);

  const [activeTab, setActiveTab] = useState("booking");
  const [toast, setToast] = useState(null);

  const [newStaffForm, setNewStaffForm] = useState({
    username: "",
    password: "",
    fullName: "",
    phone: "",
    nationalId: "",
    role: "secretary",
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");
    const found = users.find(
      (u) =>
        u.username.trim() === loginForm.username.trim() &&
        u.password === loginForm.password
    );
    if (!found) {
      setAuthError("نام کاربری یا رمز عبور اشتباه است.");
      return;
    }
    if (!found.active) {
      setAuthError("حساب کاربری شما غیرفعال شده است. با مطب تماس بگیرید.");
      return;
    }
    setCurrentUser(found);
    setActiveTab(found.role === "patient" ? "booking" : "manage-appointments");
    showToast(`خوش آمدید، ${found.fullName}`);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError("");
    if (
      !registerForm.username.trim() ||
      !registerForm.password.trim() ||
      !registerForm.fullName.trim()
    ) {
      setAuthError("لطفاً نام کاربری، رمز عبور و نام کامل را وارد کنید.");
      return;
    }
    const exists = users.some(
      (u) =>
        u.username.toLowerCase() === registerForm.username.trim().toLowerCase()
    );
    if (exists) {
      setAuthError("این نام کاربری قبلاً ثبت شده است.");
      return;
    }
    const created = {
      id: Date.now(),
      username: registerForm.username.trim(),
      password: registerForm.password,
      fullName: registerForm.fullName.trim(),
      phone: registerForm.phone.trim(),
      nationalId: registerForm.nationalId.trim(),
      role: "patient",
      active: true,
    };
    setUsers((prev) => [...prev, created]);
    setCurrentUser(created);
    setActiveTab("booking");
    setRegisterForm({
      username: "",
      password: "",
      fullName: "",
      phone: "",
      nationalId: "",
    });
    showToast("حساب کاربری شما با موفقیت ایجاد شد.");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginForm({ username: "", password: "" });
    showToast("از حساب کاربری خارج شدید.");
  };

  const currentSchedule = schedules[selectedDateKey];
  const bookedForSelectedDay = useMemo(
    () =>
      appointments.filter(
        (a) => a.dateKey === selectedDateKey && a.status !== "cancelled"
      ),
    [appointments, selectedDateKey]
  );

  const remainingCapacity = currentSchedule
    ? Math.max(0, currentSchedule.maxCapacity - bookedForSelectedDay.length)
    : 0;

  const handleBookAppointment = () => {
    if (!currentUser) return;
    if (!currentSchedule || !currentSchedule.isActive) {
      showToast("این روز برای نوبت‌دهی فعال نیست.");
      return;
    }
    if (remainingCapacity <= 0) {
      showToast("ظرفیت این روز تکمیل شده است.");
      return;
    }
    const hasActiveInDay = appointments.some(
      (a) =>
        a.userId === currentUser.id &&
        a.dateKey === selectedDateKey &&
        a.status === "booked"
    );
    if (hasActiveInDay) {
      showToast("شما در این تاریخ یک نوبت فعال دارید.");
      return;
    }

    const nextQueue = bookedForSelectedDay.length + 1;
    const newAppt = {
      id: Date.now(),
      userId: currentUser.id,
      patientName: currentUser.fullName,
      phone: currentUser.phone,
      nationalId: currentUser.nationalId,
      dateKey: selectedDateKey,
      queueNumber: nextQueue,
      trackingCode: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "booked",
    };
    setAppointments((prev) => [newAppt, ...prev]);
    showToast(`نوبت شما با کد رهگیری ${newAppt.trackingCode} ثبت شد.`);
    setActiveTab("my-appointments");
  };

  const handleCancelAppointment = (apptId) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === apptId ? { ...a, status: "cancelled" } : a))
    );
    showToast("نوبت مورد نظر لغو شد.");
  };

  const handleStatusChange = (apptId, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === apptId ? { ...a, status: newStatus } : a))
    );
    showToast("وضعیت نوبت به‌روزرسانی شد.");
  };

  const handleUpdateSchedule = (dateKey, updates) => {
    setSchedules((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        ...updates,
      },
    }));
    showToast("تنظیمات ظرفیت روز ذخیره شد.");
  };

  const handleCreateUserByStaff = (e) => {
    e.preventDefault();
    if (
      !newStaffForm.username.trim() ||
      !newStaffForm.password.trim() ||
      !newStaffForm.fullName.trim()
    ) {
      showToast("نام کاربری، رمز عبور و نام کامل الزامی است.");
      return;
    }
    if (users.some((u) => u.username === newStaffForm.username.trim())) {
      showToast("این نام کاربری تکراری است.");
      return;
    }
    const created = {
      id: Date.now(),
      ...newStaffForm,
      username: newStaffForm.username.trim(),
      active: true,
    };
    setUsers((prev) => [...prev, created]);
    setNewStaffForm({
      username: "",
      password: "",
      fullName: "",
      phone: "",
      nationalId: "",
      role: "secretary",
    });
    showToast("کاربر جدید به سیستم اضافه شد.");
  };

  const toggleUserActive = (userId) => {
    if (currentUser && currentUser.id === userId) {
      showToast("نمی‌توانید حساب فعال خود را غیرفعال کنید.");
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, active: !u.active } : u))
    );
    showToast("وضعیت دسترسی کاربر تغییر کرد.");
  };

  const changeUserRole = (userId, role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    showToast("نقش کاربر به‌روزرسانی شد.");
  };

  const isStaff =
    currentUser &&
    (currentUser.role === "secretary" || currentUser.role === "admin");

  const activeMonth = JALALI_MONTHS[selectedMonthIndex];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/40 to-slate-100 flex items-center justify-center p-4">
        {toast && (
          <div className="fixed top-5 left-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
            {toast}
          </div>
        )}

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 text-white p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center mx-auto mb-3 text-teal-300">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold">سامانه نوبت‌دهی آنلاین مطب</h1>
            <p className="text-xs text-slate-300 mt-1">
              ورود با نام کاربری و رمز عبور یا ایجاد حساب کاربری جدید
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
                className={`py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  authMode === "login"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LogIn className="w-4 h-4" />
                ورود به حساب
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                }}
                className={`py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  authMode === "register"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                ثبت‌نام بیمار
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authMode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    نام کاربری
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={loginForm.username}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, username: e.target.value })
                      }
                      placeholder="مثلاً secretary یا patient1"
                      className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    رمز عبور
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      placeholder="رمز عبور را وارد کنید"
                      className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition shadow-sm"
                >
                  ورود به سامانه
                </button>

                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <p className="font-bold text-slate-700">حساب‌های نمونه جهت تست:</p>
                  <p>• منشی: <span className="font-mono font-bold">secretary</span> | رمز: <span className="font-mono font-bold">123</span></p>
                  <p>• ادمین: <span className="font-mono font-bold">admin</span> | رمز: <span className="font-mono font-bold">123</span></p>
                  <p>• بیمار: <span className="font-mono font-bold">patient1</span> | رمز: <span className="font-mono font-bold">123</span></p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    نام و نام خانوادگی *
                  </label>
                  <input
                    type="text"
                    required
                    value={registerForm.fullName}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, fullName: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      نام کاربری *
                    </label>
                    <input
                      type="text"
                      required
                      value={registerForm.username}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, username: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      رمز عبور *
                    </label>
                    <input
                      type="password"
                      required
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, password: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      شماره موبایل
                    </label>
                    <input
                      type="text"
                      value={registerForm.phone}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      کد ملی
                    </label>
                    <input
                      type="text"
                      value={registerForm.nationalId}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, nationalId: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition shadow-sm mt-2"
                >
                  ثبت‌نام و ورود به پنل
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {toast && (
        <div className="fixed top-5 left-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
          {toast}
        </div>
      )}

      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">سامانه نوبت‌دهی مطب</p>
              <p className="text-[11px] text-slate-300">
                {currentUser.fullName} •{" "}
                {currentUser.role === "admin"
                  ? "مدیر سیستم"
                  : currentUser.role === "secretary"
                  ? "منشی"
                  : "بیمار"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs space-y-1">
            {currentUser.role === "patient" && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab("booking")}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    activeTab === "booking"
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  رزرو نوبت (تقویم سال ۱۴۰۵)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("my-appointments")}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    activeTab === "my-appointments"
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  نوبت‌های من
                </button>
              </>
            )}

            {isStaff && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab("manage-appointments")}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    activeTab === "manage-appointments"
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  مدیریت نوبت‌های روزانه
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("manage-schedule")}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    activeTab === "manage-schedule"
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  تقویم و ظرفیت سال ۱۴۰۵
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("manage-users")}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    activeTab === "manage-users"
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  مدیریت کاربران (منشی/ادمین/بیمار)
                </button>
              </>
            )}
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-6">
          {(activeTab === "booking" || activeTab === "manage-schedule") && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    تقویم نوبت‌دهی سال ۱۴۰۵ — {activeMonth.name} ۱۴۰۵
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    امکان انتخاب ماه‌های مختلف سال و مشاهده وضعیت ظرفیت روزانه
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={selectedMonthIndex === 0}
                    onClick={() =>
                      setSelectedMonthIndex((prev) => Math.max(0, prev - 1))
                    }
                    className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
                    title="ماه قبل"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <select
                    value={selectedMonthIndex}
                    onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
                  >
                    {JALALI_MONTHS.map((m) => (
                      <option key={m.index} value={m.index}>
                        {m.name} ۱۴۰۵
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={selectedMonthIndex === 11}
                    onClick={() =>
                      setSelectedMonthIndex((prev) => Math.min(11, prev + 1))
                    }
                    className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
                    title="ماه بعد"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 pb-1">
                {WEEKDAYS.map((w) => (
                  <div key={w}>{w}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: activeMonth.days }, (_, idx) => idx + 1).map(
                  (dayNum) => {
                    const key = `1405-${String(selectedMonthIndex + 1).padStart(
                      2,
                      "0"
                    )}-${String(dayNum).padStart(2, "0")}`;
                    const sch = schedules[key];
                    const dayBookedCount = appointments.filter(
                      (a) => a.dateKey === key && a.status !== "cancelled"
                    ).length;
                    const left = sch
                      ? Math.max(0, sch.maxCapacity - dayBookedCount)
                      : 0;
                    const isSelected = selectedDateKey === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedDateKey(key)}
                        className={`p-2.5 rounded-2xl border text-right transition flex flex-col justify-between min-h-[76px] ${
                          isSelected
                            ? "border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20"
                            : !sch?.isActive
                            ? "border-slate-100 bg-slate-100/70 text-slate-400"
                            : left === 0
                            ? "border-rose-200 bg-rose-50/40"
                            : "border-slate-200 bg-white hover:border-teal-300"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-bold">{dayNum}</span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              !sch?.isActive
                                ? "bg-slate-300"
                                : left === 0
                                ? "bg-rose-500"
                                : "bg-emerald-500"
                            }`}
                          />
                        </div>
                        <span className="text-[11px] font-medium mt-1">
                          {!sch?.isActive
                            ? "تعطیل"
                            : left === 0
                            ? "تکمیل"
                            : `${left} ظرفیت`}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>

              {currentSchedule && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">
                      تاریخ انتخابی: {currentSchedule.day} {currentSchedule.monthName}{" "}
                      {currentSchedule.year}
                    </p>
                    <p className="text-xs text-slate-600">
                      وضعیت:{" "}
                      {currentSchedule.isActive
                        ? `فعال — ${remainingCapacity} ظرفیت خالی از ${currentSchedule.maxCapacity}`
                        : "غیرفعال / تعطیل"}
                    </p>
                  </div>

                  {activeTab === "booking" ? (
                    <button
                      type="button"
                      disabled={!currentSchedule.isActive || remainingCapacity <= 0}
                      onClick={handleBookAppointment}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-sm font-semibold transition"
                    >
                      ثبت قطعی نوبت
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="text-xs font-semibold text-slate-700">
                        ظرفیت:
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={currentSchedule.maxCapacity}
                        onChange={(e) =>
                          handleUpdateSchedule(selectedDateKey, {
                            maxCapacity: Number(e.target.value),
                          })
                        }
                        className="w-20 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateSchedule(selectedDateKey, {
                            isActive: !currentSchedule.isActive,
                          })
                        }
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                          currentSchedule.isActive
                            ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        }`}
                      >
                        {currentSchedule.isActive ? "بستن روز" : "باز کردن روز"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "my-appointments" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">نوبت‌های ثبت‌شده من</h2>
              <div className="space-y-3">
                {appointments
                  .filter((a) => a.userId === currentUser.id)
                  .map((appt) => (
                    <div
                      key={appt.id}
                      className="p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          تاریخ: {appt.dateKey} • شماره نوبت: {appt.queueNumber}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          کد رهگیری: <span className="font-mono">{appt.trackingCode}</span> •
                          وضعیت:{" "}
                          {appt.status === "booked"
                            ? "فعال"
                            : appt.status === "cancelled"
                            ? "لغو شده"
                            : "ویزیت شده"}
                        </p>
                      </div>
                      {appt.status === "booked" && (
                        <button
                          type="button"
                          onClick={() => handleCancelAppointment(appt.id)}
                          className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold"
                        >
                          لغو نوبت
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "manage-appointments" && isStaff && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">لیست کامل نوبت‌های ثبت‌شده</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500">
                      <th className="py-3 px-2">بیمار</th>
                      <th className="py-3 px-2">تاریخ</th>
                      <th className="py-3 px-2">نوبت</th>
                      <th className="py-3 px-2">کد رهگیری</th>
                      <th className="py-3 px-2">وضعیت</th>
                      <th className="py-3 px-2">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td className="py-3 px-2 font-semibold">{appt.patientName}</td>
                        <td className="py-3 px-2">{appt.dateKey}</td>
                        <td className="py-3 px-2">{appt.queueNumber}</td>
                        <td className="py-3 px-2 font-mono text-xs">{appt.trackingCode}</td>
                        <td className="py-3 px-2 text-xs">{appt.status}</td>
                        <td className="py-3 px-2 flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(appt.id, "visited")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold"
                          >
                            ویزیت شد
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(appt.id, "cancelled")}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold"
                          >
                            لغو
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "manage-users" && isStaff && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  افزودن منشی / ادمین / کاربر جدید
                </h2>
                <form
                  onSubmit={handleCreateUserByStaff}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
                >
                  <input
                    type="text"
                    placeholder="نام و نام خانوادگی *"
                    value={newStaffForm.fullName}
                    onChange={(e) =>
                      setNewStaffForm({ ...newStaffForm, fullName: e.target.value })
                    }
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="نام کاربری *"
                    value={newStaffForm.username}
                    onChange={(e) =>
                      setNewStaffForm({ ...newStaffForm, username: e.target.value })
                    }
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                  <input
                    type="password"
                    placeholder="رمز عبور *"
                    value={newStaffForm.password}
                    onChange={(e) =>
                      setNewStaffForm({ ...newStaffForm, password: e.target.value })
                    }
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                  <select
                    value={newStaffForm.role}
                    onChange={(e) =>
                      setNewStaffForm({ ...newStaffForm, role: e.target.value })
                    }
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="secretary">منشی</option>
                    <option value="admin">ادمین</option>
                    <option value="patient">بیمار</option>
                  </select>
                  <button
                    type="submit"
                    className="sm:col-span-2 lg:col-span-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    ثبت کاربر در سیستم
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  لیست کاربران سیستم ({users.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs text-slate-500">
                        <th className="py-3 px-2">نام</th>
                        <th className="py-3 px-2">نام کاربری</th>
                        <th className="py-3 px-2">نقش</th>
                        <th className="py-3 px-2">وضعیت</th>
                        <th className="py-3 px-2">مدیریت</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td className="py-3 px-2 font-semibold">{u.fullName}</td>
                          <td className="py-3 px-2 font-mono text-xs">{u.username}</td>
                          <td className="py-3 px-2">
                            <select
                              value={u.role}
                              onChange={(e) => changeUserRole(u.id, e.target.value)}
                              className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white"
                            >
                              <option value="patient">بیمار</option>
                              <option value="secretary">منشی</option>
                              <option value="admin">ادمین</option>
                            </select>
                          </td>
                          <td className="py-3 px-2 text-xs">
                            {u.active ? "فعال" : "غیرفعال"}
                          </td>
                          <td className="py-3 px-2">
                            <button
                              type="button"
                              onClick={() => toggleUserActive(u.id)}
                              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold"
                            >
                              {u.active ? "غیرفعال‌سازی" : "فعال‌سازی"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
