import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
      root: {
            flexGrow: 1,
      },
      menuButton: {
            marginRight: theme.spacing(2),
      },
      title: {
            flexGrow: 1,
      },
}));

function Header() {
      const classes = useStyles();

      return (
            <div className={classes.root}>
                  <AppBar position="static">
                        <Toolbar>
                              <IconButton edge="start" className={classes.menuItem} color="inherit" aria-label="menu"><MenuIcon /></IconButton>
                              <Typography variant="h6" className={classes.title}>List of Containers</Typography>
                              {/* <Icon>directions_boat</Icon> */}
                              <Typography variant="h6" className={classes.menuItem}>&nbsp;ZedNODE&nbsp;&nbsp;</Typography>
                              <Icon>local_shipping</Icon>
                        </Toolbar>
                  </AppBar>
            </div>
      );
}

export default Header;