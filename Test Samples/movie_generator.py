import os
from moviepy.editor import ImageClip, TextClip, concatenate_videoclips

# Paths to folders
questions_folder = "Test Samples\questions"
answers_folder = "Test Samples\pnswers"
output_folder = "Test Samples\output"

# Function to create countdown
def create_countdown(duration, size=(1080, 1920)):
    countdown_clips = []
    for i in range(duration, 0, -1):
        countdown_text = TextClip(str(i), fontsize=100, color='yellow', bg_color='black', size=size)
        countdown_clips.append(countdown_text.set_duration(1))
    return concatenate_videoclips(countdown_clips)

# Function to create a single video
def create_video(question_image, answer_image, output_path):
    # Question slide
    question_clip = ImageClip(question_image).set_duration(5).resize(height=1920, width=1080)

    # Pause to solve slide
    pause_text = TextClip("Pause to Solve", fontsize=70, color='red', bg_color='black', size=(1080, 1920))
    pause_clip = pause_text.set_duration(2)

    # Countdown slide
    countdown_clip = create_countdown(10)

    # Answer slide
    answer_clip = ImageClip(answer_image).set_duration(5).resize(height=1920, width=1080)

    # Combine all clips
    final_clip = concatenate_videoclips([question_clip, pause_clip, countdown_clip, answer_clip])
    final_clip.write_videofile(output_path, fps=24, codec="libx264")

# Generate videos for all question-answer pairs
for filename in os.listdir(questions_folder):
    if filename.endswith(".png"):
        question_path = os.path.join(questions_folder, filename)
        answer_path = os.path.join(answers_folder, filename)
        output_path = os.path.join(output_folder, f"{os.path.splitext(filename)[0]}.mp4")

        if os.path.exists(answer_path):  # Ensure corresponding answer exists
            print(f"Creating video for {filename}...")
            create_video(question_path, answer_path, output_path)
        else:
            print(f"Answer for {filename} not found. Skipping...")
