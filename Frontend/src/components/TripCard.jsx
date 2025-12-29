import { useState } from "react";
import ItineraryForm from "./ItineraryForm";
import ItineraryTimeline from "./ItineraryTimeline";

function TripCard({
  trip,
  itinerary,
  onViewItinerary,
  onItineraryChange,
  onAddItinerary,
  onDeleteTrip,
  onUpdateTrip,
  onDeleteItineraryDay,
}) {
  const [showItinerary, setShowItinerary] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editTrip, setEditTrip] = useState(false);

  const [editTripForm, setEditTripForm] = useState({
    name: trip.name,
    start_date: trip.start_date,
    end_date: trip.end_date,
    start_location: trip.start_location,
    end_location: trip.end_location,
    price: trip.price,
  });

  const handleViewItinerary = () => {
    onViewItinerary();
    setShowItinerary((prev) => !prev);
  };

  return (
    <div className="trip-card">
      {/* ---------- TRIP HEADER ---------- */}
      {!editTrip ? (
        <>
          <h3>{trip.name}</h3>
          <p><strong>Route:</strong> {trip.start_location} → {trip.end_location}</p>
          <p><strong>Dates:</strong> {trip.start_date} to {trip.end_date}</p>
          <p><strong>Price:</strong> ₹{trip.price}</p>
        </>
      ) : (
        <>
          <input
            value={editTripForm.name}
            onChange={(e) => setEditTripForm({ ...editTripForm, name: e.target.value })}
          />
          <input
            type="date"
            value={editTripForm.start_date}
            onChange={(e) => setEditTripForm({ ...editTripForm, start_date: e.target.value })}
          />
          <input
            type="date"
            value={editTripForm.end_date}
            onChange={(e) => setEditTripForm({ ...editTripForm, end_date: e.target.value })}
          />
          <input
            value={editTripForm.start_location}
            onChange={(e) => setEditTripForm({ ...editTripForm, start_location: e.target.value })}
          />
          <input
            value={editTripForm.end_location}
            onChange={(e) => setEditTripForm({ ...editTripForm, end_location: e.target.value })}
          />
          <input
            type="number"
            value={editTripForm.price}
            onChange={(e) => setEditTripForm({ ...editTripForm, price: e.target.value })}
          />
        </>
      )}

      {/* ---------- ACTION BUTTONS ---------- */}
      <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
        <button onClick={handleViewItinerary}>
          {showItinerary ? "Hide Itinerary" : "View Itinerary"}
        </button>

        <button onClick={() => setShowForm((p) => !p)}>
          {showForm ? "Close Add Day" : "Add Itinerary Day"}
        </button>

        {!editTrip ? (
          <button onClick={() => setEditTrip(true)}>Edit Trip</button>
        ) : (
          <button
            onClick={() => {
              onUpdateTrip(trip.id, editTripForm);
              setEditTrip(false);
            }}
          >
            Save Trip
          </button>
        )}

        <button onClick={() => onDeleteTrip(trip.id)}>Delete Trip</button>
      </div>

      {/* ---------- ITINERARY ---------- */}
      {showItinerary && (
        <ItineraryTimeline
          itinerary={itinerary}
          onDelete={(dayId) => onDeleteItineraryDay(dayId, trip.id)}
        />
      )}

      {/* ---------- ADD ITINERARY FORM ---------- */}
      {showForm && (
        <ItineraryForm
          onChange={onItineraryChange}
          onSubmit={onAddItinerary}
        />
      )}
    </div>
  );
}

export default TripCard;
