import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
      palette: {
            primary: purple,  // '#707070'
            secondary: green,
      },
      status: {
            danger: 'orange',
      },
});

export default theme
