const DoctorCard = ({ name, specialty }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold">{name}</h3>
      <p className="text-gray-600">{specialty}</p>
    </div>
  );
};

export default DoctorCard;
