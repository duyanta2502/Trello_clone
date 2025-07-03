import { ToastContainer } from 'react-toastify'
import { useTheme } from '@mui/material/styles'
import 'react-toastify/dist/ReactToastify.css'

const ToastWrapper = () => {
  const theme = useTheme()

  return (
    <ToastContainer
      position="bottom-left"
      theme={theme.palette.mode === 'dark' ? 'dark' : 'light'}
    />
  )
}

export default ToastWrapper