import re
import os

path = r'd:\hospital_management\startup\frontend\src\pages\RoleSetup.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'import { setUserRole }' not in content:
    content = content.replace(
        "import { FaStethoscope, FaUser } from 'react-icons/fa';",
        "import { FaStethoscope, FaUser } from 'react-icons/fa';\nimport { setUserRole } from '../services/api';"
    )

# Update handleContinue
old_handle = """  const handleContinue = () => {
    if (!selectedRole) {
      alert('Please select your role');
      return;
    }

    localStorage.setItem('currentRole', selectedRole);
    setCurrentRole(selectedRole);

    if (selectedRole === 'doctor') {
      navigate('/doctor-setup');
    } else {
      navigate('/dashboard');
    }
  };"""

new_handle = """  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) {
      alert('Please select your role');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await setUserRole(selectedRole, token);
      
      if (response && response.access_token) {
        localStorage.setItem('authToken', response.access_token);
        localStorage.setItem('currentRole', selectedRole);
        setCurrentRole(selectedRole);

        if (selectedRole === 'doctor') {
          navigate('/doctor-setup');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert('Failed to set role. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to set role. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };"""

content = content.replace(old_handle, new_handle)

# Update disabled state
content = content.replace(
    "disabled={!selectedRole}",
    "disabled={!selectedRole || isSubmitting}"
)

# Update continue button text
content = content.replace(
    "Continue\n          </button>",
    "{isSubmitting ? 'Saving...' : 'Continue'}\n          </button>"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated RoleSetup.jsx")
