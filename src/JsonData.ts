export interface ConsJsonData {
    time_var: number,
    max_cap: number,
    max_shift_size: number,
    max_shift_blocks: number,
    hours_in_day: number,
    resources: ResourceConstraint[]
}

export interface ResourceConstraint {
    id: string,
    constraints: ConstraintsObject
}

export interface ConstraintsObject {
    global_constraints: GlobalConstraints,
    daily_start_times: DailyStartTimes,
    never_work_masks: NeverWorkMask,
    always_work_masks: AlwaysWorkMask,
}

interface GlobalConstraints {
    "max_weekly_cap": number,
    "max_daily_cap": number,
    "max_consecutive_cap": number,
    "max_shifts_day": number,
    "max_shifts_week": number,
    "is_human": boolean
}

interface DailyStartTimes {
    "monday": string,
    "tuesday": string,
    "wednesday": string,
    "thursday": string,
    "friday": string,
    "saturday": string,
    "sunday": string
}

interface NeverWorkMask {
    "monday": number,
    "tuesday": number,
    "wednesday": number,
    "thursday": number,
    "friday": number,
    "saturday": number,
    "sunday": number
}

interface AlwaysWorkMask {
    "monday": number,
    "tuesday": number,
    "wednesday": number,
    "thursday": number,
    "friday": number,
    "saturday": number,
    "sunday": number
}

export interface ScenarioProperties {
    num_iterations: number,
    algorithm: string,
    approach: string,
}


