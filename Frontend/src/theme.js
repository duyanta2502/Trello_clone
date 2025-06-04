import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
// import { cyan, orange, deepOrange, teal } from '@mui/material/colors'

const theme = extendTheme({
  trello: {
    appBarHeight: 60,
    boardBarHeight: 60
  },
  // Custom color schemes can be defined here
  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: teal,
    //     secondary: deepOrange
    //   }
    // },
    // dark: {
    //   palette: {
    //     primary: cyan,
    //     secondary: orange
    //   }
    // }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '4px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.8px',
          '&:hover': { borderWidth: '1.6px' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          // color: theme.palette.primary.main,
          fontSize: '0.875rem'
        }
      }
    },
    MuiOutlinedInput:{
      styleOverrides:{
        root: {
          // color: theme.palette.primary.main,
          // '.MuiOutlinedInput-notchedOutline': {
          //   borderColor: theme.palette.primary.light
          // },
          // '&:hover .MuiOutlinedInput-notchedOutline': {
          //   borderColor: theme.palette.primary.main
          // },
          fontSize: '0.875rem',
          '& fieldset': { borderWidth: '0.8px !important' },
          '&:hover fieldset': { borderWidth: '1.6px !important' },
          '&.Mui-focused fieldset': { borderWidth: '1.6px !important' }
        }
      }
    }
  }
  // ...other properties
})

export default theme
