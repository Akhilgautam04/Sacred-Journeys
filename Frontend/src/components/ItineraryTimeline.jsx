function ItineraryTimeline({ itinerary, onDelete }) {
  if (!itinerary || itinerary.length === 0) {
    return <p>No itinerary added yet</p>;
  }

  return (
    <div className="itinerary">
      {itinerary.map((day, index) => (
        <div key={day.id} className="itinerary-day">
          <p><b>Day {index + 1}</b> — {day.day_date}</p>
          <p>📍 {day.location}</p>
          <p>🛕 {day.pilgrimage_site}</p>
          <p>🚌 {day.transport}</p>
          <p>🏨 {day.lodging}</p>

          <button
            style={{ marginTop: "6px" }}
            onClick={() => onDelete(day.id)}
          >
            Delete Day
          </button>
        </div>
      ))}
    </div>
  );
}

export default ItineraryTimeline;
