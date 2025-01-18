import React, { useEffect, useRef, useState } from 'react'
import "./Weather.css"
import search_icon from  "../assets/search.png"
import clear_icon from  "../assets/clear.png"
import cloud_icon from  "../assets/cloud.png"
import drizzle_icon from  "../assets/drizzle.png"
import rain_icon from  "../assets/rain.png"
import snow_icon from  "../assets/snow.png"
import { toast } from "react-toastify"

const Weather = () => {

    const inputRef=useRef();
    const [weatherData,setWeatherData]=useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [forecastData, setForecastData] = useState([]);
    
    const formatTime = (time) => {
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const amPm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12< 10 ? '0' + hours12 : hours12}:${minutes < 10 ? '0' + minutes : minutes} ${amPm}`;
    };


    const formatDate = (date) => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
        const day = dayNames[date.getDay()];
        const month = monthNames[date.getMonth()];
        const dayOfMonth = date.getDate();
    
        return `${day}, ${month} ${dayOfMonth< 10 ? '0' + dayOfMonth :dayOfMonth}`;
    };

    const allIcons={
        "01d":clear_icon,
        "01n":clear_icon,
        "02d":clear_icon,
        "02n":clear_icon,
        "03d":cloud_icon,
        "03n":cloud_icon,
        "04d":cloud_icon,
        "04n":cloud_icon,
        "09d":drizzle_icon,
        "09n":drizzle_icon,
        "10d":rain_icon,
        "10n":rain_icon,
        "11d":rain_icon,
        "11n":rain_icon,
        "13d":snow_icon,
        "13n":snow_icon,
        "50d":snow_icon,
        "50n":snow_icon,
    }

    const search=async(city)=>{
        if(city===""){
            toast.error("Enter City Name");
            return;
        }
        try {
            const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`
            
            const response=await fetch(url);
            const data=await response.json();

            if(!response.ok){
                toast.error(data.message);
                return;
            }

            setWeatherData({
                humidity:data.main.humidity,
                pressure:data.main.pressure,
                windSpeed:data.wind.speed,
                sunRise:data.sys.sunrise,
                sunSet:data.sys.sunset,
                temperature:Math.floor(data.main.temp),
                location:data.name,
            })

            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();

            const dailyForecasts = forecastData.list.filter((item, index, arr) => {
                const currentDate = new Date(item.dt * 1000).getDate();
                return index === arr.findIndex(forecast => new Date(forecast.dt * 1000).getDate() === currentDate);
            }).slice(0, 8);

            setForecastData(dailyForecasts);

        } catch (error) {
            setWeatherData(false);
            console.log("Error in fetching weather data");
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            search(inputRef.current.value);
            inputRef.current.value = ''; 
        }
    };

    useEffect(()=>{
        search("Bangalore");
    },[])

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000); 
    
        return () => clearInterval(timer);
    }, []);

    return (
        <>
        <div className="container">
            <div className="place-container">
                <div className="place" >{weatherData.location}</div>

                <div className="others" >
                    <div className="weather-item">
                        <div>Humidity</div>
                        <div>{weatherData.humidity} %</div>
                    </div>
                    <div className="weather-item">
                        <div>Pressure</div>
                        <div>{weatherData.pressure} hPa</div>
                    </div>
                    <div className="weather-item">
                        <div>Wind Speed</div>
                        <div>{weatherData.windSpeed} Km/h</div>
                    </div>
                    <div className="weather-item">
                        <div>Sunrise</div>
                        <div>{formatTime(new Date(weatherData.sunRise * 1000))}</div>
                    </div>
                    <div className="weather-item">
                        <div>Sunset</div>
                        <div>{formatTime(new Date(weatherData.sunSet * 1000))}</div>
                    </div>
                </div>
            </div>

            <div className="search-container">
                <input  type="text" placeholder='Search City' spellCheck="false" ref={inputRef} onKeyDown={handleKeyDown}/>
                <img src={search_icon} alt="" onClick={()=>{search(inputRef.current.value);  inputRef.current.value = ''}}/>
            </div>

            <div className="date-container">
                <div className="time">
                    {formatTime(currentDate)}
                </div>
                <div className="date">
                    {formatDate(currentDate)}
                </div>
            </div>
        </div>
        <div className='forecast'>
            <div className="future-forecast">
            {forecastData.length > 0 && (
                        <>
                            <div className="today" >
                                <img src={allIcons[forecastData[0].weather[0].icon]} alt={clear_icon} className="w-icon" />
                                <div className="other">
                                    <div className="day">{formatDate(new Date(forecastData[0].dt * 1000))}</div>
                                    <div className="temp">Night - {Math.floor(forecastData[0].main.temp_min)} &#176;C</div>
                                    <div className="temp">Day - {Math.floor(forecastData[0].main.temp_max)} &#176;C</div>
                                </div>
                            </div>
                            <div className="weather-forecast">
                                {forecastData.slice(1).map((day, index) => (
                                    <div className="weather-forecast-item" key={index}>
                                        <div className="day">{formatDate(new Date(day.dt * 1000))}</div>
                                        <img src={allIcons[day.weather[0].icon]} alt={clear_icon} className="w-icon" />
                                        <div className="temp">Night - {Math.floor(day.main.temp_min)} &#176;C</div>
                                        <div className="temp">Day - {Math.floor(day.main.temp_max)} &#176;C</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
            </div>
        </div>
    
    </>
    )
}

export default Weather