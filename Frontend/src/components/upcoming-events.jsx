"use client"

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Fade from "@mui/material/Fade"
import EventIcon from "@mui/icons-material/Event"
import SchoolIcon from "@mui/icons-material/School"
import SportsIcon from "@mui/icons-material/Sports"
import CelebrationIcon from "@mui/icons-material/Celebration"

const events = [
  { title: "Parent-Teacher Meeting", date: "Nov 28", time: "10:00 AM", icon: <SchoolIcon />, color: "#6366f1" },
  { title: "Annual Sports Day", date: "Dec 5", time: "9:00 AM", icon: <SportsIcon />, color: "#22d3ee" },
  { title: "Christmas Celebration", date: "Dec 22", time: "11:00 AM", icon: <CelebrationIcon />, color: "#10b981" },
  { title: "Term End Exams", date: "Dec 15", time: "8:30 AM", icon: <EventIcon />, color: "#f59e0b" },
]

export default function UpcomingEvents() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

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
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", fontSize: "1rem" }}>
              Upcoming Events
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "primary.main",
                cursor: "pointer",
                fontSize: "0.75rem",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              View All
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {events.map((event, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#f9fafb",
                  border: "1px solid rgba(0, 0, 0, 0.04)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: `${event.color}10`,
                    borderColor: `${event.color}30`,
                    transform: "translateX(4px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    bgcolor: `${event.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: event.color,
                    border: `1px solid ${event.color}30`,
                    "& svg": { fontSize: 18 },
                  }}
                >
                  {event.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      fontSize: "0.8rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {event.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                    {event.date} • {event.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  )
}
