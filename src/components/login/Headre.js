import React,{useEffect,useState} from "react";
import { 
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem
    } from '@mui/material';
import  { Menu as MenuIcon } from '@mui/icons-material/';
import sabpaisalogo from "../../assets/images/sabpaisalogo.png"
//import "./Header.css"
import { useSelector,useDispatch } from "react-redux";
// import { userActions } from "../../_actions";


const pages = ['Payments', 'Payouts', 'Neo Banking API','Pricing'];
let settings = ['SignUp','Call +91 887-777-2299'];

function Header () {
//   const data = useSelector(state => state.authentication);
//   const loggedIn = data.loggedIn;
  
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [settingPage,setSettingPage] = useState(settings);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (button) => {
    if(button==='Logout'){
    //   dispatch(userActions.logout());
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    
  }, [dispatch,handleCloseNavMenu]);

  return (
    <AppBar position="static" style={{background:'white',textColor:'black'}}>
    ddd
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            sx={{
            height: 64,
            }}
            alt="Sabpaisa"
            src={sabpaisalogo}
        />

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" style={{fontSize:'24px'}}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'flex' } }}>
          
            {settingPage.map((setting) => (
              <Button
                key={setting}
                onClick={()=>handleCloseNavMenu(setting)}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {setting}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;