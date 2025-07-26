import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function MedicineDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/medicines/${id}/online`);
        setDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h4 className="text-danger">Error loading details: {error}</h4>
      </div>
    );
  }

  if (!details) {
    return <div className="text-center py-10">No details found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="card lg:card-side bg-base-100 shadow-xl">
        {details.image && (
          <figure className="p-4">
            <img src={details.image} alt={details.name} className="rounded-lg" />
          </figure>
        )}
        <div className="card-body">
          <h2 className="card-title text-3xl">{details.name}</h2>
          <p className="text-lg mt-2"><span className="font-semibold">Category:</span> {details.category}</p>
          <div className="divider"></div>
          <h3 className="font-bold text-xl mt-4">Description</h3>
          <p>{details.description}</p>
          {details.indications && (
            <>
              <h3 className="font-bold text-xl mt-4">Indications and Usage</h3>
              <p>{details.indications}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicineDetails;
