import {Routes, Route} from "react-router-dom";
import Upload from "../components/upload/Upload";
import paths from "./paths";

const AppRouter = () => {
    return (
        <Routes>
            <Route path={"/"} element={<Upload/>} />
            <Route path={paths.UPLOAD_PATH} element={<Upload/>} />
        </Routes>
    )
}
export default AppRouter;