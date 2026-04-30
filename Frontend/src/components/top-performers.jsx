"use client"

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import Fade from "@mui/material/Fade"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"

const performers = [
  { name: "Ananya Singh", class: "Class 10-A", score: "98.5%", rank: 1, avatar: "A" },
  { name: "Rohan Mehta", class: "Class 10-B", score: "97.2%", rank: 2, avatar: "R" },
  { name: "Priya Sharma", class: "Class 10-A", score: "96.8%", rank: 3, avatar: "P" },
  { name: "Arjun Patel", class: "Class 10-C", score: "95.5%", rank: 4, avatar: "A" },
]

const rankColors = {
  1: "#fbbf24",
  2: "#94a3b8",
  3: "#cd7c32",
  4: "#6366f1",
}

export default function TopPerformers() {
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
              Top Performers
            </Typography>
            <EmojiEventsIcon sx={{ color: "#fbbf24", fontSize: 20 }} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {performers.map((student, index) => (
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
                    bgcolor: "rgba(99, 102, 241, 0.08)",
                    borderColor: "rgba(99, 102, 241, 0.2)",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: `${rankColors[student.rank]}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${rankColors[student.rank]}`,
                  }}
                >
                  <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: rankColors[student.rank] }}>
                    {student.rank}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: `hsl(${index * 60}, 70%, 50%)`,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {student.avatar}
                </Avatar>
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
                    {student.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                    {student.class}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#10b981", fontSize: "0.8rem" }}>
                  {student.score}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  )
}
