"use client"

import { useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Zoom from "@mui/material/Zoom"
import Grid from "@mui/material/Grid"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import EventNoteIcon from "@mui/icons-material/EventNote"
import PaymentIcon from "@mui/icons-material/Payment"
import DescriptionIcon from "@mui/icons-material/Description"

const actions = [
  {
    label: "Add Student",
    icon: <PersonAddIcon />,
    color: "#6366f1",
  },
  {
    label: "Mark Attendance",
    icon: <EventNoteIcon />,
    color: "#22d3ee",
  },
  {
    label: "Collect Fees",
    icon: <PaymentIcon />,
    color: "#10b981",
  },
  {
    label: "Generate Report",
    icon: <DescriptionIcon />,
    color: "#f59e0b",
  },
]

export default function QuickActions() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <Box sx={{ mt: { xs: 2, md: 4 } , ml:3 }}>
      <Typography
        variant="subtitle1"
        sx={{
          color: "text.secondary",
          fontWeight: 600,
          mb: 2,
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
        }}
      >
        Quick Actions
      </Typography>
      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        {actions.map((action, index) => (
          <Grid item xs={6} sm={6} md={3} key={action.label}>
            <Zoom in={true} timeout={300 + index * 100}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={action.icon}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{
                  px: { xs: 1.5, sm: 2, md: 3 },
                  py: { xs: 1.5, sm: 1.5 },
                  borderRadius: 2,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: hoveredIndex === index ? action.color : "text.secondary",
                  bgcolor: hoveredIndex === index ? `${action.color}10` : "#f9fafb",
                  transition: "all 0.3s ease",
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                  justifyContent: "flex-start",
                  "&:hover": {
                    borderColor: `${action.color}50`,
                    bgcolor: `${action.color}15`,
                    transform: "translateY(-2px)",
                    boxShadow: `0 10px 30px ${action.color}20`,
                  },
                  "& .MuiButton-startIcon": {
                    transition: "transform 0.3s ease",
                    transform: hoveredIndex === index ? "scale(1.1)" : "scale(1)",
                    mr: { xs: 0.5, sm: 1 },
                    "& svg": {
                      fontSize: { xs: 18, sm: 20, md: 22 },
                    },
                  },
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  {action.label}
                </Box>
                <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                  {action.label.split(" ")[0]}
                </Box>
              </Button>
            </Zoom>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
