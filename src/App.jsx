
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Calculator from "./components/Calculator/Calculcator.jsx";
import {Button} from "antd";


function App() {
    return (
        <div className='mainWrapper'>
            <Header />
            <Calculator />
            <Footer />
        </div>

    )
}

export default App;