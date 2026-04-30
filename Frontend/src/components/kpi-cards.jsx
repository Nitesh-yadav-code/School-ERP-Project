"use client"

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Grow from "@mui/material/Grow"
import PeopleIcon from "@mui/icons-material/People"
import EventAvailableIcon from "@mui/icons-material/EventAvailable"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import PendingActionsIcon from "@mui/icons-material/PendingActions"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import TrendingDownIcon from "@mui/icons-material/TrendingDown"
import dashboardService from "../services/dashboardService"

export default function KpiCards() {
  const [show, setShow] = useState(false)
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendanceRate: 0,
    monthlyFeesCollected: 0,
    pendingFeesTotal: 0
  })

  useEffect(() => {
    setShow(true)
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const res = await dashboardService.getDashboardStats()
      const data = res.data.stats

      // Calculate total pending fees from the array
      const pendingTotal = data.pendingFees.reduce((sum, item) => sum + item.pending, 0)

      setStats({
        totalStudents: data.totalStudents,
        todayAttendanceRate: data.todayAttendanceRate,
        monthlyFeesCollected: data.monthlyFeesCollected,
        pendingFeesTotal: pendingTotal
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    }
  }

  const kpiData = [
    {
      title: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      change: "+12%", // Placeholder as we don't have historical data yet
      trend: "up",
      icon: <PeopleIcon />,
      color: "#6366f1",
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    },
    {
      title: "Attendance Today",
      value: `${stats.todayAttendanceRate.toFixed(1)}%`,
      change: "+2.1%", // Placeholder
      trend: "up",
      icon: <EventAvailableIcon />,
      color: "#22d3ee",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)",
    },
    {
      title: "Fees Collected (Month)",
      value: `₹${(stats.monthlyFeesCollected / 1000).toFixed(1)}K`,
      change: "+18%", // Placeholder
      trend: "up",
      icon: <AccountBalanceWalletIcon />,
      color: "#10b981",
      gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    },
    {
      title: "Pending Fees",
      value: `₹${(stats.pendingFeesTotal / 1000).toFixed(1)}K`,
      change: "-8%", // Placeholder
      trend: "down",
      icon: <PendingActionsIcon />,
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
    },
  ]

  return (
    <Grid container sx={{ mt: 3, ml: 3 }} spacing={{ xs: 2, sm: 2, md: 3 }}>
      {kpiData.map((kpi, index) => (
        <Grid item xs={6} sm={6} md={6} lg={3} key={kpi.title}>
          <Grow in={show} timeout={500 + index * 100}>
            <Card
              sx={{
                bgcolor: "#ffffff",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                borderRadius: { xs: 2, md: 3 },
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                height: "100%",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px ${kpi.color}20`,
                  borderColor: `${kpi.color}40`,
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: kpi.gradient,
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1.5, sm: 0 },
                  }}
                >
                  <Box sx={{ order: { xs: 2, sm: 1 } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 0.5,
                        fontWeight: 500,
                        fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                      }}
                    >
                      {kpi.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: "text.primary",
                        letterSpacing: "-0.02em",
                        fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                      }}
                    >
                      {kpi.value}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 0.5, flexWrap: "wrap" }}>
                      {kpi.trend === "up" ? (
                        <TrendingUpIcon sx={{ fontSize: { xs: 14, sm: 18 }, color: "#10b981" }} />
                      ) : (
                        <TrendingDownIcon sx={{ fontSize: { xs: 14, sm: 18 }, color: "#10b981" }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#10b981",
                          fontWeight: 600,
                          fontSize: { xs: "0.7rem", sm: "0.8rem" },
                        }}
                      >
                        {kpi.change}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontSize: { xs: "0.65rem", sm: "0.75rem" },
                          display: { xs: "none", md: "block" },
                        }}
                      >
                        vs last month
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: { xs: 40, sm: 48, md: 56 },
                      height: { xs: 40, sm: 48, md: 56 },
                      borderRadius: 2,
                      background: `${kpi.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: kpi.color,
                      border: `1px solid ${kpi.color}30`,
                      order: { xs: 1, sm: 2 },
                      "& svg": {
                        fontSize: { xs: 20, sm: 22, md: 24 },
                      },
                    }}
                  >
                    {kpi.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      ))}
    </Grid>
  )
}
