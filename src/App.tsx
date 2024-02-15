import { BrowserRouter } from "react-router-dom"
import "./App.css"
import Navbar from "./components/navigation/Navbar"
import AppRouter from "./router/AppRouter"

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <div className="App">
                <AppRouter />
            </div>
        </BrowserRouter>
    )
}

export default App
