import { useEffect, useState } from "react";
import "./App.css";

import CreateTripForm from "./components/CreateTripForm";
import TripCard from "./components/TripCard";

// ✅ CHANGE THIS IF BACKEND URL CHANGES
const BACKEND_URL = "https://sacred-journeys-api.onrender.com";

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

  // ---------- FETCH TRIPS ----------
  const fetchTrips = () => {
    fetch(`${BACKEND_URL}/trips`)
      .then((res) => res.json())
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // ---------- CREATE TRIP ----------
  const createTrip = (e) => {
    e.preventDefault();

    fetch(`${BACKEND_URL}/trips`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...tripForm,
        price: Number(tripForm.price),
        operator_id: 1,
      }),
    }).then(() => {
      setTripForm({
        name: "",
        start_date: "",
        end_date: "",
        start_location: "",
        end_location: "",
        price: "",
        operator_id: 1,
      });
      fetchTrips();
    });
  };

  // ---------- FETCH ITINERARY ----------
  const fetchItinerary = (tripId) => {
    fetch(`${BACKEND_URL}/trips/${tripId}/itinerary`)
      .then((res) => res.json())
      .then((data) => {
        setItineraries((prev) => ({ ...prev, [tripId]: data }));
      });
  };

  // ---------- ADD ITINERARY ----------
  const addItinerary = (tripId) => {
    fetch(`${BACKEND_URL}/trips/${tripId}/itinerary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itineraryForm),
    }).then(() => {
      setItineraryForm({
        day_date: "",
        location: "",
        transport: "",
        pilgrimage_site: "",
        lodging: "",
      });
      fetchItinerary(tripId);
    });
  };

  return (
    <div className="container">
      <h1>🛕 Sacred Journeys</h1>

      {/* CREATE TRIP */}
      <CreateTripForm
        tripForm={tripForm}
        onChange={(e) =>
          setTripForm({ ...tripForm, [e.target.name]: e.target.value })
        }
        onSubmit={createTrip}
      />

      <h2>Available Trips</h2>

      {loading && <p>Loading...</p>}

      {!loading &&
        trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            itinerary={itineraries[trip.id]}
            onViewItinerary={() => fetchItinerary(trip.id)}
            onItineraryChange={(e) =>
              setItineraryForm({
                ...itineraryForm,
                [e.target.name]: e.target.value,
              })
            }
            onAddItinerary={() => addItinerary(trip.id)}
          />
        ))}
    </div>
  );
}

export default App;
