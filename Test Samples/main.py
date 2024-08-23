import json
import re

ogtext = ('redoxans-1. (4) 2. (3) 3. (2) 4. (2) 5.(3) 6.(4) 7.(4) 8.(2) 9.(4) 10.(1) I1.(3) 12. (1) 13. (I) 14.(3) 15.(2) 16.(3) 17.(4) 18.(4) 19. (I) 20. (I) 21. (4) 22. (4) 23. (I) 24. (3) 25. (2) 26.(4) 27.(2) 28. (3) 29. (3) 30.(1) 31.(4) 32.(1) 33. (I) 34.(2) 35. (I ) 36.(2) 37. (I) 38. (I) 39.(2) 40.(4) 41.(4) 42.(4) 43.(3) 44.(2) 45.(3) 46.(I) 47.(3) 48.(2) 49. (I) 50.(I) 51.(4) 52.(3) 53.(4) 54. (I) 55.(3) 56.(3) 57.(2) 58.(3) 59. (I) 60.(2) 61. (I) 62.(1) 63.(4) 64.(4) 65.(3) 66.(3) 67.(1) 68.(4) 69. (I) 70.(3) 71.(3) 72. (1 ) 73. (I) 74. (I) 75.(3) 76.(2) 77. (I) 78.(1) 79.(3) 80.(4) 81.(2) 82.(1) 83.(3) 84.(4) 85.(2) 86.(4) 87.(2) 88.(4) 89.(4) 90.(I) 91.(I) 92.(3) 93.(3) 94.(2) 95.(I) 96.(2) 97.(3) 98. (2) 99. (3) 100.(3) ')
text = ogtext.replace('I', '1')

# Extract the filename
filename = text.split('-')[0]

# Remove the filename part to get the actual question-answer text
qa_text = text.split('-', 1)[1]

# Use regex to find all question-answer pairs, allowing for spaces inside parentheses
pattern = re.compile(r'(\d+)\.\s*\(\s*(\d+)\s*\)')
matches = pattern.findall(qa_text)

# Create a dictionary to store the question-answer pairs
qa_dict = {str(q): int(a) for q, a in matches}

# Convert the dictionary to a JSON string
json_data = json.dumps(qa_dict, indent=4)

# Define the JSON filename
json_filename = f"{filename}.json"

# Output the JSON string (you can also write this to a file)
print(json_data)

# Optionally, write the JSON data to a file
with open(json_filename, 'w') as file:
    file.write(json_data)

print(f"Data saved to {json_filename}")
