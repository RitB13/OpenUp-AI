import os
import re

input_folder = "knowledge_base"
output_file = "sentence2_pool.txt"

with open(output_file, "w", encoding="utf-8") as outfile:
    for filename in os.listdir(input_folder):
        if filename.endswith(".txt"):
            with open(os.path.join(input_folder, filename), "r", encoding="utf-8") as infile:
                content = infile.read()
                # Split on sentences using . or newline
                sentences = re.split(r'\.\s+|\n+', content)
                for sentence in sentences:
                    sentence = sentence.strip()
                    if 8 < len(sentence) < 200:  # Keep it reasonable
                        outfile.write(sentence + "\n")
print("Extracted sentences saved to sentence2_pool.txt")
