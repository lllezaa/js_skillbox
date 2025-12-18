const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

const searchInput = document.querySelector('.search-input');
const locationBtn = document.querySelector('.location-btn');
const temperatureEl = document.querySelector('.temperature');
const conditionEl = document.querySelector('.condition');
const weatherIconEl = document.querySelector('.weather-icon');
const hourlyForecastEl = document.querySelector('.hourly-forecast');

const weatherCodes = {
    0: { description: 'Ясно', icon: 'clear' },
    1: { description: 'Преимущественно ясно', icon: 'clear' },
    2: { description: 'Переменная облачность', icon: 'partly-cloudy' },
    3: { description: 'Облачно', icon: 'cloudy' },
    45: { description: 'Туман', icon: 'fog' },
    48: { description: 'Изморозь', icon: 'fog' },
    51: { description: 'Лёгкая морось', icon: 'drizzle' },
    53: { description: 'Морось', icon: 'drizzle' },
    55: { description: 'Сильная морось', icon: 'drizzle' },
    61: { description: 'Небольшой дождь', icon: 'rain' },
    63: { description: 'Дождь', icon: 'rain' },
    65: { description: 'Сильный дождь', icon: 'rain' },
    66: { description: 'Ледяной дождь', icon: 'rain' },
    67: { description: 'Сильный ледяной дождь', icon: 'rain' },
    71: { description: 'Небольшой снег', icon: 'snow' },
    73: { description: 'Снег', icon: 'snow' },
    75: { description: 'Сильный снег', icon: 'snow' },
    77: { description: 'Снежные зёрна', icon: 'snow' },
    80: { description: 'Ливень', icon: 'rain' },
    81: { description: 'Сильный ливень', icon: 'rain' },
    82: { description: 'Очень сильный ливень', icon: 'rain' },
    85: { description: 'Снегопад', icon: 'snow' },
    86: { description: 'Сильный снегопад', icon: 'snow' },
    95: { description: 'Гроза', icon: 'thunderstorm' },
    96: { description: 'Гроза с градом', icon: 'thunderstorm' },
    99: { description: 'Гроза с сильным градом', icon: 'thunderstorm' }
};

const weatherIcons = {
    'clear': `<svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="25" fill="#FFD93D"/>
        <path d="M50 10V20M50 80V90M10 50H20M80 50H90M22 22L29 29M71 71L78 78M22 78L29 71M71 29L78 22" stroke="#FFD93D" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
    'partly-cloudy': `<svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <circle cx="70" cy="35" r="18" fill="#FFD93D"/>
        <path d="M70 10V15M70 55V60M45 35H50M90 35H95M52 17L56 21M84 49L88 53M52 53L56 49M84 21L88 17" stroke="#FFD93D" stroke-width="3" stroke-linecap="round"/>
        <path d="M25 75C25 75 25 60 40 60C42 50 52 45 62 50C72 45 82 55 80 65C90 65 90 80 80 80H30C20 80 20 70 25 75Z" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    'cloudy': `<svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <path d="M30 60C30 60 30 50 40 50C41 43 48 40 55 43C62 40 68 46 67 52C73 52 73 62 67 62H33C27 62 27 56 30 60Z" fill="#aaa" stroke="#888" stroke-width="2"/>
        <path d="M20 80C20 80 20 65 35 65C37 55 47 50 57 55C67 50 77 60 75 70C85 70 85 85 75 85H25C15 85 15 75 20 80Z" fill="#ccc" stroke="#999" stroke-width="2"/>
    </svg>`,
    'fog': `<svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <path d="M15 40H85M20 50H80M15 60H85M25 70H75" stroke="#aaa" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
    'drizzle': `<svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <path d="M20 55C20 55 20 40 35 40C37 30 47 25 57 30C67 25 77 35 75 45C85 45 85 60 75 60H25C15 60 15 50 20 55Z" fill="#aaa" stroke="#888" stroke-width="2"/>
        <path d="M35 70L33 78M50 70L48 78M65 70L63 78" stroke="#4FC3F7" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    'rain': `<svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <path d="M20 55C20 55 20 40 35 40C37 30 47 25 57 30C67 25 77 35 75 45C85 45 85 60 75 60H25C15 60 15 50 20 55Z" fill="#888" stroke="#666" stroke-width="2"/>
        <path d="M35 70L30 85M50 70L45 85M65 70L60 85" stroke="#4FC3F7" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    'snow': `<svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <path d="M20 55C20 55 20 40 35 40C37 30 47 25 57 30C67 25 77 35 75 45C85 45 85 60 75 60H25C15 60 15 50 20 55Z" fill="#ccc" stroke="#aaa" stroke-width="2"/>
        <circle cx="35" cy="75" r="4" fill="#fff" stroke="#ccc"/>
        <circle cx="50" cy="80" r="4" fill="#fff" stroke="#ccc"/>
        <circle cx="65" cy="75" r="4" fill="#fff" stroke="#ccc"/>
        <circle cx="42" cy="88" r="3" fill="#fff" stroke="#ccc"/>
        <circle cx="58" cy="88" r="3" fill="#fff" stroke="#ccc"/>
    </svg>`,
    'thunderstorm': `<svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <path d="M20 50C20 50 20 35 35 35C37 25 47 20 57 25C67 20 77 30 75 40C85 40 85 55 75 55H25C15 55 15 45 20 50Z" fill="#666" stroke="#444" stroke-width="2"/>
        <path d="M55 60L45 75H55L45 90" stroke="#FFD93D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
};

