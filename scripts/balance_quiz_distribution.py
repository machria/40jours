import json
import random

def balance_quiz():
    path = 'public/data/sira-quiz.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Seed for reproducibility if needed, but here we want randomness
    # random.seed(42) 

    for question in data:
        # Get current correct text
        correct_index = question['correct']
        correct_option_text = question['options'][correct_index]
        
        # Shuffle options
        random.shuffle(question['options'])
        
        # Find new index of the correct option
        new_correct_index = question['options'].index(correct_option_text)
        question['correct'] = new_correct_index

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Balanced {len(data)} questions by shuffling options.")

if __name__ == "__main__":
    balance_quiz()
