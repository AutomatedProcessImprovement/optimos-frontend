import {useLocation} from "react-router";
import {Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import FileUploader from "./FileUploader";
import {LoadingButton} from "@mui/lab";
import * as React from "react";
import moment from 'moment';
import 'moment-duration-format';

interface LocationState {
    reportFile: File
    reportJson: string
}

const DashBoard = () => {
    const { state } = useLocation()
    const { reportFile, reportJson } = state as LocationState

    const [fileDownloadUrl, setFileDownloadUrl] = useState("")
    const [fileDownloadSimParams, setFileDownloadSimParams] = useState("")
    const [fileDownloadConsParams, setFileDownloadConsParams] = useState("")
    const linkDownloadRef = useRef<HTMLAnchorElement>(null)
    const link2DownloadRef = useRef<HTMLAnchorElement>(null)
    const link3DownloadRef = useRef<HTMLAnchorElement>(null)

    const report = JSON.parse(reportJson)

    useEffect(() => {
        if (fileDownloadUrl !== "" && fileDownloadUrl !== undefined) {
            linkDownloadRef.current?.click()
            URL.revokeObjectURL(fileDownloadUrl);
        }
    }, [fileDownloadUrl]);

    useEffect(() => {
        if (fileDownloadSimParams !== "" && fileDownloadSimParams !== undefined) {
            link2DownloadRef.current?.click()
            URL.revokeObjectURL(fileDownloadSimParams);
        }
    }, [fileDownloadSimParams]);

    useEffect(() => {
        if (fileDownloadConsParams !== "" && fileDownloadConsParams !== undefined) {
            link3DownloadRef.current?.click()
            URL.revokeObjectURL(fileDownloadConsParams);
        }
    }, [fileDownloadConsParams]);



    const onDownloadEntrySimParams = (entry: any) => {
        const blob = new Blob([JSON.stringify(entry)], {type: "application/json"});

        const entry_parameters_file = new File([blob], "name", { type: "application/json" })
        const fileDownloadUrl = URL.createObjectURL(entry_parameters_file)
        setFileDownloadSimParams(fileDownloadUrl)
    }

    const onDownloadEntryConsParams = (entry: any) => {
        const blob = new Blob([JSON.stringify(entry)], {type: "application/json"});

        const entry_parameters_file = new File([blob], "name", { type: "application/json" })
        const fileDownloadUrl = URL.createObjectURL(entry_parameters_file)
        setFileDownloadConsParams(fileDownloadUrl)
    }


    const onDownload = () => {

        const fileDownloadUrl = URL.createObjectURL(reportFile)
        setFileDownloadUrl(fileDownloadUrl)
    }

    return (
        <>
            <Grid container alignItems="center" justifyContent="center" spacing={4} style={{ paddingTop: '30px' }} className="centeredContent">
                <Grid item xs={6}>
                    <Paper elevation={5} sx={{ p: 3, minHeight: '30vw' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4" align="center">
                                    Optimization report
                                </Typography>
                                <br/>
                                <Grid container>
                                    { report.map((item: any) => {
                                        return <Grid container >
                                            <Grid item xs={12}>
                                                <Typography variant={"h5"} align={"left"} sx={{paddingBottom: 1}} > {item.name}</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography sx={{fontWeight: 'bold'}} align={"left"}> Average cost</Typography>
                                                <Typography sx={{fontWeight: 'bold'}} align={"left"}> Average cycle time (sec)</Typography>
                                                <Typography sx={{fontWeight: 'bold'}} align={"left"}> Pareto size</Typography>
                                                <Typography sx={{fontWeight: 'bold'}} align={"left"}> # in Pareto</Typography>
                                                <Typography sx={{fontWeight: 'bold'}} align={"left"}> Cost compared to original</Typography>
                                                <Typography sx={{fontWeight: 'bold'}} align={"left"}> Time compared to original</Typography>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography align={"left"}> {item.ave_cost}</Typography>
                                                <Typography align={"left"}> {item.ave_time}</Typography>
                                                <Typography align={"left"}> {item.pareto_size}</Typography>
                                                <Typography align={"left"}> {item.in_jp}</Typography>
                                                <Typography align={"left"}> {item.cost_metric}</Typography>
                                                <Typography align={"left"}> {item.time_metric}</Typography>
                                            </Grid>
                                            <Grid container >
                                                <Typography variant={"h5"} align={"left"} sx={{paddingTop:1}} > Pareto values</Typography>
                                                {item.pareto_values.map((entry: any) => {
                                                    return <Grid container sx={{paddingTop: 1}}>

                                                        <Grid item xs={5}>
                                                            <Typography sx={{fontWeight: 'bold'}} align={"left"}> Entry ID</Typography>
                                                            <Typography sx={{fontWeight: 'bold'}} align={"left"}> Median cost</Typography>
                                                            <Typography sx={{fontWeight: 'bold'}} align={"left"}> Median cycle time (sec)</Typography>
                                                        </Grid>
                                                        <Grid item xs={7}>
                                                            <Typography align={"left"}> {entry.name}</Typography>
                                                            <Typography align={"left"}> {entry.median_execution_cost}</Typography>
                                                            <Typography align={"left"}> {entry.median_cycle_time}</Typography>
                                                        </Grid>
                                                        <Button
                                                            sx={{ marginTop: 1, marginRight: 1}}
                                                            type="button"
                                                            variant="contained"
                                                            onClick={(_e) => onDownloadEntrySimParams(entry.sim_params)}
                                                        >Download parameters</Button>
                                                        <a
                                                            style={{ display: "none" }}
                                                            download={"simparams.json"}
                                                            href={fileDownloadSimParams}
                                                            ref={link2DownloadRef}
                                                        >Download json</a>

                                                        <Button
                                                            sx={{ marginTop: 1}}
                                                            type="button"
                                                            variant="contained"
                                                            onClick={(_e) => onDownloadEntryConsParams(entry.cons_params)}
                                                        >Download constraints</Button>
                                                        <a
                                                            style={{ display: "none" }}
                                                            download={"constraints.json"}
                                                            href={fileDownloadConsParams}
                                                            ref={link3DownloadRef}
                                                        >Download json</a>

                                                    </Grid>

                                                })}
                                            </Grid>
                                        </Grid>
                                    })}
                                </Grid>
                            </Grid>

                        </Grid>
                    </Paper>
                    <Grid item xs={12} sx={{paddingTop: '20px'}}>
                        <Button
                            type="button"
                            variant="contained"
                            onClick={(_e) => onDownload()}
                        >Download entire report</Button>
                        <a
                            style={{ display: "none" }}
                            download={"report.json"}
                            href={fileDownloadUrl}
                            ref={linkDownloadRef}
                        >Download json</a>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default DashBoard