function CreateTripForm({ tripForm, onChange, onSubmit }) {
  return (
    <>
      <h2>Create Trip</h2>

      <form onSubmit={onSubmit} className="form-card">
        <input name="name" placeholder="Trip Name" onChange={onChange} />
        <input type="date" name="start_date" onChange={onChange} />
        <input type="date" name="end_date" onChange={onChange} />
        <input name="start_location" placeholder="Start Location" onChange={onChange} />
        <input name="end_location" placeholder="End Location" onChange={onChange} />
        <input type="number" name="price" placeholder="Price" onChange={onChange} />
        <button>Create Trip</button>
      </form>
    </>
  );
}

export default CreateTripForm;
