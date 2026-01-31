import json
import re

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def extract_keywords(text):
    # Extract capitalized words (names) and numbers (years)
    # Also ignore common words (Le, La, Les, Un, Une, De, Des, Et, Ou, Est, A, ... - simple heuristic)
    words = re.findall(r'\b[A-Z][a-z]+\b|\b\d+\b', text)
    stopwords = {'Le', 'La', 'Les', 'Un', 'Une', 'De', 'Des', 'Du', 'Au', 'Aux', 'Et', 'Ou', 'Est', 'Sont', 'A', 'Par', 'Pour', 'Sur', 'Dans', 'Qui', 'Que', 'Quoi', 'Où', 'Quand', 'Comment', 'Pourquoi', 'Quel', 'Quelle', 'Quels', 'Quelles', 'Ce', 'Cet', 'Cette', 'Ces', 'Il', 'Elle', 'Ils', 'Elles', 'Son', 'Sa', 'Ses', 'Leur', 'Leurs'}
    return {w for w in words if w not in stopwords}

def verify():
    seerah_data = load_json('public/data/seerah-fr.json')
    quiz_data = load_json('public/data/sira-quiz.json')

    # Build a searchable index of Seerah content
    seerah_text = ""
    for event in seerah_data:
        seerah_text += f"{event['title']} "
        seerah_text += " ".join(event.get('commentary', [])) + " "
        seerah_text += f"{event.get('notes', '')} "
        seerah_text += f"{event.get('start', '')} "

    seerah_text_lower = seerah_text.lower()

    missing_coverage = []

    print(f"Verifying {len(quiz_data)} questions against {len(seerah_data)} events...")

    for i, item in enumerate(quiz_data):
        question = item['question']
        explanation = item['explanation']
        
        # We check if the KEY concepts in the question/explanation are present in the Seerah text
        # Simple heuristic: Check if specific Proper Nouns or unique terms from the question appear in Seerah text
        
        keywords = extract_keywords(question + " " + explanation)
        
        # Filter out very common keywords that might generate false positives if checked alone
        # (Though we are checking if *any* significant keyword is missing? No, we want to see if the topic exists)
        
        # Better approach: Check if the question text seems "alien" to the Seerah text.
        # Let's count how many keywords from the question appear in the text.
        
        found_keywords = []
        missing_keywords = []
        
        for kw in keywords:
            if kw.lower() in seerah_text_lower:
                found_keywords.append(kw)
            else:
                missing_keywords.append(kw)
        
        # Score: percentage of keywords found
        if len(keywords) > 0:
            score = len(found_keywords) / len(keywords)
        else:
            score = 1.0 # No keywords to find
            
        # If score is low, it might be undocumented
        if score < 0.5 and len(missing_keywords) > 0:
             missing_coverage.append({
                "index": i,
                "question": question,
                "missing_keywords": missing_keywords,
                "score": score
            })

    print(f"Found {len(missing_coverage)} potentially undocumented questions.")
    
    # Save report
    with open('sira_coverage_report.json', 'w', encoding='utf-8') as f:
        json.dump(missing_coverage, f, indent=2, ensure_ascii=False)
        
    # Print top 10
    for m in missing_coverage[:10]:
        print(f"[{m['index']}] {m['question']}")
        print(f"  Missing: {m['missing_keywords']}")
        print("-" * 40)

if __name__ == "__main__":
    verify()
