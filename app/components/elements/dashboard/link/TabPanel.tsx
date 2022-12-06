import { Box } from '@mui/material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    className?:string
    padding?: number;
  }

const TabPanel = (props: TabPanelProps) => {
  const { children, padding, value, index, className = '', ...other } = props;

  const pc = {
      p: padding,
      py: padding !== undefined ? undefined : 2
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
        <Box className={className} sx={pc}>
          {children}
        </Box>
      )}
    </div>
  );
}


export default TabPanel;