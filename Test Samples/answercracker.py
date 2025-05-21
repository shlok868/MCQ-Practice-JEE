import json
import re
from collections import OrderedDict

# Ask the user for input
ogtext = input("Paste the answer key text: ")

# Replace 'a', 'b', 'c', 'd' with '1', '2', '3', '4' respectively (case-insensitive)
ogtext = re.sub(r'[aA]', '1', ogtext)
ogtext = re.sub(r'[bB]', '2', ogtext)
ogtext = re.sub(r'[cC]', '3', ogtext)
ogtext = re.sub(r'[dD]', '4', ogtext)

text = ogtext.replace('I', '1')

# Extract filename and QA pairs
filename = text.split('-')[0]
qa_text = text.split('-', 1)[1]

# Find all question-answer pairs
pattern = re.compile(r'(\d+)\.\s*\(\s*(\d+)\s*\)')
matches = pattern.findall(qa_text)

# Sort matches numerically by question number
sorted_matches = sorted(matches, key=lambda x: int(x[0]))

# Create an ordered dictionary to preserve sorting
qa_dict = OrderedDict()
for q, a in sorted_matches:
    qa_dict[q] = int(a)

# Convert to JSON
json_data = json.dumps(qa_dict, indent=4)

# Save to file
json_filename = f"{filename}.json"
with open(json_filename, 'w') as file:
    file.write(json_data)

print(f"Data saved to {json_filename}")
print(json_data)