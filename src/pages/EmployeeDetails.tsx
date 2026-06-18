import { useParams } from 'react-router-dom';

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Employee Profile</h1>
      <p>Detailed view and compensation history for Employee ID: {id}</p>
    </div>
  );
};

export default EmployeeDetails;
