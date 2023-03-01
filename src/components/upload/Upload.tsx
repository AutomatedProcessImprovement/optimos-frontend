import * as React from 'react'
import FileDropzoneArea from "./FileDropzoneArea";
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
import {useEffect, useState} from "react";
import FileUploader from "../FileUploader";
import {getFileByFileName, getTaskByTaskId, optimize} from "../../api/api";
import { useInterval } from 'usehooks-ts'
import paths from '../../router/paths';
import {useNavigate} from "react-router";


const Upload = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [simParams, setSimParams] = useState<File | null>(null);
    const [consParams, setConsParams] = useState<File | null>(null);
    const [bpmnModel, setBpmnModel] = useState<File | null>(null);

    const [approach, setApproach] = useState<string>("")
    const [algorithm, setAlgorithm] = useState<string>("")
    const [name, setName] = useState<string>("")

    const [iterations, setIterations] = useState<number>(0)

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
                    console.log(result)
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

                        console.log(dataJson)
                        setErrorMessage("Optimization Task failed")
                    }
                })
                .catch((error: any) => {
                    setIsPollingEnabled(false)

                    console.log(error)
                    const errorMessage = error?.response?.data?.displayMessage || "Something went wrong"
                    setErrorMessage("Task Executing: " + errorMessage)
                })
    },
        isPollingEnabled ? 3000 : null
    )


    const areFilesPresent = () => {
        const files_complete = simParams != null && consParams != null && bpmnModel != null
        const params_complete = approach !== '' && algorithm !== '' && name !== '' && iterations != 0
        return files_complete && params_complete
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

    const setErrorMessage = (value: string) => {
        console.log("WIP: ErrorMessage")
    };

    const handleRequest = async () => {
        setLoading(false)
        if (areFilesPresent()) {
            // Set info message
            optimize(algorithm, approach, name, iterations,
                simParams as Blob, consParams as Blob , bpmnModel as Blob)
                .then(((result) => {
                    const dataJson = result.data
                    console.log(result)
                    console.log(dataJson.TaskId)

                    if (dataJson.TaskId) {
                        setPendingTaskId(dataJson.TaskId)
                        console.log(pendingTaskId)
                        setIsPollingEnabled(true)
                    }

                }))
                .catch((error: any) => {
                    console.log(error.response)
                    setErrorMessage(error.response.data.displayMessage)
                })

        }
    }

    const handleChange = (event: SelectChangeEvent | any) => {
        if (event.target.name === 'iterations') {
            setIterations(event.target.value)
        } else if (event.target.name === 'approach') {
            setApproach(event.target.value as string);
        } else if (event.target.name === 'algorithm') {
            setAlgorithm(event.target.value as string);
        } else if (event.target.name === 'scenarioName') {
            setName(event.target.value)
        }
    };

    return (
        <>
            <Grid container alignItems="center" justifyContent="center" spacing={4} style={{ paddingTop: '30px' }} className="centeredContent">
                <Grid item xs={6}>
                    <Paper elevation={5} sx={{ p: 3, minHeight: '30vw' }}>
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
                                <Grid container sx={{paddingTop: '5%'}}>
                                    <Grid item xs={4}>
                                        <Typography >Algorithm selection</Typography>
                                        <FormControl sx={{marginTop: '10px'}}>
                                            <InputLabel id={"algorithm-select-label"}>Algorithm</InputLabel>
                                            <Select
                                                required={true}
                                                name={"algorithm"}
                                                sx={{minWidth: 250}}
                                                labelId="algorithm-select-label"
                                                id="approach-select"
                                                value={algorithm}
                                                label="Algorithm"
                                                onChange={handleChange}
                                                placeholder={"HC"}
                                            >
                                                <MenuItem value={"HC-STRICT"}>HC-STRICT | Hill Climb strict</MenuItem>
                                                <MenuItem value={"HC-FLEX"}>HC-FLEX | Hill Climb flex</MenuItem>
                                                <MenuItem value={"TS"}>TS | Tabu search </MenuItem>
                                                <MenuItem value={"ALL"}>ALL | All algorithms </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>Approach Selection</Typography>
                                        <FormControl sx={{marginTop: '10px'}}>
                                            <InputLabel id="approach-select-label">Approach</InputLabel>
                                            <Select
                                                required={true}
                                                sx={{minWidth: 250}}
                                                labelId="approach-select-label"
                                                id="approach-select"
                                                value={approach}
                                                name={"approach"}
                                                label="Approach"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={"CA"}>CA | Calendar Only</MenuItem>
                                                <MenuItem value={"AR"}>AR | Add/Remove Only</MenuItem>
                                                <MenuItem value={"CO"}>CO | CA/AR combined </MenuItem>
                                                <MenuItem value={"CAAR"}>CAAR | First CA then AR </MenuItem>
                                                <MenuItem value={"ARCA"}>ARCA | First AR then CA </MenuItem>
                                                <MenuItem value={"ALL"}>ALL | All approaches </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>Number of iterations</Typography>
                                        <TextField
                                            onChange={handleChange}
                                            name={"iterations"}
                                            sx={{minWidth: 250, marginTop: '10px'}} id="iterations_textfield" label="Iterations" variant="outlined" />
                                    </Grid>

                                </Grid>
                                {/*<FileDropzoneArea*/}
                                {/*    acceptedFiles={['.bpmn', '.json']}*/}
                                {/*    setSelectedFiles={setSelectedFiles}*/}
                                {/*/>*/}
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
        </>
    )
}

export default Upload;