import React,{useEffect,useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';
import sabpaisalogo from '../../assets/images/sabpaisa-logo-white.png'
import {
    Grid,
    styled,
    Box,
    Paper,
    Divider ,
    Typography ,
    Card,
    CardContent,
    CardHeader ,
    Snackbar,
    IconButton,
} from '@mui/material/';
import CloseIcon from '@mui/icons-material/Close';
import { Formik} from "formik";
import { useHistory  } from "react-router-dom";
import * as Yup from 'yup';
import Textfield from '../../_components/reuseable_components/Textfield'
import FormButton from '../../_components/reuseable_components/FormButton'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Headre';
import './Login.css';
import { login,logout } from "../../slices/auth";
import { clearMessage } from "../../slices/message";
import OtpView from "../login/OtpView";
import toastConfig from "../../utilities/toastTypes";
import OTPVerificationApi from "../../slices/auth";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


const useStyles = makeStyles({
    root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    },

    formBase:{
        marginTop:'50px',
        marginBottom:'15px',

    },
    carHeader:{
        backgroundColor:'#ff3e06',
        textAlign:'center'
    },
    leftCard:{
        backgroundColor:'#212121',
    }
  });

  const theme = createTheme();

  const INITIAL_FORM_STATE = {
    clientUserId:'',
    userPassword:''
  };

const FORM_VALIDATION = Yup.object().shape({
    clientUserId: Yup.string().required("Required"),
    userPassword: Yup.string().required('Password is required')
});

