import os

# Path to the folder containing your files
folder_path = 'Test Samples\pswers'

# List all files in the folder
files = os.listdir(folder_path)

# Sort files numerically based on their current names
files.sort(key=lambda f: int(f[1:-4]))

# Rename files
for i, filename in enumerate(files, start=1):
    src = os.path.join(folder_path, filename)
    dst = os.path.join(folder_path, f'{i}.png')
    os.rename(src, dst)

print("Files renamed successfully!")
