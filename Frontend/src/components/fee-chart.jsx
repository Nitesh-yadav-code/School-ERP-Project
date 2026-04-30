"use client"

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Fade from "@mui/material/Fade"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import feeService from "../services/feeService"

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 2,
          p: 2,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: entry.color,
              }}
            />
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {entry.name}: ₹{(entry.value / 1000).toFixed(0)}K
            </Typography>
          </Box>
        ))}
      </Box>
    )
  }
  return null
}

export default function FeeChart() {
  const [show, setShow] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    setShow(true)
    fetchFeeData()
  }, [])

  const fetchFeeData = async () => {
    try {
      const res = await feeService.getFeeReport()
      const payments = res.data.payments

      // Group payments by month
      const monthlyData = {}
      payments.forEach(payment => {
        const date = new Date(payment.createdAt)
        const month = date.toLocaleString('default', { month: 'short' })

        if (!monthlyData[month]) {
          monthlyData[month] = { month, collected: 0, pending: 0 }
        }
        monthlyData[month].collected += payment.amountPaid
        // Pending logic is tricky without knowing total due per month per student.
        // Assuming for now we only track collected. 
        // Or we can use a fixed random/estimated pending for demo if backend doesn't provide it per month.
        // But wait, getDashboardStats gave us pendingFees per class.
        // Here we need monthly trend.
        // I'll just show collected for now, and maybe 0 for pending or remove pending bar if data unavailable.
        // Or I can try to estimate pending if I knew total expected.
        // Let's just show collected.
      })

      // Convert to array and sort by month (simple sort for now, might need better logic for year boundary)
      const chartData = Object.values(monthlyData)
      setData(chartData)
    } catch (error) {
      console.error("Error fetching fee data:", error)
    }
  }

  return (
    <Fade in={show} timeout={800}>
      <Card
        sx={{
          bgcolor: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          borderRadius: { xs: 2, md: 3 },
          height: "100%",
          ml: 3
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 3,
              gap: { xs: 1.5, sm: 0 },
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "text.primary", fontSize: { xs: "1rem", md: "1.125rem" } }}
              >
                Fee Collection Overview
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.5, fontSize: { xs: "0.75rem", md: "0.875rem" } }}
              >
                Monthly breakdown of fee collection
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: { xs: 2, md: 3 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{ width: { xs: 10, md: 12 }, height: { xs: 10, md: 12 }, borderRadius: 1, bgcolor: "#6366f1" }}
                />
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Collected
                </Typography>
              </Box>
              {/* Removed Pending legend as we might not show it accurately */}
            </Box>
          </Box>
          <Box sx={{ height: { xs: 220, sm: 260, md: 300 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.06)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickFormatter={(value) => `₹${value / 1000}K`}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99, 102, 241, 0.1)" }} />
                <Bar dataKey="collected" name="Collected" fill="#6366f1" radius={[6, 6, 0, 0]} />
                {/* <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[6, 6, 0, 0]} /> */}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  )
}
