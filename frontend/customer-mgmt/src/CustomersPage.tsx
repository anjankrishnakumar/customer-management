import React, { useEffect, useState } from 'react';
import fetchWithRefresh from './fetchWithRefresh';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  user: string;
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = React.useState(false);
  const [showForm, setShowForm] = useState(false);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
  });

      const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchWithRefresh('http://127.0.0.1:8000/api/customers/', {
          method: 'GET'
        });
        if (!response.ok) {
        //   throw new Error('Failed to fetch customers');
        navigate('/error', {
          state: { message: 'Failed to fetch customers. Please login again. ' },
        });
        return;

        }
        const data: Customer[] = await response.json();
        setCustomers(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {


    fetchCustomers();
  }, []);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setError("");
    try {
      const res = await fetchWithRefresh("http://127.0.0.1:8000/api/customers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add customer");
      }
      // Clear form
      setFormData({ first_name: "", last_name: "", phone: "", date_of_birth: "" });
      setShowForm(false);
      fetchCustomers(); // refresh list
    } catch (err: any) {
      setError(err.message);
    }
    setFormSubmitting(false);
  };

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await fetch('http://127.0.0.1:8000/auth/logout/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    } catch (err) {
      console.error('Logout failed');
    }

    localStorage.clear();
    navigate('/login');
  };

  return (
    <Layout username={username} onLogout={handleLogout} >
    <div style={{ padding: 20 }}>
      <h2>Customers</h2>

      <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: 20 }}>
        {showForm ? 'Cancel' : 'Add Customer'}
      </button>

{showForm ? (
  <form onSubmit={handleAddCustomer} style={{ marginTop: 20 }}>
    <div>
      <label>First Name: </label>
      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleInputChange}
        required
      />
    </div>
    <div>
      <label>Last Name: </label>
      <input
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={handleInputChange}
        required
      />
    </div>
    <div>
      <label>Phone: </label>
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        required
      />
    </div>
    <div>
      <label>Date of Birth: </label>
      <input
        type="date"
        name="date_of_birth"
        value={formData.date_of_birth}
        onChange={handleInputChange}
        required
      />
    </div>
    <button type="submit" disabled={formSubmitting} style={{ marginTop: 10 }}>
      {formSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  </form>
) : (
  // customer list table remains here
  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
    <thead>
      <tr>
        <th style={{ border: '1px solid black', padding: 8 }}>S.No</th>
        <th style={{ border: '1px solid black', padding: 8 }}>First Name</th>
        <th style={{ border: '1px solid black', padding: 8 }}>Last Name</th>
        <th style={{ border: '1px solid black', padding: 8 }}>Phone</th>
        <th style={{ border: '1px solid black', padding: 8 }}>Date of Birth</th>
        <th style={{ border: '1px solid black', padding: 8 }}>Created By</th>
      </tr>
    </thead>
    <tbody>
      {customers.map((customer) => (
        <tr key={customer.id}>
          <td style={{ border: '1px solid black', padding: 8 }}>{customer.id}</td>
          <td style={{ border: '1px solid black', padding: 8 }}>{customer.first_name}</td>
          <td style={{ border: '1px solid black', padding: 8 }}>{customer.last_name}</td>
          <td style={{ border: '1px solid black', padding: 8 }}>{customer.phone}</td>
          <td style={{ border: '1px solid black', padding: 8 }}>{customer.date_of_birth}</td>
          <td style={{ border: '1px solid black', padding: 8 }}>{customer.user}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}


    </div>
    </Layout>
  );
};

export default CustomersPage;
