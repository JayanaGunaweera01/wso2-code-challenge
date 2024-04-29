import { useAuthContext } from "@asgardeo/auth-react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Loader from "../components/Loader/Loader";

interface LoginPageProps {
  isLoginProgress: boolean;
}

function LoginPage(props: LoginPageProps) {
  const { signIn } = useAuthContext();

  return (
    <Stack spacing={2} alignItems="center" sx={{ m: 1 }}>
      <Typography variant="h4" align="center">
        Todo List
      </Typography>
      {props.isLoginProgress ? (
        <Loader text="Logging in..." />
      ) : (
        <Button variant="contained" onClick={() => signIn()}>
          Login
        </Button>
      )}
    </Stack>
  );
}

export default LoginPage;