function getWeatherInfo(code) {
    return weatherCodes[code] || { description: 'Неизвестно', icon: 'cloudy' };
}

function getWeatherIcon(iconType) {
    return weatherIcons[iconType] || weatherIcons['cloudy'];
}

function getSmallWeatherIcon(iconType) {
    const icon = weatherIcons[iconType] || weatherIcons['cloudy'];
    return icon.replace('width="100" height="100"', 'width="24" height="24"');
}

async function searchCity(cityName) {
    try {
        const response = await fetch(
            `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=ru`
        );
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error('Город не найден');
        }
        
        return data.results[0];
    } catch (error) {
        throw error;
    }
}

async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(
            `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=1`
        );
        
        if (!response.ok) {
            throw new Error('Погода не найдена');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

function updateCurrentWeather(weatherData, cityName) {
    const temp = Math.round(weatherData.current.temperature_2m);
    const weatherCode = weatherData.current.weather_code;
    const weatherInfo = getWeatherInfo(weatherCode);
    
    temperatureEl.textContent = `${temp}°C`;
    conditionEl.textContent = weatherInfo.description;
    weatherIconEl.innerHTML = getWeatherIcon(weatherInfo.icon);
    
    searchInput.value = cityName;
}

function updateHourlyForecast(weatherData) {
    const currentHour = new Date().getHours();
    const hourlyTemps = weatherData.hourly.temperature_2m;
    const hourlyCodes = weatherData.hourly.weather_code;
    const hourlyTimes = weatherData.hourly.time;
    
    let startIndex = hourlyTimes.findIndex(time => {
        const hour = new Date(time).getHours();
        return hour >= currentHour;
    });
    
    if (startIndex === -1) startIndex = 0;
    
    const hoursToShow = [];
    for (let i = 0; i < 6 && startIndex + i < hourlyTemps.length; i++) {
        hoursToShow.push({
            time: hourlyTimes[startIndex + i],
            temp: hourlyTemps[startIndex + i],
            code: hourlyCodes[startIndex + i]
        });
    }
    
    hourlyForecastEl.innerHTML = hoursToShow.map((item, index) => {
        const time = index === 0 ? 'Сейчас' : new Date(item.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        const temp = Math.round(item.temp);
        const weatherInfo = getWeatherInfo(item.code);
        
        return `
            <div class="hour-item ${index === 0 ? 'active' : ''}">
                <span class="hour-time">${time}</span>
                <div class="hour-icon-container">
                    ${getSmallWeatherIcon(weatherInfo.icon)}
                </div>
                <span class="hour-temp">${temp}°C</span>
            </div>
        `;
    }).join('');
}

async function getWeatherForCity(city) {
    if (!city.trim()) return;
    
    try {
        showLoading();
        
        const cityData = await searchCity(city);
        const weatherData = await fetchWeather(cityData.latitude, cityData.longitude);
        
        updateCurrentWeather(weatherData, cityData.name);
        updateHourlyForecast(weatherData);
    } catch (error) {
        showError(error.message);
    }
}

async function getLocationWeather() {
    if (!navigator.geolocation) {
        showError('Геолокация не поддерживается');
        return;
    }
    
    showLoading();
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const weatherData = await fetchWeather(latitude, longitude);
                
                const geoResponse = await fetch(
                    `${GEOCODING_URL}?latitude=${latitude}&longitude=${longitude}&count=1&language=ru`
                );
                
                let cityName = 'Ваше местоположение';
                try {
                    const reverseUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ru`;
                    const reverseResponse = await fetch(reverseUrl);
                    const reverseData = await reverseResponse.json();
                    cityName = reverseData.address?.city || reverseData.address?.town || reverseData.address?.village || cityName;
                } catch (e) {}
                
                updateCurrentWeather(weatherData, cityName);
                updateHourlyForecast(weatherData);
            } catch (error) {
                showError(error.message);
            }
        },
        (error) => {
            showError('Не удалось получить местоположение');
        }
    );
}

function showLoading() {
    temperatureEl.textContent = '...';
    conditionEl.textContent = 'Загрузка...';
}

function showError(message) {
    temperatureEl.textContent = '--°C';
    conditionEl.textContent = message;
}

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeatherForCity(searchInput.value);
    }
});

locationBtn.addEventListener('click', getLocationWeather);

getWeatherForCity('Москва');
