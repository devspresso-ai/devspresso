
"use client";

import { useState } from "react";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { useRouter } from "next/navigation";
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import { signOut } from "next-auth/react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const [companySize, setCompanySize] = useState('');
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
        marginTop={7}
        
      >
        <Paper elevation={6} sx={{ width: 600, padding:7, borderRadius: 4, boxShadow: boxShadowStyle, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            You're Signed In!
          </Typography>
          <Typography variant="body1">
            To sign out, just hit the button below.
          </Typography>
          <Button
            variant="contained"
            onClick={() => signOut()}
            sx={{marginTop:2}}
          >
            Sign Out
          </Button>

        </Paper>
      </Box>
    </>
  );
}
