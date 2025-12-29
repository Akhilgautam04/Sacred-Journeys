import { useEffect, useState } from "react";
import "./App.css";

import CreateTripForm from "./components/CreateTripForm";
import TripCard from "./components/TripCard";

function App() {
  const [trips, setTrips] = useState([]);
  const [itineraries, setItineraries] = useState({});
  const [loading, setLoading] = useState(true);

  const [tripForm, setTripForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
    start_location: "",
    end_location: "",
    price: "",
    operator_id: 1,
  });

  const [itineraryForm, setItineraryForm] = useState({
    day_date: "",
    location: "",
    transport: "",
    pilgrimage_site: "",
    lodging: "",
  });

  const fetchTrips = () => {
    fetch("http://localhost:8000/trips")
      .then(res => res.json())
      .then(data => {
        setTrips(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // -------- CREATE TRIP --------
  const createTrip = (e) => {
    e.preventDefault();

    fetch("http://localhost:8000/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...tripForm,
        price: Number(tripForm.price),
        operator_id: 1,
      }),
    }).then(() => fetchTrips());
  };

  // -------- UPDATE TRIP --------
  const updateTrip = (tripId, data) => {
    fetch(`http://localhost:8000/trips/${tripId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, operator_id: 1 }),
    }).then(() => fetchTrips());
  };

  // -------- DELETE TRIP --------
  const deleteTrip = (tripId) => {
    if (!window.confirm("Delete this trip?")) return;

    fetch(`http://localhost:8000/trips/${tripId}`, {
      method: "DELETE",
    }).then(() => fetchTrips());
  };

  // -------- ITINERARY --------
  const fetchItinerary = (tripId) => {
    fetch(`http://localhost:8000/trips/${tripId}/itinerary`)
      .then(res => res.json())
      .then(data => {
        setItineraries(prev => ({ ...prev, [tripId]: data }));
      });
  };

  const addItinerary = (tripId) => {
    fetch(`http://localhost:8000/trips/${tripId}/itinerary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itineraryForm),
    }).then(() => fetchItinerary(tripId));
  };

  const deleteItineraryDay = (dayId, tripId) => {
    fetch(`http://localhost:8000/itinerary/${dayId}`, {
      method: "DELETE",
    }).then(() => fetchItinerary(tripId));
  };

  return (
    <div className="container">
      <h1>🛕 Sacred Journeys</h1>

      <CreateTripForm
        tripForm={tripForm}
        onChange={(e) =>
          setTripForm({ ...tripForm, [e.target.name]: e.target.value })
        }
        onSubmit={createTrip}
      />

      <h2>Available Trips</h2>

      {loading && <p>Loading...</p>}

      {trips.map(trip => (
        <TripCard
          key={trip.id}
          trip={trip}
          itinerary={itineraries[trip.id]}
          onViewItinerary={() => fetchItinerary(trip.id)}
          onItineraryChange={(e) =>
            setItineraryForm({ ...itineraryForm, [e.target.name]: e.target.value })
          }
          onAddItinerary={() => addItinerary(trip.id)}
          onDeleteTrip={deleteTrip}
          onUpdateTrip={updateTrip}
          onDeleteItineraryDay={deleteItineraryDay}
        />
      ))}
    </div>
  );
}

export default App;
