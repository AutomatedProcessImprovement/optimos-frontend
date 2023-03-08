import {Card, FormControlLabel, Grid, InputLabel, MenuItem, Switch, TextField, Typography} from "@mui/material"
import { useState, useEffect } from "react"
import {Controller, useFieldArray, UseFormReturn} from "react-hook-form"
import { ConsJsonData } from '../../JsonData'
import {MIN_LENGTH_REQUIRED_MSG, REQUIRED_ERROR_MSG, SHOULD_BE_GREATER_0_MSG} from '../validationMessages'
import * as React from "react";


interface ResourceCalendarsProps {
    formState: UseFormReturn<ConsJsonData, object>
    setErrorMessage: (value: string) => void
}

const ResourceConstraints = (props: ResourceCalendarsProps) => {
    const { formState: { control: formControl, getValues }, formState, setErrorMessage } = props
    const [currCalendarIndex, setCurrCalendarIndex] = useState<number>()
    const [currCalendarKey, setCurrCalendarKey] = useState<string>("")


    const { fields: allCalendars, prepend, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: "resources"
    })

    useEffect(() => {
        // once we get the new number of calendars, we:
        // either created a new one and redirect users to this newly created resource
        // or loading the page for the first time and select the first calendar in the list as an active one
        setCurrCalendarIndex(0)
    }, [allCalendars])

    useEffect(() => {
        // once index of the selected calendar changed,
        // we need to update the key accordingly
        updateCurrKey(currCalendarIndex)
    }, [currCalendarIndex])

    const handleCalendarSelectChange = (event: any) => {
        const selectedCalendarIndex = event.target.value
        updateCurrCalendar(Number(selectedCalendarIndex))
    }

    const updateCurrCalendar = (index?: number) => {
        // update index
        setCurrCalendarIndex(index)

        // update key
        updateCurrKey(index)
    }

    const updateCurrKey = (currIndex?: number) => {
        if (currIndex === undefined) {
            setCurrCalendarKey("")
        } else {
            const calendarKey = allCalendars[currIndex]?.key || ""
            setCurrCalendarKey(calendarKey)
        }
    }

    return (
        <Grid container width="100%" spacing={2}>
            <Grid container item xs={12}>
                <Grid container item xs={8}>
                    <Grid item xs={8}>
                        <TextField
                            sx={{ width: "100%" }}
                            label="Resource"
                            variant="standard"
                            value={currCalendarIndex ?? ''}
                            onChange={handleCalendarSelectChange}
                            select
                        >
                            {allCalendars.map((item, index) => {
                                const { key } = item
                                return <MenuItem
                                    key={`calendar_select_${key}`}
                                    value={index}
                                >
                                    {item.id}
                                </MenuItem>
                            })}
                        </TextField>
                    </Grid>
                </Grid>
            </Grid>
            {(currCalendarIndex === undefined)
                ? <Grid item xs={12} sx={{ p: 2 }}>
                    <Typography>
                        Please select the resource to see its configuration
                    </Typography>
                </Grid>
                : <Grid item xs={12} sx={{ p: 2 }}>
                    <ResourceConstraintsList
                        key={`resource_calendars.${currCalendarKey}`}
                        formState={formState}
                        setErrorMessage={setErrorMessage}
                        calendarIndex={currCalendarIndex}
                        calendarKey={currCalendarKey}
                    />
                </Grid>
            }

        </Grid>
    )
}

interface RConsGlobalProps extends ResourceCalendarsProps {
    calendarIndex: number
    calendarKey: string
}

const ResourceConstraintsList = (props: RConsGlobalProps) => {
    const { formState, calendarIndex, calendarKey } = props
    const {control} = formState
    const [index, setIndex] = useState<number>(calendarIndex)

    useEffect(() => {
        if (index !== calendarIndex) {
            setIndex(calendarIndex)
        }
    }, [calendarIndex, index])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card elevation={5} sx={{ p: 2}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" align="left">
                                Resource constraints
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.global_constraints.max_weekly_cap`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Resource max weekly capacity"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "1",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.global_constraints.max_daily_cap`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Resource max daily capacity"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "1",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.global_constraints.max_consecutive_cap`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Resource max consecutive capacity"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "1",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.global_constraints.max_shifts_day`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Resource max shifts per day"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "1",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.global_constraints.max_shifts_week`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Resource max shifts per week"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "1",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.global_constraints.is_human`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <>

                                        <FormControlLabel control={<Switch
                                            checked={value}
                                            onChange={(e) => {
                                                onChange(Boolean(e.target.checked))
                                            }}
                                            // error={errors?.max_shift_blocks !== undefined}
                                            // helperText={errors?.max_shift_blocks?.message || ""}
                                        />} label={"Human resource?"}/></>


                                )}
                            />
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Grid item xs={6}>
                <Card elevation={5} sx={{ p: 2}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" align="left">
                                Never work masks
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.never_work_masks.monday`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Monday"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "0",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.never_work_masks.tuesday`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Tuesday"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "0",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.never_work_masks.wednesday`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Wednesday"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "0",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.never_work_masks.thursday`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Thursday"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "0",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.never_work_masks.friday`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Friday"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "0",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.never_work_masks.saturday`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Saturday"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "0",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.never_work_masks.sunday`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Sunday"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "0",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Grid item xs={6}>
                <Card elevation={5} sx={{ p: 2}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" align="left">
                                Always work masks
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.always_work_masks.monday`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Monday"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "0",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.always_work_masks.tuesday`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Tuesday"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "0",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.always_work_masks.wednesday`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Wednesday"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "0",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.always_work_masks.thursday`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Thursday"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "0",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.always_work_masks.friday`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Friday"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "0",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.always_work_masks.saturday`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Saturday"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "0",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={`resources.${index}.constraints.always_work_masks.sunday`}
                                control={control}
                                rules={{
                                    required: REQUIRED_ERROR_MSG,
                                    min: { value: 1, message: SHOULD_BE_GREATER_0_MSG }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type="number"
                                        value={value}
                                        label="Sunday"
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "1",
                                            min: "0",
                                        }}
                                        // error={errors?.max_shift_blocks !== undefined}
                                        // helperText={errors?.max_shift_blocks?.message || ""}
                                        variant="standard"
                                        style={{ width: "50%" }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    )


}


export default ResourceConstraints;