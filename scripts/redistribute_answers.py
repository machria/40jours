import json
import random

# Charger les questions
with open('data/sira-quiz.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Total questions: {len(questions)}")

# Fonction pour redistribuer les options
def redistribute_options(question):
    """Redistribue les options pour que la bonne réponse ne soit pas toujours en position B"""
    correct_index = question['correct']
    options = question['options']
    
    # Créer une nouvelle position aléatoire pour la bonne réponse
    new_correct_index = random.randint(0, 3)
    
    # Réorganiser les options
    correct_answer = options[correct_index]
    new_options = options.copy()
    
    # Échanger la bonne réponse avec la nouvelle position
    new_options[correct_index], new_options[new_correct_index] = new_options[new_correct_index], new_options[correct_index]
    
    question['options'] = new_options
    question['correct'] = new_correct_index
    
    return question

# Redistribuer toutes les questions
print("Redistribution des réponses...")
for i, q in enumerate(questions):
    questions[i] = redistribute_options(q)

# Vérifier la nouvelle distribution
from collections import Counter
distribution = Counter([q['correct'] for q in questions])
print(f"\nNouvelle distribution des réponses correctes:")
for pos in range(4):
    count = distribution.get(pos, 0)
    print(f"  Position {pos} (option {chr(65+pos)}): {count} questions ({count/len(questions)*100:.1f}%)")

# Sauvegarder
with open('data/sira-quiz.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"\n✅ Questions redistribuées et sauvegardées!")
print(f"Total: {len(questions)} questions")
