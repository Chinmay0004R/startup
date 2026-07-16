#!/usr/bin/env python3
"""Audit all models and schemas for type mismatches."""

from app.models import (
    user, post, doctor, doctor_profile, complaint, 
    review, follow, notification, comment, certificate,
    email_verification, patient_profile, retired_police_profile, sos_incident
)

print("=== DATABASE MODELS TYPE AUDIT ===\n")

models = {
    'User': user.User,
    'Post': post.Post,
    'Doctor': doctor.Doctor,
    'DoctorProfile': doctor_profile.DoctorProfile,
    'Complaint': complaint.Complaint,
    'Review': review.Review,
    'Follow': follow.Follow,
    'Comment': comment.Comment,
    'Certificate': certificate.Certificate,
    'EmailVerification': email_verification.EmailVerification,
    'PatientProfile': patient_profile.PatientProfile,
    'RetiredPoliceProfile': retired_police_profile.RetiredPoliceProfile,
    'SOSIncident': sos_incident.SOSIncident,
}

for name, model_cls in models.items():
    print(f"\n{name}:")
    cols = model_cls.__table__.columns
    for col in cols:
        print(f"  {col.name}: {col.type}")
