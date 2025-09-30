export default function Search({ city, onCityChange, onSearch }){
    return(
        <div className="search-container">
            <div className="search-input">
                <input 
                    type="search" 
                    value={city}
                    onChange={(e) => onCityChange(e.target.value)}
                    placeholder="Enter city"
                />
            </div>
            <button onClick={onSearch}>Search</button>
        </div>
    )
}