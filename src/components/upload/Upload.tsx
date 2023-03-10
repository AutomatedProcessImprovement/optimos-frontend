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
import FileDropzoneArea from "./FileDropzoneArea";
import JSZip from "jszip";
import useJsonFile from "../parameterEditor/useJsonFile";

const Upload = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const [simParams, setSimParams] = useState<File | null>(null);
    const [consParams, setConsParams] = useState<File | null>(null);
    const [bpmnModel, setBpmnModel] = useState<File | null>(null);
    const [combinedFiles, setCombinedFiles] = useState<File | File[]>()

    const [snackMessage, setSnackMessage] = useState("");
    const [snackColor, setSnackColor] = useState<AlertColor | undefined>(undefined)

    const navigate = useNavigate()

    const [isValidConstraints, setIsValidConstraints] = useState<boolean>(false)
    const [isValidSimParams, setIsValidSimParams] = useState<boolean>(false)

    useEffect(() => {
        if (combinedFiles === undefined) {
            setSimParams(null)
            setBpmnModel(null)
            setConsParams(null)
            setIsValidConstraints(false)
            setIsValidSimParams(false)
            return
        }
        if (combinedFiles instanceof Array<File>) {
            for (const combinedFilesKey in combinedFiles) {
                if (combinedFiles[combinedFilesKey].name.endsWith(".bpmn")) {
                    setBpmnModel(combinedFiles[combinedFilesKey])
                }
                if (combinedFiles[combinedFilesKey].name.endsWith(".json")) {

                    if (combinedFiles[combinedFilesKey].name.includes("constraints")) {
                        const jsonFileReader = new FileReader();
                        jsonFileReader.readAsText(combinedFiles[combinedFilesKey], "UTF-8");
                        jsonFileReader.onload = e => {
                            if (e.target?.result && typeof e.target?.result === 'string') {
                                const rawData = JSON.parse(e.target.result);
                                setIsValidConstraints(rawData.time_var != undefined && rawData.resources != undefined)
                            }
                        };
                        setConsParams(combinedFiles[combinedFilesKey]);
                    } else {
                        const jsonFileReader = new FileReader();
                        jsonFileReader.readAsText(combinedFiles[combinedFilesKey], "UTF-8");
                        jsonFileReader.onload = e => {
                            if (e.target?.result && typeof e.target?.result === 'string') {
                                const rawData = JSON.parse(e.target.result);
                                setIsValidConstraints(rawData.resource_profiles != undefined && rawData.resource_calendars != undefined)
                            }
                        };
                        setSimParams(combinedFiles[combinedFilesKey])
                    }
                }
            }
        } else {
            const zip = new JSZip();
            zip.loadAsync(combinedFiles).then((content) => {
                for (const contentKey in content.files) {
                    if (content.files[contentKey].name.endsWith(".bpmn")) {
                        content.files[contentKey].async('blob').then((fileData) => {
                            const f = new File([fileData], "model.bpmn")
                            setBpmnModel(f)
                        })
                    }
                    if (content.files[contentKey].name.endsWith(".json")) {
                        content.files[contentKey].async('blob').then((fileData) => {
                            if (content.files[contentKey].name.includes("constraints")) {
                                const f = new File([fileData], content.files[contentKey].name);
                                const jsonFileReader = new FileReader();
                                jsonFileReader.readAsText(f, "UTF-8");
                                jsonFileReader.onload = e => {
                                    if (e.target?.result && typeof e.target?.result === 'string') {
                                        const rawData = JSON.parse(e.target.result);
                                        setIsValidConstraints(rawData.time_var != undefined && rawData.resources != undefined)
                                    }
                                };
                                setConsParams(f)
                            } else {
                                const f = new File([fileData], content.files[contentKey].name);
                                const jsonFileReader = new FileReader();
                                jsonFileReader.readAsText(f, "UTF-8");
                                jsonFileReader.onload = e => {
                                    if (e.target?.result && typeof e.target?.result === 'string') {
                                        const rawData = JSON.parse(e.target.result);
                                        setIsValidConstraints(rawData.resource_profiles != undefined && rawData.resource_calendars != undefined)
                                    }
                                };
                                setSimParams(f)
                            }
                        })
                    }
                }
            }).catch((error) => {
                setErrorMessage(error)
            });
        }

    }, [combinedFiles])

    const areFilesPresent = () => {
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
    };

    const updateSnackMessage = (text: string) => {
        setSnackMessage(text)
    };

    const onSnackbarClose = () => {
        updateSnackMessage("")
    };

    const handleRequest = async () => {
        setLoading(true)

        if (!areFilesPresent() && !isValidConstraints && !isValidSimParams) {
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
                                                    bpmn | json | zip
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container sx={{paddingTop: '5%'}}>
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
                                <Grid item sx={{paddingTop: '5%'}} className="centeredContent" xs={12}>
                                    <FileDropzoneArea acceptedFiles={[".zip", ".json", ".bpmn"]} setSelectedFiles={setCombinedFiles}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Grid item xs={12} sx={{paddingTop: '20px'}}>
                        <LoadingButton
                            disabled={!areFilesPresent() && !isValidConstraints && !isValidSimParams}
                            variant="contained"
                            onClick={handleRequest}
                            loading={loading}
                            sx={{width: '250px'}}
                        >
                            Next
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