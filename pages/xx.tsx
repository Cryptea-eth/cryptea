import * as React from 'react';
import { styled } from "@mui/material/styles";

import { BsCheck as Check } from 'react-icons/bs'

import {
  stepConnectorClasses,
  StepConnector,
  Step,
  Stepper,
  StepLabel,
} from "@mui/material";

const StepperLine = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#f57059',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#f57059',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const StepperMain: any = styled("div")(({ theme, ownerState }: any) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#f57059",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#f57059",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props: any) {
  const { active, completed, className } = props;

  return (
    <StepperMain ownerState={{ active }} className={className}>
      {completed ? (
        <Check size={23} className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </StepperMain>
  );
}


const steps = ['Link type', 'Amount', 'Leo'];

export default function CustomizedSteppers() {
  return (
   
      <Stepper alternativeLabel activeStep={2} connector={<StepperLine />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

  );
}
