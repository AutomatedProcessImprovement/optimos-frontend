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
import React, { useState, useEffect, useRef } from 'react';
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
import { saveAs } from "file-saver";

import {AlertColor} from "@mui/material/Alert";
import BuildIcon from '@mui/icons-material/Build';
import useTabVisibility, { TABS } from './useTabVisibility';
import SnackBar from "../SnackBar";
import GlobalConstraints from "../globalConstraints/GlobalConstraints";
import paths from "../../router/paths";
import {useNavigate} from "react-router";
import {useForm} from "react-hook-form";
import {ConsJsonData, ScenarioProperties} from "../../JsonData";
import RCons from "../resourceConstraints/ResourceConstraints";
import ScenarioConstraints from "../globalConstraints/ScenarioConstraints";
import {getTaskByTaskId, optimize} from "../../api/api";
import {useInterval} from "usehooks-ts";
import OptimizationResults from "../dashboard/OptimizationResults";
import JSZip from "jszip";

interface LocationState {
    bpmnFile: File,
    simParamsFile: File,
    consParamsFile: File
}

const tooltip_desc: { [key: string]: string } = {
    GLOBAL_CONSTRAINTS:
        "Define the algorithm, approach and number of iterations",
    SCENARIO_CONSTRAINTS:
        "Define the top-level restrictions like the time granularity and the maximum work units",
    RESOURCE_CONSTRAINTS:
        "Define resource specific constraints, their maximum capacity and working masks",
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

    const [isPollingEnabled, setIsPollingEnabled] = useState(false)
    const [pendingTaskId, setPendingTaskId] = useState("")

    const [activeStep, setActiveStep] = useState<TABS>(TABS.GLOBAL_CONSTRAINTS)
    const [snackColor, setSnackColor] = useState<AlertColor | undefined>(undefined)

    const {jsonData} = useJsonFile(consParamsFile)

    const {formState} = useFormState(jsonData)
    const {formState: {errors, isValid, isSubmitted, submitCount}, getValues, handleSubmit} = formState

    const {visibleTabs, getIndexOfTab} = useTabVisibility()

    const [optimizationReportFileName, setOptimizationReportFileName] = useState("")
    const [optimizationReportInfo, setOptimizationReportInfo] = useState<string | null>(null)


    const scenarioState = useForm<ScenarioProperties>({
        mode: "onBlur",
        defaultValues: {
            scenario_name: "My first scenario",
            num_iterations: 100,
            algorithm: "HC-FLEX",
            approach: "CO"
        }
    })
    const { getValues: getScenarioValues, trigger: triggerScenario, formState: { errors: scenarioErrors } } = scenarioState


    useInterval(
        () => {
            getTaskByTaskId(pendingTaskId)
                .then((result: any) => {
                    const dataJson = result.data
                    console.log(dataJson.TaskStatus)
                    if (dataJson.TaskStatus === "SUCCESS") {
                        setIsPollingEnabled(false)
                        console.log(dataJson.TaskResponse)

                        // setCurrSimulatedOutput(dataJson.TaskResponse)
                        setOptimizationReportFileName(dataJson.TaskResponse['stat_path'])
                        setOptimizationReportInfo(dataJson.TaskResponse['report'])
                        console.log(dataJson.TaskResponse)

                        // redirect to results step
                        setActiveStep(TABS.SIMULATION_RESULTS)

                        // hide info message
                        onSnackbarClose()
                    }
                    else if (dataJson.TaskStatus === "FAILURE") {
                        setIsPollingEnabled(false)

                        console.log(dataJson)
                        setErrorMessage("Simulation Task failed")
                    }
                })
                .catch((error: any) => {
                    setIsPollingEnabled(false)

                    console.log(error)
                    console.log(error.response)
                    const errorMessage = error?.response?.data?.displayMessage || "Something went wrong"
                    setErrorMessage("Task Executing: " + errorMessage)
                })
        },
        isPollingEnabled ? 3000 : null
    );

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
            case TABS.SCENARIO_CONSTRAINTS:
                return <ScenarioConstraints
                    scenarioFormState={scenarioState}
                    jsonFormState={formState}
                    setErrorMessage={setErrorMessage}

                />
            case TABS.RESOURCE_CONSTRAINTS:
                return <RCons
                    // jsonFormState={formState}
                    setErrorMessage={setErrorMessage}

                    formState={formState}
                />
            case TABS.SIMULATION_RESULTS:
                if (!!optimizationReportInfo) {
                    console.log(optimizationReportInfo)
                    return <OptimizationResults
                        reportJson={optimizationReportInfo}
                        reportFileName={optimizationReportFileName}
                    />;
                }
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
                currError = scenarioErrors
                Icon = <BuildIcon style={styles}/>
                break
            case TABS.SCENARIO_CONSTRAINTS:
                currError = errors.time_var || errors.hours_in_day || errors.max_cap || errors.max_shift_size || errors.hours_in_day || errors.max_shift_blocks
                Icon = <SettingsIcon style={styles}/>
                break
            case TABS.RESOURCE_CONSTRAINTS:
                currError = errors.hours_in_day
                Icon = <GroupsIcon style={styles}/>
                break
            case TABS.SIMULATION_RESULTS:
                lastStep = true
                Icon = <BarChartIcon style={styles}/>
                break
            default:
                return <></>

        }
        return Icon
    }

    const onDownloadScenarioFilesAsZip = () => {

        const files = [bpmnFile, simParamsFile, consParamsFile]
        const zip = new JSZip();

        files.forEach((file) => {
            zip.file(file.name, file);
        });
        zip
            .generateAsync({ type: "blob" })
            .then(function (content) {
                saveAs(content, "files.zip");
            })
            .catch((e) => console.log(e));
    }

    const fromContentToBlob = (values: any) => {
        const content = JSON.stringify(values)
        const blob = new Blob([content], { type: "text/plain" })
        return blob
    };

    const getBlobBasedOnExistingInput = (): Blob => {
        const values = getValues() as ConsJsonData
        const blob = fromContentToBlob(values)

        return blob
    };


    const onStartOptimization = async () => {

        if (!isValid) {
            return;
        }
        setInfoMessage("Optimization started...")
        const newBlob = getBlobBasedOnExistingInput()
        const {num_iterations: num_iterations, approach: approach, algorithm: algorithm, scenario_name: scenario_name} = getScenarioValues()


        optimize(algorithm, approach, scenario_name, num_iterations,
            simParamsFile, newBlob, bpmnFile)
            .then(((result) => {
                const dataJson = result.data
                console.log(dataJson.TaskId)
                console.log("in optimize")

                if (dataJson.TaskId) {
                    setIsPollingEnabled(true)
                    setPendingTaskId(dataJson.TaskId)
                }

            }))
            .catch((error: any) => {
                console.log(error.response)
                setErrorMessage(error.response.data.displayMessage)
            })
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
                                    onClick={onStartOptimization}
                                    // type="submit"
                                >Start Optimization</Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item container xs={5} justifyContent="flex-end">
                            <ButtonGroup>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={onDownloadScenarioFilesAsZip}
                                >Download scenario files</Button>
                                <a
                                    style={{display: "none"}}
                                    download={"json-file-name.json"}
                                >Download json</a>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} alignItems="center" justifyContent="center" sx={{paddingTop: '20px'}}>
                        <Stepper nonLinear alternativeLabel activeStep={getIndexOfTab(activeStep)} connector={<></>}
                                 >
                            {Object.entries(visibleTabs.getAllItems()).map(([key, label]: [string, string]) => {
                                const keyTab = key as keyof typeof TABS
                                const valueTab: TABS = TABS[keyTab]

                                return <Step key={label}>
                                    <Tooltip title={tooltip_desc[key]}>
                                        <StepButton color="inherit" onClick={() => setActiveStep(valueTab)} icon={getStepIcon(valueTab)}
                                        >
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