import {Routes, Route} from "react-router-dom";
import Upload from "../components/upload/Upload";
import paths from "./paths";
import ParameterEditor from "../components/parameterEditor/ParameterEditor";

const AppRouter = () => {
    return (
        <Routes>
            <Route path={"/"} element={<Upload/>} />
            <Route path={paths.UPLOAD_PATH} element={<Upload/>} />
            <Route path={paths.PARAMEDITOR_PATH} element={<ParameterEditor/>} />
        </Routes>
    )
}
export default AppRouter;