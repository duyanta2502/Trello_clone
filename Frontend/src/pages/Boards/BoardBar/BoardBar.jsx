import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FilterListIcon from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import { Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

import { capitalizeFirstLetter } from '~/utils/formatters'

const MENU_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paxdingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': { color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
function BoardBar({ board }) {
  return (
    <Box sx = {{
      // backgroundColor: 'primary.dark',
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      borderBottom: '1px solid white',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      {/* left BoardBar */}
      <Box sx = {{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Chip
          sx={ MENU_STYLE }
          icon={<DashboardIcon />}
          label={board?.title}
          clickable
        />
        <Chip
          sx={ MENU_STYLE }
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={ MENU_STYLE }
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx={ MENU_STYLE }
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={ MENU_STYLE }
          icon={<FilterListIcon />}
          label="Filter"
          clickable
        />
      </Box>
      {/* right BoardBar */}
      <Box sx = {{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon = { <PersonAddIcon/> }
          sx = {{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}> Invite
        </Button>
        <AvatarGroup max={5}
          sx={{
            gap:'10px',
            '& .MuiAvatar-root': {
              width: 30,
              height: 30,
              fontSize: 16,
              border:'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0de' }
            }
          }}
        >
          <Tooltip title="duyanta2502">
            <Avatar alt="duyanta2502" src="https://cdn.donmai.us/720x720/c4/ff/c4ffab6a2ac05f28c76333f35f56ceae.webp" />
          </Tooltip>
          <Tooltip title="duyanta1">
            <Avatar alt="duyanta2502" src="https://cdn.donmai.us/720x720/c4/ff/c4ffab6a2ac05f28c76333f35f56ceae.webp" />
          </Tooltip>
          <Tooltip title="duyanta2">
            <Avatar alt="duyanta2502" src="https://cdn.donmai.us/720x720/c4/ff/c4ffab6a2ac05f28c76333f35f56ceae.webp" />
          </Tooltip>
          <Tooltip title="duyanta3">
            <Avatar alt="duyanta2502" src="https://cdn.donmai.us/720x720/c4/ff/c4ffab6a2ac05f28c76333f35f56ceae.webp" />
          </Tooltip>
          <Tooltip title="duyanta4">
            <Avatar alt="duyanta2502" src="https://cdn.donmai.us/720x720/c4/ff/c4ffab6a2ac05f28c76333f35f56ceae.webp" />
          </Tooltip>
          <Tooltip title="duyanta5">
            <Avatar alt="duyanta2502" src="https://cdn.donmai.us/720x720/c4/ff/c4ffab6a2ac05f28c76333f35f56ceae.webp" />
          </Tooltip>
          <Tooltip title="duyanta6">
            <Avatar alt="duyanta2502" src="https://cdn.donmai.us/720x720/c4/ff/c4ffab6a2ac05f28c76333f35f56ceae.webp" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar