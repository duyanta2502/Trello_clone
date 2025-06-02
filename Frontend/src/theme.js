import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { cyan, orange, deepOrange, teal } from '@mui/material/colors'
import { AppBar } from '@mui/material'

// Create a theme instance.
const theme = extendTheme({
  trello: {
    AppBarHeight: 48,
    boardBarHeight: 58
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange
      },
      spacing: (factor) => `${0.25 * factor}rem`
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange
      },
      spacing: (factor) => `${0.25 * factor}rem`
    }
  }
  // ...other properties
})

export default theme
