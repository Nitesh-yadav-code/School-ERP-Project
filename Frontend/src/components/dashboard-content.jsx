"use client"

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Avatar from "@mui/material/Avatar"
import Chip from "@mui/material/Chip"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import Divider from "@mui/material/Divider"
import Button from "@mui/material/Button"
import { styled } from "@mui/material/styles"
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import PeopleIcon from "@mui/icons-material/People"
import SchoolIcon from "@mui/icons-material/School"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee"
import ClassIcon from "@mui/icons-material/Class"
import PersonOffIcon from "@mui/icons-material/PersonOff"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import DescriptionIcon from "@mui/icons-material/Description"
import RefreshIcon from "@mui/icons-material/Refresh"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import EventIcon from "@mui/icons-material/Event"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import dashboardService from "../services/dashboardService"
import { toast } from "react-toastify"

// Styled Components
const StatCard = styled(Card)(({ theme }) => ({
  background: "#ffffff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
  border: "1px solid #f3f4f6",
  height: "100%",
  width:"100%",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-4px)",
  },
}))

const WelcomeBanner = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
  borderRadius: "16px",
  padding: "24px",
  color: "#fff",
  marginBottom: "24px",
  boxShadow: "0 4px 20px rgba(79, 70, 229, 0.3)",
}))

const ChartCard = styled(Card)(({ theme }) => ({
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
  border: "1px solid #f3f4f6",
  height: "100%",
}))

const ActivityCard = styled(Card)(({ theme }) => ({
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
  border: "1px solid #f3f4f6",
  overflow: "hidden",
  height: "100%",
  width:"100%",
}))

