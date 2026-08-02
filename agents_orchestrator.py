import os
import sys
import glob
import re
from typing import Dict, TypedDict, Annotated, Sequence
import operator

# ==========================================
# LOGGING EN DIRECT
# ==========================================

LOG_FILENAME = "agents_execution.log"

class TeeLogger:
    def __init__(self, filename=LOG_FILENAME):
        self.terminal = sys.stdout
        self.log_file = open(filename, "w", encoding="utf-8")

    def write(self, message):
        self.terminal.write(message)
        self.terminal.flush()
        self.log_file.write(message)
        self.log_file.flush()

    def flush(self):
        self.terminal.flush()
        self.log_file.flush()

sys.stdout = TeeLogger()

try:
    from langchain_ollama import ChatOllama
    from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage, AIMessage
    from langgraph.graph import StateGraph, END
except ImportError as e:
    print(f"❌ Des dépendances sont manquantes : {e}")
    print("Veuillez installer les packages requis avec : pip install langchain-ollama langgraph langchain-core")
    sys.exit(1)

# ==========================================
# SCANNEUR LEGER DU PROJET
# ==========================================

def scan_repository_context(base_dir: str = ".") -> str:
    """Construit un aperçu concis du projet."""
    context_lines = ["=== STRUCTURE DU PROJET 40JOURS ==="]
    
    package_json = os.path.join(base_dir, "package.json")
    if os.path.exists(package_json):
        with open(package_json, "r", encoding="utf-8") as f:
            context_lines.append(f"\n--- PACKAGE.JSON ---\n{f.read()}")

    context_lines.append("\n=== PAGES DISPONIBLES (app/) ===")
    app_files = sorted(glob.glob(f"{base_dir}/app/**/*.tsx", recursive=True))
    for af in app_files[:15]:
        rel = os.path.relpath(af, base_dir)
        context_lines.append(f"- {rel}")

    context_lines.append("\n=== COMPOSANTS DISPONIBLES (components/) ===")
    comp_files = sorted(glob.glob(f"{base_dir}/components/**/*.tsx", recursive=True))
    for cf in comp_files[:15]:
        rel = os.path.relpath(cf, base_dir)
        context_lines.append(f"- {rel}")

    return "\n".join(context_lines)

def get_target_file_content(filepath: str, base_dir: str = ".") -> str:
    """Lit 100% du contenu d'un fichier spécifique."""
    full_path = os.path.abspath(os.path.join(base_dir, filepath))
    if os.path.exists(full_path):
        with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    return ""

# ==========================================
# APPLIQUEUR SECURISE
# ==========================================

def apply_code_changes_to_codebase(code_solution: str, base_dir: str = "."):
    """Écrit le code sur le disque avec garde-fou anti-régression."""
    print("\n==================================================")
    print("🛡️ VÉRIFICATION DE SÉCURITÉ & APPLICATION SUR DISQUE")
    print("==================================================")
    
    pattern = r"FILEPATH:\s*([^\n\r]+)[\s\S]*?```(?:tsx|ts|js|jsx|css)?\n([\s\S]*?)```"
    matches = re.findall(pattern, code_solution)
    
    if not matches:
        alt_pattern = r"(?:Fichier|File|Path):\s*([a-zA-Z0-9_\-/\.]+\.(?:tsx|ts|js|jsx))[\s\S]*?```(?:tsx|ts|js|jsx|css)?\n([\s\S]*?)```"
        matches = re.findall(alt_pattern, code_solution)

    if not matches:
        print("⚠️ Aucun fichier cible explicite trouvé dans le code généré.")
        return

    written_count = 0
    for filepath_str, code_content in matches:
        clean_path = filepath_str.strip().strip("`").strip("'").strip('"')
        if clean_path.startswith("./"):
            clean_path = clean_path[2:]
            
        full_filepath = os.path.abspath(os.path.join(base_dir, clean_path))
        if not full_filepath.startswith(os.path.abspath(base_dir)):
            continue

        if os.path.exists(full_filepath):
            with open(full_filepath, "r", encoding="utf-8", errors="ignore") as existing_file:
                old_code = existing_file.read()
            
            old_lines_count = len(old_code.splitlines())
            new_lines_count = len(code_content.splitlines())

            if old_lines_count > 25 and new_lines_count < (old_lines_count * 0.7):
                print(f"\n❌ [SÉCURITÉ BLOCAGE] L'écriture sur '{clean_path}' a été ANNULÉE.")
                print(f"⚠️ Raison : Régression détectée ({old_lines_count} lignes d'origine -> {new_lines_count} nouvelles lignes).")
                print("💡 Le fichier d'origine a été préservé intact sur votre disque.\n")
                continue

        try:
            os.makedirs(os.path.dirname(full_filepath), exist_ok=True)
            with open(full_filepath, "w", encoding="utf-8") as f:
                f.write(code_content.strip() + "\n")
            written_count += 1
            print(f"✅ [MODIFIÉ SUR DISQUE] : {clean_path} ({len(code_content)} caractères)")
        except Exception as e:
            print(f"❌ Erreur d'écriture sur {clean_path} : {e}")

    if written_count > 0:
        print(f"\n🎉 {written_count} fichier(s) mis à jour avec succès !")

# ==========================================
# INITIALISATION DES MODÈLES
# ==========================================

