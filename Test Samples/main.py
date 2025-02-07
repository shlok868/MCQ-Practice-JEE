import json
import re
ogtext="babes-1. (4) 6. (4) 11. (4) 16. (1) 21. (2) 26. (4) 31. (3) 36.(1) 41.(2) 46. (2) 51. (4) . (3) 7. (2) 12. (2) 17. (4) 22. (2) 27. (1) 32. (4) 37. (1) 42. (4) 47. (3) 4. (2) 9. (1) 14. (2) 19. (2) 24. (2) 29. (1) 34. (4) 39. (2) 44. (1) 49. (2) 5. (1) 10. (2) 15. (2) 20. (2) 25. (2) 30. (3) 35. (2) 40. (3) 45.(1) 50. (3) "
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
