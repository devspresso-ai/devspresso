
"use client";

import Image from "next/image";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from "react";
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'info' as AlertColor
  });
  const router = useRouter();

  // tailwind shadow
  const boxShadowStyle = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';

  return (
    <>
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={snackbarState.open}
      >
        <Alert onClose={() => {setSnackbarState({...snackbarState, open: false})}} severity={snackbarState.severity} sx ={{boxShadow: boxShadowStyle}}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
      <Box
        display="flex" 
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Paper 
          elevation={6} 
          sx={{ width: 300, paddingTop:4, paddingRight:9, paddingBottom:3, paddingLeft:9, borderRadius:4, boxShadow:boxShadowStyle, textAlign: 'center' }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
       
              signIn("credentials", {
                redirect: false,
                email: e.currentTarget.email.value,
                password: e.currentTarget.password.value,
                // @ts-ignore
              }).then(({ ok, error }) => {
                setLoading(false);
                if (ok) {
                  router.push("/develop");
                } else {
                  setSnackbarState({
                    open: true,
                    message: error,
                    severity: 'error'
                  });
                }
              });

            }}
          >

            <Grid container rowSpacing={1}>
              <Grid item xs={12}>
                <Link href="https://app.second.dev">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={48}
                    height={32}
                  />
                </Link>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5">Sign In</Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email"
                  required
                  label="Email Address"
                  variant="standard" 
                  fullWidth
                  size="small" 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password" 
                  name="password" 
                  type="password" 
                  required
                  label="Password" 
                  variant="standard" 
                  fullWidth
                  size="small"
                />
       
              </Grid>
              <Grid item xs={12}>
                <LoadingButton variant="contained"
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  size="large"
                  fullWidth
                  sx={{marginTop:1}}
                >
                  Sign In
                </LoadingButton>
              </Grid>
              <Grid item xs={12} sx={{marginTop:1}}>
                <Typography variant="body2">
                  Don&apos;t have an account?{' '}
                  <Link href="/register">
                    Sign up
                  </Link>{' '}
                  for free.
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </>
  );
}
