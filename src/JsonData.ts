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
    scenario_name: string
    num_iterations: number,
    algorithm: string,
    approach: string,
}


export interface SimJsonData {
    resource_profiles: ResourcePool[]
    arrival_time_distribution: ProbabilityDistribution
    arrival_time_calendar: TimePeriod[]
    gateway_branching_probabilities: GatewayBranchingProbability[]
    task_resource_distribution: TaskResourceDistribution[]
    resource_calendars: ResourceCalendar[]
    event_distribution: EventDistribution[]
}

export interface GatewayBranchingProbability {
    gateway_id: string,
    probabilities: Probability[]
}

export interface Probability {
    path_id: string
    value: number
}

export interface ResourcePool {
    id: string,
    name: string,
    resource_list: ResourceInfo[]
}

export interface ResourceInfo {
    id: string,
    name: string,
    cost_per_hour: number
    amount: number
    calendar: string
    assignedTasks: string[]
}

export interface ProbabilityDistribution {
    distribution_name: string
    distribution_params: { value: number }[]
}

export interface ProbabilityDistributionForResource extends ProbabilityDistribution {
    resource_id: string
}

export interface TimePeriod {
    from: string
    to: string
    beginTime: string
    endTime: string
}

export interface ResourceCalendar {
    id: string
    name: string
    time_periods: TimePeriod[]
}

export interface TaskResourceDistribution {
    task_id: string
    resources: ProbabilityDistributionForResource[]
}


export interface EventDistribution extends ProbabilityDistribution {
    event_id: string
}

