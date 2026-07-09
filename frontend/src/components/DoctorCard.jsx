const DoctorCard = ({ name, specialty, hospital, verified, yearsExperience }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          <p className="text-sm text-blue-300">{specialty}</p>
        </div>
        {verified && (
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
            Verified
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-slate-400">{hospital}</p>
      <p className="mt-1 text-sm text-slate-500">{yearsExperience}+ years experience</p>
    </div>
  );
};

export default DoctorCard;
