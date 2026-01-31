import json

def add_surah_info():
    path = 'public/data/seerah-fr.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Mapping of titles to Surah info to append
    surah_updates = {
        "Bataille de Badr": "La Sourate Al-Anfal (Le Butin) a été révélée à propos de cette bataille, détaillant les règles du butin et les leçons de la victoire.",
        "Bataille d'Uhud": "Une grande partie de la Sourate Ali 'Imran (versets 121-179) commente cette bataille, analysant les causes de la défaite et consolant les croyants.",
        "Bataille de la Tranchée (Khandaq)": "La Sourate Al-Ahzab (Les Coalisés) décrit ce siège, la peur des croyants et le miracle divin du vent qui a chassé les ennemis.",
        "Traité de Hudaybiyyah": "C'est au retour de ce voyage que la Sourate Al-Fath (La Victoire Éclatante) a été révélée, qualifiant ce traité de 'victoire manifeste'.",
        "Conquête de La Mecque": "La Sourate An-Nasr (Le Secours) est associée à cette victoire finale et à l'entrée des gens en masse dans la religion d'Allah.",
        "Bataille de Tabuk": "La Sourate At-Tawbah (Le Repentir) a été révélée en grande partie au sujet de cette expédition, dévoilant les hypocrites qui ont refusé de partir.",
        "Al-Isra' wal-Mi'raj (Voyage Nocturne)": "L'événement est mentionné au début de la Sourate Al-Isra (17:1) et la vision céleste est décrite dans la Sourate An-Najm.",
        "Hijrah vers Médine": "La Sourate At-Tawbah (9:40) rappelle le moment critique ou le Prophète était dans la grotte avec Abu Bakr : 'Ne t'attriste pas, Allah est avec nous'.",
        "Changement de la Qibla": "Les versets 142-150 de la Sourate Al-Baqarah traitent du changement de direction de la prière et répondent aux critiques des ignorants."
    }

    updated_count = 0
    for event in data:
        title = event.get('title')
        if title in surah_updates:
            # Check if updated info is already present to avoid duplication
            already_present = False
            for comment in event['commentary']:
                if "Sourate" in comment and ("Al-Anfal" in comment or "Ali 'Imran" in comment or "Al-Ahzab" in comment or "Al-Fath" in comment or "An-Nasr" in comment or "At-Tawbah" in comment or "Al-Isra" in comment or "Al-Baqarah" in comment):
                     # Simple heuristic check, might need refinement if content is slighty different
                     # But for now, if 'Sourate' is there, we assume it might be covered.
                     # However user ASKED to add it if missing. My previous adds (Nadir, Ifk) had it.
                     # These ones likely don't.
                     # Let's perform a stricter check on the specific Surah name we are adding.
                     pass

            # We will append the specific info string to the commentary list
            info = surah_updates[title]
            
            # Check strict duplication of the specific string or key words
            is_dup = False
            for c in event['commentary']:
                if info in c:
                    is_dup = True
                    break
            
            if not is_dup:
                event['commentary'].append(info)
                updated_count += 1
                print(f"Updated: {title}")

    if updated_count > 0:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Successfully updated {updated_count} events with Surah information.")
    else:
        print("No updates needed.")

if __name__ == "__main__":
    add_surah_info()
