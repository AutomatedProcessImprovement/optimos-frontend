import {Controller, useFieldArray, UseFormReturn} from "react-hook-form";
import {ConsJsonData, ResourceConstraint, ScenarioProperties} from "../../JsonData";
import {
    Card,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow,
    TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {REQUIRED_ERROR_MSG, SHOULD_BE_GREATER_0_MSG} from "../validationMessages";
import * as React from "react";
import { AutoSizer } from "react-virtualized";
import { VariableSizeList } from "react-window";
import {useEffect, useState} from "react";

interface ResourceConstraintsProps {
    jsonFormState: UseFormReturn<ConsJsonData, object>
    setErrorMessage: (value: string) => void
}


const ResourceConstraints = (props: ResourceConstraintsProps) => {
    const { setErrorMessage } = props

    const [currCalendarIndex, setCurrCalendarIndex] = useState<number>()
    const [currCalendarKey, setCurrCalendarKey] = useState<string>("")
    const [isNameDialogOpen, setIsNameDialogOpen] = useState<boolean>(false)
    const [assignedCalendars, setAssignedCalendars] = useState<Array<ResourceConstraint>>([])

    const { control: formControl, getValues, trigger, setFocus } = props.jsonFormState
    const { fields: constraints, prepend, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `resources`
    })

    useEffect(() => {
        const usedCalendars = getValues("resources")
        console.log(usedCalendars)
        setAssignedCalendars(usedCalendars)
    }, [])

    useEffect(() => {
        // once we get the new number of calendars, we:
        // either created a new one and redirect users to this newly created resource
        // or loading the page for the first time and select the first calendar in the list as an active one
        setCurrCalendarIndex(0)
    }, [constraints])

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
            const calendarKey = constraints[currIndex]?.key || ""
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
                            label="Calendar"
                            variant="standard"
                            onChange={handleCalendarSelectChange}
                            value={currCalendarIndex ?? ''}
                            select
                        >
                            {constraints.map((item, index) => {
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
                        Please select the calendar to see its time periods
                    </Typography>
                </Grid>
                : <Grid item xs={12} sx={{ p: 2 }}>
                    TODO
                </Grid>
            }
        </Grid>
    )
}


export default ResourceConstraints