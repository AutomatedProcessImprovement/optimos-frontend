import React, { Component } from "react";
import { DropzoneArea } from "mui-file-dropzone";
import {makeStyles} from "@mui/material";


interface DropzoneAreaProps {
    acceptedFiles: string[];
    setSelectedFiles: (files:any) => void;
}

const FileDropzoneArea = (props: DropzoneAreaProps) => {
    const { acceptedFiles, setSelectedFiles } = props

    const onChange = (_files: File[]) => {
        setSelectedFiles(_files)
    }
    const onDelete = (_files: File) => {
        console.log("WIP: onDelete")
    }

    return <DropzoneArea
        onChange={onChange}
        onDelete={onDelete}
        filesLimit={3}
        showFileNames={true}
        maxFileSize={500000000}
        showPreviews={true}
        previewText={"Uploaded files:"}
        showPreviewsInDropzone={false}
        showFileNamesInPreview={true}
        useChipsForPreview={true}
        showAlerts={false}
        clearOnUnmount={true}
        disableRejectionFeedback={true}
        acceptedFiles={acceptedFiles}
        fileObjects={setSelectedFiles}

    />


}

export default FileDropzoneArea;