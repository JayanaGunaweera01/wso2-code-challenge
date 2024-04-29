import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface ErrorBannerProps {
  message?: string;
}

function ErrorBanner(props: ErrorBannerProps) {
  return (
    <Stack spacing={2} alignItems="center" sx={{ m: 1 }}>
      <Typography variant="subtitle1" align="center">
        {props.message}
      </Typography>
    </Stack>
  );
}

export default ErrorBanner;
