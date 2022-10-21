import { Box } from '@mui/material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    padding?: number;
  }

const TabPanel = (props: TabPanelProps) => {
  const { children, padding, value, index, ...other } = props;

  const pc = {
      p: padding,
      py: padding ? undefined : 2
  }

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={pc}>
          {children}
        </Box>
      )}
    </div>
  );
}


export default TabPanel;