const IconWrapper = styled(Box)(({ bgcolor }) => ({
  width: 40,
  height: 40,
  borderRadius: "10px",
  background: bgcolor,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

export default function DashboardContent() {
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [academicYear, setAcademicYear] = useState("2024-25")
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    todayAttendanceRate: 0,
    presentToday: 0,
    absentToday: 0,
    monthlyFeesCollected: 0,
    totalPendingFees: 0,
    todayCollection: 0,
    leavesRequests: 0,
    recentPayments: [],
    absenteesToday: [],
    weeklyAttendance: [],
    weeklyRevenue: [],
    upcomingEvents: [],
    pendingTasks: [],
  })

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchDashboardStats()
  }, [academicYear])

  const fetchDashboardStats = async () => {
    setLoading(true)
    try {
      const res = await dashboardService.getDashboardStats(academicYear)
      const data = res?.data?.stats
      setStats({
        totalStudents: data?.totalStudents || 0,
        totalTeachers: data?.totalTeachers || 0,
        totalClasses: data?.totalClasses || 0,
        todayAttendanceRate: data?.todayAttendanceRate || 0,
        presentToday: data?.presentToday || 0,
        absentToday: data?.absentToday || 0,
        monthlyFeesCollected: data?.monthlyFeesCollected || 0,
        totalPendingFees: data?.totalPendingFees || 0,
        todayCollection: data?.todayCollection || 0,
        leavesRequests: data?.leavesRequests || 0,
        recentPayments: data?.recentPayments || [],
        absenteesToday: data?.absenteesToday || [],
        weeklyAttendance: data?.weeklyAttendance || [
          { day: "Mon", rate: 0 },
          { day: "Tue", rate: 0 },
          { day: "Wed", rate: 0 },
          { day: "Thu", rate: 0 },
          { day: "Fri", rate: 0 },
        ],
        weeklyRevenue: data?.weeklyRevenue || [
          { day: "Mon", amount: 0 },
          { day: "Tue", amount: 0 },
          { day: "Wed", amount: 0 },
          { day: "Thu", amount: 0 },
          { day: "Fri", amount: 0 },
        ],
        upcomingEvents: data?.upcomingEvents || [],
        pendingTasks: data?.pendingTasks || [],
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`
    return `₹${amount}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    })
  }

  const getStudentName = (payment) => {
    const student = payment?.feeAssignmentId?.studentEnrollmentId?.studentId
    if (student) {
      return `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Unknown"
    }
    return payment?.name || "Unknown Student"
  }

  const getStudentClass = (payment) => {
    const enrollment = payment?.feeAssignmentId?.studentEnrollmentId
    return enrollment?.classId?.name || payment?.class || "-"
  }

  const getAbsenteeName = (record) => {
    const student = record?.studentEnrollmentId?.studentId
    if (student) {
      return `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Unknown"
    }
    return record?.name || "Unknown Student"
  }

  const getAbsenteeClass = (record) => {
    return record?.studentEnrollmentId?.classId?.name || record?.class || "-"
  }

  // Primary Stats Data
  const primaryStats = [
    {
      icon: <PeopleIcon sx={{ color: "#fff", fontSize: 20 }} />,
      iconBg: "#6366f1",
      title: "Total Students",
      value: stats.totalStudents?.toLocaleString() || "0",
      subtitle: "Active enrollments",
      color: "#6366f1",
    },
    {
      icon: <SchoolIcon sx={{ color: "#fff", fontSize: 20 }} />,
      iconBg: "#8b5cf6",
      title: "Teaching Staff",
      value: stats.totalTeachers || "0",
      subtitle: "Active teachers",
      color: "#8b5cf6",
    },
    {
      icon: <CheckCircleIcon sx={{ color: "#fff", fontSize: 20 }} />,
      iconBg: "#10b981",
      title: "Attendance Rate",
      value: `${stats.todayAttendanceRate?.toFixed(1) || "0"}%`,
      subtitle: `${stats.presentToday || 0} present today`,
      color: "#10b981",
    },
    {
      icon: <CurrencyRupeeIcon sx={{ color: "#fff", fontSize: 20 }} />,
      iconBg: "#3b82f6",
      title: "Today's Collection",
      value: formatCurrency(stats.todayCollection || 0),
      subtitle: "Fees collected today",
      color: "#3b82f6",
    },
  ]

  // Secondary Stats Data
  const secondaryStats = [
    {
      icon: <ClassIcon sx={{ color: "#fff", fontSize: 20 }} />,
      iconBg: "#f97316",
      title: "Active Classes",
      value: stats.totalClasses || "0",
      subtitle: "Running sessions",
      color: "#f97316",
    },
    {
      icon: <PersonOffIcon sx={{ color: "#fff", fontSize: 20 }} />,
      iconBg: "#ef4444",
      title: "Absent Today",
      value: stats.absentToday || "0",
      subtitle: "Students marked absent",
      color: "#ef4444",
    },
    {
      icon: <AccessTimeIcon sx={{ color: "#fff", fontSize: 20 }} />,
      iconBg: "#f59e0b",
      title: "Pending Fees",
      value: formatCurrency(stats.totalPendingFees || 0),
      subtitle: "Outstanding payments",
      color: "#f59e0b",
    },
    {
      icon: <DescriptionIcon sx={{ color: "#fff", fontSize: 20 }} />,
      iconBg: "#ec4899",
      title: "Leave Requests",
      value: stats.leavesRequests || "0",
      subtitle: "Pending approvals",
      color: "#ec4899",
    },
  ]

  return (
    <Box sx={{ height: "90vh", overflowY: "auto",overflowX: "hidden", bgcolor: "#f9fafb", width: "100%" }}>
      <Box sx={{ width: "100%" }}>
        {/* Header / Welcome Banner */}
        <WelcomeBanner>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", fontWeight: 500, mb: 0.5 }}>
                {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: "1.5rem", md: "1.875rem" } }}>
                {getGreeting()}, Admin! 👋
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>
                Here's what's happening in your school today
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField
                select
                size="small"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                sx={{
                  minWidth: 120,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    color: "#fff",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                    "&.Mui-focused fieldset": { borderColor: "#fff" },
                  },
                  "& .MuiSvgIcon-root": { color: "#fff" },
                }}
              >
                <MenuItem value="2024-25">2024-25</MenuItem>
                <MenuItem value="2023-24">2023-24</MenuItem>
                <MenuItem value="2022-23">2022-23</MenuItem>
              </TextField>
              <IconButton
                onClick={fetchDashboardStats}
                disabled={loading}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                }}
              >
                <RefreshIcon
                  sx={{
                    fontSize: 20,
                    animation: loading ? "spin 1s linear infinite" : "none",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        </WelcomeBanner>
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 2,
    mb: 2,
    transition: "all 0.3s ease",
  }}
>
  {primaryStats.map((stat, index) => (
    <StatCard key={index}>
      <IconWrapper bgcolor={stat.iconBg} sx={{ mb: 1.5 }}>
        {stat.icon}
      </IconWrapper>

      <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#6b7280", mb: 0.5 }}>
        {stat.title}
      </Typography>

      <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: stat.color, mb: 0.25 }}>
        {stat.value}
      </Typography>

      <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>
        {stat.subtitle}
      </Typography>
    </StatCard>
  ))}
</Box>


        {/* Secondary Stats - 4 columns */}
        <Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 2,
    mb: 2,
    transition: "all 0.3s ease",
  }}
>
  {secondaryStats.map((stat, index) => (
    <StatCard key={index}>
      <IconWrapper bgcolor={stat.iconBg} sx={{ mb: 1.5 }}>
        {stat.icon}
      </IconWrapper>

      <Typography
        sx={{
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "#6b7280",
          mb: 0.5,
        }}
      >
        {stat.title}
      </Typography>

      <Typography
        sx={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: stat.color,
          mb: 0.25,
        }}
      >
        {stat.value}
      </Typography>

      <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>
        {stat.subtitle}
      </Typography>
    </StatCard>
  ))}
</Box>


        {/* Charts Section - 2 columns */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Weekly Attendance Chart */}
          {/* <Grid item xs={12} md={6}>
            <ChartCard>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
                      Weekly Attendance
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Last 5 days trend
                    </Typography>
                  </Box>
                  <Chip
                    label={`${stats.todayAttendanceRate?.toFixed(1) || 0}% Avg`}
                    size="small"
                    sx={{
                      bgcolor: "#f0fdf4",
                      color: "#15803d",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                </Box>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={stats.weeklyAttendance}>
                    <defs>
                      <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="#10B981"
                      strokeWidth={2}
                      fill="url(#attendanceGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </ChartCard>
          </Grid> */}

          {/* Weekly Revenue Chart */}
          {/* <Grid item xs={12} md={6}>
            <ChartCard>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
                      Weekly Revenue
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Daily collection (in thousands)
                    </Typography>
                  </Box>
                  <Chip
                    label={formatCurrency(stats.monthlyFeesCollected || 0)}
                    size="small"
                    sx={{
                      bgcolor: "#eff6ff",
                      color: "#1d4ed8",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                </Box>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.weeklyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="amount" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </ChartCard>
          </Grid> */}
        </Grid>

        {/* Activity Section - 3 columns */}
        <Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 2,
    transition: "all 0.3s ease",
  }}
