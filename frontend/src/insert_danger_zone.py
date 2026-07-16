import re
import os

def insert_danger_zone_patient():
    path = r'd:\hospital_management\startup\frontend\src\pages\PatientProfile.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "import DangerZone" not in content:
        content = content.replace(
            "import { FaUserCircle, FaPencilAlt } from 'react-icons/fa';",
            "import { FaUserCircle, FaPencilAlt } from 'react-icons/fa';\nimport DangerZone from '../components/DangerZone';"
        )
        
        # Insert before </main>
        content = content.replace(
            "</main>",
            "  <DangerZone />\n      </main>"
        )
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated PatientProfile.jsx")

def insert_danger_zone_doctor():
    path = r'd:\hospital_management\startup\frontend\src\pages\DoctorProfile.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    if "import DangerZone" not in content:
        content = content.replace(
            "import { FaUserMd, FaCamera, FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';",
            "import { FaUserMd, FaCamera, FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';\nimport DangerZone from '../components/DangerZone';"
        )
        
        # Insert before </div> of the main content. Since DoctorProfile has a complex structure, 
        # let's find a reliable anchor.
        # `<div className="form-actions">` is probably near the end. Let's look for `<div className="profile-container">` end.
        
        # Another reliable anchor is the end of the return statement before Footer:
        # </main> ? Wait, PatientProfile has </main>. Let's see if DoctorProfile has </main>.
        if "</main>" in content:
            content = content.replace(
                "</main>",
                "  <DangerZone />\n      </main>"
            )
        else:
            # Let's just insert it before `<Footer />`
            content = content.replace(
                "<Footer />",
                "  <DangerZone />\n      <Footer />"
            )

        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated DoctorProfile.jsx")


if __name__ == "__main__":
    insert_danger_zone_patient()
    insert_danger_zone_doctor()
