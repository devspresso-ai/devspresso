
"use client";

import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from '@mui/material/Link';
import { useRouter } from "next/navigation";
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'info' as AlertColor
  });
  const [emailValid, setEmailValid] = useState(false);
  const [fullNameValid, setFullNameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [showFullNameAndPasswordField, setShowFullNameAndPasswordField] = useState(false);
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

              const email = e.currentTarget.email.value;
              const fullName = e.currentTarget.fullName.value;
              const password = e.currentTarget.password.value;

              fetch("/api/auth/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: email,
                  fullName: fullName,
                  password: password,
                }),
              }).then(async (res) => {

                if (res.status === 200) {
                  setSnackbarState({
                    open: true,
                    message: 'Account created!',
                    severity: 'success'
                  });
                  setTimeout(() => {

                    signIn("credentials", {
                      redirect: false,
                      email: email,
                      password: password,
                      // @ts-ignore
                    }).then(({ ok, error }) => {
                      setLoading(false);
                      if (ok) {
                        router.push("/authenticate_completion");
                      } else {
                        setSnackbarState({
                          open: true,
                          message: error,
                          severity: 'error'
                        });
                      }
                    });



                    
                  }, 2000);
                } else {
                  setLoading(false);
                  setSnackbarState({
                    open: true,
                    message: await res.text(),
                    severity: 'error'
                  });
                }
              });
              
            }}

          >

            <Grid container rowSpacing={1}>
              <Grid item xs={12}>
                <Link href="https://app.second.dev/">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={48}
                    height={32}
                  />
                </Link>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5">Create an Account</Typography>
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
                  onChange = {(e) => {
                    let val = e.currentTarget.value;

                    let validRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

                    if (val.match(validRegex)) {
                      setEmailValid(true);
                      setShowFullNameAndPasswordField(true);
                    }
                    else {
                      setEmailValid(false);
                    }

                  
                  }}
                  />
              </Grid>
              {showFullNameAndPasswordField &&
              <>
                <Grid item xs={12}>
                    <TextField
                      id="fullName" 
                      name="fullName" 
                      type="text" 
                      required
                      label="Full Name" 
                      variant="standard" 
                      fullWidth
                      size="small"
                      onChange = {(e) => {
                        let val = e.currentTarget.value;

                        // just make sure something it put in
                        setFullNameValid(val.length > 1);
                    }}
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
                      onChange = {(e) => {
                      let val = e.currentTarget.value;

                      // for now simple password validation. 
                      setPasswordValid(val.length > 3);
                    }}
                      />
                  </Grid>  
                </>  
              }

              <Grid item xs={12}>
                <LoadingButton variant="contained"
                  type="submit"
                  disabled={loading || !emailValid || !fullNameValid || !passwordValid}
                  loading={loading}
                  size="large"
                  fullWidth
                  sx={{marginTop:1}}
                >
                  Create Account
                </LoadingButton>
              </Grid>

              <Grid item xs={12} sx={{marginTop:1}}>
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Link href="/">
                    Sign in
                  </Link>{" "}
                  instead.
                </Typography>
              </Grid>
            </Grid>
          </form>

        </Paper>
      </Box>
    </>
  );
}