>
          {/* Recent Payments */}
            <ActivityCard>
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid #f3f4f6",
                  background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <IconWrapper bgcolor="#10b981">
                    <CurrencyRupeeIcon sx={{ color: "#fff", fontSize: 18 }} />
                  </IconWrapper>
                  <Box>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827" }}>
                      Recent Payments
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Latest fee collections
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
                {stats.recentPayments?.length > 0 ? (
                  stats.recentPayments.map((payment, index) => (
                    <Box
                      key={payment?._id || index}
                      sx={{
                        p: 1.5,
                        borderBottom: "1px solid #f9fafb",
                        transition: "background 0.2s",
                        "&:hover": { bgcolor: "#f9fafb" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827" }}>
                          {getStudentName(payment)}
                        </Typography>
                        <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: "#10b981" }}>
                          ₹{payment?.amountPaid?.toLocaleString() || payment?.amount?.toLocaleString() || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                          Class {getStudentClass(payment)}
                        </Typography>
                        <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                          {formatDate(payment?.paymentDate || payment?.date)}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <CurrencyRupeeIcon sx={{ fontSize: 40, color: "#d1d5db", mb: 1 }} />
                    <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      No recent payments
                    </Typography>
                  </Box>
                )}
              </Box>
            </ActivityCard>

          {/* Today's Absentees */}
            <ActivityCard>
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid #f3f4f6",
                  background: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <IconWrapper bgcolor="#ef4444">
                    <PersonOffIcon sx={{ color: "#fff", fontSize: 18 }} />
                  </IconWrapper>
                  <Box>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827" }}>
                      Today's Absentees
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      {stats.absentToday || 0} students absent
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
                {stats.absenteesToday?.length > 0 ? (
                  <>
                    {stats.absenteesToday.map((student, index) => (
                      <Box
                        key={student?._id || index}
                        sx={{
                          p: 1.5,
                          borderBottom: "1px solid #f9fafb",
                          transition: "background 0.2s",
                          "&:hover": { bgcolor: "#f9fafb" },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: "#fee2e2",
                              color: "#ef4444",
                              fontSize: 14,
                              fontWeight: 700,
                            }}
                          >
                            {getAbsenteeName(student).charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827" }}>
                              {getAbsenteeName(student)}
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                              Class {getAbsenteeClass(student)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                    <Box sx={{ p: 1.5, textAlign: "center" }}>
                      <Button
                        size="small"
                        endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          fontSize: "0.75rem",
                          color: "#6366f1",
                          fontWeight: 500,
                          textTransform: "none",
                          "&:hover": { bgcolor: "#eef2ff" },
                        }}
                      >
                        View All Absentees
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <CheckCircleIcon sx={{ fontSize: 40, color: "#10b981", mb: 1 }} />
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827" }}>
                      Perfect Attendance! 🎉
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      All students present today
                    </Typography>
                  </Box>
                )}
              </Box>
            </ActivityCard>

          {/* Upcoming Events & Tasks */}
            <ActivityCard>
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid #f3f4f6",
                  background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <IconWrapper bgcolor="#6366f1">
                    <EventIcon sx={{ color: "#fff", fontSize: 18 }} />
                  </IconWrapper>
                  <Box>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827" }}>
                      Upcoming Events
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Important dates
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
                {stats.upcomingEvents?.length > 0 ? (
                  stats.upcomingEvents.map((event, index) => (
                    <Box
                      key={event?._id || index}
                      sx={{
                        p: 1.5,
                        borderBottom: "1px solid #f9fafb",
                        transition: "background 0.2s",
                        "&:hover": { bgcolor: "#f9fafb" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "8px",
                            bgcolor: "#eef2ff",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#6366f1" }}>
                            {event?.date?.split(" ")[0] || "TBD"}
                          </Typography>
                          <Typography sx={{ fontSize: "0.625rem", color: "#818cf8" }}>
                            {event?.date?.split(" ")[1] || ""}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827" }}>
                            {event?.title || "Untitled Event"}
                          </Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "capitalize" }}>
                            {event?.type || "Event"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <CalendarMonthIcon sx={{ fontSize: 36, color: "#d1d5db", mb: 1 }} />
                    <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      No upcoming events
                    </Typography>
                  </Box>
                )}

                {/* Pending Tasks Section */}
                {stats.pendingTasks?.length > 0 && (
                  <Box sx={{ p: 1.5, bgcolor: "#fffbeb" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <WarningAmberIcon sx={{ fontSize: 16, color: "#d97706" }} />
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#92400e" }}>
                        Pending Tasks
                      </Typography>
                    </Box>
                    {stats.pendingTasks.map((task, index) => (
                      <Box
                        key={task?._id || index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          py: 0.75,
                        }}
                      >
                        <Typography sx={{ fontSize: "0.75rem", color: "#92400e" }}>
                          {task?.task || "Unknown task"}
                        </Typography>
                        <Chip
                          label={task?.count || 0}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            bgcolor: "#fde68a",
                            color: "#92400e",
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}

                {stats.upcomingEvents?.length === 0 && stats.pendingTasks?.length === 0 && (
                  <Box sx={{ p: 3, bgcolor: "#fffbeb", textAlign: "center" }}>
                    <WarningAmberIcon sx={{ fontSize: 32, color: "#f59e0b", mb: 1 }} />
                    <Typography sx={{ fontSize: "0.875rem", color: "#92400e" }}>
                      No pending tasks
                    </Typography>
                  </Box>
                )}
              </Box>
            </ActivityCard>
        </Box>
      </Box>
    </Box>
  )
}


