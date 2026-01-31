import json
from collections import Counter

def analyze_distribution():
    try:
        with open('public/data/sira-quiz.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        total_questions = len(data)
        correct_indices = [item['correct'] for item in data]
        counts = Counter(correct_indices)
        
        print(f"Total Questions: {total_questions}")
        print("-" * 30)
        print("Answer Distribution:")
        
        for i in range(4):
            count = counts.get(i, 0)
            percentage = (count / total_questions) * 100 if total_questions > 0 else 0
            # Assuming 0=A, 1=B, 2=C, 3=D
            option_label = chr(65 + i) 
            print(f"Option {option_label} ({i}): {count} ({percentage:.1f}%)")
            
        # Check for potential issues
        most_common = counts.most_common(1)[0]
        least_common = counts.most_common()[-1]
        
        print("-" * 30)
        print(f"Most frequent: Option {chr(65 + most_common[0])} ({most_common[1]})")
        print(f"Least frequent: Option {chr(65 + least_common[0])} ({least_common[1]})")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    analyze_distribution()
