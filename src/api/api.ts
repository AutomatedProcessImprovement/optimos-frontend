import axios from '../axios'

export const optimize = async (
    algorithm: string, approach: string, logName: string, total_iterations: number,
    simScenarioFile: Blob | File, constraintsFile: Blob | File,
    modelFile: Blob | File
) => {
    const formData = new FormData()
    formData.append("algorithm", algorithm)
    formData.append("approach", approach)
    formData.append("logName", logName)
    formData.append("total_iterations", total_iterations.toString())
    formData.append("simScenarioFile", simScenarioFile as Blob)
    formData.append("constraintsFile", constraintsFile as Blob)
    formData.append("modelFile", modelFile as Blob)

    return await axios.post(
        'api/optimize',
        formData
    )
}