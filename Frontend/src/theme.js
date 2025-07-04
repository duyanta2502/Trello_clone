import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
// import { cyan, orange, deepOrange, teal } from '@mui/material/colors'
const APP_BAR_HEIGHT = 58
const BOARD_BAR_HEIGHT = 60
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT + BOARD_BAR_HEIGHT}px)`
const COLUM_HEADER_HEIGHT = '50px'
const COLUM_FOOTER_HEIGHT = '56px'
const theme = extendTheme({
  trello: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUM_HEADER_HEIGHT,
    columnFooterHeight: COLUM_FOOTER_HEIGHT
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
          // fix tạm cho nó, tắt luôn cho đỡ bug
          textTransform: 'none',
          borderWidth: '0.8px',
          '&:hover': { borderWidth: '0.8px' }
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
    // FontSize for content board
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': {
            fontSize: '0.875rem'
          }
        }
      }
    },
    // theme TextField
    MuiOutlinedInput:{
      styleOverrides:{
        root: {
          fontSize: '0.875rem',
          '& fieldset': { borderWidth: '0.8px !important' },
          '&:hover fieldset': { borderWidth: '1.6px !important' },
          '&.Mui-focused fieldset': { borderWidth: '1.6px !important' }
        }
      }
    },
    // theme Card
    MuiCard:{
      styleOverrides:{
        root: ({ theme }) => ({
          // border: '0.8px solid transparent',
          borderWidth: '0.8px',
          borderStyle: 'solid',
          borderColor: 'transparent',
          '&:hover': {
            borderColor: theme.palette.mode === 'dark' ? 'white' : '#1976d2'
          }
        })
      }
    }
  }
  // ...other properties
})

export default theme
