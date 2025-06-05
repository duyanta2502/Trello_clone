import AppsIcon from '@mui/icons-material/Apps'
import CloseIcon from '@mui/icons-material/Close'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import SearchIcon from '@mui/icons-material/Search'
import { Badge, Button, TextField, Tooltip, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import SvgIcon from '@mui/material/SvgIcon'
import { useState } from 'react'

import { ReactComponent as trelloLogo } from '~/assets/mdi--trello.svg'
import ModeSelect from '~/components/ModeSelect/ModeSelect'

import Profiles from './Menus/Profiles'
import Recent from './Menus/Recent'
import Started from './Menus/Started'
import Template from './Menus/Template'
import Workspaces from './Menus/Workspaces'

function AppBar() {
  const [searchValue, setSearchValue] = useState('')
  return (
    <Box sx = {{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowY: 'hidden',
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
    }}>
      {/*===== left AppBar =====*/}
      <Box sx = {{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <AppsIcon sx = {{ color: 'white' }} />
        <Box sx = {{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon
            component={trelloLogo}
            fontSize='small'
            inheritViewBox
            sx = {{ color: 'white' }} />
          <Typography
            variant='span'
            sx = {{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold' }}> Trello
          </Typography>
        </Box>
        <Box sx={{ display: { xs:'none', md:'flex' }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Started />
          <Template />
          <Button sx={{
            color: 'white',
            border: 'none',
            '&:hover': { border: 'none' }
          }}
          variant="outlined"
          startIcon = { <LibraryAddIcon /> }> Create
          </Button>
        </Box>
      </Box>
      {/*===== right AppBar =====*/}
      <Box sx = {{ display: 'flex', alignItems: 'center', gap: 2, m: 1 }}>
        <TextField
          id="outlined-search"
          label="Search..."
          type="text"
          size='small'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: searchValue &&(
              <InputAdornment position="end">
                <CloseIcon
                  fontSize='small'
                  sx={{ color: 'white', cursor: 'pointer' }}
                  onClick={() => setSearchValue('')} />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '180px',
            '& input': { color: 'white' },
            '& label': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            }
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ModeSelect />
          <Tooltip
            title="Notifications"
            sx={{ color: 'white' }}>
            <Badge
              color="secondary"
              variant="dot"
              sx = {{ cursor: 'pointer' }}>
              <NotificationsNoneIcon
                sx={{ color:'white' }}/>
            </Badge>
          </Tooltip>
          <Tooltip
            title="Help"
            placement="bottom">
            <HelpOutlineIcon sx={{ cursor: 'pointer', color:'white' }} />
          </Tooltip>
        </Box>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar