import re

path = r'd:\hospital_management\startup\backend\app\api\v1\users.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# The chunk to move
me_route = """@router.delete("/me")
def delete_my_account(payload: DeleteAccountRequest, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    email = current_user.get("email")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Verify password if user has a standard password
    if not user.hashed_password.startswith("google-oauth:"):
        if not verify_password(payload.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    try:
        # Collect Cloudinary public IDs to delete
        public_ids_to_delete = []
        if user.profile_image_public_id:
            public_ids_to_delete.append(user.profile_image_public_id)
        
        if user.doctor_profile:
            if user.doctor_profile.license_public_id:
                public_ids_to_delete.append(user.doctor_profile.license_public_id)
            for cert in user.doctor_profile.certificates:
                if cert.public_id:
                    public_ids_to_delete.append(cert.public_id)
        
        # Delete Cloudinary assets
        for public_id in public_ids_to_delete:
            try:
                delete_asset(public_id)
            except Exception as e:
                print(f"Failed to delete Cloudinary asset {public_id}: {e}")

        # Database deletion
        db.delete(user)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete account")
        
    return {"message": "Account deleted successfully"}
"""

if me_route in content:
    # Remove it from the end
    content = content.replace("\n" + me_route, "")
    
    # Insert it before DELETE /{user_id}
    target = "@router.delete(\"/{user_id}\")"
    content = content.replace(target, me_route + "\n\n" + target)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed route order in users.py")
