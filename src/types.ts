export type JsonReport = JsonReportEntry[]

export interface JsonReportEntry {
    name: string
    func_ev: number
    total_explored: number
    pareto_size: number
    in_jp: number
    not_in_jp: number
    hyperarea: number
    hausd_dist: number
    delta_sprd: number
    purity_rate: number
    ave_time: number
    ave_cost: number
    time_metric: number
    cost_metric: number
    pareto_values: ParetoValue[]
}

export interface ParetoValue {
    name: string
    sim_params: SimParams
    cons_params: ConsParams
    median_cycle_time: number
    median_execution_cost: number
}

export interface SimParams {
    resource_profiles: ResourceProfile[]
    arrival_time_distribution: ArrivalTimeDistribution
    arrival_time_calendar: ArrivalTimeCalendar[]
    gateway_branching_probabilities: GatewayBranchingProbability[]
    task_resource_distribution: TaskResourceDistribution[]
    event_distribution: EventDistribution
    resource_calendars: ResourceCalendar[]
}

export interface ResourceProfile {
    id: string
    name: string
    resource_list: ResourceList[]
}

export interface ResourceList {
    id: string
    name: string
    cost_per_hour: number
    amount: number
    calendar: string
    assigned_tasks: string[]
}

export interface ArrivalTimeDistribution {
    distribution_name: string
    distribution_params: DistributionParam[]
}

export interface DistributionParam {
    value: number
}

export interface ArrivalTimeCalendar {
    from: string
    to: string
    beginTime: string
    endTime: string
}

export interface GatewayBranchingProbability {
    gateway_id: string
    probabilities: Probability[]
}

export interface Probability {
    path_id: string
    value: number
}

export interface TaskResourceDistribution {
    task_id: string
    resources: Resource[]
}

export interface Resource {
    resource_id: string
    distribution_name: string
    distribution_params: DistributionParam2[]
}

export interface DistributionParam2 {
    value: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EventDistribution {}

export interface ResourceCalendar {
    id: string
    name: string
    time_periods: TimePeriod[]
}

export interface TimePeriod {
    from: string
    to: string
    beginTime: string
    endTime: string
}

export interface ConsParams {
    time_var: number
    max_cap: number
    max_shift_size: number
    max_shift_blocks: number
    hours_in_day: number
    resources: Resource2[]
}

export interface Resource2 {
    id: string
    constraints: Constraints
}

export interface Constraints {
    global_constraints: GlobalConstraints
    daily_start_times: DailyStartTimes
    never_work_masks: NeverWorkMasks
    always_work_masks: AlwaysWorkMasks
}

export interface GlobalConstraints {
    max_weekly_cap: number
    max_daily_cap: number
    max_consecutive_cap: number
    max_shifts_day: number
    max_shifts_week: number
    is_human: boolean
}

export interface DailyStartTimes {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
}

export interface NeverWorkMasks {
    monday: number
    tuesday: number
    wednesday: number
    thursday: number
    friday: number
    saturday: number
    sunday: number
}

export interface AlwaysWorkMasks {
    monday: number
    tuesday: number
    wednesday: number
    thursday: number
    friday: number
    saturday: number
    sunday: number
}
