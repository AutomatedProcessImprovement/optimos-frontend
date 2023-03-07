import {
    Button,
    ButtonGroup,
    Grid,
    makeStyles,
    Step,
    StepButton,
    StepLabel,
    Stepper,
    Tooltip,
    useTheme
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import GroupsIcon from '@mui/icons-material/Groups';
import DateRangeIcon from '@mui/icons-material/DateRange';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useFormState from "./useFormState";
import useJsonFile from "./useJsonFile";
import {AlertColor} from "@mui/material/Alert";

import useTabVisibility, { TABS } from './useTabVisibility';
import SnackBar from "../SnackBar";
import GlobalConstraints from "../globalConstraints/GlobalConstraints";
import paths from "../../router/paths";
import {useNavigate} from "react-router";
import {useForm} from "react-hook-form";
import {ScenarioProperties} from "../../JsonData";
import ResourceConstraints from "../resourceConstraints/ResourceConstraints";

interface LocationState {
    bpmnFile: File,
    simParamsFile: File,
    consParamsFile: File
}

const tooltip_desc: { [key: string]: string } = {
    GLOBAL_CONSTRAINTS:
        "test",
    RESOURCE_CONSTRAINTS:
        "test",
    SIMULATION_RESULTS:
        "",
}

const ParameterEditor = () => {
    const navigate = useNavigate()

    const {state} = useLocation()
    const {bpmnFile, simParamsFile, consParamsFile} = state as LocationState
    const [snackMessage, setSnackMessage] = useState("")
    const theme = useTheme()
    const activeColor = theme.palette.info.dark
    const successColor = theme.palette.success.light
    const errorColor = theme.palette.error.light

    const linkDownloadRef = useRef<HTMLAnchorElement>(null)


    const [activeStep, setActiveStep] = useState<TABS>(TABS.GLOBAL_CONSTRAINTS)
    const [snackColor, setSnackColor] = useState<AlertColor | undefined>(undefined)

    const {jsonData} = useJsonFile(consParamsFile)

    const {formState} = useFormState(jsonData)
    const {formState: {errors, isValid, isSubmitted, submitCount}, getValues, handleSubmit} = formState

    const {visibleTabs, getIndexOfTab} = useTabVisibility()

    const scenarioState = useForm<ScenarioProperties>({
        mode: "onBlur",
        defaultValues: {
            num_iterations: 100,
            algorithm: "HC-FLEX",
            approach: "CO"
        }
    })
    const { getValues: getScenarioValues, trigger: triggerScenario, formState: { errors: scenarioErrors } } = scenarioState



    const setErrorMessage = (value: string) => {
        setSnackColor("error")
        setSnackMessage(value)
    };

    const setInfoMessage = (value: string) => {
        setSnackColor("info")
        setSnackMessage(value)
    };

    const onSnackbarClose = () => {
        setErrorMessage("")
    };

    const onStartOver = () => {
        navigate(paths.UPLOAD_PATH)
    }

    const getStepContent = (index: TABS) => {
        switch (index) {
            case TABS.GLOBAL_CONSTRAINTS:
                return <GlobalConstraints
                    scenarioFormState={scenarioState}
                    jsonFormState={formState}
                    setErrorMessage={setErrorMessage}

                />
            case TABS.RESOURCE_CONSTRAINTS:
                return <ResourceConstraints
                    jsonFormState={formState}
                    setErrorMessage={setErrorMessage}

                />
            case TABS.SIMULATION_RESULTS:
                if (true)
                    return <></>

                return <></>
        }
    };
    const getStepIcon = (currentTab: TABS): React.ReactNode => {
        const isActiveStep = activeStep === currentTab
        const styles = isActiveStep ? {color: activeColor} : {}

        let Icon: React.ReactNode
        let currError: any
        let lastStep = false
        switch (currentTab) {
            case TABS.GLOBAL_CONSTRAINTS:
                currError = errors.hours_in_day
                Icon = <SettingsIcon style={styles}/>
                break
            case TABS.RESOURCE_CONSTRAINTS:
                currError = errors.hours_in_day
                Icon = <SettingsIcon style={styles}/>
                break
            case TABS.SIMULATION_RESULTS:
                lastStep = true
                Icon = <BarChartIcon style={styles}/>
                break
            default:
                return <></>
        }
    }
    return (
        <form>
            <Grid container alignItems="center" justifyContent="center">
                <Grid item xs={10} sx={{paddingTop: '10px'}}>
                    <Grid container item xs={12}>
                        <Grid item xs={4} justifyContent="flex-start">
                            <ButtonGroup>
                                <Button
                                    onClick={onStartOver}
                                    startIcon={<ArrowBackIosNewIcon/>}
                                >Start Over</Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item container xs={3} justifyContent="center">
                            <ButtonGroup>
                                <Button
                                    type="submit"
                                >Start Optimization</Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item container xs={5} justifyContent="flex-end">
                            <ButtonGroup>
                                <Button
                                    type="button"
                                    variant="outlined"
                                >Download files</Button>
                                <a
                                    style={{display: "none"}}
                                    download={"json-file-name.json"}
                                >Download json</a>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} alignItems="center" justifyContent="center" sx={{paddingTop: '20px'}}>
                        <Stepper nonLinear alternativeLabel activeStep={getIndexOfTab(activeStep)}
                                 >
                            {Object.entries(visibleTabs.getAllItems()).map(([key, label]: [string, string]) => {
                                const keyTab = key as keyof typeof TABS
                                const valueTab: TABS = TABS[keyTab]

                                return <Step key={label}>
                                    <Tooltip title={tooltip_desc[key]}>
                                        <StepButton color="inherit" onClick={() => setActiveStep(valueTab)}
                                                    icon={getStepIcon(valueTab)}>
                                            {label}
                                        </StepButton>
                                    </Tooltip>
                                </Step>
                            })}
                        </Stepper>
                        <Grid container mt={3} style={{marginBottom: "2%"}}>
                            {getStepContent(activeStep)}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {
                snackMessage && <SnackBar
                    message={snackMessage}
                    severityLevel={snackColor}
                    onSnackbarClose={onSnackbarClose}
                />
            }
        </form>
    );
}
export default ParameterEditor