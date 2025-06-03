import ModeSelect from '~/components/ModeSelect'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Started from './Menus/Started'
import Template from './Menus/Template'
import Profiles from './Menus/Profiles'
import Box from '@mui/material/Box'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as trelloLogo } from '~/assets/mdi--trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import SearchIcon from '@mui/icons-material/Search'
function AppBar() {
  return (
    <Box sx = {{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto'
    }}>
      {/*===== left Box =====*/}
      <Box sx = {{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <AppsIcon sx = {{ color: 'primary.main' }} />
        <Box sx = {{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon component={trelloLogo} fontSize='small' inheritViewBox sx = {{ color: 'primary.main' }} />
          <Typography variant='span' sx = {{ color: 'primary.main', fontSize: '1.3rem', fontWeight: 'bold' }}>Trello </Typography>
        </Box>
        <Box sx={{ display: { xs:'none', md:'flex' }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Started />
          <Template />
          <Button variant="outlined"
            startIcon = { <LibraryAddIcon /> }> Create
          </Button>
        </Box>
      </Box>
      {/*===== right Box =====*/}
      <Box sx = {{ display: 'flex', alignItems: 'center', gap: 2, m: 1 }}>
        <TextField id="outlined-search" startIcon = { <SearchIcon/> } label="Search..." type="search" size='small' sx={{ minWidth: '120px' }}/>
        <Box sx={{ display: { xs:'none', md:'flex' }, alignItems: 'center', m: 1, gap: 1 }}>
          <ModeSelect />
          <Tooltip title="Notifications" sx={{ color: 'primary.main' }}>
            <Badge color="secondary" variant="dot" sx = {{ cursor: 'pointer' }}>
              <NotificationsNoneIcon sx={{ color:'primary.main' }}/>
            </Badge>
          </Tooltip>
          <Tooltip title="Help" placement="bottom">
            <HelpOutlineIcon sx={{ cursor: 'pointer', color:'primary.main' }} />
          </Tooltip>
        </Box>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar