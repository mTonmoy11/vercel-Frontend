import { useEffect, useState } from "react";
import AboutUs from "../components/home/AboutUs";
import Accordion from "../components/home/Accordion";
import Features from "../components/home/Features";
import Slider from "../components/home/Slider";
import { Link } from "react-router-dom";


const Home = () => {
    const[regUser, setRegUser] = useState([]);
    useEffect(() => {
        // Initialize scroll position
        window.scrollTo(0, 0);
        fetch('http://localhost:5000/registers')
        .then(res => res.json())
        .then(data => {setRegUser(data)})
        console.log(regUser);
    }, []);
    return (
        <div className="">
            <Slider></Slider>
            <div className="md:my-20">

                <Features key={regUser._id} regUser={regUser}></Features>
            </div>
            <div className="md:my-20">

                <Accordion></Accordion>
            </div>
           

        </div>
    );
};

export default Home;