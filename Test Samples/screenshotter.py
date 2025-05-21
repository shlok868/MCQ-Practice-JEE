import pyautogui
import os
import tkinter as tk
from tkinter import simpledialog
from PIL import ImageGrab

class SnippingTool:
    def __init__(self, root):
        self.root = root
        self.root.withdraw()
        self.start_number = int(simpledialog.askstring("Input", "Enter the starting question number:"))
        self.folder_name = "screenshots"
        if not os.path.exists(self.folder_name):
            os.makedirs(self.folder_name)
        self.question_number = self.start_number

        self.root.deiconify()
        self.root.attributes("-alpha", 0.3)  # Make the window semi-transparent
        self.root.attributes("-fullscreen", True)
        self.canvas = tk.Canvas(self.root, cursor="cross")
        self.canvas.pack(fill=tk.BOTH, expand=tk.YES)
        self.canvas.bind("<ButtonPress-1>", self.on_button_press)
        self.canvas.bind("<B1-Motion>", self.on_mouse_drag)
        self.canvas.bind("<ButtonRelease-1>", self.on_button_release)
        self.rect = None
        self.start_x = None
        self.start_y = None

    def on_button_press(self, event):
        self.start_x = event.x
        self.start_y = event.y
        self.rect = self.canvas.create_rectangle(self.start_x, self.start_y, self.start_x, self.start_y, outline='red')

    def on_mouse_drag(self, event):
        if self.rect is None:
            return
        cur_x, cur_y = (event.x, event.y)
        self.canvas.coords(self.rect, self.start_x, self.start_y, cur_x, cur_y)

    def on_button_release(self, event):
        end_x, end_y = (event.x, event.y)
        self.root.withdraw()
        x1 = min(self.start_x, end_x)
        y1 = min(self.start_y, end_y)
        x2 = max(self.start_x, end_x)
        y2 = max(self.start_y, end_y)
        self.take_screenshot(x1, y1, x2, y2)
        self.question_number += 1
        self.root.deiconify()

    def take_screenshot(self, x1, y1, x2, y2):
        screenshot = ImageGrab.grab(bbox=(x1, y1, x2, y2))
        filename = os.path.join(self.folder_name, f"q{self.question_number}.png")
        screenshot.save(filename)
        print(f"Screenshot saved as {filename}")

def main():
    root = tk.Tk()
    app = SnippingTool(root)
    root.mainloop()

if __name__ == "__main__":
    main()
