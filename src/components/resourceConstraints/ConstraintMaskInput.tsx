import { type FC } from "react"
import { type Control, Controller } from "react-hook-form"
import { Grid, TextField } from "@mui/material"
import {
    REQUIRED_ERROR_MSG,
    SHOULD_BE_GREATER_0_MSG,
} from "../validationMessages"
import { type ConsJsonData } from "../../JsonData"

interface Props {
    control: Control<ConsJsonData, object>
    index: number
    field: keyof ConsJsonData["resources"][0]["constraints"]["never_work_masks"]
    collection: "never_work_masks" | "always_work_masks"
}
export const ConstraintMaskInput: FC<Props> = (props) => {
    const { control, index, collection, field } = props
    return (
        <Grid item xs={12}>
            <Controller
                name={`resources.${index}.constraints.${collection}.${field}`}
                control={control}
                rules={{
                    required: REQUIRED_ERROR_MSG,
                    min: {
                        value: 1,
                        message: SHOULD_BE_GREATER_0_MSG,
                    },
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
    )
}