function Login(props) {
    const history = useHistory()
    const [loading, setLoading] = useState(false);
    const  isLoggedIn  = useSelector((state) => state.auth.isLoggedIn);
    const { message } = useSelector((state) => state.message);
    const authentication = useSelector(state => state.auth);
    // console.log(authentication);
    
    const [open, setOpen] = useState(false);
    const [notificationMsg, setNotificationMsg] = React.useState('Username or password not valid');
    const [auth,setAuthData] = useState(authentication);
    const [showOTP, setShowOtp] = useState(false);
    const [signUpOrSignIn,setSignUpOrSignIn]=useState(false)
    const [otp, setOtp] = useState({ otp: "" });
    const [otpVerificationError, setOtpVerificationError] = useState("");
    const [showResendCode, setShowResendCode] = useState(false);
    const [showBackDrop, setShowBackDrop] = useState(false);
    const [GeoLocation, setGeeolocation] = useState("");

    const classes = useStyles();
    const dispatch = useDispatch();

    // const AuthToken = useSelector(
    //     (state) =>
    //       state.CombinedReducers.authentication.LoginResponse.verification_token
    //   );

    useEffect(()=>{
        setAuthData(authentication);
        // console.log('change auth data',auth);
        redirectRoute(auth);
    },[authentication])

    useEffect(() => {
        dispatch(clearMessage());
      }, [dispatch]);
    
    useEffect(() => {
        // console.log('call one tiem');
        dispatch(logout());
    }, [])

      const handleLogin = (formValue) => {
        var { clientUserId, userPassword } = formValue;
        var username= clientUserId; 
        var password= userPassword; 
        setLoading(true);
        // console.log(formValue);
        dispatch(login({ username, password }))
          .unwrap()
          .then(() => {
            history.push("/dashboard");
            // window.location.reload();
          })
          .catch(() => {
            setLoading(false);
          });
      };

      const handleChangeForOtp = (otp) => {
        const regex = /^[0-9]*$/;
        if (!otp || regex.test(otp.toString())) {
          setOtp({ otp });
        }
      };

const redirectRoute = (authen) => {
        // console.log('function call route');
        // console.log('isLoggedIn',isLoggedIn);
        // console.log('authvaliduser',authen.isValidUser);
        if (isLoggedIn ) {
            setOpen(false);
              // console.log('redirect','dashboard')
              history.push("/dashboard");
          }
          if (authen.isValidUser==="No"){
              setOpen(true);
          }
    };

    const handleClickForVerification = () => {
        setShowBackDrop(true);
        dispatch(
          OTPVerificationApi({
            //verification_code: AuthToken,
            otp: parseInt(otp.otp, 10),
            geo_location: GeoLocation,
          })
        ).then((res) => {
          if (res) {
            if (res.meta.requestStatus === "fulfilled") {
              if (res.payload.response_code === "1") {
                setOtpVerificationError("");
                setShowBackDrop(false);
                history.push("/ledger");
              } else if (res.payload.response_code === "0") {
                setShowBackDrop(false);
                toastConfig.errorToast(res.payload.message);
              }
            } else {
              setShowBackDrop(false);
              setShowResendCode(true);
            }
          }
        });
      };
    
    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
    };

    // useEffect(() => {
         
    //      auth.isValidUser==="No" ? setOpen(true):setOpen(false);
    //      setNotificationMsg("User name Or Password Not Valid");
    //     }, [auth]);

    // useEffect(() => {dispatch(userActions.logout()); // console.log("run one time only:")}, [])
    
    const action = (
        <React.Fragment>
        <IconButton
            size="small"
            aria-label="close"
            onClick={handleClose}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
        </React.Fragment>
    );

    return (
    <>  
        
    <Header/>
        <CssBaseline />

        <Container fixed >
      
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={notificationMsg}
        action={action}
        variant="error"
      />
      <Box className={classes.formBase} sx={{ width: '100%', bgcolor: 'background.paper' }}>
      
        <Grid container>
            <Grid item md className={classes.leftCard}>
                <Card  style={{backgroundColor:'#212334', color:'white' }} sx={{ minWidth: 275 ,height: '100%'}}>
                <CardContent >
                    <Typography   gutterBottom>
                        <img  src={sabpaisalogo} width="150" alt="SabPaisa" title="SabPaisa" />
                    </Typography>
                    <Typography variant="p" style={{color:'white'}}>
                    Receive Payments, The Easy Way
                    </Typography>
                    <Typography variant="h5" component="div" style={{color:'white'}} >
                    A Payments Solution for
                    </Typography>
                    <Typography variant="h5" style={{color:'white'}}>
                    Businesses, SMEs, Freelancers, Homepreneurs.
                    </Typography>
                </CardContent>
                </Card>
            </Grid>
            
            
            <Divider orientation="vertical" flexItem />            
            <Grid item md>
            <Card sx={{ minWidth: 275,height: '100%' }}>
            <CardHeader title="Login" className={classes.carHeader} />
                <CardContent >
                    <Typography  color="text.secondary" gutterBottom>
                        Enter your email and password to sign in
                    </Typography>
                    <Typography variant="p">
                    {/* login form code  */}
                        {/* <LoginForm /> */}
                        <ThemeProvider theme={theme}>
                                <Container component="main" >
                                    <CssBaseline />
                                    <Box
                                    sx={{
                                    //css
                                    }}
                                    >
                                     <Formik
                                        initialValues={{
                                        ...INITIAL_FORM_STATE
                                    }}
                                        validationSchema={FORM_VALIDATION}
                                        onSubmit={handleLogin}
                                    >
                                    <Box component="form" noValidate sx={{ mt: 1 }}>
                                        <Textfield
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="clientUserId"
                                        autoComplete="email"
                                        autoFocus
                                        variant="filled"
                                        />
                                        <Textfield
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="userPassword"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        variant="filled"
                                        />
                                        <Grid container>
                                        <Grid item xs>
                                            <FormButton disabled={loading} >
                                            {loading && (
                                                <span className="spinner-border spinner-border-sm"></span>
                                                )}
                                                Login
                                            </FormButton>
                                        </Grid>
                                        </Grid>
                                        <Typography  color="text.secondary" gutterBottom>
                                        Forgot your password? Click here
                                        </Typography>
                                    </Box>
                                    </Formik>
                                    </Box>

                                </Container>
                                </ThemeProvider>
                    </Typography>
                    
                </CardContent>
                </Card>
            </Grid>
        </Grid>
        </Box>
        </Container>
    </>
    )
}


export default Login;
