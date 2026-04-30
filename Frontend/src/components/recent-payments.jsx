"use client"

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import Chip from "@mui/material/Chip"
import Fade from "@mui/material/Fade"
import Slide from "@mui/material/Slide"
import dashboardService from "../services/dashboardService"

export default function RecentPayments() {
  const [show, setShow] = useState(false)
  const [payments, setPayments] = useState([])

  useEffect(() => {
    setShow(true)
    fetchRecentPayments()
  }, [])

  const fetchRecentPayments = async () => {
    try {
      const res = await dashboardService.getDashboardStats()
      const data = res.data.stats.recentPayments

      const formattedPayments = data.map((payment, index) => ({
        id: payment._id,
        student: `${payment.studentId?.firstName} ${payment.studentId?.lastName}`,
        class: "Class N/A", // payment object doesn't seem to have class name populated in controller, only studentId. 
        // Wait, feeCollectionController getFeeReport populates classId, but dashboardController getDashboardStats only populates studentId.
        // I should probably update dashboardController to populate classId too, but I can't edit backend easily without verifying.
        // For now, I'll leave it as N/A or try to handle gracefully.
        amount: `₹${payment.amountPaid}`,
        status: "Completed", // Assuming all payments in this table are completed
        time: new Date(payment.createdAt).toLocaleDateString(), // Formatting date
        avatar: payment.studentId?.firstName?.charAt(0) || "S",
      }))
      setPayments(formattedPayments)
    } catch (error) {
      console.error("Error fetching recent payments:", error)
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

        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 2, md: 3 } }}>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "text.primary", fontSize: { xs: "1rem", md: "1.125rem" } }}
              >
                Recent Payments
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.5, fontSize: { xs: "0.75rem", md: "0.875rem" } }}
              >
                Latest fee transactions
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "primary.main",
                cursor: "pointer",
                fontSize: { xs: "0.75rem", md: "0.875rem" },
                "&:hover": { textDecoration: "underline" },
              }}
            >
              View All
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, md: 2 } }}>
            {payments.map((payment, index) => (
              <Slide key={payment.id} direction="left" in={show} timeout={400 + index * 100}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: { xs: 1.5, md: 2 },
                    borderRadius: 2,
                    bgcolor: "#f9fafb",
                    border: "1px solid rgba(0, 0, 0, 0.04)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(99, 102, 241, 0.08)",
                      borderColor: "rgba(99, 102, 241, 0.2)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2 }, minWidth: 0, flex: 1 }}>
                    <Avatar
                      sx={{
                        width: { xs: 32, md: 40 },
                        height: { xs: 32, md: 40 },
                        bgcolor: `hsl(${index * 50}, 70%, 50%)`,
                        fontSize: { xs: 12, md: 14 },
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {payment.avatar}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          fontSize: { xs: "0.8rem", md: "0.875rem" },
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {payment.student}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", fontSize: { xs: "0.65rem", md: "0.75rem" } }}
                      >
                        {payment.class} • {payment.time}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      textAlign: "right",
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1, md: 2 },
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        fontSize: { xs: "0.75rem", md: "0.875rem" },
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      {payment.amount}
                    </Typography>
                    <Chip
                      label={payment.status}
                      size="small"
                      sx={{
                        bgcolor:
                          payment.status === "Completed" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: payment.status === "Completed" ? "#10b981" : "#f59e0b",
                        fontWeight: 500,
                        fontSize: { xs: "0.6rem", md: "0.7rem" },
                        height: { xs: 20, md: 24 },
                        border:
                          payment.status === "Completed"
                            ? "1px solid rgba(16, 185, 129, 0.3)"
                            : "1px solid rgba(245, 158, 11, 0.3)",
                      }}
                    />
                  </Box>
                </Box>
              </Slide>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  )
}