llm_coder = ChatOllama(model="qwen2.5-coder:7b", temperature=0.1, num_ctx=8192, keep_alive="10m")
llm_reviewer = ChatOllama(model="qwen2.5-coder:1.5b", temperature=0.0, num_ctx=4096, keep_alive="10m")

def stream_agent_invoke(llm, messages, agent_title: str) -> str:
    print(f"\n==================================================")
    print(f"⚡ {agent_title} - EN DIRECT :")
    print(f"==================================================\n", flush=True)
    
    full_response = []
    for chunk in llm.stream(messages):
        content = chunk.content
        sys.stdout.write(content)
        sys.stdout.flush()
        full_response.append(content)
    
    print("\n", flush=True)
    return "".join(full_response)

# ==========================================
# MODE 2 : GENERATEUR DE PROPOSITIONS D'IDÉES
# ==========================================

def run_proposal_mode():
    print("\n==================================================")
    print("💡 MODE PROPOSITION D'AMÉLIORATIONS (SANS MODIFICATION DISQUE)")
    print("==================================================\n")
    
    repo_context = scan_repository_context(".")
    
    system_prompt = SystemMessage(content=(
        "Tu es un Lead Product & Software Architect.\n"
        "Examine la structure du projet 40jours fournie.\n"
        "Propose EXACTEMENT 3 idées d'améliorations concrètes et utiles pour l'application.\n"
        "Pour chaque idée, indique :\n"
        "- Le Titre de la fonctionnalité\n"
        "- Le Fichier cible à modifier (ex: components/SearchInterface.tsx ou app/glossaire/GlossaireClient.tsx)\n"
        "- Le Bénéfice UX / Performance pour l'utilisateur\n"
        "- Les détails techniques de ce qui sera ajouté.\n\n"
        "Ne génère AUCUN code complet. Rédige uniquement un rapport clair et structuré."
    ))
    
    messages = [system_prompt, HumanMessage(content=f"Structure du projet :\n\n{repo_context}")]
    report = stream_agent_invoke(llm_coder, messages, "ARCHITECTE / PRODUCT PROPOSER (qwen2.5-coder:7b)")
    
    print("\n==================================================")
    print("💡 INSTRUCTIONS POUR APPLIQUER UNE IDÉE :")
    print("==================================================")
    print("Pour exécuter l'idée de votre choix sur votre codebase, lancez :")
    print('python3 agents_orchestrator.py "Titre ou consigne de l\'idée choisie" "fichier_cible.tsx"\n')

# ==========================================
# EXECUTION DE CODE SPECIFIQUE
# ==========================================

def run_execution_mode(task_prompt: str, target_filepath: str):
    print("\n==================================================")
    print(f"⚡ EXÉCUTION DE L'AMÉLIORATION SUR : {target_filepath if target_filepath else 'Base de code'}")
    print("==================================================\n")
    
    repo_context = scan_repository_context(".")
    target_content = ""
    if target_filepath:
        target_content = get_target_file_content(target_filepath)
        print(f"📄 Fichier d'origine chargé à 100% : {target_filepath} ({len(target_content)} caractères / {len(target_content.splitlines())} lignes)")

    system_prompt = SystemMessage(content=(
        "Tu es un Développeur Senior Next.js/TypeScript.\n"
        "1. Exécute la consigne demandée par l'utilisateur.\n"
        "2. RÈGLE ABSOLUE : Tu dois CONSERVER 100% de la structure, des imports et du JSX d'origine du fichier ci-dessous. Tu ajoutes tes modifications sans rien détruire.\n"
        "3. Indique OBLIGATOIREMENT le chemin de fichier avec 'FILEPATH: <chemin_relatif>' juste avant le bloc ```tsx.\n\n"
        f"FORMAT OBLIGATOIRE :\n"
        f"FILEPATH: {target_filepath if target_filepath else 'components/MonComposant.tsx'}\n"
        "```tsx\n"
        "// Ton code complet avec le fichier d'origine conservé à 100%\n"
        "```"
    ))

    prompt = f"Consigne :\n{task_prompt}\n\n"
    if target_filepath and target_content:
        prompt += f"--- FICHIER ORIGINE À CONSERVER ET ENRICHIR ({target_filepath}) ---\n{target_content}"
    else:
        prompt += f"--- CONTEXTE DU PROJET ---\n{repo_context}"

    messages = [system_prompt, HumanMessage(content=prompt)]
    code_output = stream_agent_invoke(llm_coder, messages, "DEVELOPER AGENT (qwen2.5-coder:7b)")
    
    # Reviewer validation
    system_prompt_rev = SystemMessage(content="Tu es le Code Reviewer. Si le code est propre et complet, réponds 'STATUS: APPROVED'.")
    messages_rev = [system_prompt_rev, HumanMessage(content=f"Code à évaluer :\n{code_output}")]
    rev_result = stream_agent_invoke(llm_reviewer, messages_rev, "REVIEWER AGENT (qwen2.5-coder:1.5b)")
    
    if "APPROVED" in rev_result.upper():
        apply_code_changes_to_codebase(code_output, base_dir=".")
    else:
        print("⚠️ Le Reviewer a demandé des ajustements, écriture annulée.")

if __name__ == "__main__":
    if len(sys.argv) == 1:
        # Sans argument => Mode Proposition d'Abord (aucun fichier modifié)
        run_proposal_mode()
    else:
        # Avec arguments => Execution précise de l'idée choisie
        task = sys.argv[1]
        target = sys.argv[2] if len(sys.argv) > 2 else ""
        run_execution_mode(task, target)
