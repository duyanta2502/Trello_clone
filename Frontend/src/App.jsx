import Button from '@mui/material/Button'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import AccessAlarm from '@mui/icons-material/AccessAlarm'
import HomeIcon from '@mui/icons-material/Home'
import pink from '@mui/material/colors/pink'
function App() {
  return (
    <>
      <div>taduyan</div>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <br></br>
      <AccessAlarm />
      <ThreeDRotation />
      <HomeIcon />
      <HomeIcon color="primary" />
      <HomeIcon color="secondary" />
      <HomeIcon color="success" />
      <HomeIcon color="action" />
      <HomeIcon color="disabled" />
      <HomeIcon sx={{ color: pink[500] }} />
    </>
  )
}

export default App
