# Replace 'your_file.txt' with the name of your actual file
import os
file_name = 'prompt.txt'

# Get the directory where the script is located
def read_file_content(file_name):
    script_dir = os.path.dirname(__file__)
    file_path = os.path.join(script_dir, file_name)

    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

initialPromptForCoupletMaster = read_file_content(file_name)


