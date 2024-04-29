import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface LoaderProps {
  text?: string;
}

function Loader(props: LoaderProps) {
  return (
    <Stack spacing={2} alignItems="center" sx={{ m: 1 }}>
      <CircularProgress />
      <Typography variant="subtitle1" align="center">
        {props.text}
      </Typography>
    </Stack>
  );
}

export default Loader;
