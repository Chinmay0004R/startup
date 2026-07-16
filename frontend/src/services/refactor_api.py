import re

with open(r'd:\hospital_management\startup\frontend\src\services\api.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix request helper
request_old = """const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });"""
request_new = """const request = async (path, options = {}) => {
  const fetchOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  };

  if (fetchOptions.body && typeof fetchOptions.body === 'object' && !(fetchOptions.body instanceof FormData)) {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);"""

content = content.replace(request_old, request_new)

# Remove JSON.stringify from all other places
content = re.sub(r'body:\s*JSON\.stringify\((.*?)\)', r'body: \1', content)

with open(r'd:\hospital_management\startup\frontend\src\services\api.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("api.js refactored successfully.")
