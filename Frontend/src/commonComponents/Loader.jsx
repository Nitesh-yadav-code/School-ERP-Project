
import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { styled } from "@mui/material/styles";

const StyledBackdrop = styled(Backdrop)({
  zIndex: 1301,
  color: "#fff",
});

const LoaderContainer = styled('section')(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  gap: theme.spacing(2),
}));

const BookIcon = styled(MenuBookIcon)({
  fontSize: 50,
  color: "#667eea",
  animation: "bookFlip 2s infinite ease-in-out",
  "@keyframes bookFlip": {
    "0%, 100%": { transform: "rotateY(0deg)" },
    "50%": { transform: "rotateY(180deg)" },
  },
});

const LoadingText = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontSize: "1.2rem",
  fontWeight: 500,
  letterSpacing: "1px",
}));


const LoadingComponent = ({ isLoading }) => {
  return (
    <StyledBackdrop
      open={Boolean(isLoading)}
      style={{ display: isLoading ? "" : "none" }}
    >
      <LoaderContainer>
        <BookIcon />
        <CircularProgress color="secondary" />
        <LoadingText>Loading Data...</LoadingText>
      </LoaderContainer>
    </StyledBackdrop>
  );
};

export default LoadingComponent;


