import json
import re
from collections import OrderedDict

ogtext = "babesans-1. (4) 6. (4) 11. (4) 16. (1) 21. (2) 26. (4) 31. (3) 36.(1) 41.(2) 46. (2) 51. (4) 2. (3) 7.(2) 12. (2) 17. (4) 22. (2) 27. (1) 32. (4) 37. (1) 42. (4) 47. (3) 3. (3) 8. (4) 13. (3) 18. (3) 23. (3) 28. (1) 33. (2) 38. (1) 43. (3) 48. (2) 4. (2) 9. (1) 14. (2) 19. (2) 24. (2) 29. (1) 34. (4) 39. (2) 44. (1) 49. (2) 5. (1) 10. (2) 15. (2) 20. (2) 25. (2) 30. (3) 35. (2) 40. (3) 45.(1) 50. (3)  "
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