import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import styles from "./Layout.module.css";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { status, data } = useSession({ required: true });
  data?.user?.email;
  return (
    <div className={styles.layout}>
      <AppBar position="static">
        <Toolbar>
          <nav className={styles.topMenu}>
            <div className={styles.topMenuLogo}>
              <Typography variant="h6">
                Todo App
                {process.env.NEXT_PUBLIC_ENV_NAME}
              </Typography>
            </div>
            <ul className={styles.topMainMenuUl}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/todos">Todos</Link>
              </li>
            </ul>
            <ul className={styles.topUserMenuUl}>
              <li>
                <User email={data?.user?.email} />
              </li>
            </ul>
          </nav>
        </Toolbar>
      </AppBar>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

function User(user: { email?: string | null }) {
  return (
    <div className={styles.userWrap}>
      <div className={styles.userEmail}>{user.email ?? "John Doe"}</div>
      <Button
        color="secondary"
        className={styles.signOut}
        onClick={() => signOut()}
        variant="contained"
      >
        Sign out
      </Button>
    </div>
  );
}
