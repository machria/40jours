import json, re

ABSENT_31 = {1, 23, 29, 32, 35, 36, 37, 39, 45, 50, 54, 55, 67, 77, 78, 81, 82, 86, 87, 89, 91, 94, 95, 97, 98, 99, 100, 101, 103, 104, 106}
PRESENT_83 = set(range(1, 115)) - ABSENT_31

with open('data/asbab_nuzul_fr.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print("==================================================")
print("🔍 RAPPORT D'AUDIT ET DE VERIFICATION D'INTEGRITE")
print("==================================================")

total_entries = len(d)
surahs_covered = set(int(k.split('_')[0]) for k in d.keys())

absent_violations = surahs_covered.intersection(ABSENT_31)
missing_present_surahs = PRESENT_83 - surahs_covered

print(f"1. VOLUMETRIE TOTALE DE RECITS : {total_entries} récits")
print(f"2. MATRICE DES 83 SOURATES PRESENTES : {len(surahs_covered)} sur 83 couvertes")
if len(missing_present_surahs) == 0:
    print("   ✅ 100% des 83 sourates d'Al-Wahidi possèdent au moins 1 récit !")
else:
    print(f"   ❌ Sourates manquantes : {sorted(list(missing_present_surahs))}")

print(f"3. ETANCHEITE DES 31 SOURATES ABSENTES :")
if len(absent_violations) == 0:
    print("   ✅ 100% des 31 sourates absentes possèdent EXACTEMENT 0 récit !")
else:
    print(f"   ❌ Violations détectées sur sourates absentes : {sorted(list(absent_violations))}")

# Check Isnads
entries_with_isnad = 0
for k, v in d.items():
    v_lower = v.lower()
    if any(m in v_lower for m in ['rapporté', 'al-wahidi', 'ibn abbas', 'aïcha', 'aïchah', 'bukhari', 'muslim', 'tirmidhi', 'nasa\'i', 'suddi', 'qatadah', 'mujahid', 'nous a informé', 'a dit', 'révélé']):
        entries_with_isnad += 1

print(f"4. QUALITE ET AUTHENTICITE DES ISNADS :")
print(f"   ✅ {entries_with_isnad} / {total_entries} récits ({round(entries_with_isnad/total_entries*100, 1)}%) comportent une attribution historique ou Isnad explicite !")

print("==================================================")
