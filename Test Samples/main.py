import json
import re
ogtext='circlesans-1. (I) 2. (I) 3. (2) 4. (I) 5. (I) 6. (1) 7. (I) 8. (I) 9. (4) 10. (2) 11. (3) 12. (3) 13. (4) 14. (I) 15. (3) 16. (I) 17. (I) 18. (2) 19. (2) 20. (1) 21. (I) 22. (1) 23. (2) 24. (4) 25. (2) 26. (4) 27. (2) 28. (3) 29. (3) 30. (2) 31. (I) 32. (3) 33. (3) 34. (4) 35. (2) 36. (I) 37. (I) 38. (3) 39. (3) 40. (4) 41. (2) 42. (3) 43. (I) 44. (I) 45. (3) 46. (I) 47. (3) 48. (2) 49. (2) 50. (1) Si. (I) 52. (I) 53. (4) 54. (4) 55. (3) 56. (I) 57. (2) 58. (4) 59. (4) 60. (3) 61. (3) 62. (2) 63. (2) 64. (I) 65. (4) 66. (3) 67. (2) 68. (I) 69. (I) 70. (2) 71. (2) 72. (3) 73. (3) 74. (I) 75. (1) 76. (3) 81. (2) 86. (4) 77. (2) 82. (I) 87. (3) 78. (I) 83. (I) 88. (3) 79. (2) 84. (2) 89. (3) 80. (1) 85. (2) 90. (I) 91. (4) 92. (I) 93. (I) 94. (3) 95. (4) 96. (I) 97. (2) 98. (2) 99. (3) 100. (1) 101. (3) 102. (2) 103. (I) 104. (3) 105. (3) 106. (3) 107. (3) 108. (4) 109. (4) '
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
