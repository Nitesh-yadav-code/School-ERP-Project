"use client"

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import LinearProgress from "@mui/material/LinearProgress"
import Chip from "@mui/material/Chip"
import Fade from "@mui/material/Fade"
import classService from "../services/classService"
import attendanceService from "../services/attendanceService"

const getStatusColor = (rate) => {
  if (rate >= 95) return "#10b981"
  if (rate >= 90) return "#6366f1"
  if (rate >= 85) return "#f59e0b"
  return "#ef4444"
}

export default function AttendanceTable() {
  const [show, setShow] = useState(false)
  const [attendanceData, setAttendanceData] = useState([])

  useEffect(() => {
    setShow(true)
    fetchAttendanceData()
  }, [])

  const fetchAttendanceData = async () => {
    try {
      const classRes = await classService.getClasses()
      const classes = classRes.data.classes
      const today = new Date().toISOString().split('T')[0]

      const stats = await Promise.all(
        classes.map(async (cls) => {
          try {
            const attRes = await attendanceService.getAttendanceByClass(`${cls._id}?date=${today}`)
            const attendance = attRes.data.attendance

            const total = attendance.length
            const present = attendance.filter((r) => r.status === "Present").length
            const absent = attendance.filter((r) => r.status === "Absent").length
            const rate = total > 0 ? ((present / total) * 100).toFixed(1) : 0

            return {
              class: cls.className, // Assuming className field based on common naming, or name
              total,
              present,
              absent,
              rate: parseFloat(rate),
            }
          } catch (error) {
            console.error(`Error fetching attendance for class ${cls._id}`, error)
            return null
          }
        })
      )

      setAttendanceData(stats.filter(Boolean))
    } catch (error) {
      console.error("Error fetching classes", error)
    }
  }

  return (
    <Fade in={show} timeout={1000}>
      <Card
        sx={{
          bgcolor: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          borderRadius: { xs: 2, md: 3 },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 2, md: 3 } }}>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "text.primary", fontSize: { xs: "1rem", md: "1.125rem" } }}
              >
                Today's Attendance
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.5, fontSize: { xs: "0.75rem", md: "0.875rem" } }}
              >
                Class-wise attendance breakdown
              </Typography>
            </Box>
            <Chip
              label="Live"
              size="small"
              sx={{
                bgcolor: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                fontWeight: 600,
                border: "1px solid rgba(16, 185, 129, 0.3)",
                "& .MuiChip-label": {
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                },
                "&::before": {
                  content: '""',
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "#10b981",
                  animation: "pulse 2s infinite",
                  marginLeft: 0.5,
                },
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                  "100%": { opacity: 1 },
                },
              }}
            />
          </Box>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: { xs: 500, md: "auto" } }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                      color: "text.secondary",
                      fontWeight: 600,
                      fontSize: { xs: "0.65rem", md: "0.75rem" },
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: { xs: 1.5, md: 2 },
                    }}
                  >
                    Class
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                      color: "text.secondary",
                      fontWeight: 600,
                      fontSize: { xs: "0.65rem", md: "0.75rem" },
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: { xs: 1.5, md: 2 },
                    }}
                  >
                    Total
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                      color: "text.secondary",
                      fontWeight: 600,
                      fontSize: { xs: "0.65rem", md: "0.75rem" },
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: { xs: 1.5, md: 2 },
                    }}
                  >
                    Present
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                      color: "text.secondary",
                      fontWeight: 600,
                      fontSize: { xs: "0.65rem", md: "0.75rem" },
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: { xs: 1.5, md: 2 },
                    }}
                  >
                    Absent
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                      color: "text.secondary",
                      fontWeight: 600,
                      fontSize: { xs: "0.65rem", md: "0.75rem" },
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: { xs: 1.5, md: 2 },
                    }}
                  >
                    Attendance Rate
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((row, index) => (
                  <TableRow
                    key={row.class}
                    sx={{
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "rgba(99, 102, 241, 0.08)",
                      },
                      "& td": {
                        borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                        py: { xs: 1.5, md: 2 },
                      },
                    }}
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "text.primary", fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                      >
                        {row.class}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                      >
                        {row.total}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{ color: "#10b981", fontWeight: 500, fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                      >
                        {row.present}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{ color: "#ef4444", fontWeight: 500, fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                      >
                        {row.absent}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
                        <Box sx={{ flexGrow: 1, maxWidth: { xs: 80, md: 150 } }}>
                          <LinearProgress
                            variant="determinate"
                            value={row.rate}
                            sx={{
                              height: { xs: 4, md: 6 },
                              borderRadius: 3,
                              bgcolor: "rgba(0, 0, 0, 0.08)",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 3,
                                bgcolor: getStatusColor(row.rate),
                              },
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: getStatusColor(row.rate),
                            minWidth: { xs: 40, md: 50 },
                            fontSize: { xs: "0.75rem", md: "0.875rem" },
                          }}
                        >
                          {row.rate}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Fade>
  )
}
