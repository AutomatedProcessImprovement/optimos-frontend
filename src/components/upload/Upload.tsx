import * as React from 'react'
import {useEffect, useState} from 'react'
import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import {LoadingButton} from '@mui/lab';
import FileUploader from "../FileUploader";
import {getFileByFileName, getTaskByTaskId, optimize} from "../../api/api";
import {useInterval} from 'usehooks-ts'
import paths from '../../router/paths';
import {useNavigate} from "react-router";
import SnackBar from "../SnackBar";
import {AlertColor} from "@mui/material/Alert";


const Upload = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [simParams, setSimParams] = useState<File | null>(null);
    const [consParams, setConsParams] = useState<File | null>(null);
    const [bpmnModel, setBpmnModel] = useState<File | null>(null);

    const [approach, setApproach] = useState<string>("")
    const [algorithm, setAlgorithm] = useState<string>("")
    const [name, setName] = useState<string>("")

    const [iterations, setIterations] = useState<number>(0)

    const [snackMessage, setSnackMessage] = useState("");
    const [snackColor, setSnackColor] = useState<AlertColor | undefined>(undefined)

    const [isPollingEnabled, setIsPollingEnabled] = useState(false)
    const [pendingTaskId, setPendingTaskId] = useState("")

    const [optimizationReportFileName, setOptimizationReportFileName] = useState("")



    const navigate = useNavigate()

    useEffect(() => {
        if (optimizationReportFileName === "") {
            return
        }
        getFileByFileName(optimizationReportFileName)
            .then((result: any) => {
                const jsonString = JSON.stringify(result.data)
                const blob = new Blob([jsonString], {type: "application/json"});

                const optimizationReportFile = new File([blob], "name", { type: "application/json" })


                navigate(paths.DASHBOARD_PATH, {
                    state: {
                        reportFile: optimizationReportFile,
                        reportJson: jsonString
                    }
                })


            })
            .catch((error: any) => {
                console.log(error?.response || error)
                const errorMessage = error?.response?.data?.displayMessage || "Something went wrong"
                setErrorMessage("Loading File: " + errorMessage)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optimizationReportFileName])

    useInterval(
    () => {
            getTaskByTaskId(pendingTaskId)
                .then((result:any) => {
                    const dataJson = result.data
                    if (dataJson.TaskStatus === "SUCCESS") {
                        setIsPollingEnabled(false);

                        const taskResponseJson = dataJson.TaskResponse
                        if (taskResponseJson["success"] === false) {
                            setIsPollingEnabled(false)
                            setErrorMessage(`Optimization Task: ${taskResponseJson['errorMessage']}`)
                        } else {
                            setOptimizationReportFileName(taskResponseJson['stat_path'])
                            setLoading(false)
                        }
                    }
                    else if (dataJson.TaskStatus === "FAILURE") {
                        setIsPollingEnabled(false)
                        setLoading(false)

                        setErrorMessage("Optimization Task failed")
                    }
                })
                .catch((error: any) => {
                    setIsPollingEnabled(false)

                    const errorMessage = error?.response?.data?.displayMessage || "Something went wrong"
                    setErrorMessage("Task Executing: " + errorMessage)
                })
    },
        isPollingEnabled ? 3000 : null
    )


    const areFilesPresent = () => {
        // const params_complete = approach !== '' && algorithm !== '' && name !== '' && iterations != 0
        return simParams != null && consParams != null && bpmnModel != null
    }

    const onBpmnModelChange = (file: File) => {
        setBpmnModel(file)
    };
    const onSimParamsChange = (file: File) => {
        setSimParams(file)
    };
    const onConsParamsChange = (file: File) => {
        setConsParams(file)
    };

    const setInfoMessage = (value: string) => {
        updateSnackMessage(value)
        setSnackColor("info")
    };

    const setErrorMessage = (value: string) => {
        updateSnackMessage(value)
        setSnackColor("error")
        setLoading(false)
    };

    const updateSnackMessage = (text: string) => {
        setSnackMessage(text)
    };



    const onSnackbarClose = () => {
        updateSnackMessage("")
    };

    const handleRequest = async () => {
        setLoading(true)

        if (!areFilesPresent()) {
            return
        }
        setInfoMessage("Optimization started...")

        navigate(paths.PARAMEDITOR_PATH, {
            state: {
                bpmnFile: bpmnModel,
                simParamsFile: simParams,
                consParamsFile: consParams
            }
        })
    }

    const handleChange = (event: SelectChangeEvent | any) => {
        if (event.target.name === 'scenarioName') {
            setName(event.target.value)
        }
    };

    return (
        <>
            <Grid container alignItems="center" justifyContent="center" spacing={4} style={{ paddingTop: '30px' }} className="centeredContent">
                <Grid item xs={6}>
                    <Paper elevation={5} sx={{ p: 3, minHeight: '25vw' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4" align="center">
                                    Upload files
                                </Typography>
                                <br/>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Grid container>
                                            <Grid item xs={3}>
                                                <Typography variant="body1" align="left" sx={{fontWeight: 'bold'}}>
                                                    Supported extensions:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography variant="body1" align="left">
                                                    bpmn | json
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container sx={{paddingTop: '5%'}}>
                                <Grid item xs={12} className="centeredContent">
                                    <Typography variant={'h5'}>Name your scenario</Typography>
                                    <TextField
                                        onChange={handleChange}
                                        name={"scenarioName"}
                                        sx={{ m:1,minWidth: 250}} id="logname_textfield" label="e.g. John Doe" variant="standard" className="centeredContent"/>
                                </Grid>
                                <Grid container sx={{paddingTop: '5%'}}>
                                    <Grid item xs={4}>
                                        <Typography>BPMN Model</Typography>
                                        <br/>
                                        <FileUploader
                                            file={bpmnModel}
                                            startId="bpmn_file"
                                            ext=".bpmn"
                                            onFileChange={onBpmnModelChange}
                                            setErrorMessage={setErrorMessage}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>Simulation Parameters</Typography>
                                        <br/>
                                        <FileUploader
                                            file={simParams}
                                            startId="simparams_file"
                                            ext=".json"
                                            onFileChange={onSimParamsChange}
                                            setErrorMessage={setErrorMessage}
                                        />
                                    </Grid>
                                        <Grid item xs={4}>
                                            <Typography>Constraints Parameters</Typography>
                                            <br/>
                                            <FileUploader
                                                file={consParams}
                                                startId="consparams_file"
                                                ext=".json"
                                                onFileChange={onConsParamsChange}
                                                setErrorMessage={setErrorMessage}
                                            />
                                        </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Grid item xs={12} sx={{paddingTop: '20px'}}>
                        <LoadingButton
                            disabled={!areFilesPresent()}
                            variant="contained"
                            onClick={handleRequest}
                            loading={loading}
                        >
                            Start optimization
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
            {snackMessage && <SnackBar
                message={snackMessage}
                onSnackbarClose={onSnackbarClose}
                severityLevel={snackColor}
            />}
        </>
    )
}

export default Upload;