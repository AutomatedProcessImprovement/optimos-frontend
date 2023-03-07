import {Controller, useFieldArray, UseFormReturn} from "react-hook-form";
import {ConsJsonData, ScenarioProperties} from "../../JsonData";
import {Card, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {REQUIRED_ERROR_MSG, SHOULD_BE_GREATER_0_MSG} from "../validationMessages";
import * as React from "react";

interface GlobalConstraintsProps {
    scenarioFormState: UseFormReturn<ScenarioProperties,object>
    jsonFormState: UseFormReturn<ConsJsonData, object>
    setErrorMessage: (value: string) => void
}


const GlobalConstraints = (props: GlobalConstraintsProps) => {
    const {
        scenarioFormState: { control: scenarioFormControl, formState: scenarioErrors },
        jsonFormState: { control: consFormControl, formState: consErrors },
        setErrorMessage
    } = props

    return (
        <>
            <Card elevation={5} sx={{ p: 2, mb:3, width:"100%" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="left">
                            Scenario specification
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="algorithm"
                            control={scenarioFormControl}
                            rules={{
                                required: REQUIRED_ERROR_MSG,
                            }}
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <InputLabel id={"algorithm-select-label"}>Algorithm</InputLabel>
                                    <Select
                                        required={true}
                                        name={"algorithm"}
                                        sx={{minWidth: 250}}
                                        labelId="algorithm-select-label"
                                        id="approach-select"
                                        value={value}
                                        label="Algorithm"
                                        onChange={(e) => {
                                            onChange(String(e.target.value))
                                        }}
                                        error={scenarioErrors?.errors.algorithm !== undefined}
                                        variant="standard"
                                    >
                                    <MenuItem value={"HC-STRICT"}>HC-STRICT | Hill Climb strict</MenuItem>
                                    <MenuItem value={"HC-FLEX"}>HC-FLEX | Hill Climb flex</MenuItem>
                                    <MenuItem value={"TS"}>TS | Tabu search </MenuItem>
                                    <MenuItem value={"ALL"}>ALL | All algorithms </MenuItem>
                                </Select></>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="approach"
                            control={scenarioFormControl}
                            rules={{
                                required: REQUIRED_ERROR_MSG,
                            }}
                            render={({ field: { onChange, value } }) => (
                                <>
                                    {/*<TextField*/}
                                    {/*    type="text"*/}
                                    {/*    value={value}*/}
                                    {/*    label="Approach for the optimization"*/}
                                    {/*    onChange={(e) => {*/}
                                    {/*        onChange(String(e.target.value))*/}
                                    {/*    }}*/}
                                    {/*    error={errors?.num_iterations !== undefined}*/}
                                    {/*    helperText={errors?.num_iterations?.message || ""}*/}
                                    {/*    variant="standard"*/}
                                    {/*    style={{ width: "50%" }}*/}
                                    {/*/>*/}
                                    <InputLabel id="approach-select-label">Approach</InputLabel>

                                    <Select
                                        required={true}
                                        sx={{minWidth: 250}}
                                        labelId="approach-select-label"
                                        id="approach-select"
                                        value={value}
                                        name={"approach"}
                                        label="Approach"
                                        onChange={(e) => {
                                            onChange(String(e.target.value))
                                        }}
                                        error={scenarioErrors.errors?.num_iterations !== undefined}
                                        variant="standard"
                                    >
                                        <MenuItem value={"CA"}>CA | Calendar Only</MenuItem>
                                        <MenuItem value={"AR"}>AR | Add/Remove Only</MenuItem>
                                        <MenuItem value={"CO"}>CO | CA/AR combined </MenuItem>
                                        <MenuItem value={"CAAR"}>CAAR | First CA then AR </MenuItem>
                                        <MenuItem value={"ARCA"}>ARCA | First AR then CA </MenuItem>
                                        <MenuItem value={"ALL"}>ALL | All approaches </MenuItem>
                                    </Select>
                                </>


                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Controller
                            name="num_iterations"
                            control={scenarioFormControl}
                            rules={{
                                required: REQUIRED_ERROR_MSG,
                                min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextField
                                    type="number"
                                    value={value}
                                    label="Total number of iterations"
                                    onChange={(e) => {
                                        onChange(Number(e.target.value))
                                    }}
                                    inputProps={{
                                        step: "1",
                                        min: "1",
                                    }}
                                    error={scenarioErrors?.errors.num_iterations !== undefined}
                                    helperText={scenarioErrors?.errors.num_iterations?.message || ""}
                                    variant="standard"
                                    style={{ width: "50%" }}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Card>
            <Card elevation={5} sx={{ p: 2, width:"100%" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="left">
                            Scenario constraints
                        </Typography>

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="max_cap"
                            control={consFormControl}
                            rules={{
                                required: REQUIRED_ERROR_MSG,
                                min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextField
                                    type="number"
                                    value={value}
                                    label="Maximum capacity"
                                    onChange={(e) => {
                                        onChange(Number(e.target.value))
                                    }}
                                    inputProps={{
                                        step: "1",
                                        min: "1",
                                    }}
                                    error={consErrors?.errors.max_cap !== undefined}
                                    helperText={consErrors?.errors.max_cap?.message || "Maximum capacity"}
                                    variant="standard"
                                    style={{ width: "50%" }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="max_shift_size"
                            control={consFormControl}
                            rules={{
                                required: REQUIRED_ERROR_MSG,
                                min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextField
                                    type="number"
                                    value={value}
                                    label="Max shift size"
                                    onChange={(e) => {
                                        onChange(Number(e.target.value))
                                    }}
                                    inputProps={{
                                        step: "1",
                                        min: "1",
                                    }}
                                    error={consErrors?.errors.max_shift_size !== undefined}
                                    helperText={consErrors?.errors.max_shift_size?.message || "Max shift size"}
                                    variant="standard"
                                    style={{ width: "50%" }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="max_shift_blocks"
                            control={consFormControl}
                            rules={{
                                required: REQUIRED_ERROR_MSG,
                                min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextField
                                    type="number"
                                    value={value}
                                    label="Max shifts / day"
                                    onChange={(e) => {
                                        onChange(Number(e.target.value))
                                    }}
                                    inputProps={{
                                        step: "1",
                                        min: "1",
                                    }}
                                    error={consErrors?.errors.max_shift_blocks !== undefined}
                                    helperText={consErrors?.errors.max_shift_blocks?.message || "Max shifts / day"}
                                    variant="standard"
                                    style={{ width: "50%" }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="hours_in_day"
                            control={consFormControl}
                            rules={{
                                required: REQUIRED_ERROR_MSG,
                                min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextField
                                    type="number"
                                    value={value}
                                    label="Hours per day (NOT IN USE)"
                                    onChange={(e) => {
                                        onChange(Number(e.target.value))
                                    }}
                                    inputProps={{
                                        step: "1",
                                        min: "1",
                                    }}
                                    error={consErrors?.errors.hours_in_day !== undefined}
                                    helperText={consErrors?.errors.hours_in_day?.message || "Hours per day (NOT IN USE)"}
                                    variant="standard"
                                    style={{ width: "50%" }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="time_var"
                            control={consFormControl}
                            rules={{
                                required: REQUIRED_ERROR_MSG,
                                min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextField
                                    type="number"
                                    value={value}
                                    label="Time granularity"
                                    onChange={(e) => {
                                        onChange(Number(e.target.value))
                                    }}
                                    inputProps={{
                                        step: "1",
                                        min: "1",
                                    }}
                                    error={consErrors?.errors.time_var !== undefined}
                                    helperText={consErrors?.errors.time_var?.message || "Time granularity"}
                                    variant="standard"
                                    style={{ width: "50%" }}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}


export default GlobalConstraints